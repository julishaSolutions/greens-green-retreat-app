import { SuggestionForm } from './components/suggestion-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Lightbulb } from 'lucide-react';

export default function AIJournalPage() {
  return (
    <div className="max-w-3xl mx-auto">
        <Card className="shadow-lg">
            <CardHeader className="text-center">
                <div className="mx-auto bg-primary/10 rounded-full h-20 w-20 flex items-center justify-center mb-4">
                    <Lightbulb className="h-10 w-10 text-primary" />
                </div>
                <CardTitle className={cn("text-3xl font-bold font-headline text-primary")}>
                AI Journal Idea Generator
                </CardTitle>
                <CardDescription className="mt-2 text-lg text-foreground/80 font-sans">
                Paste in recent guest reviews and let our AI assistant suggest engaging journal post titles that highlight a positive experience.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <SuggestionForm />
            </CardContent>
        </Card>
    </div>
  );
}
