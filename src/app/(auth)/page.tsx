
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/contexts/app-provider';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated } = useApp(); // Ensures AppProvider is an ancestor

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/dashboard/fields');
    } else {
      // This case should ideally be handled by a higher-level auth guard or middleware
      // redirecting to login if not authenticated when trying to access an auth route.
      // For now, if somehow landed here without auth, redirect to login.
      router.replace('/login');
    }
  }, [isAuthenticated, router]);

  return (
    <div className="flex items-center justify-center min-h-full">
      <div className="space-y-4 p-8">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-3/4" />
      </div>
    </div>
  );
}
