
"use client";

import Image from 'next/image';
import Link from 'next/link';
import type { Field } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Edit3, Trash2, MapPin, Trees, ScanText } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useApp } from '@/contexts/app-provider';

interface FieldCardProps {
  field: Field;
}

export function FieldCard({ field }: FieldCardProps) {
  const { deleteField } = useApp();

  return (
    <Card className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="p-0 relative">
        <Image
          src={field.imageUrl || `https://placehold.co/600x400.png?text=${encodeURIComponent(field.name)}`}
          alt={field.name}
          width={600}
          height={400}
          className="object-cover w-full h-48"
          data-ai-hint="agriculture field"
        />
         <div className="absolute top-2 right-2 bg-background/70 text-foreground px-2 py-1 rounded-md text-xs backdrop-blur-sm">
          {field.status}
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="text-xl font-headline mb-1">{field.name}</CardTitle>
        <div className="text-sm text-muted-foreground space-y-1">
          <div className="flex items-center gap-2">
            <Trees className="w-4 h-4 text-primary" />
            <span>Crop: {field.cropType}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            <span>Area: {field.area} acres</span>
          </div>
          <div className="flex items-center gap-2">
            <ScanText className="w-4 h-4 text-primary" />
            <span>Soil: {field.soilType}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 border-t flex justify-between items-center gap-2">
        <Link href={`/dashboard/fields/${field.id}`} asChild>
          <Button variant="outline" size="sm" aria-label={`View details for ${field.name}`}>
            <Eye className="mr-2 h-4 w-4" /> View
          </Button>
        </Link>
        <div className="flex gap-2">
          <Link href={`/dashboard/fields/${field.id}/edit`} asChild>
            <Button variant="ghost" size="icon" aria-label={`Edit ${field.name}`}>
              <Edit3 className="h-5 w-5" />
            </Button>
          </Link>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10" aria-label={`Delete ${field.name}`}>
                <Trash2 className="h-5 w-5" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the field "{field.name}" and all associated data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => deleteField(field.id)} className="bg-destructive hover:bg-destructive/90">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardFooter>
    </Card>
  );
}
