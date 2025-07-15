
'use server';

import { z } from 'zod';
import { createBooking, getBookingsForCottage, type BookingDateRange } from '@/services/bookingService';

export async function fetchBookings(cottageId: string): Promise<BookingDateRange[]> {
    if (!cottageId) {
        return [];
    }
    try {
        const bookings = await getBookingsForCottage(cottageId);
        return bookings;
    } catch (error) {
        console.error("Failed to fetch bookings:", error);
        return []; // Return empty on error to avoid crashing the client
    }
}

const FormSchema = z.object({
  cottageId: z.string().min(1, "Cottage ID is required."),
  guestName: z.string().min(2, "Name must be at least 2 characters."),
  guestEmail: z.string().email("Please enter a valid email address."),
  checkIn: z.coerce.date(),
  checkOut: z.coerce.date(),
}).refine(data => data.checkOut > data.checkIn, {
  message: "Check-out date must be after check-in date.",
  path: ["checkOut"],
});

export type BookingFormState = {
  message: string;
  errors?: {
    cottageId?: string[];
    guestName?: string[];
    guestEmail?: string[];
    checkIn?: string[];
    checkOut?: string[];
    form?: string[];
  };
  success: boolean;
  paymentLink?: string;
};

export async function submitBooking(prevState: BookingFormState, formData: FormData): Promise<BookingFormState> {
    const validatedFields = FormSchema.safeParse({
        cottageId: formData.get('cottageId'),
        guestName: formData.get('guestName'),
        guestEmail: formData.get('guestEmail'),
        checkIn: formData.get('checkIn'),
        checkOut: formData.get('checkOut'),
    });

    if (!validatedFields.success) {
        return {
            message: 'Validation failed. Please check your input.',
            errors: validatedFields.error.flatten().fieldErrors,
            success: false,
        };
    }
    
    try {
        const bookingId = await createBooking(validatedFields.data);
        // NOTE: We append a `tracking_id` to the Intasend URL.
        // This is a common pattern for payment gateways to associate a transaction
        // with a specific order or booking on our end.
        const paymentLink = `https://payment.intasend.com/pay/46132722-b089-4fdc-a73d-762ebfcb34ab/?tracking_id=${bookingId}`;
        
        // In a real application, you would email this link to the guest.
        // For this demo, we will display it directly on the page.
        return {
            message: 'Booking request received! Please complete your payment using the link below to confirm your stay.',
            errors: {},
            success: true,
            paymentLink: paymentLink,
        };
    } catch (error) {
        console.error("Booking Error:", error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        return {
            message: 'Booking failed.',
            errors: { form: [errorMessage] },
            success: false,
        };
    }
}
