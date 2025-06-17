
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/contexts/app-provider'; // Assuming AppProvider is at root for this check or accessible
import { AppProvider } from '@/contexts/app-provider'; // Import AppProvider
import { Skeleton } from '@/components/ui/skeleton';

function HomePageContent() {
  const router = useRouter();
  // This component must be a client component to use hooks.
  // We check auth status here. A real app might use middleware or a server-side check.
  // For this demo, we'll use a client-side check.
  const authState = useApp(); // This will throw if AppProvider is not an ancestor.
  // We ensure useApp is called conditionally or after checking if context is available.
  // However, given the prompt, AppProvider should wrap this.
  
  useEffect(() => {
    // if authState is not immediately available, it might be loading
    // for this demo, we assume it's available quickly after AppProvider mounts
    if (authState) { // Check if authState (context value) is available
      if (authState.isAuthenticated) {
        router.replace('/dashboard/fields');
      } else {
        router.replace('/login');
      }
    }
  }, [authState, router]);

  // Show a loading state or a blank page while redirecting
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="space-y-4 p-8">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-3/4" />
      </div>
    </div>
  );
}

// Wrap HomePageContent with AppProvider so useApp can be used
export default function Home() {
  return (
    <AppProvider>
      <HomePageContent />
    </AppProvider>
  );
}
