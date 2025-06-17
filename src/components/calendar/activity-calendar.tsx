
"use client";

import React, { useState, useMemo } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Activity } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { format, parseISO, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths, isToday } from 'date-fns';
import { Button } from '../ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getLang } from '@/lib/locale-helper'; // Helper for date-fns locale

interface ActivityCalendarProps {
  activities: Activity[];
}

export function ActivityCalendar({ activities }: ActivityCalendarProps) {
  const [currentMonthDate, setCurrentMonthDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const { t, i18n } = useTranslation();
  const dateFnsLocale = getLang(i18n.language);

  const activitiesByDate = useMemo(() => {
    const map = new Map<string, Activity[]>();
    activities.forEach(activity => {
      const dateStr = format(parseISO(activity.date), 'yyyy-MM-dd', { locale: dateFnsLocale });
      if (!map.has(dateStr)) {
        map.set(dateStr, []);
      }
      map.get(dateStr)?.push(activity);
    });
    return map;
  }, [activities, dateFnsLocale]);

  const selectedDateActivities = useMemo(() => {
    if (!selectedDate) return [];
    const dateStr = format(selectedDate, 'yyyy-MM-dd', { locale: dateFnsLocale });
    return activitiesByDate.get(dateStr) || [];
  }, [selectedDate, activitiesByDate, dateFnsLocale]);

  const daysInMonthWithEvents = useMemo(() => {
    const start = startOfMonth(currentMonthDate);
    const end = endOfMonth(currentMonthDate);
    return eachDayOfInterval({ start, end }).map(day => ({
      date: day,
      hasEvent: activitiesByDate.has(format(day, 'yyyy-MM-dd', { locale: dateFnsLocale })),
    }));
  }, [currentMonthDate, activitiesByDate, dateFnsLocale]);

  const handleMonthChange = (month: Date) => {
    setCurrentMonthDate(month);
  };

  const goToPreviousMonth = () => {
    setCurrentMonthDate(prev => subMonths(prev, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonthDate(prev => addMonths(prev, 1));
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="md:col-span-2 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-headline">{format(currentMonthDate, 'MMMM yyyy', { locale: dateFnsLocale })}</CardTitle>
            <CardDescription>{t('calendar_page.select_day_description')}</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={goToPreviousMonth} aria-label={t('calendar_page.previous_month')}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={goToNextMonth} aria-label={t('calendar_page.next_month')}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            month={currentMonthDate}
            onMonthChange={handleMonthChange}
            className="p-0"
            locale={dateFnsLocale}
            modifiers={{ 
              event: daysInMonthWithEvents.filter(d => d.hasEvent).map(d => d.date),
              today: new Date()
            }}
            modifiersClassNames={{
              event: "border-primary border-2 rounded-md",
              today: "bg-accent text-accent-foreground rounded-md"
            }}
          />
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-headline">
            {selectedDate ? format(selectedDate, 'MMMM d, yyyy', { locale: dateFnsLocale }) : t('calendar_page.no_date_selected')}
          </CardTitle>
          <CardDescription>
            {selectedDateActivities.length > 0 
              ? t('calendar_page.activities_scheduled_plural', { count: selectedDateActivities.length })
              : t('calendar_page.no_activities_for_day')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px] pr-4">
            {selectedDateActivities.length > 0 ? (
              <ul className="space-y-3">
                {selectedDateActivities.map(activity => (
                  <li key={activity.id} className="p-3 bg-muted rounded-md shadow-sm">
                    <div className="flex justify-between items-center">
                      <p className="font-semibold text-sm">{activity.title}</p>
                      <Badge variant={activity.type === 'ai-derived' ? 'default' : 'secondary'} className="text-xs">
                        {activity.type === 'ai-derived' ? t('calendar_page.activity_type_ai') : t('calendar_page.activity_type_manual')}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{activity.description}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-10">
                {selectedDate ? t('calendar_page.no_activities_placeholder') : t('calendar_page.select_date_placeholder')}
              </p>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}

