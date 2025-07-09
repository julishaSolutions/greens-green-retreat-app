
import { getKnowledgeBase } from '@/services/systemService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Bot } from 'lucide-react';
import { KnowledgeBaseForm } from './components/knowledge-base-form';

export default async function AISettingsPage() {
    const knowledgeBaseContent = await getKnowledgeBase();

    return (
        <div className="max-w-4xl mx-auto">
            <Card className="shadow-lg">
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <div className="bg-primary/10 rounded-full h-12 w-12 flex items-center justify-center">
                            <Bot className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <CardTitle className={cn("text-3xl font-bold font-headline text-primary")}>
                                AI Assistant Settings
                            </CardTitle>
                            <CardDescription className="mt-1 text-lg text-foreground/80 font-sans">
                                Manage the knowledge base for your website's AI chatbot.
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <KnowledgeBaseForm initialContent={knowledgeBaseContent} />
                </CardContent>
            </Card>
        </div>
    );
}
