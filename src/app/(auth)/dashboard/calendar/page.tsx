
"use client";

import { ActivityCalendar } from '@/components/calendar/activity-calendar';
import { useApp } from '@/contexts/app-provider';

export default function CalendarPage() {
  const { activities } = useApp();
  
  return (
    <div className="container mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-headline font-semibold">Activity Calendar</h1>
        <p className="text-muted-foreground">View and manage your farm activities.</p>
      </div>
      <ActivityCalendar activities={activities} />
    </div>
  );
}
