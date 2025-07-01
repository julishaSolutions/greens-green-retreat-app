'use client';

import { useFormStatus } from 'react-dom';
import { useActionState, useEffect, useRef } from 'react';
import { getSuggestions, type FormState } from '../actions';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { Loader2, List, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const initialState: FormState = {
  message: '',
  errors: {},
  data: [],
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto font-sans">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Generating...
        </>
      ) : (
         <>
          <Sparkles className="mr-2 h-4 w-4" />
          Generate Titles
        </>
      )}
    </Button>
  );
}

export function SuggestionForm() {
  const [state, formAction] = useActionState(getSuggestions, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (state.message && state.message !== 'Validation failed. Please check your input.') {
      toast({
        title: state.message.startsWith('Successfully') ? 'Success' : 'Error',
        description: state.message,
        variant: state.message.startsWith('Successfully') ? 'default' : 'destructive',
      });
    }
    if (state.message === 'Successfully generated titles!') {
        formRef.current?.reset();
    }
  }, [state, toast]);

  return (
    <div className="space-y-6">
      <form ref={formRef} action={formAction} className="space-y-4">
        <div>
          <Label htmlFor="reviews" className="text-lg font-medium">Guest Reviews</Label>
          <Textarea
            id="reviews"
            name="reviews"
            placeholder="Paste guest reviews here... e.g., 'Waking up to birdsong at Alma 1 was magical! The kids loved the water slides. Such a peaceful and beautiful place. We will be back!'"
            rows={8}
            className="mt-2 font-sans"
            aria-describedby="reviews-error"
            required
          />
          {state.errors?.reviews && (
            <p id="reviews-error" className="text-sm font-medium text-destructive mt-2">
              {state.errors.reviews[0]}
            </p>
          )}
        </div>
        <SubmitButton />
      </form>
      
      {state.data.length > 0 && (
        <div>
            <h3 className="text-2xl font-bold font-headline text-primary flex items-center gap-2 mb-4">
                <List className="h-6 w-6"/>
                Suggested Titles
            </h3>
            <Alert>
                <AlertDescription>
                <ul className="space-y-2 list-disc pl-5 font-sans">
                    {state.data.map((title, index) => (
                    <li key={index} className="text-base">{title}</li>
                    ))}
                </ul>
                </AlertDescription>
            </Alert>
        </div>
      )}
    </div>
  );
}
