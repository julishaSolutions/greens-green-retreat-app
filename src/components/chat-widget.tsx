'use client';

import { useState, useRef, useEffect, type FormEvent } from 'react';
import { askAIAssistant } from '@/ai/flows/ai-assistant';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bot, Send, Loader2, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Logo } from './logo';


type Message = {
    role: 'user' | 'model';
    content: string;
};

const initialMessages: Message[] = [
    {
        role: 'model',
        content: "Hello! I'm the assistant for Green's Green Retreat. How can I help you plan your getaway today?"
    }
];

export function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: Message = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await askAIAssistant({
                query: input,
                history: messages,
            });
            const modelMessage: Message = { role: 'model', content: response };
            setMessages(prev => [...prev, modelMessage]);
        } catch (error) {
            console.error("Error calling AI assistant:", error);
            const errorMessage: Message = { role: 'model', content: "Sorry, I'm having trouble connecting right now. Please try again later." };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="default"
                    size="lg"
                    className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-lg z-50 bg-primary hover:bg-primary/90"
                >
                    <Bot className="h-8 w-8 text-primary-foreground" />
                    <span className="sr-only">Open Chat</span>
                </Button>
            </PopoverTrigger>
            <PopoverContent
                side="top"
                align="end"
                className="w-[90vw] max-w-md h-[70vh] p-0 rounded-xl overflow-hidden border-2 border-primary/20"
                sideOffset={16}
            >
                <Card className="flex flex-col h-full border-none shadow-none">
                    <CardHeader className="bg-primary text-primary-foreground">
                        <div className="flex items-center gap-3">
                            <Logo size={40} className="bg-white rounded-full p-1" />
                            <div>
                                <CardTitle className="font-headline text-xl">GGR Assistant</CardTitle>
                                <CardDescription className="text-primary-foreground/80">Your guide to the retreat</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="flex-grow p-0 overflow-hidden">
                        <ScrollArea className="h-full" ref={scrollAreaRef}>
                            <div className="p-4 space-y-6">
                                {messages.map((message, index) => (
                                    <div key={index} className={cn(
                                        "flex gap-3 items-start",
                                        message.role === 'user' ? 'justify-end' : 'justify-start'
                                    )}>
                                        {message.role === 'model' && (
                                            <Avatar className="h-8 w-8 border-2 border-primary/50">
                                                <AvatarFallback className="bg-primary/20 text-primary">
                                                    <Bot className="h-5 w-5"/>
                                                </AvatarFallback>
                                            </Avatar>
                                        )}
                                        <div className={cn(
                                            "rounded-xl p-3 max-w-xs sm:max-w-sm prose prose-sm text-sm",
                                            message.role === 'user'
                                                ? 'bg-accent text-accent-foreground rounded-br-none'
                                                : 'bg-muted rounded-bl-none'
                                        )}>
                                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                {message.content}
                                            </ReactMarkdown>
                                        </div>
                                         {message.role === 'user' && (
                                            <Avatar className="h-8 w-8 border-2 border-accent/50">
                                                <AvatarFallback className="bg-accent/20 text-accent-foreground">
                                                    <User className="h-5 w-5"/>
                                                </AvatarFallback>
                                            </Avatar>
                                        )}
                                    </div>
                                ))}
                                {isLoading && (
                                    <div className="flex gap-3 items-start justify-start">
                                        <Avatar className="h-8 w-8 border-2 border-primary/50">
                                            <AvatarFallback className="bg-primary/20 text-primary">
                                                <Bot className="h-5 w-5"/>
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="rounded-xl p-3 max-w-[80%] bg-muted rounded-bl-none">
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                               <Loader2 className="h-4 w-4 animate-spin"/>
                                               <span>Thinking...</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </ScrollArea>
                    </CardContent>
                    <CardFooter className="p-3 border-t bg-background">
                        <form onSubmit={handleSubmit} className="flex w-full items-center gap-2">
                            <Input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask about our cottages..."
                                className="flex-grow"
                                disabled={isLoading}
                            />
                            <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                                <span className="sr-only">Send</span>
                            </Button>
                        </form>
                    </CardFooter>
                </Card>
            </PopoverContent>
        </Popover>
    );
}
