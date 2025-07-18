
'use server';

import { adminDb } from '@/lib/firebase-admin';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';

export type BookingDateRange = {
    from: Date;
    to: Date;
};

export type Booking = {
  id: string;
  guestName: string;
  guestEmail: string;
  cottageId: string;
  checkIn: Date;
  checkOut: Date;
  status: 'pending_confirmation' | 'confirmed' | 'cancelled';
  createdAt: Date;
  expiresAt?: Date;
  paymentStatus?: string;
  transactionId?: string;
};

export type PaymentDetails = {
  transactionId: string;
  paymentStatus: string;
};

function docToBooking(doc: FirebaseFirestore.DocumentSnapshot): Booking | null {
    const data = doc.data();
    if (!data) return null;

    return {
        id: doc.id,
        guestName: data.guestName || '',
        guestEmail: data.guestEmail || '',
        cottageId: data.cottageId || '',
        checkIn: (data.checkIn as Timestamp)?.toDate(),
        checkOut: (data.checkOut as Timestamp)?.toDate(),
        status: data.status || 'pending_confirmation',
        createdAt: (data.createdAt as Timestamp)?.toDate(),
        expiresAt: (data.expiresAt as Timestamp)?.toDate(),
        paymentStatus: data.paymentStatus,
        transactionId: data.transactionId,
    };
}

export async function getBookingById(bookingId: string): Promise<Booking | null> {
  if (!bookingId) return null;
  try {
    const db = adminDb();
    const doc = await db.collection('bookings').doc(bookingId).get();
    if (!doc.exists) {
      console.warn(`[BookingService] Booking with ID ${bookingId} not found.`);
      return null;
    }
    return docToBooking(doc);
  } catch (error) {
    console.error(`Error fetching booking by ID ${bookingId}:`, error);
    throw new Error(`Failed to fetch booking by ID ${bookingId}.`);
  }
}

export async function getAllBookings(): Promise<Booking[]> {
  try {
    const db = adminDb();
    const bookingsRef = db.collection('bookings').orderBy('createdAt', 'desc');
    const snapshot = await bookingsRef.get();
    return snapshot.docs.map(doc => docToBooking(doc)).filter((b): b is Booking => b !== null);
  } catch (error) {
    console.error(`Error fetching all bookings:`, error);
    throw new Error(`Failed to fetch all bookings.`);
  }
}

/**
 * Fetches all active (confirmed or non-expired pending) bookings for a cottage.
 * This is a helper function to consolidate logic for availability checks.
 */
async function getActiveBookingsForCottage(cottageId: string): Promise<Booking[]> {
  if (!cottageId) return [];
  const db = adminDb();
  const now = new Date();

  try {
    // Query all bookings for the cottage that haven't been explicitly cancelled.
    const bookingsQuery = db.collection('bookings')
      .where('cottageId', '==', cottageId)
      .where('status', 'in', ['confirmed', 'pending_confirmation']);
      
    const snapshot = await bookingsQuery.get();
    const allBookings = snapshot.docs.map(docToBooking).filter((b): b is Booking => b !== null);

    // Filter out expired pending bookings in the code.
    return allBookings.filter(booking => {
      if (booking.status === 'confirmed') {
        return true; // Always include confirmed bookings.
      }
      if (booking.status === 'pending_confirmation') {
        // Include pending bookings only if they have not expired.
        return booking.expiresAt ? booking.expiresAt > now : false;
      }
      return false;
    });
  } catch (error) {
    console.error(`Error fetching active bookings for cottage ${cottageId}:`, error);
    throw new Error(`Failed to fetch active bookings for cottage ${cottageId}.`);
  }
}


export async function getBookingsForCottage(cottageId: string): Promise<BookingDateRange[]> {
  const activeBookings = await getActiveBookingsForCottage(cottageId);
  return activeBookings.map(booking => ({
    from: booking.checkIn,
    to: booking.checkOut,
  }));
}


/**
 * Checks if a cottage is available for a given date range.
 * This implementation fetches all relevant bookings and checks for overlaps in the code.
 * @param {string} cottageId - The ID of the cottage.
 * @param {Date} newCheckIn - The check-in date for the new booking.
 * @param {Date} newCheckOut - The check-out date for the new booking.
 * @returns {Promise<boolean>} - True if available, false otherwise.
 */
export async function checkAvailability(cottageId: string, newCheckIn: Date, newCheckOut: Date): Promise<boolean> {
  try {
    const existingBookings = await getActiveBookingsForCottage(cottageId);

    // Check for overlaps with the new booking.
    // An overlap exists if (StartA < EndB) and (EndA > StartB).
    const isOverlapping = existingBookings.some(existing => 
        newCheckIn < existing.checkOut && newCheckOut > existing.checkIn
    );

    // If it's overlapping, it's NOT available.
    return !isOverlapping;

  } catch (e) {
    console.error('CRITICAL: Error during checkAvailability:', e);
    // Fail safe: if the check fails for any reason, assume it's not available to prevent double booking.
    return false;
  }
}


export async function createBooking(bookingData: {
  cottageId: string;
  checkIn: Date;
  checkOut: Date;
  guestName: string;
  guestEmail: string;
}): Promise<string> {
    const { cottageId, checkIn, checkOut, guestName, guestEmail } = bookingData;

    if (!cottageId || !checkIn || !checkOut || !guestName || !guestEmail) {
        throw new Error("Missing required booking information.");
    }
    
    const isAvailable = await checkAvailability(cottageId, checkIn, checkOut);
    if (!isAvailable) {
        console.warn(`Booking attempt failed for cottage ${cottageId} for dates ${checkIn} to ${checkOut}. Dates no longer available.`);
        throw new Error("Sorry, the selected dates are no longer available. Please choose different dates.");
    }

    const db = adminDb();
    const bookingRef = db.collection('bookings').doc();
    
    // Set expiry for 10 minutes from now
    const TEN_MINUTES_IN_MS = 10 * 60 * 1000;
    const expiresAt = Timestamp.fromMillis(Date.now() + TEN_MINUTES_IN_MS);
    
    await bookingRef.set({
        ...bookingData,
        checkIn: Timestamp.fromDate(checkIn),
        checkOut: Timestamp.fromDate(checkOut),
        createdAt: FieldValue.serverTimestamp(),
        expiresAt: expiresAt,
        status: 'pending_confirmation',
        paymentStatus: 'pending_payment',
    });

    return bookingRef.id;
}

export async function confirmBookingPayment(bookingId: string, paymentDetails: PaymentDetails): Promise<Booking | null> {
  const db = adminDb();
  const bookingRef = db.collection('bookings').doc(bookingId);

  try {
    const doc = await bookingRef.get();
    if (!doc.exists) {
        throw new Error(`Booking with ID ${bookingId} not found.`);
    }

    const updatePayload: { [key: string]: any } = {
      paymentStatus: (paymentDetails.paymentStatus || 'unknown').toUpperCase(),
      transactionId: paymentDetails.transactionId,
      updatedAt: FieldValue.serverTimestamp(),
      // Remove the expiry date upon successful payment
      expiresAt: FieldValue.delete(),
    };

    if (updatePayload.paymentStatus === 'COMPLETE') {
      updatePayload.status = 'confirmed';
    }

    await bookingRef.update(updatePayload);

    const updatedDoc = await bookingRef.get();
    return docToBooking(updatedDoc);
  } catch(error) {
    console.error(`Error confirming payment for booking ${bookingId}:`, error);
    throw error;
  }
}
