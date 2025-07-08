
import { getAllPosts } from '@/services/postService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Newspaper, Pencil } from 'lucide-react';

export default async function AdminJournalListPage() {
    const posts = await getAllPosts();

    const statusVariantMap: { [key: string]: "default" | "secondary" | "destructive" } = {
        'draft': 'secondary',
        'published': 'default',
    };

    return (
        <div className="max-w-7xl mx-auto">
            <Card className="shadow-lg">
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <div className="bg-primary/10 rounded-full h-12 w-12 flex items-center justify-center">
                            <Newspaper className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <CardTitle className={cn("text-3xl font-bold font-headline text-primary")}>
                                Journal Posts
                            </CardTitle>
                            <CardDescription className="mt-1 text-lg text-foreground/80 font-sans">
                                Manage all your journal posts here. Edit, publish, and delete articles.
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {posts.length > 0 ? (
                        <div className="border rounded-lg overflow-hidden">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Title</TableHead>
                                        <TableHead className="text-center">Status</TableHead>
                                        <TableHead>Created</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {posts.map(post => (
                                        <TableRow key={post.id}>
                                            <TableCell className="font-medium">{post.title}</TableCell>
                                            <TableCell className="text-center">
                                                <Badge variant={statusVariantMap[post.status] || 'secondary'} className="capitalize">
                                                    {post.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{format(post.createdAt, 'MMM d, yyyy')}</TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="icon" asChild>
                                                    <Link href={`/admin/journal/${post.id}/edit`}>
                                                        <Pencil className="h-4 w-4" />
                                                        <span className="sr-only">Edit</span>
                                                    </Link>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    ) : (
                         <p className="text-center py-8 text-muted-foreground font-sans">No posts found. Create one using the AI Content Studio!</p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
