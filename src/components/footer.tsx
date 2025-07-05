
import { cn } from '@/lib/utils';
import { Twitter, Instagram, Facebook, Linkedin, Phone, Mail } from 'lucide-react';
import Link from 'next/link';
import { Logo } from './logo';

const footerLinks = [
    { href: '/', label: 'Home' },
    { href: '/the-retreat', label: 'The Retreat' },
    { href: '/experiences', label: 'Experiences' },
    { href: '/our-story', label: 'Our Story' },
    { href: '/journal', label: 'Journal' },
    { href: '/booking', label: 'Book Now' },
    { href: '/admin/journal-ideas', label: 'Admin' },
  ];

const TikTokIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-2.43.03-4.83-.95-6.43-2.88-1.59-1.94-2.2-4.42-1.8-6.83.39-2.39 1.81-4.45 3.72-5.96 1.9-1.51 4.23-2.35 6.69-2.34.02 1.54-.01 3.08.01 4.63-.02 1.05.39 2.07 1.23 2.82.84.75 1.95 1.11 3.12 1.02.05-1.55.02-3.1-.01-4.64-.99-.32-1.95-.69-2.88-1.13-.93-.44-1.82-.96-2.64-1.58-.25-.19-.48-.4-.7-.62-1.07-1.08-1.7-2.38-1.7-3.86-.03-1.52.01-3.04.04-4.57.01-.52.08-1.04.19-1.55Z"/>
    </svg>
)

export default function Footer() {
  return (
    <footer className="bg-card border-t">
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          <div className="flex flex-col items-center text-center md:items-start md:text-left">
            <Link href="/" className="mb-4">
              <Logo size={80} />
            </Link>
            <p className="text-foreground/70 font-sans max-w-xs">
              Your family-owned sanctuary in the highlands of Tigoni, Limuru.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:col-span-2">
            <div>
              <h3 className={cn("font-semibold text-lg font-headline mb-4")}>Navigate</h3>
              <ul className="space-y-2">
                {footerLinks.map(link => (
                    <li key={link.href}>
                        <Link href={link.href} className="text-foreground/70 hover:text-primary transition-colors font-sans">
                            {link.label}
                        </Link>
                    </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className={cn("font-semibold text-lg font-headline mb-4")}>Connect</h3>
               <div className="flex items-center gap-2 text-foreground/70 mb-2 font-sans justify-center sm:justify-start">
                  <Phone className="h-5 w-5" />
                  <a href="tel:+254714281791" className="hover:text-primary transition-colors">+254 714 281 791</a>
                </div>
                <div className="flex items-center gap-2 text-foreground/70 mb-4 font-sans justify-center sm:justify-start">
                  <Mail className="h-5 w-5" />
                  <a href="mailto:greensgreenretreat@gmail.com" className="hover:text-primary transition-colors">greensgreenretreat@gmail.com</a>
                </div>
              <div className="flex space-x-4 justify-center sm:justify-start">
                <a href="https://instagram.com/greens_green_retreat" target="_blank" rel="noopener noreferrer" className="text-foreground/70 hover:text-primary transition-colors">
                  <Instagram className="h-6 w-6" />
                  <span className="sr-only">Instagram</span>
                </a>
                <a href="#" className="text-foreground/70 hover:text-primary transition-colors">
                    <TikTokIcon className="h-6 w-6" />
                    <span className="sr-only">TikTok</span>
                </a>
                <a href="#" className="text-foreground/70 hover:text-primary transition-colors">
                  <Linkedin className="h-6 w-6" />
                  <span className="sr-only">LinkedIn</span>
                </a>
                <a href="#" className="text-foreground/70 hover:text-primary transition-colors">
                  <Twitter className="h-6 w-6" />
                  <span className="sr-only">Twitter</span>
                </a>
                <a href="#" className="text-foreground/70 hover:text-primary transition-colors">
                  <Facebook className="h-6 w-6" />
                  <span className="sr-only">Facebook</span>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center text-foreground/50 text-sm font-sans">
          <p>&copy; {new Date().getFullYear()} Green's Green Retreat. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
