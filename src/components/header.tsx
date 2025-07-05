
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { Menu } from 'lucide-react';
import { Logo } from './logo';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/the-retreat', label: 'The Retreat' },
  { href: '/experiences', label: 'Experiences' },
  { href: '/our-story', label: 'Our Story' },
  { href: '/journal', label: 'Journal' },
];

export default function Header() {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2" onClick={() => setMenuOpen(false)}>
           <Logo size={48} />
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-sans">
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
            <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground font-sans">
              <Link href="/booking">Book Now</Link>
            </Button>
        </div>

        <Sheet open={isMenuOpen} onOpenChange={setMenuOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <SheetHeader>
              <SheetTitle className="sr-only">Menu</SheetTitle>
            </SheetHeader>
            <div className="p-4">
              <Link href="/" className="inline-block mb-8" onClick={() => setMenuOpen(false)}>
                 <Logo size={60} />
              </Link>
              <nav className="flex flex-col gap-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className={cn(
                        'text-lg font-medium transition-colors hover:text-primary font-sans',
                        pathname === link.href ? 'text-primary' : 'text-foreground/70'
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              <div className="mt-8 flex flex-col gap-2">
                <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground font-sans" onClick={() => setMenuOpen(false)}>
                  <Link href="/booking">Book Now</Link>
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
