'use server';
import { adminDb } from '@/lib/firebase-admin';
import { Timestamp, type DocumentData } from 'firebase-admin/firestore';

const ADMIN_DB_ERROR_MESSAGE = 'Firestore Admin is not initialized. This is likely due to missing or incorrect Firebase Admin credentials in your .env.local file. Please check your configuration and restart the server.';

export type Booking = {
  id?: string;
  cottageId: string;
  guestId: string;
  guestName: string;
  guestEmail: string;
  guestNumber: number;
  checkInDate: Date;
  checkOutDate: Date;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: Timestamp;
};

/**
 * Checks if a cottage is available for a given date range.
 * @param cottageId The ID of the cottage.
 * @param checkInDate The check-in date.
 * @param checkOutDate The check-out date.
 * @returns A promise that resolves to true if available, false otherwise.
 */
export async function checkAvailability(cottageId: string, checkInDate: Date, checkOutDate: Date): Promise<boolean> {
  if (!adminDb) {
    throw new Error(ADMIN_DB_ERROR_MESSAGE);
  }

  const bookingsRef = adminDb.collection('bookings');
  
  // Firestore can't perform two range filters on different fields.
  // We query for any confirmed booking where its start date is before our end date,
  // then filter in memory to see if its end date is after our start date.
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
    // In case of an error (e.g., permissions), we should assume unavailability to be safe.
    // We will return false to prevent double bookings.
    console.warn("Could not verify availability due to a service error. Blocking booking as a precaution.");
    return false;
  }
}

/**
 * Creates a new booking in Firestore.
 * @param bookingData The data for the new booking.
 * @returns The ID of the newly created booking.
 */
export async function createBooking(bookingData: Omit<Booking, 'id' | 'status' | 'createdAt'>): Promise<string> {
  if (!adminDb) {
    throw new Error(ADMIN_DB_ERROR_MESSAGE);
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
