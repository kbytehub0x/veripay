import { NextResponse } from 'next/server';
import { getContracts, createContract } from '@/lib/store';

export async function GET() {
  try {
    const contracts = getContracts();
    return NextResponse.json({ success: true, contracts });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.title || !body.client || !body.contractor || !body.milestones) {
      return NextResponse.json({ success: false, error: 'Missing required contract fields' }, { status: 400 });
    }

    const totalAmount = body.milestones.reduce((acc: number, m: any) => acc + (Number(m.amount) || 0), 0);

    const contract = createContract({
      title: body.title,
      description: body.description || '',
      client: body.client,
      contractor: body.contractor,
      totalAmount,
      currency: body.currency || 'USD',
      autoReleaseThreshold: Number(body.autoReleaseThreshold) || 500,
      minConfidenceScore: Number(body.minConfidenceScore) || 90,
      status: 'active',
      milestones: body.milestones.map((m: any, idx: number) => ({
        id: `ms_${Date.now()}_${idx}`,
        contractId: '',
        title: m.title,
        description: m.description || '',
        amount: Number(m.amount) || 0,
        dueDate: m.dueDate || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
        acceptanceCriteria: m.acceptanceCriteria || [],
        status: 'pending_funding'
      }))
    });

    return NextResponse.json({ success: true, contract });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
