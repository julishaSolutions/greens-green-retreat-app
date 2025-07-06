'use server';

// The booking feature has been temporarily disabled to restore application stability.
export async function submitBooking(prevState: any, formData: FormData): Promise<any> {
  return {
    message: 'This feature is currently disabled.',
    errors: {},
    success: false,
  };
}
