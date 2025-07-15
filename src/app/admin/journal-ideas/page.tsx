import { SuggestionForm } from './components/suggestion-form';
import { ArticleGeneratorForm } from './components/article-generator-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Lightbulb } from 'lucide-react';

export default function AIJournalPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
        <Card className="shadow-lg">
            <CardHeader className="text-center">
                <div className="mx-auto bg-primary/10 rounded-full h-20 w-20 flex items-center justify-center mb-4">
                    <Lightbulb className="h-10 w-10 text-primary" />
                </div>
                <CardTitle className={cn("text-4xl font-bold font-headline text-primary")}>
                AI Content Studio
                </CardTitle>
                <CardDescription className="mt-2 text-lg text-foreground/80 font-sans">
                A two-step process to create engaging journal content for your retreat.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div>
                <CardTitle className="text-3xl font-bold font-headline text-primary mb-2">
                  1. Get Title Ideas
                </CardTitle>
                <CardDescription className="text-lg text-foreground/80 font-sans mb-6">
                  Paste in recent guest reviews to generate engaging journal post titles.
                </CardDescription>
                <SuggestionForm />
              </div>
              
              <Separator className="my-8" />
              
              <ArticleGeneratorForm />

            </CardContent>
        </Card>
    </div>
  );
}
