
"use client";

import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useApp } from '@/contexts/app-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ArrowLeft, Edit3, MapPin, Trees, ScanText, Info, CalendarDays } from 'lucide-react';
import { FieldActivityPlan } from '@/components/fields/field-activity-plan';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from 'react-i18next';

function FieldValue({ icon: Icon, label, value, unit }: { icon: React.ElementType, label: string, value: string | number, unit?: string }) {
  return (
    <div className="flex items-start">
      <Icon className="w-5 h-5 text-primary mr-3 mt-1 flex-shrink-0" />
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-medium">{value}{unit ? ` ${unit}` : ''}</p>
      </div>
    </div>
  );
}

export default function FieldDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { getFieldById } = useApp();
  const { t } = useTranslation();
  const fieldId = typeof params.id === 'string' ? params.id : undefined;

  if (!fieldId) {
    router.push('/dashboard/fields');
    return <p>Invalid field ID.</p>;
  }
  
  const field = getFieldById(fieldId);

  if (!field) {
    return (
      <div className="container mx-auto py-8">
        <Skeleton className="h-10 w-1/4 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <Skeleton className="h-64 w-full rounded-lg" />
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <Button variant="outline" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> {t('field_detail.back_button')}
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 shadow-xl">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-3xl font-headline mb-1">{field.name}</CardTitle>
                <CardDescription>{t('field_detail.description', { fieldName: field.name })}</CardDescription>
              </div>
              <Link href={`/dashboard/fields/${field.id}/edit`} passHref legacyBehavior>
                <Button variant="outline" size="sm">
                  <Edit3 className="mr-2 h-4 w-4" /> {t('field_detail.edit_button')}
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden mb-6 shadow-md">
              <Image
                src={field.imageUrl || `https://placehold.co/800x500.png?text=${encodeURIComponent(field.name)}`}
                alt={field.name}
                layout="fill"
                objectFit="cover"
                data-ai-hint="agriculture aerial"
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              <FieldValue icon={Trees} label={t('field_form.crop_type_label')} value={field.cropType} />
              <FieldValue icon={MapPin} label={t('field_form.area_label')} value={String(field.area)} unit={t('field_form.area_label_suffix', 'acres')} />
              <FieldValue icon={ScanText} label={t('field_form.soil_type_label')} value={field.soilType} />
              <FieldValue icon={Info} label={t('field_form.status_label')} value={field.status} />
            </div>

            <Separator className="my-6" />

            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <CalendarDays className="w-5 h-5 text-primary mr-2" />
                {t('field_detail.scheduled_activities_title')}
              </h3>
              {field.activities && field.activities.length > 0 ? (
                <ul className="space-y-3">
                  {field.activities.map(activity => (
                    <li key={activity.id} className="p-3 bg-muted rounded-md">
                      <div className="flex justify-between items-center">
                        <p className="font-medium">{activity.title}</p>
                        <Badge variant="secondary">{new Date(activity.date).toLocaleDateString()}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">{t('field_detail.no_activities_message')}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-1">
          <FieldActivityPlan field={field} />
        </div>
      </div>
    </div>
  );
}

