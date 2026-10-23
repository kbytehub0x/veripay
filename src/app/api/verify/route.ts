import { NextResponse } from 'next/server';
import { getContractById, submitMilestoneEvidence, recordMilestoneAudit, recordMilestonePayout } from '@/lib/store';
import { runVerificationAgent } from '@/lib/agent';
import { executeContractorPayout, generateMilestoneInvoice } from '@/lib/paypal';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { contractId, milestoneId, evidence } = body;

    if (!contractId || !milestoneId || !evidence) {
      return NextResponse.json({ success: false, error: 'Missing contractId, milestoneId, or evidence' }, { status: 400 });
    }

    const contract = getContractById(contractId);
    if (!contract) {
      return NextResponse.json({ success: false, error: 'Contract not found' }, { status: 404 });
    }

    const milestone = contract.milestones.find(m => m.id === milestoneId);
    if (!milestone) {
      return NextResponse.json({ success: false, error: 'Milestone not found' }, { status: 404 });
    }

    // 1. Submit evidence to milestone store
    submitMilestoneEvidence(contractId, milestoneId, {
      ...evidence,
      submittedAt: new Date().toISOString(),
    });

    // 2. Run VeriAgent autonomous verification
    const audit = await runVerificationAgent({
      milestone,
      evidence,
      autoReleaseThreshold: contract.autoReleaseThreshold,
      minConfidenceScore: contract.minConfidenceScore,
    });

    // 3. Record audit findings
    recordMilestoneAudit(contractId, milestoneId, audit);

    // 4. Policy Firewall: If eligible for instant auto-release, execute PayPal Payout
    let payoutResult = null;
    if (audit.policyEvaluation.autoReleaseEligible) {
      try {
        const payoutResponse = await executeContractorPayout({
          milestoneId: milestone.id,
          contractId: contract.id,
          contractorEmail: contract.contractor.paypalEmail,
          amount: milestone.amount,
          note: `VeriPay Auto-Release: ${milestone.title}`,
          currency: contract.currency,
        });

        const batchId = payoutResponse.batch_header?.payout_batch_id || `VP-BATCH-${Date.now()}`;
        const item = payoutResponse.items?.[0];
        const itemId = item?.payout_item_id || `PI-${Date.now()}`;
        const txId = item?.transaction_id || `TX-PP-${Date.now()}`;

        const invoice = await generateMilestoneInvoice({
          milestoneId: milestone.id,
          contractId: contract.id,
          clientName: contract.client.name,
          clientEmail: contract.client.email,
          contractorName: contract.contractor.name,
          contractorEmail: contract.contractor.paypalEmail,
          amount: milestone.amount,
          currency: contract.currency,
          milestoneTitle: milestone.title,
          transactionId: txId,
        });

        recordMilestonePayout(contractId, milestoneId, {
          batchId,
          itemId,
          transactionId: txId,
          invoice,
        });

        payoutResult = {
          batchId,
          itemId,
          transactionId: txId,
          status: 'SUCCESS',
          amount: milestone.amount,
          invoice,
        };
      } catch (payoutErr: any) {
        console.error('PayPal Payout execution error:', payoutErr);
        payoutResult = {
          status: 'FAILED',
          error: payoutErr.message || 'PayPal Payout execution failed',
        };
      }
    }

    const updatedContract = getContractById(contractId);
    const autoDisbursed = Boolean(payoutResult && payoutResult.status === 'SUCCESS');

    return NextResponse.json({
      success: true,
      audit,
      autoDisbursed,
      payoutResult,
      contract: updatedContract,
    });
  } catch (error: any) {
    console.error('Verification error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
