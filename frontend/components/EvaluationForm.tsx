"use client";

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Textarea } from './ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';

const evaluationSchema = z.object({
  id: z.string(),
  scores: z.object({
    movement: z.number().min(0).max(10),
    conformation: z.number().min(0).max(10),
    muscleDevelopment: z.number().min(0).max(10),
    breedCharacteristics: z.number().min(0).max(10),
  }),
  notes: z.string().min(1, 'Notes are required'),
  images: z.array(z.string()),
});

type EvaluationFormData = z.infer<typeof evaluationSchema>;

interface EvaluationFormProps {
  initialData: EvaluationFormData;
  onSave: (data: EvaluationFormData) => void;
}

export function EvaluationForm({ initialData, onSave }: EvaluationFormProps) {
  const form = useForm<EvaluationFormData>({
    resolver: zodResolver(evaluationSchema),
    defaultValues: initialData,
  });

  const onSubmit = (data: EvaluationFormData) => {
    onSave(data);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Animal Evaluation</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Movement Score */}
            <FormField
              control={form.control}
              name="scores.movement"
              render={({ field }) => (
                <FormItem>
                  <div className="space-y-2">
                    <FormLabel>Movement Score</FormLabel>
                    <FormControl>
                      <div className="flex items-center space-x-4">
                        <Slider
                          min={0}
                          max={10}
                          step={1}
                          value={[field.value]}
                          onValueChange={([value]) => field.onChange(value)}
                          className="flex-1"
                        />
                        <span className="text-sm text-muted-foreground w-12 text-right">
                          {field.value}/10
                        </span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            {/* Conformation Score */}
            <FormField
              control={form.control}
              name="scores.conformation"
              render={({ field }) => (
                <FormItem>
                  <div className="space-y-2">
                    <FormLabel>Conformation Score</FormLabel>
                    <FormControl>
                      <div className="flex items-center space-x-4">
                        <Slider
                          min={0}
                          max={10}
                          step={1}
                          value={[field.value]}
                          onValueChange={([value]) => field.onChange(value)}
                          className="flex-1"
                        />
                        <span className="text-sm text-muted-foreground w-12 text-right">
                          {field.value}/10
                        </span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            {/* Muscle Development Score */}
            <FormField
              control={form.control}
              name="scores.muscleDevelopment"
              render={({ field }) => (
                <FormItem>
                  <div className="space-y-2">
                    <FormLabel>Muscle Development Score</FormLabel>
                    <FormControl>
                      <div className="flex items-center space-x-4">
                        <Slider
                          min={0}
                          max={10}
                          step={1}
                          value={[field.value]}
                          onValueChange={([value]) => field.onChange(value)}
                          className="flex-1"
                        />
                        <span className="text-sm text-muted-foreground w-12 text-right">
                          {field.value}/10
                        </span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            {/* Breed Characteristics Score */}
            <FormField
              control={form.control}
              name="scores.breedCharacteristics"
              render={({ field }) => (
                <FormItem>
                  <div className="space-y-2">
                    <FormLabel>Breed Characteristics Score</FormLabel>
                    <FormControl>
                      <div className="flex items-center space-x-4">
                        <Slider
                          min={0}
                          max={10}
                          step={1}
                          value={[field.value]}
                          onValueChange={([value]) => field.onChange(value)}
                          className="flex-1"
                        />
                        <span className="text-sm text-muted-foreground w-12 text-right">
                          {field.value}/10
                        </span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            {/* Notes */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <div className="space-y-2">
                    <FormLabel>Evaluation Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter detailed notes about the evaluation..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button type="submit">Save Evaluation</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}