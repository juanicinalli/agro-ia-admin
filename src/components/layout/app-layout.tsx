
"use client";

import { SidebarNav } from './sidebar-nav';
import { SidebarProvider, Sidebar, SidebarInset, SidebarTrigger, SidebarHeader, SidebarRail } from '@/components/ui/sidebar';
import { useIsMobile } from "@/hooks/use-mobile";
import React from 'react';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile();

  return (
    <SidebarProvider defaultOpen={!isMobile} open={!isMobile}>
      <Sidebar variant="sidebar" collapsible={isMobile ? "offcanvas" : "icon"} className="border-r border-sidebar-border shadow-lg">
        <SidebarNav />
      </Sidebar>
      <SidebarInset className="flex flex-col">
        <header className="sticky top-0 z-10 flex items-center justify-between h-16 px-4 bg-background/80 backdrop-blur-sm border-b md:px-6 md:hidden">
           {/* Mobile header: SidebarTrigger is on the left, potentially app name or current page title */}
          <SidebarTrigger />
          <h2 className="text-lg font-semibold">AgroVision AI</h2>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </SidebarInset>
      {!isMobile && <SidebarRail />}
    </SidebarProvider>
  );
}
