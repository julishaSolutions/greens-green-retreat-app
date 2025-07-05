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
    // To prevent crashes when Firebase is not configured, we can assume availability.
    // The booking will be 'pending' and can be manually verified.
    console.warn('Firestore is not initialized. Availability check is skipped.');
    return true;
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

  try {
    const querySnapshot = await getDocs(q);

    const overlappingBookings = querySnapshot.docs.filter(doc => {
        const booking = doc.data() as DocumentData;
        const bookingCheckoutDate = (booking.checkOutDate as Timestamp).toDate();
        return bookingCheckoutDate > checkInDate;
    });

    return overlappingBookings.length === 0;
  } catch (error) {
    console.error("Error checking availability:", error);
    // In case of a permissions error on the server, we can allow the booking to go through as 'pending'.
    // This prevents the user from being blocked. The alternative is to return false and block all bookings.
    console.warn("Could not verify availability due to an error. Allowing tentative booking.");
    return true;
  }
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
