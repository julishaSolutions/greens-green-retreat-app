
import { NextResponse, type NextRequest } from 'next/server';
import { confirmBookingPayment } from '@/services/bookingService';
import crypto from 'crypto';

// This is your webhook secret, which you should set in your .env file
const WEBHOOK_SECRET = process.env.INTASEND_WEBHOOK_SECRET;

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
  try {
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(body);
    const digest = hmac.digest('hex');
    const signatureBuffer = Buffer.from(signature);
    const digestBuffer = Buffer.from(digest);
    return crypto.timingSafeEqual(digestBuffer, signatureBuffer);
  } catch (error) {
    console.error('Error during signature verification:', error);
    return false;
  }
}

/**
 * This is the API route that Intasend will call to notify your application about payment events.
 * It handles two main things:
 * 1. Responding to the initial 'challenge' from Intasend to verify the webhook URL.
 * 2. Processing incoming payment notifications (payloads) to update booking statuses.
 */
export async function POST(request: NextRequest) {
  console.log('[Intasend Webhook] Received a request.');

  if (!WEBHOOK_SECRET) {
    console.error('[Intasend Webhook] CRITICAL: INTASEND_WEBHOOK_SECRET is not set in environment variables.');
    return new Response('Webhook secret not configured.', { status: 500 });
  }

  const signature = request.headers.get('x-intasend-signature');
  const bodyText = await request.text();

  if (!verifySignature(bodyText, signature, WEBHOOK_SECRET)) {
    console.warn('[Intasend Webhook] Invalid webhook signature received. Aborting.');
    return new Response('Invalid signature.', { status: 400 });
  }
  
  console.log('[Intasend Webhook] Signature verified successfully.');

  try {
    const payload = JSON.parse(bodyText);

    if (payload.challenge) {
      console.log('[Intasend Webhook] Responding to Intasend webhook challenge.');
      return NextResponse.json({ challenge: payload.challenge });
    }

    console.log(`[Intasend Webhook] Received event type: ${payload.event_type}`);
    if (payload.event_type === 'invoice.payment.successful' && payload.data) {
      const { invoice, transaction, state } = payload.data;
      const bookingId = invoice?.tracking_id;
      const transactionId = transaction?.id;
      const paymentStatus = state;

      console.log('[Intasend Webhook] Processing payload:', { bookingId, transactionId, paymentStatus });

      if (!bookingId || !transactionId || !paymentStatus) {
        console.error('[Intasend Webhook] Webhook payload is missing required fields.');
        return new Response('Webhook Error: Missing required data.', { status: 400 });
      }

      await confirmBookingPayment(bookingId, { transactionId, paymentStatus });
      console.log(`[Intasend Webhook] Successfully updated bookingId: ${bookingId}`);
    }

    return new Response('Webhook received successfully.', { status: 200 });

  } catch (error) {
    console.error('[Intasend Webhook] Error processing webhook:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return new Response(`Webhook Error: ${errorMessage}`, { status: 500 });
  }
}
