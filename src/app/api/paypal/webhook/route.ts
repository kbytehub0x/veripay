import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const eventType = payload.event_type;

    console.log(`[PayPal Webhook Received] Type: ${eventType}`, payload.id);

    // In production, verify PayPal webhook signature via PayPal Webhook verification API
    // (api-m.sandbox.paypal.com/v1/notifications/verify-webhook-signature)

    switch (eventType) {
      case 'CHECKOUT.ORDER.APPROVED':
      case 'PAYMENT.CAPTURE.COMPLETED':
        console.log('Payment capture confirmed for reference:', payload.resource?.custom_id);
        break;

      case 'PAYMENT.PAYOUTSBATCH.SUCCESS':
      case 'PAYMENT.PAYOUTS-ITEM.SUCCEEDED':
        console.log('Payout disbursement successful:', payload.resource?.payout_item_id);
        break;

      default:
        console.log('Unhandled webhook event:', eventType);
    }

    return NextResponse.json({ received: true, eventType });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json({ received: false, error: error.message }, { status: 500 });
  }
}
