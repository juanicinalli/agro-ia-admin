
"use client";

import { FieldForm } from '@/components/fields/field-form';
import { useApp } from '@/contexts/app-provider';
import { useRouter } from 'next/navigation';
import type { Field } from '@/lib/types';

export default function NewFieldPage() {
  const { addField } = useApp();
  const router = useRouter();

  const handleSubmit = (data: Omit<Field, 'id' | 'activities' | 'imageUrl' | 'aiActivityPlan'> & { imageUrl?: string }) => {
    const fieldData = {
      ...data,
      // imageUrl is handled by addField if present, or defaults
    };
    addField(fieldData);
    router.push('/dashboard/fields');
  };

  return (
    <div className="container mx-auto">
      <FieldForm onSubmit={handleSubmit} isEditing={false} />
    </div>
  );
}
