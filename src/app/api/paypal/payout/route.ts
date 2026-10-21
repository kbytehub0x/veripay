import { NextResponse } from 'next/server';
import { executeContractorPayout } from '@/lib/paypal';
import { getContractById, recordMilestonePayout } from '@/lib/store';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { contractId, milestoneId, note } = body;

    if (!contractId || !milestoneId) {
      return NextResponse.json({ success: false, error: 'contractId and milestoneId are required' }, { status: 400 });
    }

    const contract = getContractById(contractId);
    if (!contract) {
      return NextResponse.json({ success: false, error: 'Contract not found' }, { status: 404 });
    }

    const milestone = contract.milestones.find(m => m.id === milestoneId);
    if (!milestone) {
      return NextResponse.json({ success: false, error: 'Milestone not found' }, { status: 404 });
    }

    // Execute payout via PayPal Payouts API
    const payoutResponse = await executeContractorPayout({
      milestoneId: milestone.id,
      contractId: contract.id,
      contractorEmail: contract.contractor.paypalEmail,
      amount: milestone.amount,
      note: note || `Client 1-Click Approved: ${milestone.title}`,
      currency: contract.currency,
    });

    const batchId = payoutResponse.batch_header?.payout_batch_id || `VP-BATCH-${Date.now()}`;
    const item = payoutResponse.items?.[0];
    const itemId = item?.payout_item_id || `PI-${Date.now()}`;
    const txId = item?.transaction_id || `TX-PP-${Date.now()}`;

    recordMilestonePayout(contractId, milestoneId, {
      batchId,
      itemId,
      transactionId: txId,
    });

    const updatedContract = getContractById(contractId);

    return NextResponse.json({
      success: true,
      payoutResponse,
      batchId,
      itemId,
      transactionId: txId,
      contract: updatedContract,
    });
  } catch (error: any) {
    console.error('PayPal manual payout error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
