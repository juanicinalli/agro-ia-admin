
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { LayoutDashboard, Tractor, CalendarDays, Lightbulb, Wheat, BrainCircuit, LogOut } from 'lucide-react';
import { useApp } from '@/contexts/app-provider';
import { Button } from '@/components/ui/button';

const navItems = [
  { href: '/dashboard/fields', label: 'Fields', icon: Tractor },
  { href: '/dashboard/calendar', label: 'Calendar', icon: CalendarDays },
  { href: '/dashboard/recommendations', label: 'Recommendations', icon: Lightbulb },
];

export function SidebarNav() {
  const pathname = usePathname();
  const { logout } = useApp();

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-sidebar-border">
        <Link href="/dashboard/fields" asChild>
          <a className="flex items-center gap-2">
            <Wheat className="h-8 w-8 text-primary" />
            <BrainCircuit className="h-7 w-7 text-primary" />
            <h1 className="text-2xl font-headline font-semibold text-sidebar-foreground group-data-[collapsible=icon]:hidden">AgroVision AI</h1>
          </a>
        </Link>
      </div>
      <nav className="flex-grow p-2">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} asChild>
                <SidebarMenuButton
                  isActive={pathname.startsWith(item.href)}
                  tooltip={item.label}
                  className="justify-start"
                >
                  <item.icon className="h-5 w-5" />
                  <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </nav>
      <div className="p-4 mt-auto border-t border-sidebar-border">
        <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton
                    onClick={logout}
                    tooltip="Logout"
                    variant="ghost"
                    className="w-full justify-start group-data-[collapsible=icon]:justify-center"
                >
                    <LogOut className="h-5 w-5" />
                    <span className="group-data-[collapsible=icon]:hidden">Logout</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
      </div>
    </div>
  );
}
