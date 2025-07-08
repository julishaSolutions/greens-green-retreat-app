
'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { confirmPayment } from './actions';
import { type Booking } from '@/services/bookingService';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

function ConfirmationContent() {
    const searchParams = useSearchParams();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [booking, setBooking] = useState<(Booking & { cottageName?: string }) | null>(null);
    const [errorMessage, setErrorMessage] = useState('');
    
    useEffect(() => {
        const bookingId = searchParams.get('tracking_id');
        // NOTE: These are assumed parameter names from Intasend's redirect.
        // You may need to adjust them based on their actual API.
        const transactionId = searchParams.get('transaction_id');
        const paymentStatus = searchParams.get('status');

        if (!bookingId || !transactionId || !paymentStatus) {
            setErrorMessage('Invalid confirmation link. Missing payment details.');
            setStatus('error');
            return;
        }

        async function verifyPayment() {
            try {
                const result = await confirmPayment({ bookingId, transactionId, paymentStatus });
                if (result.success && result.booking) {
                    setBooking(result.booking);
                    setStatus('success');
                } else {
                    setErrorMessage(result.message || 'Payment could not be confirmed.');
                    setStatus('error');
                }
            } catch (err) {
                setErrorMessage(err instanceof Error ? err.message : 'An unexpected error occurred.');
                setStatus('error');
            }
        }
        
        verifyPayment();
    }, [searchParams]);

    if (status === 'loading') {
        return (
            <div className="flex flex-col items-center justify-center text-center space-y-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="text-lg text-muted-foreground font-sans">Confirming your payment, please wait...</p>
            </div>
        );
    }
    
    if (status === 'error') {
        return (
             <div className="flex flex-col items-center justify-center text-center space-y-4">
                <XCircle className="h-12 w-12 text-destructive" />
                <p className="text-lg font-bold text-destructive font-sans">Payment Confirmation Failed</p>
                <p className="text-muted-foreground">{errorMessage}</p>
                 <Button asChild variant="outline">
                    <Link href="/inquire">Contact Support</Link>
                </Button>
            </div>
        )
    }

    if (status === 'success' && booking) {
        return (
            <div className="flex flex-col items-center justify-center text-center space-y-4">
                <CheckCircle className="h-12 w-12 text-green-500" />
                <p className="text-lg font-bold text-primary font-sans">Payment Successful!</p>
                <p className="text-muted-foreground">
                    Thank you, {booking.guestName}! Your booking for {booking.cottageName} is confirmed.
                    We've sent a confirmation email to {booking.guestEmail} (simulation).
                </p>
                <Button asChild>
                    <Link href="/">Back to Home</Link>
                </Button>
            </div>
        )
    }

    return null;
}


export default function BookingConfirmationPage() {
    return (
        <div className="container mx-auto px-4 py-12 md:py-20">
            <Card className="max-w-2xl mx-auto shadow-lg">
                <CardHeader>
                    <CardTitle className={cn("text-3xl md:text-4xl font-bold font-headline text-primary text-center")}>Booking Confirmation</CardTitle>
                </CardHeader>
                <CardContent className="min-h-[200px] flex items-center justify-center">
                    <Suspense fallback={<div className="flex flex-col items-center justify-center text-center space-y-4"><Loader2 className="h-12 w-12 animate-spin text-primary" /><p className="text-lg text-muted-foreground font-sans">Loading...</p></div>}>
                      <ConfirmationContent />
                    </Suspense>
                </CardContent>
            </Card>
        </div>
    )
}
