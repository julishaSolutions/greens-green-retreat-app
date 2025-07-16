
'use client';

import { useEffect, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { type Post } from '@/services/postService';
import { saveChanges, publishPost, unpublishPost, type EditFormState } from '../actions';
import { useToast } from '@/hooks/use-toast';
import { getDisplayImageUrl } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Save, Send, EyeOff } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const initialState: EditFormState = {
  message: '',
  errors: {},
  success: false,
};

function SubmitButton({ text, icon }: { text: string; icon: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="font-sans">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : (
        <>
          {icon}
          {text}
        </>
      )}
    </Button>
  );
}

export function EditForm({ post }: { post: Post }) {
  const { toast } = useToast();
  const [state, formAction] = useActionState(saveChanges, initialState);
  const { pending } = useFormStatus();

  useEffect(() => {
    if (state.message) {
      toast({
        title: state.success ? 'Success' : 'Error',
        description: state.message,
        variant: state.success ? 'default' : 'destructive',
      });
    }
  }, [state, toast]);

  const displayImageUrl = getDisplayImageUrl(post.imageUrl);

  return (
    <Card className="shadow-lg">
      <form action={formAction}>
        <input type="hidden" name="id" value={post.id} />
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-3xl font-bold font-headline text-primary">Edit Article</CardTitle>
              <CardDescription className="mt-1 text-lg text-foreground/80 font-sans">
                Make changes to your article and manage its visibility.
              </CardDescription>
            </div>
            <Button asChild variant="outline">
              <Link href="/admin/journal">Back to List</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-lg">Title</Label>
            <Input
              id="title"
              name="title"
              defaultValue={post.title}
              className="font-sans text-base"
              aria-describedby="title-error"
              required
            />
            {state?.errors?.title && (
              <p id="title-error" className="text-sm font-medium text-destructive">
                {state.errors.title[0]}
              </p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="imageUrl" className="text-lg">Featured Image URL</Label>
            {displayImageUrl && (
                <div className="mt-2 relative aspect-video w-full max-w-sm rounded-md overflow-hidden border">
                    <Image src={displayImageUrl} alt="Current post image" fill className="object-cover" sizes="50vw" />
                </div>
            )}
            <Input
              id="imageUrl"
              name="imageUrl"
              defaultValue={post.imageUrl || ''}
              placeholder="https://example.com/your-image.png"
              className="font-sans text-base"
              aria-describedby="imageUrl-error"
            />
            {state?.errors?.imageUrl && (
              <p id="imageUrl-error" className="text-sm font-medium text-destructive">
                {state.errors.imageUrl[0]}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="content" className="text-lg">Content (Markdown)</Label>
            <Textarea
              id="content"
              name="content"
              defaultValue={post.content}
              rows={15}
              className="font-sans text-base"
              aria-describedby="content-error"
              required
            />
            {state?.errors?.content && (
              <p id="content-error" className="text-sm font-medium text-destructive">
                {state.errors.content[0]}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter className="justify-between">
          <SubmitButton text="Save Changes" icon={<Save className="mr-2 h-4 w-4" />} />
          <div className="flex gap-2">
            {post.status === 'draft' ? (
                <Button type="submit" variant="secondary" formAction={publishPost.bind(null, post.id)} disabled={pending}>
                    {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                    Publish
                </Button>
            ) : (
                <Button type="submit" variant="secondary" formAction={unpublishPost.bind(null, post.id)} disabled={pending}>
                    {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <EyeOff className="mr-2 h-4 w-4" />}
                    Unpublish
                </Button>
            )}
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
