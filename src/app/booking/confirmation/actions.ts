
'use server';

import { confirmBookingPayment, type Booking } from '@/services/bookingService';
import { getCottages } from '@/services/contentService';
import { z } from 'zod';

const PaymentConfirmationSchema = z.object({
  bookingId: z.string(),
  transactionId: z.string(),
  paymentStatus: z.string(), // e.g., 'COMPLETE', 'FAILED'
});

type ConfirmPaymentInput = z.infer<typeof PaymentConfirmationSchema>;

type ConfirmPaymentResult = {
  success: boolean;
  message: string;
  booking?: Booking & { cottageName?: string };
}

export async function confirmPayment(input: ConfirmPaymentInput): Promise<ConfirmPaymentResult> {
  const validatedFields = PaymentConfirmationSchema.safeParse(input);

  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Invalid input data.',
    };
  }

  const { bookingId, transactionId, paymentStatus } = validatedFields.data;

  // IMPORTANT: In a real-world application, you must call the Intasend API
  // from the server here to securely verify the transactionId and status.
  // This prevents users from manually crafting a URL to fake a payment.
  // For this demo, we will trust the redirect parameters from the URL.

  if (paymentStatus.toUpperCase() !== 'COMPLETE') {
      return {
          success: false,
          message: `Payment was not successful. Status: ${paymentStatus}`
      }
  }

  try {
    const updatedBooking = await confirmBookingPayment(bookingId, { transactionId, paymentStatus });
    if (updatedBooking) {
      // Here you would also trigger a real confirmation email to the guest.
      console.log(`Booking ${bookingId} confirmed. A confirmation email should be sent to ${updatedBooking.guestEmail}.`);
      
      const cottages = await getCottages();
      const cottage = cottages.find(c => c.id === updatedBooking.cottageId);

      return {
        success: true,
        message: 'Booking confirmed successfully!',
        booking: { ...updatedBooking, cottageName: cottage?.name || 'Unknown Cottage' },
      };
    } else {
        return {
            success: false,
            message: 'Booking could not be found or updated.'
        }
    }
  } catch (error) {
    console.error(`Failed to confirm payment for booking ${bookingId}:`, error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'An unexpected error occurred.',
    };
  }
}
