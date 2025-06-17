
"use client";

import { useParams, useRouter } from 'next/navigation';
import { FieldForm } from '@/components/fields/field-form';
import { useApp } from '@/contexts/app-provider';
import type { Field }from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function EditFieldPage() {
  const params = useParams();
  const router = useRouter();
  const { getFieldById, updateField } = useApp();
  const fieldId = typeof params.id === 'string' ? params.id : undefined;
  
  if (!fieldId) {
    // This should ideally not happen if routing is correct
    router.push('/dashboard/fields');
    return <p>Invalid field ID.</p>;
  }

  const field = getFieldById(fieldId);

  const handleSubmit = (data: Omit<Field, 'id' | 'activities' | 'aiActivityPlan'> & { imageUrl?: string }) => {
    updateField(fieldId, data);
    router.push(`/dashboard/fields/${fieldId}`);
  };

  if (!field) {
    return (
      <div className="container mx-auto max-w-2xl">
        <Skeleton className="h-12 w-1/2 mb-4" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <FieldForm initialData={field} onSubmit={handleSubmit} isEditing={true} />
    </div>
  );
}
