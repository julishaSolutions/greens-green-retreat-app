
'use server';
import { adminDb } from '@/lib/firebase-admin';
import { Timestamp, type DocumentData } from 'firebase-admin/firestore';

const FIREBASE_NOT_INITIALIZED_ERROR = 'Booking operations are disabled because the connection to the database has not been configured. Please check your server environment configuration.';

export type Booking = {
  id?: string;
  cottageId: string;
  guestName: string;
  guestEmail: string;
  guestNumber: number;
  checkInDate: Date;
  checkOutDate: Date;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: Timestamp;
};

export async function checkAvailability(cottageId: string, checkInDate: Date, checkOutDate: Date): Promise<boolean> {
  if (!adminDb) {
    console.warn(FIREBASE_NOT_INITIALIZED_ERROR);
    // As a safe default, if the database is down, assume dates are not available to prevent double bookings.
    return false;
  }
  
  const bookingsRef = adminDb.collection('bookings');
  
  const q = bookingsRef
    .where('cottageId', '==', cottageId)
    .where('status', '==', 'confirmed')
    .where('checkInDate', '<', Timestamp.fromDate(checkOutDate));

  try {
    const querySnapshot = await q.get();
    const overlappingBookings = querySnapshot.docs.filter(doc => {
        const booking = doc.data() as DocumentData;
        const bookingCheckoutDate = (booking.checkOutDate as Timestamp).toDate();
        return bookingCheckoutDate > checkInDate;
    });
    return overlappingBookings.length === 0;
  } catch (error) {
    console.error("Error checking availability:", error);
    // In case of a query error, also assume unavailability to be safe.
    return false;
  }
}

export async function createBooking(bookingData: Omit<Booking, 'id' | 'status' | 'createdAt'>): Promise<string> {
  if (!adminDb) {
    throw new Error(FIREBASE_NOT_INITIALIZED_ERROR);
  }

  const bookingsRef = adminDb.collection('bookings');
  const newBooking = {
    ...bookingData,
    checkInDate: Timestamp.fromDate(bookingData.checkInDate),
    checkOutDate: Timestamp.fromDate(bookingData.checkOutDate),
    status: 'pending' as const,
    createdAt: Timestamp.now(),
  };

  const docRef = await bookingsRef.add(newBooking);
  return docRef.id;
}
