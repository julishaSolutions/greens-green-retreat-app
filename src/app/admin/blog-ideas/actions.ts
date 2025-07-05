
'use server';

// This feature has been disabled to consolidate with the Journal feature.
export async function getSuggestions(prevState: any, formData: FormData): Promise<any> {
  return { message: 'This feature is disabled.', errors: {}, data: [] };
}
