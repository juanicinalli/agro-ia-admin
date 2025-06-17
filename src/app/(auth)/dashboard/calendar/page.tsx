
"use client";

import { ActivityCalendar } from '@/components/calendar/activity-calendar';
import { useApp } from '@/contexts/app-provider';
import { useTranslation } from 'react-i18next';

export default function CalendarPage() {
  const { activities } = useApp();
  const { t } = useTranslation();
  
  return (
    <div className="container mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-headline font-semibold">{t('calendar_page.title')}</h1>
        <p className="text-muted-foreground">{t('calendar_page.description')}</p>
      </div>
      <ActivityCalendar activities={activities} />
    </div>
  );
}

