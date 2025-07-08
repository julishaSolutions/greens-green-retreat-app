
'use server';

import { getPostById } from '@/services/postService';
import { getCottages } from '@/services/contentService';
import { getBookingById, type Booking } from '@/services/bookingService';

type GetBookingResult = {
  success: boolean;
  message: string;
  booking?: Booking & { cottageName?: string };
}

export async function getBookingDetails(bookingId: string): Promise<GetBookingResult> {
  if (!bookingId) {
    return {
      success: false,
      message: 'Booking ID is missing.',
    };
  }
  
  try {
    const booking = await getBookingById(bookingId);
    
    if (booking) {
      const cottages = await getCottages();
      const cottage = cottages.find(c => c.id === booking.cottageId);
      
      return {
        success: true,
        message: 'Booking found.',
        booking: { ...booking, cottageName: cottage?.name || 'Unknown Cottage' },
      };
    } else {
      return {
        success: false,
        message: 'Booking could not be found.',
      };
    }
  } catch (error) {
    console.error(`Failed to fetch details for booking ${bookingId}:`, error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'An unexpected error occurred.',
    };
  }
}
