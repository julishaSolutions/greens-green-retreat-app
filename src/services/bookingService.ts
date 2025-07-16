
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

export async function checkAvailability(cottageId: string, checkInDate: Date, checkOutDate: Date): Promise<boolean> {
  const db = adminDb();
  const bookingsRef = db.collection('bookings');
  
  // An overlap exists if a new booking's start date is before an existing one's end date,
  // AND the new booking's end date is after the existing one's start date.
  // We check for all bookings that could possibly overlap.
  const query = bookingsRef
    .where('cottageId', '==', cottageId)
    .where('status', '!=', 'cancelled')
    .where('checkIn', '<', checkOutDate); // Find bookings that start before the new one ends.

  try {
    const snapshot = await query.get();
    
    // Now, from the potential overlaps, filter in code to find true overlaps.
    const overlappingBookings = snapshot.docs.filter(doc => {
        const data = doc.data();
        const existingCheckOut = (data.checkOut as Timestamp).toDate();
        // An overlap exists if an existing booking's checkout is after the new one's check-in.
        return existingCheckOut > checkInDate;
    });

    return overlappingBookings.length === 0; // It's available if there are NO overlapping bookings.
  } catch(e) {
      console.error('Error checking availability:', e);
      // Fail safe: if the check fails, assume it's not available to prevent double booking.
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
