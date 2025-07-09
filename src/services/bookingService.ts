
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

export async function getBookingById(bookingId: string): Promise<Booking | null> {
  try {
    const db = adminDb();
    const doc = await db.collection('bookings').doc(bookingId).get();
    if (!doc.exists) {
      return null;
    }
    return docToBooking(doc);
  } catch (error) {
    console.error(`Error fetching booking by ID ${bookingId}:`, error);
    throw new Error(`Failed to fetch booking by ID ${bookingId}. Reason: ${error instanceof Error ? error.message : 'Unknown'}`);
  }
}


export async function getAllBookings(): Promise<Booking[]> {
  try {
    const db = adminDb();
    const bookingsRef = db.collection('bookings').orderBy('createdAt', 'desc');
    const snapshot = await bookingsRef.get();
    if (snapshot.empty) {
      return [];
    }
    return snapshot.docs.map(docToBooking);
  } catch (error) {
    console.error(`Error fetching all bookings:`, error);
    throw new Error(`Failed to fetch all bookings. Reason: ${error instanceof Error ? error.message : 'Unknown'}`);
  }
}

export async function getBookingsForCottage(cottageId: string): Promise<BookingDateRange[]> {
  const db = adminDb();
  const bookingsRef = db.collection('bookings');
  const query = bookingsRef.where('cottageId', '==', cottageId).where('status', '!=', 'cancelled');

  try {
    const snapshot = await query.get();
    if (snapshot.empty) {
      return [];
    }
    return snapshot.docs.map(doc => {
      const data = doc.data();
      const checkIn = (data.checkIn as Timestamp).toDate();
      const checkOut = (data.checkOut as Timestamp).toDate();
      return { from: checkIn, to: checkOut };
    });
  } catch (error) {
    console.error(`Error fetching bookings for cottage ${cottageId}:`, error);
    throw new Error(`Failed to fetch bookings for cottage ${cottageId}. Reason: ${error instanceof Error ? error.message : 'Unknown'}`);
  }
}

export async function checkAvailability(cottageId: string, checkInDate: Date, checkOutDate: Date): Promise<boolean> {
  const db = adminDb();
  const bookingsRef = db.collection('bookings');
  const query = bookingsRef
    .where('cottageId', '==', cottageId)
    .where('status', '!=', 'cancelled')
    .where('checkIn', '<', checkOutDate)
    .where('checkOut', '>', checkInDate);

  const snapshot = await query.get();
  return snapshot.empty;
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
