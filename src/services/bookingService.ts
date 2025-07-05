'use server';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, addDoc, Timestamp, type DocumentData } from 'firebase/firestore';

export type Booking = {
  id?: string;
  cottageId: string;
  guestName: string;
  guestEmail: string;
  guestNumber: number;
  checkInDate: Date;
  checkOutDate: Date;
  status: 'pending' | 'confirmed' | 'cancelled';
};

/**
 * Checks if a cottage is available for a given date range.
 * @param cottageId The ID of the cottage.
 * @param checkInDate The check-in date.
 * @param checkOutDate The check-out date.
 * @returns A promise that resolves to true if available, false otherwise.
 */
export async function checkAvailability(cottageId: string, checkInDate: Date, checkOutDate: Date): Promise<boolean> {
  if (!db) {
    throw new Error('Firestore is not initialized.');
  }

  const bookingsRef = collection(db, 'bookings');
  
  // Firestore can't perform two range filters on different fields.
  // We query for any confirmed booking where its start date is before our end date,
  // then filter in memory to see if its end date is after our start date.
  const q = query(
    bookingsRef,
    where('cottageId', '==', cottageId),
    where('status', '==', 'confirmed'),
    where('checkInDate', '<', Timestamp.fromDate(checkOutDate))
  );

  const querySnapshot = await getDocs(q);

  const overlappingBookings = querySnapshot.docs.filter(doc => {
      const booking = doc.data() as DocumentData;
      const bookingCheckoutDate = (booking.checkOutDate as Timestamp).toDate();
      return bookingCheckoutDate > checkInDate;
  });

  return overlappingBookings.length === 0;
}

/**
 * Creates a new booking in Firestore.
 * @param bookingData The data for the new booking.
 * @returns The ID of the newly created booking.
 */
export async function createBooking(bookingData: Omit<Booking, 'id' | 'status'>): Promise<string> {
  if (!db) {
    throw new Error('Firestore is not initialized.');
  }
  
  const bookingsRef = collection(db, 'bookings');
  const newBooking = {
    ...bookingData,
    checkInDate: Timestamp.fromDate(bookingData.checkInDate),
    checkOutDate: Timestamp.fromDate(bookingData.checkOutDate),
    status: 'pending' as const,
  };

  const docRef = await addDoc(bookingsRef, newBooking);
  return docRef.id;
}

/**
 * Retrieves all confirmed bookings for a specific cottage.
 * @param cottageId The ID of the cottage.
 * @returns A promise that resolves to an array of booking date ranges.
 */
export async function getConfirmedBookings(cottageId: string): Promise<{ from: Date; to: Date }[]> {
  if (!db) {
    throw new Error('Firestore is not initialized.');
  }

  const bookingsRef = collection(db, 'bookings');
  const q = query(
    bookingsRef,
    where('cottageId', '==', cottageId),
    where('status', '==', 'confirmed')
  );

  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      from: (data.checkInDate as Timestamp).toDate(),
      to: (data.checkOutDate as Timestamp).toDate(),
    };
  });
}
