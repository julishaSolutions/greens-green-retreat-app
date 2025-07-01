'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Info, Mail, MessageCircle, Clock, CreditCard, Grill, Utensils, Box, ChefHat, User, Sparkles, Star } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Link from 'next/link';

const faqs = [
    {
        question: "What are your charges?",
        answer: (
            <div className="space-y-2">
                <p><strong>Day Trip:</strong> Kes. 2,000 per person.</p>
                <p><strong>Overnight (1-2 People):</strong> Kes. 14,000 per night.</p>
                <p><strong>Overnight (Group of 4-8):</strong> Kes. 40,000 per night.</p>
                <p>For a detailed price list, please request one via WhatsApp.</p>
            </div>
        )
    },
    {
        question: "What does the rate include?",
        answer: "The rate includes access to waterslides, fishing (please bring your own gear), crockery, and gas. Meals are not included in the rate."
    },
    {
        question: "Is there a restaurant on site?",
        answer: "Not yet. However, each cottage has a well-equipped kitchen with a microwave, hob, and oven for self-catering. Day visitors have access to a communal kitchen and BBQ pits."
    },
    {
        question: "Can we hire a chef?",
        answer: "Yes! We have chefs available for hire on a daily rate. The price depends on the group size and the number of meals required. Please inquire for more details."
    },
    {
        question: "What should we pack for our stay?",
        answer: (
             <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Food and drinks for your stay.</li>
                <li>Comfortable walking shoes.</li>
                <li>Swimwear for the waterslides (optional).</li>
                <li>An adventurous spirit!</li>
            </ul>
        )
    }
]

export default function InquiryPage() {

  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <Card className="max-w-3xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className={cn("text-4xl md:text-5xl font-bold font-headline text-primary")}>Inquire Now</CardTitle>
          <CardDescription className="mt-2 text-lg font-body">
            We use a direct inquiry process to provide you with the most personal service. Get in touch to plan your perfect getaway.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-8 bg-primary/5 text-primary-foreground">
            <Info className="h-4 w-4 text-primary" />
            <AlertTitle className='font-bold text-primary'>How to Book Your Stay</AlertTitle>
            <AlertDescription className="text-primary/80 font-body space-y-4 mt-2">
                <p>
                    We ask all our guests to make their reservations early. Please book at least <strong>24 hours</strong> before for day visits and <strong>2-3 days prior</strong> for overnight stays to ensure a smooth experience.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                     <Button asChild className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-sans">
                        <Link href="mailto:greensgreenretreat@gmail.com">
                            <Mail className="mr-2 h-4 w-4"/>
                            Send an Email
                        </Link>
                    </Button>
                    <Button asChild className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-sans">
                        <Link href="https://wa.me/254714281791" target="_blank" rel="noopener noreferrer">
                           <MessageCircle className="mr-2 h-4 w-4"/>
                           Chat on WhatsApp
                        </Link>
                    </Button>
                </div>
                 <div>
                    <div className="font-bold flex items-center gap-2 mt-4"><Clock className="h-4 w-4"/>Check-in / Check-out</div>
                    <p>Check-in is at <strong>10:30 AM</strong>. Check-out is at <strong>12:00 PM</strong> the following day.</p>
                </div>
                <div>
                    <div className="font-bold flex items-center gap-2 mt-4"><CreditCard className="h-4 w-4"/>Payment Information</div>
                    <p>To confirm your booking, please pay the full amount for your stay before your check-in day. Use the following details:</p>
                    <p className="font-mono bg-muted/50 p-2 rounded-md mt-2 text-sm">
                        <strong>Paybill:</strong> 625625<br/>
                        <strong>Account:</strong> 01520262670600
                    </p>
                </div>
            </AlertDescription>
          </Alert>
            
          <Separator className='my-8' />

            <div className='text-center mb-8'>
                <h3 className={cn("text-3xl font-bold font-headline text-primary")}>Frequently Asked Questions</h3>
            </div>
            <Accordion type="single" collapsible className="w-full font-body">
                {faqs.map((faq, index) => (
                    <AccordionItem value={`item-${index}`} key={index}>
                        <AccordionTrigger className='text-left font-bold'>{faq.question}</AccordionTrigger>
                        <AccordionContent className="text-base text-foreground/80">
                            {faq.answer}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
