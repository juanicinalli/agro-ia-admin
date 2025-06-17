
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

const CROP_TYPES = ["Corn", "Soybeans", "Wheat", "Barley", "Canola", "Potatoes", "Sugar Beets", "Cotton", "Sorghum", "Sunflower", "Rice", "Oats", "Rye", "Alfalfa", "Lentils", "Peas"];
const FIELD_STATUSES = ["Planted", "Growing", "Harvesting", "Fallow", "Preparing", "Tillage", "Irrigating", "Pre-Planting", "Post-Harvest", "Seedling", "Flowering", "Maturing"];
const SOIL_TYPES = ["Sandy", "Silty", "Clay", "Loamy", "Peaty", "Chalky", "Clay Loam", "Sandy Loam", "Silty Loam", "Loamy Sand", "Sandy Clay", "Silty Clay", "Peat Loam"];

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
        <CardTitle className="text-2xl font-headline flex items-center">
          {isEditing ? <FileEdit className="mr-3 h-7 w-7 text-primary" /> : <PlusSquare className="mr-3 h-7 w-7 text-primary" />}
          {isEditing ? 'Edit Field' : 'Add New Field'}
        </CardTitle>
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
                  <FormLabel className="flex items-center"><Edit className="mr-2 h-4 w-4 text-muted-foreground" />Field Name</FormLabel>
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
                  <FormLabel className="flex items-center"><MapPin className="mr-2 h-4 w-4 text-muted-foreground" />Area (acres)</FormLabel>
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
                  <FormLabel className="flex items-center"><Leaf className="mr-2 h-4 w-4 text-muted-foreground" />Crop Type</FormLabel>
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
                  <FormLabel className="flex items-center"><Droplets className="mr-2 h-4 w-4 text-muted-foreground" />Soil Type</FormLabel>
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
                  <FormLabel className="flex items-center"><ClipboardList className="mr-2 h-4 w-4 text-muted-foreground" />Field Status</FormLabel>
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
                  <FormLabel className="flex items-center"><ImageIcon className="mr-2 h-4 w-4 text-muted-foreground" />Image URL (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://placehold.co/600x400.png" {...field} />
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
                <CheckCircle className="mr-2 h-5 w-5"/>
                {form.formState.isSubmitting ? (isEditing ? 'Saving...' : 'Adding...') : (isEditing ? 'Save Changes' : 'Add Field')}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
