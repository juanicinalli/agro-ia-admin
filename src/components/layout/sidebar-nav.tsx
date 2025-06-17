
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton, useSidebar } from '@/components/ui/sidebar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Tractor, CalendarDays, Lightbulb, Wheat, BrainCircuit, LogOut, Warehouse } from 'lucide-react';
import { useApp } from '@/contexts/app-provider';

const navItems = [
  { href: '/dashboard/fields', label: 'Fields', icon: Tractor },
  { href: '/dashboard/calendar', label: 'Calendar', icon: CalendarDays },
  { href: '/dashboard/recommendations', label: 'Recommendations', icon: Lightbulb },
  { href: '/dashboard/stock', label: 'Stock', icon: Warehouse },
];

export function SidebarNav() {
  const pathname = usePathname();
  const { logout } = useApp();
  const { state: sidebarState, isMobile } = useSidebar();

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-sidebar-border">
        <Link
          href="/dashboard/fields"
          className="flex items-center gap-2 group"
        >
            <Wheat className="h-8 w-8 text-primary transition-transform group-hover:scale-110" />
            <BrainCircuit className="h-7 w-7 text-primary transition-transform group-hover:rotate-6" />
            <h1 className="text-2xl font-headline font-semibold text-sidebar-foreground group-data-[collapsible=icon]:hidden">AgroVision AI</h1>
        </Link>
      </div>
      <nav className="flex-grow p-2">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href={item.href} asChild>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname.startsWith(item.href)}
                      // The tooltip prop is NOT used here; Tooltip is handled externally
                      className="justify-start"
                    >
                      <a>
                        <item.icon className="h-5 w-5" />
                        <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                      </a>
                    </SidebarMenuButton>
                  </Link>
                </TooltipTrigger>
                <TooltipContent 
                  side="right" 
                  align="center" 
                  hidden={sidebarState !== "collapsed" || isMobile}
                >
                  {item.label}
                </TooltipContent>
              </Tooltip>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </nav>
      <div className="p-4 mt-auto border-t border-sidebar-border">
        <SidebarMenu>
            <SidebarMenuItem>
              <Tooltip>
                <TooltipTrigger asChild>
                  <SidebarMenuButton
                      onClick={logout}
                      // tooltip="Logout" // Use external Tooltip for consistency if sidebar can be icon-only for this button
                      variant="ghost"
                      className="w-full justify-start group-data-[collapsible=icon]:justify-center"
                  >
                      <LogOut className="h-5 w-5" />
                      <span className="group-data-[collapsible=icon]:hidden">Logout</span>
                  </SidebarMenuButton>
                </TooltipTrigger>
                <TooltipContent 
                  side="right" 
                  align="center" 
                  hidden={sidebarState !== "collapsed" || isMobile}
                >
                  Logout
                </TooltipContent>
              </Tooltip>
            </SidebarMenuItem>
        </SidebarMenu>
      </div>
    </div>
  );
}
