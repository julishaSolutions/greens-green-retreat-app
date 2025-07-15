
'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { getBookingDetails } from './actions';
import { type Booking } from '@/services/bookingService';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, CheckCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

function ConfirmationContent() {
    const searchParams = useSearchParams();
    const [booking, setBooking] = useState<(Booking & { cottageName?: string }) | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
        const bookingId = searchParams.get('tracking_id');

        if (!bookingId) {
            setIsLoading(false);
            return;
        }

        async function fetchBooking() {
            try {
                const result = await getBookingDetails(bookingId);
                if (result.success && result.booking) {
                    setBooking(result.booking);
                }
            } catch (err) {
                console.error("Failed to fetch booking details:", err);
            } finally {
                setIsLoading(false);
            }
        }
        
        fetchBooking();
    }, [searchParams]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center text-center space-y-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="text-lg text-muted-foreground font-sans">Loading your booking details...</p>
            </div>
        );
    }
    
    if (!booking) {
        return (
             <div className="flex flex-col items-center justify-center text-center space-y-4">
                <Clock className="h-12 w-12 text-accent" />
                <p className="text-xl font-bold text-primary font-sans">Thank you for your booking request!</p>
                <p className="text-muted-foreground max-w-md">
                    We are processing your payment. You will receive a confirmation email shortly once the payment is verified.
                </p>
                <Button asChild>
                    <Link href="/">Back to Home</Link>
                </Button>
            </div>
        )
    }

    if (booking.status === 'confirmed') {
        return (
            <div className="flex flex-col items-center justify-center text-center space-y-4">
                <CheckCircle className="h-12 w-12 text-green-500" />
                <p className="text-xl font-bold text-primary font-sans">Payment Successful & Booking Confirmed!</p>
                <p className="text-muted-foreground max-w-md">
                    Thank you, {booking.guestName}! Your booking for {booking.cottageName} is confirmed.
                    We've sent a confirmation email to {booking.guestEmail} (simulation).
                </p>
                <Button asChild>
                    <Link href="/">Back to Home</Link>
                </Button>
            </div>
        )
    }

    // Default view for pending or other statuses
    return (
        <div className="flex flex-col items-center justify-center text-center space-y-4">
            <Clock className="h-12 w-12 text-accent" />
            <p className="text-xl font-bold text-primary font-sans">Thank you, {booking.guestName}!</p>
            <p className="text-muted-foreground max-w-md">
                We have received your booking request for {booking.cottageName}. We are awaiting payment confirmation and will notify you via email once it's complete.
            </p>
            <Button asChild>
                <Link href="/">Back to Home</Link>
            </Button>
        </div>
    )
}


export default function BookingConfirmationPage() {
    return (
        <div className="container mx-auto px-4 py-12 md:py-20">
            <Card className="max-w-2xl mx-auto shadow-lg">
                <CardHeader className="text-center">
                    <CardTitle className={cn("text-3xl md:text-4xl font-bold font-headline text-primary")}>Booking Status</CardTitle>
                    <CardDescription className="text-lg font-body mt-2">
                        Thank you for choosing Green's Green Retreat.
                    </CardDescription>
                </CardHeader>
                <CardContent className="min-h-[250px] flex items-center justify-center">
                    <Suspense fallback={<div className="flex flex-col items-center justify-center text-center space-y-4"><Loader2 className="h-12 w-12 animate-spin text-primary" /><p className="text-lg text-muted-foreground font-sans">Loading...</p></div>}>
                      <ConfirmationContent />
                    </Suspense>
                </CardContent>
            </Card>
        </div>
    )
}
