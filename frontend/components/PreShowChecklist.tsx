"use client";

import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Card, CardHeader, CardContent, CardFooter } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Checkbox } from './ui/checkbox';
import { Form, FormControl, FormField, FormItem } from './ui/form';
import { cn } from '@/lib/utils';

interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

interface NewItemFormData {
  text: string;
}

const defaultItems: ChecklistItem[] = [
  { id: '1', text: 'Review breed standards', completed: false },
  { id: '2', text: 'Prepare evaluation sheets', completed: false },
  { id: '3', text: 'Check show schedule', completed: false },
];

export function PreShowChecklist() {
  const [items, setItems] = useState<ChecklistItem[]>(defaultItems);

  const form = useForm<NewItemFormData>({
    defaultValues: {
      text: '',
    },
  });

  const handleToggle = (id: string) => {
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const handleAddItem = (data: NewItemFormData) => {
    if (!data.text.trim()) return;

    const newItem: ChecklistItem = {
      id: Date.now().toString(),
      text: data.text.trim(),
      completed: false,
    };

    setItems(prevItems => [...prevItems, newItem]);
    form.reset();
  };

  const handleDeleteItem = (id: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const completedCount = items.filter(item => item.completed).length;
  const progress = items.length > 0 ? (completedCount / items.length) * 100 : 0;

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold">Pre-Show Checklist</h2>
      </CardHeader>

      <CardContent className="space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleAddItem)} className="flex gap-2">
            <FormField
              control={form.control}
              name="text"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input
                      placeholder="Add new checklist item..."
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button type="submit" size="icon">
              <Plus className="h-4 w-4" />
              <span className="sr-only">Add item</span>
            </Button>
          </form>
        </Form>

        <div className="space-y-2">
          {items.map((item) => (
            <div
              key={item.id}
              className={cn(
                'flex items-center justify-between p-2 rounded-lg',
                item.completed ? 'bg-muted/50' : 'bg-background'
              )}
            >
              <div className="flex items-center gap-3">
                <Checkbox
                  id={`item-${item.id}`}
                  checked={item.completed}
                  onCheckedChange={() => handleToggle(item.id)}
                />
                <label
                  htmlFor={`item-${item.id}`}
                  className={cn(
                    'text-sm',
                    item.completed && 'text-muted-foreground line-through'
                  )}
                >
                  {item.text}
                </label>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDeleteItem(item.id)}
                className="text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete item</span>
              </Button>
            </div>
          ))}
        </div>
      </CardContent>

      {items.length > 0 && (
        <CardFooter className="flex flex-col gap-2">
          <div className="flex items-center justify-between w-full text-sm text-muted-foreground">
            <span>Progress</span>
            <span>
              {completedCount} of {items.length} completed
            </span>
          </div>
          <Progress value={progress} className="w-full" />
        </CardFooter>
      )}
    </Card>
  );
}