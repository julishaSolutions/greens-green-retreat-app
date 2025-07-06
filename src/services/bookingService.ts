
'use server';
// The booking service has been disabled to restore application stability.
// This prevents any related server errors from occurring.

export async function checkAvailability(cottageId: string, checkInDate: Date, checkOutDate: Date): Promise<boolean> {
  console.warn("Booking service is disabled. Availability check will always return false.");
  return false;
}

export async function createBooking(bookingData: any): Promise<string> {
  throw new Error("Booking functionality is currently disabled.");
}
