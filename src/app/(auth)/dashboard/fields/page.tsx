
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FieldCard } from '@/components/fields/field-card';
import { useApp } from '@/contexts/app-provider';
import { PlusCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function FieldsDashboardPage() {
  const { fields } = useApp();
  const { t } = useTranslation();

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-headline font-semibold">{t('fields_page.title')}</h1>
        <Link href="/dashboard/fields/new" asChild>
          <Button>
            <PlusCircle className="mr-2 h-5 w-5" /> {t('fields_page.add_new_field_button')}
          </Button>
        </Link>
      </div>
      {fields.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-xl text-muted-foreground">{t('fields_page.no_fields_found_title')}</p>
          <p className="text-md mt-2">{t('fields_page.no_fields_found_description')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {fields.map((field) => (
            <FieldCard key={field.id} field={field} />
          ))}
        </div>
      )}
    </div>
  );
}

