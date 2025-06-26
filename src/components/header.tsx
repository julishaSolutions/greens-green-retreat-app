'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { Menu } from 'lucide-react';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/accommodations', label: 'Accommodations' },
  { href: '/activities', label: 'Activities' },
  { href: '/booking', label: 'Booking' },
  { href: '/blog', label: 'Blog' },
];

export default function Header() {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2" onClick={() => setMenuOpen(false)}>
          <div className="flex h-10 items-center justify-center rounded-md border bg-card px-4">
            <span className={cn('font-bold text-lg font-headline text-primary')}>Verdant Getaways</span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'transition-colors hover:text-primary',
                pathname === link.href ? 'text-primary font-semibold' : 'text-foreground/60'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
            <Button variant="outline">Log In</Button>
            <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">Sign Up</Button>
        </div>

        <Sheet open={isMenuOpen} onOpenChange={setMenuOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <div className="p-4">
              <Link href="/" className="inline-block mb-8" onClick={() => setMenuOpen(false)}>
                <div className="flex h-10 items-center justify-center rounded-md border bg-card px-4">
                    <span className={cn('font-bold text-lg font-headline text-primary')}>Verdant Getaways</span>
                </div>
              </Link>
              <nav className="flex flex-col gap-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className={cn(
                        'text-lg font-medium transition-colors hover:text-primary',
                        pathname === link.href ? 'text-primary' : 'text-foreground/70'
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              <div className="mt-8 flex flex-col gap-2">
                <Button variant="outline" onClick={() => setMenuOpen(false)}>Log In</Button>
                <Button className="bg-accent hover:bg-accent/90 text-accent-foreground" onClick={() => setMenuOpen(false)}>Sign Up</Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
