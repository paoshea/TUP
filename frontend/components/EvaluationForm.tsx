import React, { useState } from 'react';
import Image from 'next/image';
import { usePhotos } from '@/hooks/usePhotos';
import type { Animal } from '@/types';
import { useForm } from 'react-hook-form';
import { Card, CardHeader, CardContent } from './ui/card';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from './ui/form';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Textarea } from './ui/textarea';
import { Alert, AlertDescription } from './ui/alert';
import { Label } from './ui/label';

interface EvaluationFormProps {
  onSave: (data: Partial<Animal>) => Promise<void>;
  initialData?: Partial<Animal>;
}

interface FormValues {
  scores: {
    movement: number;
    conformation: number;
    muscleDevelopment: number;
    breedCharacteristics: number;
  };
  notes: string;
  images: string[];
}

export function EvaluationForm({ onSave, initialData }: EvaluationFormProps) {
  const form = useForm<FormValues>({
    defaultValues: {
      scores: {
        movement: initialData?.scores?.movement ?? 0,
        conformation: initialData?.scores?.conformation ?? 0,
        muscleDevelopment: initialData?.scores?.muscleDevelopment ?? 0,
        breedCharacteristics: initialData?.scores?.breedCharacteristics ?? 0,
      },
      notes: initialData?.notes ?? '',
      images: initialData?.images ?? [],
    },
  });

  const [images, setImages] = useState<string[]>(initialData?.images ?? []);
  const { uploadPhoto, deletePhoto, uploading, error } = usePhotos(initialData?.id ?? 'temp');

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files?.length) return;

    try {
      const uploadPromises = Array.from(files).map(async file => {
        const url = await uploadPhoto(file);
        return url;
      });

      const newUrls = await Promise.all(uploadPromises);
      const updatedImages = [...images, ...newUrls];
      setImages(updatedImages);
      form.setValue('images', updatedImages);
    } catch (err) {
      console.error('Failed to upload photos:', err);
    }
  };

  const handlePhotoDelete = async (url: string) => {
    try {
      await deletePhoto(url);
      const updatedImages = images.filter(i => i !== url);
      setImages(updatedImages);
      form.setValue('images', updatedImages);
    } catch (err) {
      console.error('Failed to delete photo:', err);
    }
  };

  const onSubmit = async (data: FormValues) => {
    await onSave({
      scores: data.scores,
      notes: data.notes,
      images: data.images,
    });
  };

  const scoreCategories = Object.keys(form.getValues().scores) as Array<keyof FormValues['scores']>;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-medium">Evaluation Scores</h3>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {scoreCategories.map((category) => (
              <FormField
                key={category}
                control={form.control}
                name={`scores.${category}`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {category.replace(/([A-Z])/g, ' $1').trim()}
                    </FormLabel>
                    <FormControl>
                      <Slider
                        min={0}
                        max={10}
                        step={1}
                        value={[field.value]}
                        onValueChange={([value]) => field.onChange(value)}
                        className="py-4"
                      />
                    </FormControl>
                    <div className="text-sm text-muted-foreground text-right">
                      {field.value}/10
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-medium">Notes</h3>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder="Add evaluation notes..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-medium">Photos</h3>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {images.map((url, index) => (
                <div key={url} className="relative group">
                  <div className="aspect-square relative">
                    <Image
                      src={url}
                      alt={`Photo ${index + 1}`}
                      fill
                      className="object-cover rounded-lg"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => handlePhotoDelete(url)}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </Button>
                </div>
              ))}
              <div className="border-2 border-dashed border-muted rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors">
                <Label
                  htmlFor="photo-upload"
                  className="cursor-pointer text-sm text-muted-foreground hover:text-foreground"
                >
                  Add Photos
                  <input
                    id="photo-upload"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                    aria-label="Upload photos"
                  />
                </Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        )}

        <Button
          type="submit"
          disabled={uploading}
          className="w-full"
        >
          {uploading ? 'Uploading...' : 'Save Evaluation'}
        </Button>
      </form>
    </Form>
  );
}