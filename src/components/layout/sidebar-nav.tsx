
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton, 
  useSidebar,
  SidebarSeparator
} from '@/components/ui/sidebar';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipTrigger,
  TooltipProvider
} from '@/components/ui/tooltip';
import { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator as DMDMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Tractor, CalendarDays, Lightbulb, Wheat, BrainCircuit, LogOut, Warehouse, Languages, Check } from 'lucide-react';
import { useApp } from '@/contexts/app-provider';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/button';

const navItems = [
  { href: '/dashboard/fields', labelKey: 'sidebar.fields', icon: Tractor },
  { href: '/dashboard/calendar', labelKey: 'sidebar.calendar', icon: CalendarDays },
  { href: '/dashboard/recommendations', labelKey: 'sidebar.recommendations', icon: Lightbulb },
  { href: '/dashboard/stock', labelKey: 'sidebar.stock', icon: Warehouse },
];

const languageOptions = [
  { code: 'en', nameKey: 'languages.en', name: 'English', flag: '🇺🇸' },
  { code: 'es', nameKey: 'languages.es', name: 'Español', flag: '🇪🇸' },
  { code: 'it', nameKey: 'languages.it', name: 'Italiano', flag: '🇮🇹' },
];

export function SidebarNav() {
  const pathname = usePathname();
  const { logout } = useApp();
  const { state: sidebarState, isMobile } = useSidebar();
  const { t, i18n } = useTranslation();

  const currentLanguage = 
    languageOptions.find(opt => i18n.language && i18n.language.startsWith(opt.code)) || 
    languageOptions.find(opt => opt.code === i18n.options.fallbackLng as string) || 
    languageOptions[0];

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

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
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link href={item.href} asChild>
                      <SidebarMenuButton
                        isActive={pathname.startsWith(item.href)}
                        className="justify-start"
                        // No asChild here, SidebarMenuButton will render <a> if href is passed by Link
                      >
                        <item.icon className="h-5 w-5" />
                        <span className="group-data-[collapsible=icon]:hidden">{t(item.labelKey)}</span>
                      </SidebarMenuButton>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent 
                    side="right" 
                    align="center" 
                    hidden={sidebarState !== "collapsed" || isMobile}
                  >
                    {t(item.labelKey)}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </nav>
      <div className="p-2 mt-auto border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DropdownMenuTrigger asChild>
                      <SidebarMenuButton
                        variant="ghost"
                        className="w-full justify-start group-data-[collapsible=icon]:justify-center"
                      >
                        <Languages className="h-5 w-5" />
                        <span className="group-data-[collapsible=icon]:hidden">
                          {currentLanguage.flag} {t(currentLanguage.nameKey, currentLanguage.name)}
                        </span>
                      </SidebarMenuButton>
                    </DropdownMenuTrigger>
                  </TooltipTrigger>
                  <TooltipContent 
                    side="right" 
                    align="center" 
                    hidden={sidebarState !== "collapsed" || isMobile}
                  >
                    {t('sidebar.select_language.tooltip')}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <DropdownMenuContent side="top" align="start" className="w-56">
                <DropdownMenuLabel>{t('sidebar.select_language.title')}</DropdownMenuLabel>
                <DMDMenuSeparator />
                {languageOptions.map((lang) => (
                  <DropdownMenuItem key={lang.code} onSelect={() => changeLanguage(lang.code)}>
                    <span className="mr-2">{lang.flag}</span>
                    <span>{t(lang.nameKey, lang.name)}</span>
                    {i18n.language && i18n.language.startsWith(lang.code) && <Check className="ml-auto h-4 w-4" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <SidebarMenuButton
                      onClick={logout}
                      variant="ghost"
                      className="w-full justify-start group-data-[collapsible=icon]:justify-center"
                  >
                      <LogOut className="h-5 w-5" />
                      <span className="group-data-[collapsible=icon]:hidden">{t('sidebar.logout')}</span>
                  </SidebarMenuButton>
                </TooltipTrigger>
                <TooltipContent 
                  side="right" 
                  align="center" 
                  hidden={sidebarState !== "collapsed" || isMobile}
                >
                  {t('sidebar.logout')}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </SidebarMenuItem>
        </SidebarMenu>
      </div>
    </div>
  );
}
