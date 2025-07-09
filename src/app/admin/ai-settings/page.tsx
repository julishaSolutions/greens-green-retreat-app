
import { getKnowledgeBase, getAllAgentConfigs } from '@/services/systemService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { Bot, SlidersHorizontal } from 'lucide-react';
import { KnowledgeBaseForm } from './components/knowledge-base-form';
import { AgentSettings } from './components/agent-settings';

export default async function AISettingsPage() {
    const knowledgeBaseContent = await getKnowledgeBase();
    const agentConfigs = await getAllAgentConfigs();

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
                                Manage the knowledge and behavior of your website's AI chatbot.
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                   <Tabs defaultValue="knowledge-base" className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="knowledge-base">
                            <Bot className="mr-2 h-4 w-4" />
                            Knowledge Base
                        </TabsTrigger>
                        <TabsTrigger value="agent-settings">
                            <SlidersHorizontal className="mr-2 h-4 w-4" />
                            Agent Settings
                        </TabsTrigger>
                      </TabsList>
                      <TabsContent value="knowledge-base" className="mt-6">
                        <KnowledgeBaseForm initialContent={knowledgeBaseContent} />
                      </TabsContent>
                      <TabsContent value="agent-settings" className="mt-6">
                        <AgentSettings agentConfigs={agentConfigs} />
                      </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
}
