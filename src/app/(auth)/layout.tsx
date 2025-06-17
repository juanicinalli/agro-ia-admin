
import { AppLayout } from '@/components/layout/app-layout';
import { AppProvider } from '@/contexts/app-provider';
import type { ReactNode } from 'react';

export default function AuthenticatedLayout({ children }: { children: ReactNode }) {
  return (
    <AppProvider>
      <AppLayout>
        {children}
      </AppLayout>
    </AppProvider>
  );
}
