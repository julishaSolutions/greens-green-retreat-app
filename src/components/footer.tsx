import { cn } from '@/lib/utils';
import { Twitter, Instagram, Facebook } from 'lucide-react';
import Link from 'next/link';

const footerLinks = [
    { href: '/', label: 'Home' },
    { href: '/accommodations', label: 'Accommodations' },
    { href: '/activities', label: 'Activities' },
    { href: '/booking', label: 'Booking' },
    { href: '/blog', label: 'Blog' },
    { href: '/admin/blog-ideas', label: 'Admin' },
  ];

export default function Footer() {
  return (
    <footer className="bg-card border-t">
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-start">
            <Link href="/" className="mb-4">
              <div className="flex h-12 items-center justify-center rounded-md border bg-card px-6">
                <span className={cn('font-bold text-2xl font-headline text-primary')}>Green&apos;s Green Retreat</span>
              </div>
            </Link>
            <p className="text-foreground/70">
              Your boutique nature retreat for peace and adventure.
            </p>
          </div>
          <div className="grid grid-cols-2 md:col-span-2 gap-8">
            <div>
              <h3 className={cn("font-semibold text-lg font-headline mb-4")}>Navigate</h3>
              <ul className="space-y-2">
                {footerLinks.map(link => (
                    <li key={link.href}>
                        <Link href={link.href} className="text-foreground/70 hover:text-primary transition-colors">
                            {link.label}
                        </Link>
                    </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className={cn("font-semibold text-lg font-headline mb-4")}>Connect</h3>
              <div className="flex space-x-4">
                <Link href="#" className="text-foreground/70 hover:text-primary transition-colors">
                  <Twitter className="h-6 w-6" />
                  <span className="sr-only">Twitter</span>
                </Link>
                <Link href="#" className="text-foreground/70 hover:text-primary transition-colors">
                  <Instagram className="h-6 w-6" />
                  <span className="sr-only">Instagram</span>
                </Link>
                <Link href="#" className="text-foreground/70 hover:text-primary transition-colors">
                  <Facebook className="h-6 w-6" />
                  <span className="sr-only">Facebook</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center text-foreground/50 text-sm">
          <p>&copy; {new Date().getFullYear()} Green's Green Retreat. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
