
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

function docToBooking(doc: FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData>): Booking {
    const data = doc.data()!;
    return {
        id: doc.id,
        guestName: data.guestName,
        guestEmail: data.guestEmail,
        cottageId: data.cottageId,
        checkIn: (data.checkIn as Timestamp).toDate(),
        checkOut: (data.checkOut as Timestamp).toDate(),
        status: data.status,
        createdAt: (data.createdAt as Timestamp).toDate(),
        paymentStatus: data.paymentStatus,
        transactionId: data.transactionId,
    };
}

export async function getAllBookings(): Promise<Booking[]> {
  if (!adminDb) {
    console.warn('Firestore Admin is not initialized. Cannot fetch bookings.');
    return [];
  }
  try {
    const bookingsRef = adminDb.collection('bookings').orderBy('createdAt', 'desc');
    const snapshot = await bookingsRef.get();
    if (snapshot.empty) {
      return [];
    }
    return snapshot.docs.map(docToBooking);
  } catch (error) {
    console.error(`Error fetching all bookings:`, error);
    return [];
  }
}

export async function getBookingsForCottage(cottageId: string): Promise<BookingDateRange[]> {
  if (!adminDb) {
    console.warn('Firestore Admin is not initialized. Cannot fetch bookings.');
    return [];
  }
  
  const bookingsRef = adminDb.collection('bookings');
  const query = bookingsRef.where('cottageId', '==', cottageId).where('status', '!=', 'cancelled');

  try {
    const snapshot = await query.get();
    if (snapshot.empty) {
      return [];
    }
    return snapshot.docs.map(doc => {
      const data = doc.data();
      // Firestore timestamps need to be converted to Date objects
      const checkIn = (data.checkIn as Timestamp).toDate();
      const checkOut = (data.checkOut as Timestamp).toDate();
      return { from: checkIn, to: checkOut };
    });
  } catch (error) {
    console.error(`Error fetching bookings for cottage ${cottageId}:`, error);
    return [];
  }
}

export async function checkAvailability(cottageId: string, checkInDate: Date, checkOutDate: Date): Promise<boolean> {
  if (!adminDb) {
    console.warn('Firestore Admin is not initialized. Cannot check availability.');
    // Fail open or closed? Let's fail closed to prevent double bookings.
    return false;
  }
  
  const bookingsRef = adminDb.collection('bookings');
  // Check for any booking that overlaps with the requested dates
  const query = bookingsRef
    .where('cottageId', '==', cottageId)
    .where('status', '!=', 'cancelled')
    .where('checkIn', '<', checkOutDate) // An existing booking's check-in is before the new check-out
    .where('checkOut', '>', checkInDate); // and its check-out is after the new check-in

  const snapshot = await query.get();
  // If snapshot is empty, no overlapping bookings were found, so it's available.
  return snapshot.empty;
}

export async function createBooking(bookingData: {
  cottageId: string;
  checkIn: Date;
  checkOut: Date;
  guestName: string;
  guestEmail: string;
}): Promise<string> {
    if (!adminDb) {
        throw new Error("Booking service is not available. Database not configured.");
    }

    const { cottageId, checkIn, checkOut, guestName, guestEmail } = bookingData;

    if (!cottageId || !checkIn || !checkOut || !guestName || !guestEmail) {
        throw new Error("Missing required booking information.");
    }
    
    const isAvailable = await checkAvailability(cottageId, checkIn, checkOut);
    if (!isAvailable) {
        throw new Error("Sorry, the selected dates are no longer available. Please choose different dates.");
    }

    const bookingRef = adminDb.collection('bookings').doc();
    
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
  if (!adminDb) {
    throw new Error("Booking service is not available. Database not configured.");
  }
  const bookingRef = adminDb.collection('bookings').doc(bookingId);

  const doc = await bookingRef.get();
  if (!doc.exists) {
      throw new Error(`Booking with ID ${bookingId} not found.`);
  }

  const updatePayload: { [key: string]: any } = {
    paymentStatus: paymentDetails.paymentStatus.toUpperCase(),
    transactionId: paymentDetails.transactionId,
    updatedAt: FieldValue.serverTimestamp(),
  };

  if (paymentDetails.paymentStatus.toUpperCase() === 'COMPLETE') {
    updatePayload.status = 'confirmed';
  }

  await bookingRef.update(updatePayload);

  const updatedDoc = await bookingRef.get();
  return docToBooking(updatedDoc);
}
