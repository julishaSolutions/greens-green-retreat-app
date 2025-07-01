'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { CalendarIcon, Info } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const inquiryFormSchema = z.object({
  fullName: z.string().min(2, { message: 'Full name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  dates: z.object({
    from: z.date({ required_error: 'A start date is required.' }),
    to: z.date({ required_error: 'An end date is required.' }),
  }),
  accommodation: z.string({ required_error: 'Please select a preferred accommodation.' }),
  guests: z.coerce.number().min(1, { message: 'Must have at least 1 guest.' }).max(10, { message: 'Cannot exceed 10 guests.' }),
});

type InquiryFormValues = z.infer<typeof inquiryFormSchema>;

const accommodations = [
  'Alma 1 Cottage (2 guests)',
  'Olivia Cottage (up to 8 guests)',
  'Double Alma Cottage (up to 8 guests)',
  'Alma 2 - The Treehouse (up to 8 guests)',
  'Unsure / Flexible',
];

export default function InquiryPage() {
  const form = useForm<InquiryFormValues>({
    resolver: zodResolver(inquiryFormSchema),
    defaultValues: {
      fullName: '',
      email: '',
      guests: 1,
    },
  });

  function onSubmit(data: InquiryFormValues) {
    toast({
      title: 'Inquiry Submitted!',
      description: 'Thank you for your interest. We have received your inquiry and will be in touch shortly with personalized details.',
    });
    console.log(data);
    form.reset();
  }

  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <Card className="max-w-3xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className={cn("text-4xl md:text-5xl font-bold font-headline text-primary")}>Inquire Now</CardTitle>
          <CardDescription className="mt-2 text-lg font-sans">
            Complete the form below to begin planning your stay. Our team will respond with a personalized confirmation.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-8">
            <Info className="h-4 w-4" />
            <AlertTitle className='font-bold'>A Personal Approach to Booking</AlertTitle>
            <AlertDescription className="font-sans">
              We use a direct inquiry process to provide you with the most personal service. We do not have listings on major booking platforms.
              <ul className="list-disc pl-5 mt-2">
                <li><strong>Phone:</strong> +254 714 281 7911</li>
                <li><strong>Instagram:</strong> <a href="https://instagram.com/greens_green_retreat" target="_blank" rel="noopener noreferrer" className="underline">@greens_green_retreat</a></li>
              </ul>
              Rates start at Ksh 18,500 for two people per night.
            </AlertDescription>
          </Alert>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 font-sans">
                <FormField
                  control={form.control}
                  name="dates"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Preferred Dates</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={'outline'}
                              className={cn(
                                'w-full justify-start text-left font-normal',
                                !field.value?.from && 'text-muted-foreground'
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value?.from ? (
                                field.value.to ? (
                                  <>
                                    {format(field.value.from, 'LLL dd, y')} - {format(field.value.to, 'LLL dd, y')}
                                  </>
                                ) : (
                                  format(field.value.from, 'LLL dd, y')
                                )
                              ) : (
                                <span>Select a date range</span>
                              )}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="range"
                            selected={{ from: field.value?.from, to: field.value?.to }}
                            onSelect={field.onChange}
                            numberOfMonths={2}
                            disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

              <FormField
                control={form.control}
                name="accommodation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preferred Accommodation</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a cottage or choose flexible" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {accommodations.map((item) => (
                          <SelectItem key={item} value={item}>{item}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="guests"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Guests</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" max="10" placeholder="e.g., 2" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input placeholder="you@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" size="lg">Submit Inquiry</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
