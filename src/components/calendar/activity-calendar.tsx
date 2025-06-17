
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

interface ActivityCalendarProps {
  activities: Activity[];
}

export function ActivityCalendar({ activities }: ActivityCalendarProps) {
  const [currentMonthDate, setCurrentMonthDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const activitiesByDate = useMemo(() => {
    const map = new Map<string, Activity[]>();
    activities.forEach(activity => {
      const dateStr = format(parseISO(activity.date), 'yyyy-MM-dd');
      if (!map.has(dateStr)) {
        map.set(dateStr, []);
      }
      map.get(dateStr)?.push(activity);
    });
    return map;
  }, [activities]);

  const selectedDateActivities = useMemo(() => {
    if (!selectedDate) return [];
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    return activitiesByDate.get(dateStr) || [];
  }, [selectedDate, activitiesByDate]);

  const daysInMonthWithEvents = useMemo(() => {
    const start = startOfMonth(currentMonthDate);
    const end = endOfMonth(currentMonthDate);
    return eachDayOfInterval({ start, end }).map(day => ({
      date: day,
      hasEvent: activitiesByDate.has(format(day, 'yyyy-MM-dd')),
    }));
  }, [currentMonthDate, activitiesByDate]);

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
            <CardTitle className="text-2xl font-headline">{format(currentMonthDate, 'MMMM yyyy')}</CardTitle>
            <CardDescription>Select a day to view activities.</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={goToPreviousMonth} aria-label="Previous month">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={goToNextMonth} aria-label="Next month">
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
            {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'No Date Selected'}
          </CardTitle>
          <CardDescription>
            {selectedDateActivities.length > 0 
              ? `${selectedDateActivities.length} activit${selectedDateActivities.length === 1 ? 'y' : 'ies'} scheduled.`
              : 'No activities for this day.'}
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
                        {activity.type === 'ai-derived' ? 'AI' : 'Manual'}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{activity.description}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-10">
                {selectedDate ? 'No activities scheduled.' : 'Select a date to see activities.'}
              </p>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
