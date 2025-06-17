
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

const CROP_TYPES = ["Corn", "Soybeans", "Wheat", "Barley", "Canola", "Potatoes", "Sugar Beets", "Cotton", "Sorghum", "Sunflower"];
const FIELD_STATUSES = ["Planted", "Growing", "Harvesting", "Fallow", "Preparing", "Tillage", "Irrigating"];
const SOIL_TYPES = ["Sandy", "Silty", "Clay", "Loamy", "Peaty", "Chalky", "Clay Loam", "Sandy Loam", "Silty Loam", "Loamy Sand"];

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
        <CardTitle className="text-2xl font-headline">{isEditing ? 'Edit Field' : 'Add New Field'}</CardTitle>
        <CardDescription>
          {isEditing ? 'Update the details of your field.' : 'Enter the details for your new field.'}
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
                  <FormLabel>Field Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., North Paddock" {...field} />
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
                  <FormLabel>Area (acres)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 120" {...field} />
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
                  <FormLabel>Crop Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a crop type" />
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
                  <FormLabel>Soil Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a soil type" />
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
                  <FormLabel>Field Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select field status" />
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
                  <FormLabel>Image URL (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/image.png" {...field} />
                  </FormControl>
                  <FormDescription>Enter a URL for the field image. Use https://placehold.co for placeholders.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end gap-4 pt-4">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? (isEditing ? 'Saving...' : 'Adding...') : (isEditing ? 'Save Changes' : 'Add Field')}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
