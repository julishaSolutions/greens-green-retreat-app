
'use client';

import { useState, useRef, useEffect, type FormEvent } from 'react';
import { askAIAssistant } from '@/ai/flows/ai-assistant';
import { generateSpeech } from '@/ai/flows/text-to-speech';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, Loader2, User, Sparkles, MessageCircle, Mic, Volume2, VolumeX } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useToast } from '@/hooks/use-toast';

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

// Reference for SpeechRecognition, will be populated on the client.
let recognition: any = null;

export function ChatWidget() {
    const { toast } = useToast();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [isTtsEnabled, setIsTtsEnabled] = useState(true);
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Initialize SpeechRecognition and Audio on component mount (client-side only)
    useEffect(() => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (SpeechRecognition) {
            recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = 'en-US';

            recognition.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript;
                setInput(transcript);
                setIsListening(false);
            };

            recognition.onerror = (event: any) => {
                console.error("Speech recognition error:", event.error);
                toast({ title: 'Voice Error', description: `An error occurred: ${event.error}`, variant: 'destructive'});
                setIsListening(false);
            };

            recognition.onend = () => {
                setIsListening(false);
            };
        }
        
        // Pre-create the audio element
        if (!audioRef.current) {
            audioRef.current = new Audio();
        }
    }, [toast]);


    const scrollToBottom = () => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);
    
    const handleVoiceClick = () => {
        if (!recognition) {
            toast({ title: 'Voice Not Supported', description: 'Your browser does not support voice recognition.', variant: 'destructive'});
            return;
        }
        if (isListening) {
            recognition.stop();
            setIsListening(false);
        } else {
            recognition.start();
            setIsListening(true);
        }
    };

    const playAudio = async (text: string) => {
        if (!isTtsEnabled || !text) return;

        try {
            const { audioDataUri } = await generateSpeech(text);
            if (audioRef.current && audioDataUri) {
                audioRef.current.src = audioDataUri;
                audioRef.current.play().catch(e => console.error("Audio playback failed:", e));
            }
        } catch (error) {
            console.error("Error generating speech:", error);
            toast({ title: 'Audio Error', description: 'Could not generate audio for the response.', variant: 'destructive'});
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: Message = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const responseText = await askAIAssistant({
                query: input,
                history: messages,
            });
            const modelMessage: Message = { role: 'model', content: responseText };
            setMessages(prev => [...prev, modelMessage]);
            await playAudio(responseText);

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
                    className="fixed bottom-6 right-6 rounded-full shadow-2xl z-50 bg-primary hover:bg-primary/95 h-auto py-3 px-6 flex items-center gap-3 transition-transform hover:scale-105 font-sans"
                >
                    <MessageCircle className="h-6 w-6 text-primary-foreground" />
                    <span>Talk to Greens' Assistant</span>
                </Button>
            </PopoverTrigger>
            <PopoverContent
                side="top"
                align="end"
                className="w-[90vw] max-w-md h-[70vh] p-0 rounded-2xl overflow-hidden border-2 border-primary/20 shadow-2xl"
                sideOffset={16}
            >
                <Card className="flex flex-col h-full border-none shadow-none">
                    <CardHeader className="bg-primary text-primary-foreground">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-white/20 rounded-full">
                                    <Sparkles className="h-6 w-6 text-white"/>
                                </div>
                                <div>
                                    <CardTitle className="font-headline text-xl">Greens' Assistant</CardTitle>
                                    <CardDescription className="text-primary-foreground/80 font-sans">Your guide to the retreat</CardDescription>
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-white/20" onClick={() => setIsTtsEnabled(prev => !prev)}>
                                {isTtsEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
                                <span className="sr-only">Toggle Sound</span>
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="flex-grow p-0 overflow-hidden">
                        <ScrollArea className="h-full" viewportRef={scrollAreaRef}>
                            <div className="p-4 space-y-6">
                                {messages.map((message, index) => (
                                    <div key={index} className={cn(
                                        "flex gap-3 items-start",
                                        message.role === 'user' ? 'justify-end' : 'justify-start'
                                    )}>
                                        {message.role === 'model' && (
                                            <Avatar className="h-8 w-8 border-2 border-primary/50">
                                                <AvatarFallback className="bg-primary/20 text-primary">
                                                    <Sparkles className="h-5 w-5"/>
                                                </AvatarFallback>
                                            </Avatar>
                                        )}
                                        <div className={cn(
                                            "rounded-xl p-3 max-w-xs sm:max-w-sm prose prose-sm",
                                            "prose-p:font-sans prose-p:my-0",
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
                                                <Sparkles className="h-5 w-5"/>
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="rounded-xl p-3 max-w-[80%] bg-muted rounded-bl-none">
                                            <div className="flex items-center gap-2 text-muted-foreground font-sans">
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
                             <Button
                                type="button"
                                size="icon"
                                variant="ghost"
                                onClick={handleVoiceClick}
                                className={cn("rounded-full", isListening ? 'text-destructive animate-pulse' : 'text-muted-foreground')}
                                disabled={!recognition}
                            >
                                <Mic className="h-5 w-5" />
                                <span className="sr-only">Use Microphone</span>
                            </Button>
                            <Input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask about our cottages..."
                                className="flex-grow bg-transparent focus:ring-0 focus:ring-offset-0 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 font-sans"
                                disabled={isLoading}
                            />
                            <Button type="submit" size="icon" disabled={isLoading || !input.trim()} className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full">
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
