'use server';

import { z } from 'zod';
import { checkAvailability, createBooking } from '@/services/bookingService';

const bookingFormSchema = z.object({
  fullName: z.string().min(2, { message: 'Full name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  checkInDate: z.coerce.date({ required_error: 'A start date is required.' }),
  checkOutDate: z.coerce.date({ required_error: 'An end date is required.' }),
  accommodation: z.string({ required_error: 'Please select an accommodation.' }).min(1, 'Please select an accommodation.'),
  guests: z.coerce.number().min(1, { message: 'Must have at least 1 guest.' }).max(10, { message: 'Cannot exceed 10 guests.' }),
}).refine(data => data.checkOutDate > data.checkInDate, {
  message: "Check-out date must be after check-in date.",
  path: ["dates"],
});

export type BookingFormState = {
  message: string;
  errors?: {
    _form?: string[];
    fullName?: string[];
    email?: string[];
    dates?: string[];
    checkInDate?: string[];
    checkOutDate?: string[];
    accommodation?: string[];
    guests?: string[];
  };
  success: boolean;
};

export async function submitBooking(prevState: BookingFormState, formData: FormData): Promise<BookingFormState> {
  const validatedFields = bookingFormSchema.safeParse({
      fullName: formData.get('fullName'),
      email: formData.get('email'),
      checkInDate: formData.get('checkInDate'),
      checkOutDate: formData.get('checkOutDate'),
      accommodation: formData.get('accommodation'),
      guests: formData.get('guests'),
  });

  if (!validatedFields.success) {
    const flattenedErrors = validatedFields.error.flatten();
    const formErrors = flattenedErrors.formErrors;
    const fieldErrors = flattenedErrors.fieldErrors as BookingFormState['errors'];

    if(formErrors.length > 0 && formErrors[0].includes("Check-out date")){
        if (!fieldErrors) {
            fieldErrors! = {};
        }
        fieldErrors.dates = formErrors;
    }

    return {
      message: 'Validation failed. Please check your input.',
      errors: fieldErrors,
      success: false,
    };
  }

  const { fullName, email, checkInDate, checkOutDate, accommodation, guests } = validatedFields.data;
  
  try {
    const isAvailable = await checkAvailability(accommodation, checkInDate, checkOutDate);

    if (!isAvailable) {
      return {
        message: 'The selected dates are not available for this accommodation. Please choose different dates.',
        errors: {
          dates: ['The selected dates are not available for this accommodation. Please choose different dates.'],
        },
        success: false,
      };
    }
    
    await createBooking({
        cottageId: accommodation,
        guestName: fullName,
        guestEmail: email,
        guestNumber: guests,
        checkInDate: checkInDate,
        checkOutDate: checkOutDate,
    });
    
    return {
      message: 'Booking request submitted! We will be in touch shortly to confirm.',
      errors: {},
      success: true,
    };

  } catch (error) {
    console.error('Booking submission error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
    return {
      message: 'An unexpected error occurred while submitting your booking. Please try again later.',
      errors: {
          _form: [errorMessage]
      },
      success: false,
    };
  }
}
