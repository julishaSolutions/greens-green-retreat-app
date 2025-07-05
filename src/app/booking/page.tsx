'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import { submitBooking, type BookingFormState } from './actions';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { CalendarIcon, Info, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import type { DateRange } from 'react-day-picker';
import { useFormStatus } from 'react-dom';

const accommodations = [
  { id: 'alma-1-cottage', name: 'Alma 1 Cottage' },
  { id: 'double-alma-cottage', name: 'Double Alma Cottage' },
  { id: 'alma-2-treehouse', name: 'Alma 2 (The Treehouse)' },
];

const initialState: BookingFormState = {
    message: '',
    errors: {},
    success: false,
};

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" size="lg">
            {pending ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                </>
            ) : (
                'Submit Booking Request'
            )}
        </Button>
    );
}

export default function BookingPage() {
  const [state, formAction] = useActionState(submitBooking, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const [dates, setDates] = useState<DateRange | undefined>(undefined);

  useEffect(() => {
    if (!state.message) return;
    if (state.message !== 'Validation failed. Please check your input.') {
      toast({
        title: state.success ? 'Success!' : 'Error',
        description: state.message,
        variant: state.success ? 'default' : 'destructive',
      });
    }

    if (state.success) {
      formRef.current?.reset();
      setDates(undefined);
    }
  }, [state, toast]);

  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <Card className="max-w-3xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className={cn("text-4xl md:text-5xl font-bold font-headline text-primary")}>Book Your Stay</CardTitle>
          <CardDescription className="mt-2 text-lg">
            Complete the form below to request your booking at Green&apos;s Green Retreat.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-8">
            <Info className="h-4 w-4" />
            <AlertTitle className='font-bold'>Booking Process</AlertTitle>
            <AlertDescription>
                Submitting this form places a tentative booking. We will check availability and contact you for confirmation and payment.
            </AlertDescription>
          </Alert>

          <form ref={formRef} action={formAction} className="space-y-8">
            <div className="flex flex-col space-y-2">
                <label htmlFor="dates" className="text-sm font-medium">Check-in & Check-out dates</label>
                <Popover>
                <PopoverTrigger asChild>
                    <Button
                        id="dates"
                        variant={'outline'}
                        className={cn(
                            'w-full justify-start text-left font-normal text-base md:text-sm',
                            !dates?.from && 'text-muted-foreground'
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dates?.from ? (
                        dates.to ? (
                            <>
                            {format(dates.from, 'LLL dd, y')} - {format(dates.to, 'LLL dd, y')}
                            </>
                        ) : (
                            format(dates.from, 'LLL dd, y')
                        )
                        ) : (
                        <span>Pick a date range</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="range"
                        selected={dates}
                        onSelect={setDates}
                        numberOfMonths={1}
                        disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
                    />
                </PopoverContent>
                </Popover>
                {dates?.from && <input type="hidden" name="checkInDate" value={dates.from.toISOString()} />}
                {dates?.to && <input type="hidden" name="checkOutDate" value={dates.to.toISOString()} />}
                {state.errors?.dates && <p className="text-sm font-medium text-destructive">{state.errors.dates[0]}</p>}
                {state.errors?.checkInDate && <p className="text-sm font-medium text-destructive">{state.errors.checkInDate[0]}</p>}
                {state.errors?.checkOutDate && <p className="text-sm font-medium text-destructive">{state.errors.checkOutDate[0]}</p>}
            </div>

            <div className="space-y-2">
                <label htmlFor="accommodation" className="text-sm font-medium">Accommodation</label>
                 <Select name="accommodation">
                    <SelectTrigger>
                        <SelectValue placeholder="Select a cottage" />
                    </SelectTrigger>
                    <SelectContent>
                    {accommodations.map((item) => (
                        <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>
                    ))}
                    </SelectContent>
                </Select>
                 {state.errors?.accommodation && <p className="text-sm font-medium text-destructive">{state.errors.accommodation[0]}</p>}
            </div>
            
            <div className="space-y-2">
                <label htmlFor="guests" className="text-sm font-medium">Number of Guests</label>
                <Input id="guests" name="guests" type="number" min="1" max="10" placeholder="e.g., 2" />
                {state.errors?.guests && <p className="text-sm font-medium text-destructive">{state.errors.guests[0]}</p>}
            </div>

            <div className="space-y-2">
                <label htmlFor="fullName" className="text-sm font-medium">Full Name</label>
                <Input id="fullName" name="fullName" placeholder="John Doe" />
                {state.errors?.fullName && <p className="text-sm font-medium text-destructive">{state.errors.fullName[0]}</p>}
            </div>
            
            <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">Email Address</label>
                <Input id="email" name="email" type="email" placeholder="you@example.com" />
                {state.errors?.email && <p className="text-sm font-medium text-destructive">{state.errors.email[0]}</p>}
            </div>

            {state.errors?._form && (
                <Alert variant="destructive">
                    <AlertTitle>Booking Failed</AlertTitle>
                    <AlertDescription>
                        {state.errors._form[0]}
                    </AlertDescription>
                </Alert>
            )}
            
            <SubmitButton />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
