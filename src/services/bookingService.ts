
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

export async function getBookingsForCottage(cottageId: string): Promise<BookingDateRange[]> {
  if (!cottageId) return [];
  const db = adminDb();
  const bookingsRef = db.collection('bookings');
  const query = bookingsRef.where('cottageId', '==', cottageId).where('status', '!=', 'cancelled');

  try {
    const snapshot = await query.get();
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return { 
        from: (data.checkIn as Timestamp).toDate(), 
        to: (data.checkOut as Timestamp).toDate() 
      };
    }).filter(range => range.from && range.to);
  } catch (error) {
    console.error(`Error fetching bookings for cottage ${cottageId}:`, error);
    throw new Error(`Failed to fetch bookings for cottage ${cottageId}.`);
  }
}

/**
 * Checks if a cottage is available for a given date range.
 * This is the correct and final implementation.
 * @param {string} cottageId - The ID of the cottage.
 * @param {Date} newCheckIn - The check-in date for the new booking.
 * @param {Date} newCheckOut - The check-out date for the new booking.
 * @returns {Promise<boolean>} - True if available, false otherwise.
 */
export async function checkAvailability(cottageId: string, newCheckIn: Date, newCheckOut: Date): Promise<boolean> {
  const db = adminDb();
  const bookingsRef = db.collection('bookings');

  // We only need to check against confirmed or pending bookings for the specific cottage.
  const query = bookingsRef
    .where('cottageId', '==', cottageId)
    .where('status', 'in', ['confirmed', 'pending_confirmation']);

  try {
    const snapshot = await query.get();
    if (snapshot.empty) {
      // No existing bookings for this cottage, so it's available.
      return true;
    }

    const existingBookings = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        checkIn: (data.checkIn as Timestamp).toDate(),
        checkOut: (data.checkOut as Timestamp).toDate(),
      };
    });

    // Now, we check for overlaps in our application code.
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
        throw new Error("Sorry, the selected dates are no longer available. Please choose different dates.");
    }

    const db = adminDb();
    const bookingRef = db.collection('bookings').doc();
    
    await bookingRef.set({
        ...bookingData,
        checkIn: Timestamp.fromDate(checkIn),
        checkOut: Timestamp.fromDate(checkOut),
        createdAt: FieldValue.serverTimestamp(),
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
