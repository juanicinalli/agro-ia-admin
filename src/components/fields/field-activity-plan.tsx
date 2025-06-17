
"use client";

import { useState } from 'react';
import type { Field, Activity } from '@/lib/types';
import { useApp } from '@/contexts/app-provider';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { BrainCircuit, PlusCircle, CalendarPlus, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslation } from 'react-i18next';

interface FieldActivityPlanProps {
  field: Field;
}

const activitySchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters."),
  description: z.string().min(5, "Description must be at least 5 characters."),
  date: z.string().refine((date) => !isNaN(Date.parse(date)), "Invalid date."),
});
type ActivityFormData = z.infer<typeof activitySchema>;


export function FieldActivityPlan({ field }: FieldActivityPlanProps) {
  const { generateAIFieldPlan, addActivity, loadingAIPlan } = useApp();
  const [isAddActivityDialogOpen, setIsAddActivityDialogOpen] = useState(false);
  const { t } = useTranslation();

  const activityForm = useForm<ActivityFormData>({
    resolver: zodResolver(activitySchema),
    defaultValues: {
      title: "",
      description: "",
      date: new Date().toISOString().split("T")[0],
    },
  });

  const handleAddActivitySubmit = (data: ActivityFormData) => {
    addActivity({ ...data, fieldId: field.id, type: 'manual' });
    setIsAddActivityDialogOpen(false);
    activityForm.reset();
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-headline flex items-center gap-2">
          <BrainCircuit className="w-6 h-6 text-primary" />
          {t('field_activity_plan.title')}
        </CardTitle>
        <CardDescription>
          {t('field_activity_plan.description', { fieldName: field.name })}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {field.aiActivityPlan ? (
          <div className="p-4 bg-muted rounded-md">
            <h4 className="font-semibold mb-2">{t('field_activity_plan.generated_plan_title')}</h4>
            <pre className="whitespace-pre-wrap text-sm font-mono">{field.aiActivityPlan}</pre>
          </div>
        ) : (
          <p className="text-muted-foreground">{t('field_activity_plan.no_plan_message')}</p>
        )}
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <Button onClick={() => generateAIFieldPlan(field.id)} disabled={loadingAIPlan} className="w-full sm:w-auto">
          {loadingAIPlan ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <BrainCircuit className="mr-2 h-4 w-4" />}
          {loadingAIPlan 
            ? t('field_activity_plan.generating_button') 
            : (field.aiActivityPlan ? t('field_activity_plan.regenerate_button') : t('field_activity_plan.generate_button'))}
        </Button>
        
        <Dialog open={isAddActivityDialogOpen} onOpenChange={setIsAddActivityDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full sm:w-auto">
              <CalendarPlus className="mr-2 h-4 w-4" /> {t('field_activity_plan.add_manual_activity_button')}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{t('field_activity_plan.add_manual_activity_dialog_title')}</DialogTitle>
              <DialogDescription>
                {t('field_activity_plan.add_manual_activity_dialog_description', { fieldName: field.name })}
              </DialogDescription>
            </DialogHeader>
            <Form {...activityForm}>
              <form onSubmit={activityForm.handleSubmit(handleAddActivitySubmit)} className="space-y-4 py-4">
                <FormField
                  control={activityForm.control}
                  name="title"
                  render={({ field: formField }) => (
                    <FormItem>
                      <FormLabel>{t('field_activity_plan.activity_title_label')}</FormLabel>
                      <FormControl><Input placeholder={t('field_activity_plan.activity_title_placeholder')} {...formField} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={activityForm.control}
                  name="description"
                  render={({ field: formField }) => (
                    <FormItem>
                      <FormLabel>{t('field_activity_plan.activity_description_label')}</FormLabel>
                      <FormControl><Textarea placeholder={t('field_activity_plan.activity_description_placeholder')} {...formField} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={activityForm.control}
                  name="date"
                  render={({ field: formField }) => (
                    <FormItem>
                      <FormLabel>{t('field_activity_plan.activity_date_label')}</FormLabel>
                      <FormControl><Input type="date" {...formField} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsAddActivityDialogOpen(false)}>{t('field_form.cancel_button')}</Button>
                  <Button type="submit">{t('field_activity_plan.add_button_short', 'Add Activity')}</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}

