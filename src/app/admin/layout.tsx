
'use client';

import { useState, useEffect } from 'react';
import { SidebarProvider, Sidebar, SidebarHeader, SidebarTrigger, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter, SidebarInset } from '@/components/ui/sidebar';
import { Home, Lightbulb, Newspaper, CalendarCheck, Cog } from 'lucide-react';
import { Logo } from '@/components/logo';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="flex min-h-screen w-full">
         <div className="hidden md:block w-64 p-2 border-r">
            <div className="flex flex-col gap-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
            </div>
         </div>
         <div className="flex-1 p-8">
            <Skeleton className="h-12 w-1/3 mb-6" />
            <Skeleton className="h-48 w-full" />
         </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
        <Sidebar>
          <SidebarHeader>
              <div className="flex items-center gap-2 font-headline p-2">
                <Logo size={32} />
                <h1 className="text-lg font-semibold group-data-[collapsible=icon]:hidden">Admin Panel</h1>
              </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Dashboard">
                    <Link href="/admin"><Home /> <span className="group-data-[collapsible=icon]:hidden">Dashboard</span></Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Bookings">
                    <Link href="/admin/bookings"><CalendarCheck /> <span className="group-data-[collapsible=icon]:hidden">Bookings</span></Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="AI Content Studio">
                    <Link href="/admin/journal-ideas"><Lightbulb /> <span className="group-data-[collapsible=icon]:hidden">AI Content Studio</span></Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
               <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Journal">
                    <Link href="/admin/journal"><Newspaper /> <span className="group-data-[collapsible=icon]:hidden">Journal</span></Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
               <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="AI Settings">
                    <Link href="/admin/ai-settings"><Cog /> <span className="group-data-[collapsible=icon]:hidden">AI Settings</span></Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton asChild variant="outline" tooltip="Back to Site">
                        <Link href="/"><Newspaper /> <span className="group-data-[collapsible=icon]:hidden">Back to Site</span></Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
            <header className="flex items-center p-2 border-b md:p-4 sticky top-0 bg-background/80 backdrop-blur-sm z-10 h-14">
                <SidebarTrigger className="md:hidden" />
                <div className="ml-auto">
                    {/* Placeholder for future user avatar/menu */}
                </div>
            </header>
            <main className="flex-1 p-4 md:p-8">
              {children}
            </main>
        </SidebarInset>
    </SidebarProvider>
  );
}
