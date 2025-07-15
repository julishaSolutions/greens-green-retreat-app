import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export default function AdminDashboardPage() {
    return (
        <div>
            <h1 className={cn("text-3xl font-bold mb-6 font-headline text-primary")}>Admin Dashboard</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Welcome, Administrator!</CardTitle>
                    <CardDescription>
                        This is your central hub for managing the Verdant Getaways website.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="font-sans">Use the navigation on the left to access different management tools. More features will be added here soon.</p>
                </CardContent>
            </Card>
        </div>
    );
}
