import { NextResponse } from 'next/server';
import { captureEscrowOrder } from '@/lib/paypal';
import { getContractById, fundMilestoneEscrow } from '@/lib/store';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { contractId, milestoneId, orderId } = body;

    if (!contractId || !milestoneId || !orderId) {
      return NextResponse.json({ success: false, error: 'contractId, milestoneId, and orderId are required' }, { status: 400 });
    }

    // Capture payment from PayPal Sandbox
    const captureData = await captureEscrowOrder(orderId);

    // Update milestone state in store
    const updatedMilestone = fundMilestoneEscrow(contractId, milestoneId, orderId);
    const updatedContract = getContractById(contractId);

    return NextResponse.json({
      success: true,
      capture: captureData,
      milestone: updatedMilestone,
      contract: updatedContract,
    });
  } catch (error: any) {
    console.error('PayPal capture order error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
