
"use client";

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { Field } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useRouter } from 'next/navigation';
import { FileEdit, PlusSquare, Leaf, Droplets, ClipboardList, Image as ImageIcon, MapPin, Edit, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const CROP_TYPES = ["Corn", "Soybeans", "Wheat", "Barley", "Canola", "Potatoes", "Sugar Beets", "Cotton", "Sorghum", "Sunflower", "Rice", "Oats", "Rye", "Alfalfa", "Lentils", "Peas", "Fava Beans", "Chickpeas", "Hemp", "Flax", "Mustard", "Triticale", "Millet", "Buckwheat", "Quinoa", "Amaranth", "Hops", "Various Vegetables", "Mixed Fruits"];
const FIELD_STATUSES = ["Planted", "Growing", "Harvesting", "Fallow", "Preparing", "Tillage", "Irrigating", "Pre-Planting", "Post-Harvest", "Seedling", "Vegetative", "Flowering", "Fruiting", "Maturing", "Dormant", "Cover Crop"];
const SOIL_TYPES = ["Sandy", "Silty", "Clay", "Loamy", "Peaty", "Chalky", "Clay Loam", "Sandy Loam", "Silty Loam", "Loamy Sand", "Sandy Clay", "Silty Clay", "Peat Loam", "Gravelly", "Rocky", "Laterite"];

const fieldSchema = z.object({
  name: z.string().min(3, { message: "Field name must be at least 3 characters." }),
  area: z.coerce.number().positive({ message: "Area must be a positive number." }),
  soilType: z.string().min(1, { message: "Soil type is required." }),
  cropType: z.string().min(1, { message: "Crop type is required." }),
  status: z.string().min(1, { message: "Field status is required." }),
  imageUrl: z.string().url({ message: "Please enter a valid image URL." }).optional().or(z.literal('')),
});

type FieldFormData = z.infer<typeof fieldSchema>;

interface FieldFormProps {
  initialData?: Field;
  onSubmit: (data: FieldFormData) => void;
  isEditing?: boolean;
}

export function FieldForm({ initialData, onSubmit, isEditing = false }: FieldFormProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const form = useForm<FieldFormData>({
    resolver: zodResolver(fieldSchema),
    defaultValues: {
      name: initialData?.name || '',
      area: initialData?.area || 0,
      soilType: initialData?.soilType || '',
      cropType: initialData?.cropType || '',
      status: initialData?.status || '',
      imageUrl: initialData?.imageUrl || '',
    },
  });

  const handleSubmit = (data: FieldFormData) => {
    onSubmit(data);
  };

  return (
    <Card className="max-w-2xl mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-headline flex items-center">
          {isEditing ? <FileEdit className="mr-3 h-7 w-7 text-primary" /> : <PlusSquare className="mr-3 h-7 w-7 text-primary" />}
          {isEditing ? t('field_form.edit_title') : t('field_form.add_title')}
        </CardTitle>
        <CardDescription>
          {isEditing ? t('field_form.edit_description') : t('field_form.add_description')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center"><Edit className="mr-2 h-4 w-4 text-muted-foreground" />{t('field_form.name_label')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('field_form.name_placeholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="area"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center"><MapPin className="mr-2 h-4 w-4 text-muted-foreground" />{t('field_form.area_label')}</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder={t('field_form.area_placeholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="cropType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center"><Leaf className="mr-2 h-4 w-4 text-muted-foreground" />{t('field_form.crop_type_label')}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t('field_form.crop_type_placeholder')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {CROP_TYPES.map(crop => (
                        <SelectItem key={crop} value={crop}>{crop}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="soilType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center"><Droplets className="mr-2 h-4 w-4 text-muted-foreground" />{t('field_form.soil_type_label')}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t('field_form.soil_type_placeholder')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {SOIL_TYPES.map(soil => (
                        <SelectItem key={soil} value={soil}>{soil}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center"><ClipboardList className="mr-2 h-4 w-4 text-muted-foreground" />{t('field_form.status_label')}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t('field_form.status_placeholder')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {FIELD_STATUSES.map(status => (
                        <SelectItem key={status} value={status}>{status}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center"><ImageIcon className="mr-2 h-4 w-4 text-muted-foreground" />{t('field_form.image_url_label')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('field_form.image_url_placeholder')} {...field} />
                  </FormControl>
                  <FormDescription>{t('field_form.image_url_description')}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end gap-4 pt-4">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                {t('field_form.cancel_button')}
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                <CheckCircle className="mr-2 h-5 w-5"/>
                {form.formState.isSubmitting 
                  ? (isEditing ? t('field_form.saving_button') : t('field_form.adding_button')) 
                  : (isEditing ? t('field_form.save_button') : t('field_form.add_button'))}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

