import { NextResponse } from 'next/server';
import { createEscrowOrder } from '@/lib/paypal';
import { getContractById } from '@/lib/store';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { contractId, milestoneId } = body;

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

    const order = await createEscrowOrder({
      milestoneId: milestone.id,
      contractId: contract.id,
      title: milestone.title,
      amount: milestone.amount,
      currency: contract.currency,
    });

    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    console.error('PayPal create order error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
