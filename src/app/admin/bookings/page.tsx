
import { getAllBookings } from '@/services/bookingService';
import { getCottages } from '@/services/contentService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarCheck } from 'lucide-react';

export default async function AdminBookingsPage() {
    const bookings = await getAllBookings();
    const cottagesData = await getCottages();

    const cottageMap = new Map(cottagesData.map(c => [c.id, c.name]));

    const statusVariantMap: { [key: string]: "default" | "secondary" | "destructive" } = {
        'pending_confirmation': 'secondary',
        'confirmed': 'default',
        'cancelled': 'destructive'
    };
    
    return (
        <div className="max-w-7xl mx-auto">
            <Card className="shadow-lg">
                <CardHeader>
                     <div className="flex items-center gap-4">
                        <div className="bg-primary/10 rounded-full h-12 w-12 flex items-center justify-center">
                            <CalendarCheck className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <CardTitle className={cn("text-3xl font-bold font-headline text-primary")}>
                                All Bookings
                            </CardTitle>
                            <CardDescription className="mt-1 text-lg text-foreground/80 font-sans">
                                A log of all guest booking requests.
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {bookings.length > 0 ? (
                        <div className="border rounded-lg overflow-hidden">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Guest</TableHead>
                                        <TableHead>Cottage</TableHead>
                                        <TableHead>Dates</TableHead>
                                        <TableHead className="text-center">Status</TableHead>
                                        <TableHead className="text-right">Requested On</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {bookings.map(booking => (
                                        <TableRow key={booking.id}>
                                            <TableCell>
                                                <div className="font-medium">{booking.guestName}</div>
                                                <div className="text-sm text-muted-foreground">{booking.guestEmail}</div>
                                            </TableCell>
                                            <TableCell>{cottageMap.get(booking.cottageId) || 'Unknown Cottage'}</TableCell>
                                            <TableCell>
                                                {format(booking.checkIn, 'MMM d, yyyy')} - {format(booking.checkOut, 'MMM d, yyyy')}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Badge variant={statusVariantMap[booking.status] || 'secondary'} className="capitalize">
                                                    {booking.status.replace(/_/g, ' ')}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">{format(booking.createdAt, 'MMM d, yyyy')}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    ) : (
                        <p className="text-center py-8 text-muted-foreground font-sans">No bookings found.</p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
