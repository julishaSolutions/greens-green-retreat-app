
import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { headers } from 'next/headers';
import { ChatWidget } from '@/components/chat-widget';
import { Lato, Merriweather, Playfair_Display } from 'next/font/google';

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair-display',
});

const merriweather = Merriweather({
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-merriweather',
});

const lato = Lato({
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-lato',
});


export const metadata: Metadata = {
  title: "Green's Green Retreat",
  description: "A Sanctuary of Serenity. Escape to Green's Green Retreat, a family-owned sanctuary in the highlands of Tigoni, Limuru.",
  icons: {
    icon: 'https://res.cloudinary.com/dx6zxdlts/image/upload/v1751699621/Asset_1_qan94h.png',
    apple: 'https://res.cloudinary.com/dx6zxdlts/image/upload/v1751699621/Asset_1_qan94h.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = headers();
  const pathname = headersList.get('x-next-pathname') || headersList.get('next-url') || '';
  const isAdminPage = pathname.startsWith('/admin');

  return (
    <html lang="en" className={cn("scroll-smooth light", playfairDisplay.variable, merriweather.variable, lato.variable)}>
      <body className={cn('font-body antialiased flex flex-col min-h-screen')}>
        {!isAdminPage && <Header />}
        <main className={cn('flex-grow', { 'flex': isAdminPage, 'w-full': isAdminPage })}>{children}</main>
        {!isAdminPage && <Footer />}
        {!isAdminPage && <ChatWidget />}
        <Toaster />
      </body>
    </html>
  );
}
