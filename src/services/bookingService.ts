
import { adminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

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
  // TODO: Add guestId for authenticated users to align with Firestore rules
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
        checkIn: FieldValue.serverTimestamp.fromDate(checkIn),
        checkOut: FieldValue.serverTimestamp.fromDate(checkOut),
        createdAt: FieldValue.serverTimestamp(),
        status: 'pending_confirmation', // It's good practice to have a status
    });

    return bookingRef.id;
}
