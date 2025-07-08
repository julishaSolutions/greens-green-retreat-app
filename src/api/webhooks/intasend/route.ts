
import { NextResponse, type NextRequest } from 'next/server';
import { confirmBookingPayment } from '@/services/bookingService';
import crypto from 'crypto';

// This is your webhook secret, which you should set in your .env file
const WEBHOOK_SECRET = process.env.INTASEND_WEBHOOK_SECRET;

/**
 * This is the API route that Intasend will call to notify your application about payment events.
 * It handles two main things:
 * 1. Responding to the initial 'challenge' from Intasend to verify the webhook URL.
 * 2. Processing incoming payment notifications (payloads) to update booking statuses.
 */
export async function POST(request: NextRequest) {
  console.log('[Intasend Webhook] Received a request.');

  // 1. Verify the signature to ensure the request is from Intasend
  const signature = request.headers.get('x-intasend-signature');

  if (!WEBHOOK_SECRET) {
    console.error('[Intasend Webhook] CRITICAL: INTASEND_WEBHOOK_SECRET is not set in environment variables.');
    return new Response('Webhook secret not configured.', { status: 500 });
  }

  const bodyText = await request.text();

  if (!verifySignature(bodyText, signature, WEBHOOK_SECRET)) {
    console.warn('[Intasend Webhook] Invalid webhook signature received. Aborting.');
    return new Response('Invalid signature.', { status: 400 });
  }
  console.log('[Intasend Webhook] Signature verified successfully.');

  // If signature is valid, proceed to parse the body.
  const payload = JSON.parse(bodyText);

  // 2. Handle the one-time webhook challenge from Intasend dashboard
  if (payload.challenge) {
    console.log('[Intasend Webhook] Responding to Intasend webhook challenge.');
    return NextResponse.json({ challenge: payload.challenge });
  }

  // 3. Process the actual payment event notification
  console.log(`[Intasend Webhook] Received event type: ${payload.event_type}`);
  // We are interested in the 'invoice.payment.successful' event type
  if (payload.event_type === 'invoice.payment.successful' && payload.data) {
    const data = payload.data;
    const bookingId = data.invoice?.tracking_id;
    const transactionId = data.transaction?.id;
    const paymentStatus = data.state; // e.g., 'COMPLETE'

    console.log('[Intasend Webhook] Processing payload:', { bookingId, transactionId, paymentStatus });

    if (!bookingId || !transactionId || !paymentStatus) {
      console.error('[Intasend Webhook] Webhook payload is missing required fields:', { bookingId, transactionId, paymentStatus });
      return new Response('Webhook Error: Missing required data.', { status: 400 });
    }

    try {
      console.log(`[Intasend Webhook] Processing successful payment for bookingId: ${bookingId}`);
      await confirmBookingPayment(bookingId, { transactionId, paymentStatus });
      console.log(`[Intasend Webhook] Successfully updated bookingId: ${bookingId}`);

      // Here you would typically send a confirmation email to the guest.
      // e.g., await sendBookingConfirmationEmail(bookingId);

    } catch (error) {
      console.error(`[Intasend Webhook] Failed to update booking from webhook for bookingId: ${bookingId}`, error);
      // We return a 200 OK even on failure to prevent Intasend from retrying indefinitely
      // while we investigate the issue. In a production scenario, you might have more
      // sophisticated error handling or a retry queue.
    }
  }

  // Acknowledge receipt of the event to Intasend
  console.log('[Intasend Webhook] Acknowledging receipt of the event.');
  return new Response('Webhook received successfully.', { status: 200 });
}


/**
 * Verifies the incoming webhook signature from Intasend.
 * This is crucial for security to ensure the payload is authentic.
 * @param {string} body - The raw request body string.
 * @param {string | null} signature - The signature from the 'x-intasend-signature' header.
 * @param {string} secret - Your webhook secret from the Intasend dashboard.
 * @returns {boolean} - True if the signature is valid, false otherwise.
 */
function verifySignature(body: string, signature: string | null, secret: string): boolean {
  if (!signature) {
    return false;
  }
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(body);
  const digest = hmac.digest('hex');
  return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature));
}
