
'use client';

import { useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { saveKnowledgeBase, type FormState } from '../actions';
import { useToast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Save } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info } from 'lucide-react';

const initialState: FormState = {
  message: '',
  errors: {},
  success: false,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="font-sans">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Saving...
        </>
      ) : (
        <>
          <Save className="mr-2 h-4 w-4" />
          Save Knowledge Base
        </>
      )}
    </Button>
  );
}

export function KnowledgeBaseForm({ initialContent }: { initialContent: string }) {
  const { toast } = useToast();
  const [state, formAction] = useFormState(saveKnowledgeBase, initialState);

  useEffect(() => {
    if (state.message) {
      toast({
        title: state.success ? 'Success' : 'Error',
        description: state.message,
        variant: state.success ? 'default' : 'destructive',
      });
    }
  }, [state, toast]);

  return (
    <form action={formAction} className="space-y-6">
      <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>How this works</AlertTitle>
          <AlertDescription>
            The text below is the complete source of truth for the AI assistant. It will only answer questions based on the information provided here. To update the AI's knowledge, edit the text and click save.
          </AlertDescription>
      </Alert>
      
      <div className="space-y-2">
        <Label htmlFor="knowledgeBase" className="text-lg font-medium">Knowledge Base Content</Label>
        <Textarea
          id="knowledgeBase"
          name="knowledgeBase"
          defaultValue={initialContent}
          rows={25}
          className="font-sans text-base"
          aria-describedby="kb-error"
          required
        />
        {state?.errors?.knowledgeBase && (
          <p id="kb-error" className="text-sm font-medium text-destructive">
            {state.errors.knowledgeBase[0]}
          </p>
        )}
      </div>

      <SubmitButton />
    </form>
  );
}
