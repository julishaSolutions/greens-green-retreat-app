import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { headers } from 'next/headers';
import { ChatWidget } from '@/components/chat-widget';

export const metadata: Metadata = {
  title: "Green's Green Retreat",
  description: "A Sanctuary of Serenity. Escape to Green's Green Retreat, a family-owned sanctuary in the highlands of Tigoni, Limuru.",
  icons: {
    icon: 'https://res.cloudinary.com/dx6zxdlts/image/upload/v1751720688/GGR_Favicon_c4kj1x.png',
    apple: 'https://res.cloudinary.com/dx6zxdlts/image/upload/v1751720688/GGR_Favicon_c4kj1x.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = headers();
  const pathname = headersList.get('next-url') || '';
  const isAdminPage = pathname.startsWith('/admin');

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Merriweather:ital,wght@0,400;0,700;1,400&family=Lato:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet" />
      </head>
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
