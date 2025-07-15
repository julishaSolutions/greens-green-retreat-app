
'use client';

import { useEffect, useRef, useState } from 'react';
import { useFormState } from 'react-dom';
import { useSearchParams } from 'next/navigation';
import { type DateRange } from 'react-day-picker';
import { addDays, format } from 'date-fns';
import { Calendar as CalendarIcon, User, Mail, BedDouble, AlertCircle, Loader2, Check } from 'lucide-react';

import { submitBooking, fetchBookings, type BookingFormState } from './actions';
import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const initialState: BookingFormState = {
  message: '',
  errors: {},
  success: false,
};

export default function BookingPage() {
  const searchParams = useSearchParams();
  const cottageId = searchParams.get('cottageId') || '';
  const cottageName = searchParams.get('cottageName') || 'one of our cottages';

  const { toast } = useToast();
  const [state, formAction] = useFormState(submitBooking, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 3),
  });

  const [bookedDates, setBookedDates] = useState<DateRange[]>([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(true);

  useEffect(() => {
    if (cottageId) {
      setIsLoadingBookings(true);
      fetchBookings(cottageId)
        .then(bookings => {
          setBookedDates(bookings);
        })
        .catch(console.error)
        .finally(() => {
          setIsLoadingBookings(false);
        });
    } else {
        setIsLoadingBookings(false);
    }
  }, [cottageId]);

  useEffect(() => {
    // Only show toasts for errors, as success has its own UI state now.
    if (state.message && !state.success) {
      toast({
        title: 'Error',
        description: state.message,
        variant: 'destructive',
      });
    }
  }, [state, toast]);
  
  const disabledDays = [
    { before: new Date() },
    ...bookedDates,
  ];

  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <Card className="max-w-2xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className={cn("text-3xl md:text-4xl font-bold font-headline text-primary")}>Book Your Stay</CardTitle>
          <CardDescription className="text-lg font-body">
            You are booking {cottageName}. We can't wait to host you.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {state.success && state.paymentLink ? (
             <div className="text-center space-y-6">
                <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                    <Check className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold font-headline text-primary">Booking Request Sent!</h2>
                <p className="text-foreground/80 font-sans">{state.message}</p>
                <Button asChild size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-sans">
                    <a href={state.paymentLink} target="_blank" rel="noopener noreferrer">
                        Click Here to Pay Now
                    </a>
                </Button>
                  <Button variant="link" onClick={() => window.location.reload()}>
                    Make another booking
                  </Button>
            </div>
          ) : (
            <form ref={formRef} action={formAction} className="space-y-6 font-sans">
              <input type="hidden" name="cottageId" value={cottageId} />

              <div>
                <Label htmlFor="dates" className="font-medium">Select Dates</Label>
                {isLoadingBookings && (
                  <div className="flex items-center text-sm text-muted-foreground mt-2">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    <span>Loading availability...</span>
                  </div>
                )}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="dates"
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal mt-2",
                        !date && "text-muted-foreground",
                        isLoadingBookings && "hidden"
                      )}
                      disabled={isLoadingBookings}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date?.from ? (
                        date.to ? (
                          <>
                            {format(date.from, "LLL dd, y")} -{" "}
                            {format(date.to, "LLL dd, y")}
                          </>
                        ) : (
                          format(date.from, "LLL dd, y")
                        )
                      ) : (
                        <span>Pick a date range</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={date?.from}
                      selected={date}
                      onSelect={setDate}
                      numberOfMonths={2}
                      disabled={disabledDays}
                    />
                  </PopoverContent>
                </Popover>
                <input type="hidden" name="checkIn" value={date?.from?.toISOString() || ''} />
                <input type="hidden" name="checkOut" value={date?.to?.toISOString() || ''} />
                {state.errors?.checkIn && <p className="text-sm font-medium text-destructive mt-1">{state.errors.checkIn[0]}</p>}
                {state.errors?.checkOut && <p className="text-sm font-medium text-destructive mt-1">{state.errors.checkOut[0]}</p>}
              </div>

              <div className="space-y-4">
                  <div>
                      <Label htmlFor="guestName">Full Name</Label>
                      <div className="relative mt-2">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                          <Input id="guestName" name="guestName" placeholder="John Doe" className="pl-10" required/>
                      </div>
                      {state.errors?.guestName && <p className="text-sm font-medium text-destructive mt-1">{state.errors.guestName[0]}</p>}
                  </div>
                  <div>
                      <Label htmlFor="guestEmail">Email Address</Label>
                      <div className="relative mt-2">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                          <Input id="guestEmail" name="guestEmail" type="email" placeholder="you@example.com" className="pl-10" required/>
                      </div>
                      {state.errors?.guestEmail && <p className="text-sm font-medium text-destructive mt-1">{state.errors.guestEmail[0]}</p>}
                  </div>
              </div>

              {state.errors?.form && (
                  <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Booking Error</AlertTitle>
                      <AlertDescription>
                          {state.errors.form[0]}
                      </AlertDescription>
                  </Alert>
              )}
              
              {!cottageId && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Missing Cottage Information</AlertTitle>
                  <AlertDescription>
                      Please select a cottage from the "The Retreat" page before booking.
                  </AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" size="lg" disabled={!cottageId}>
                <BedDouble className="mr-2 h-5 w-5" />
                Complete Booking
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
