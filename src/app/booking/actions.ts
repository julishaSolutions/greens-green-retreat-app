'use server';

import { z } from 'zod';
import { createBooking } from '@/services/bookingService';

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
        await createBooking(validatedFields.data);
        return {
            message: 'Booking successful! We will be in touch shortly to confirm.',
            errors: {},
            success: true,
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
