import { NextResponse } from 'next/server';
import { getApiLogs, getWebhookEvents, getDemoWalletBalances } from '@/lib/store';

export async function GET() {
  try {
    const apiLogs = getApiLogs();
    const webhookEvents = getWebhookEvents();
    const wallets = getDemoWalletBalances();
    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '';
    const isLiveSandbox = Boolean(clientId && clientId !== 'test' && clientId !== 'sb-test-client-id');

    return NextResponse.json({
      success: true,
      mode: isLiveSandbox ? 'live_sandbox' : 'simulated',
      wallets,
      apiLogs,
      webhookEvents,
    });
  } catch (error: any) {
    console.error('Demo console fetch error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
