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
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';

const bookingFormSchema = z.object({
  fullName: z.string().min(2, { message: 'Full name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  dates: z.object({
    from: z.date({ required_error: 'A start date is required.' }),
    to: z.date({ required_error: 'An end date is required.' }),
  }),
  accommodation: z.string({ required_error: 'Please select an accommodation.' }),
  guests: z.coerce.number().min(1, { message: 'Must have at least 1 guest.' }).max(10, { message: 'Cannot exceed 10 guests.' }),
});

type BookingFormValues = z.infer<typeof bookingFormSchema>;

const accommodations = [
  'Forest Haven Cabin',
  'Lakeside Serenity Villa',
  'Mountain View Lodge',
  'Meadow Glade Yurt',
  'Canopy Treehouse',
  'Riverbank Cottage',
];

export default function BookingPage() {
  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      fullName: '',
      email: '',
      guests: 1,
    },
  });

  function onSubmit(data: BookingFormValues) {
    toast({
      title: 'Booking Request Submitted!',
      description: 'We have received your booking request and will be in touch shortly to confirm.',
    });
    console.log(data);
    form.reset();
  }

  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <Card className="max-w-3xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className={cn("text-4xl md:text-5xl font-bold font-headline text-primary")}>Book Your Stay</CardTitle>
          <CardDescription className="mt-2 text-lg">
            Complete the form below to request your booking at Verdant Getaways.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="dates"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Check-in & Check-out dates</FormLabel>
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
                                <span>Pick a date range</span>
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
                    <FormLabel>Accommodation</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a cottage or villa" />
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
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" size="lg">Submit Booking Request</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
