
'use client';

import { useFormStatus, useActionState } from 'react-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { generateArticle, saveArticle, type ArticleFormState, type SaveArticleFormState } from '../actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Feather, Save } from 'lucide-react';

const initialArticleState: ArticleFormState = {
  message: '',
  errors: {},
  title: null,
  article: null,
};

const initialSaveState: SaveArticleFormState = {
  message: '',
  errors: {},
  success: false,
};

function GenerateButton() {
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
          <Feather className="mr-2 h-4 w-4" />
          Generate Article
        </>
      )}
    </Button>
  );
}

function SaveButton() {
  const { pending } = useFormStatus();
  return (
      <Button type="submit" disabled={pending} variant="outline" className="font-sans">
          {pending ? (
              <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
              </>
          ) : (
              <>
                  <Save className="mr-2 h-4 w-4" />
                  Save as Draft
              </>
          )}
      </Button>
  );
}

export function ArticleGeneratorForm() {
  const [state, formAction] = useActionState(generateArticle, initialArticleState);
  const [saveState, saveFormAction] = useActionState(saveArticle, initialSaveState);

  return (
    <div className="space-y-6">
      <CardTitle className="text-3xl font-bold font-headline text-primary">
        2. Generate Full Article
      </CardTitle>
      <CardDescription className="mt-2 text-lg text-foreground/80 font-sans">
        Paste a title from above or write your own to generate a full, SEO-optimized journal post.
      </CardDescription>

      <form action={formAction} className="space-y-4">
        <div>
          <Label htmlFor="title" className="text-lg font-medium">Article Title</Label>
          <Input
            id="title"
            name="title"
            placeholder="e.g., A Family Adventure: Water Slides and Boat Rides"
            className="mt-2 font-sans"
            aria-describedby="title-error"
            required
          />
          {state.errors?.title && (
            <p id="title-error" className="text-sm font-medium text-destructive mt-2">
              {state.errors.title[0]}
            </p>
          )}
        </div>
        <GenerateButton />
      </form>
      
      {state.article && (
        <div className="space-y-4">
            <h3 className="text-2xl font-bold font-headline text-primary flex items-center gap-2 mb-4">
                Generated Article
            </h3>
            <Card className="shadow-inner bg-muted/30">
              <CardContent className="p-6">
                <article className="prose prose-lg max-w-none text-foreground/80 font-body prose-headings:font-headline prose-headings:text-primary prose-p:mb-4">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {state.article}
                    </ReactMarkdown>
                </article>
              </CardContent>
            </Card>

            <form action={saveFormAction}>
                <input type="hidden" name="title" value={state.title || ''} />
                <input type="hidden" name="content" value={state.article} />
                <SaveButton />
                {saveState.message && !saveState.success && (
                    <p className="text-sm font-medium text-destructive mt-2">{saveState.message}</p>
                )}
            </form>
        </div>
      )}
    </div>
  );
}
