"use client";

import React, { useEffect, useState } from 'react';
import { mockStore } from '@/lib/mock/store';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import {
  Calendar,
  CheckSquare,
  Clock,
  Filter,
  Plus,
} from 'lucide-react';
import type { ChecklistItem } from '@/lib/types/mock';

export function PreShowChecklist() {
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    const checklists = mockStore.getChecklists();
    setItems(checklists);
  }, []);

  const handleToggleItem = (id: string) => {
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const filteredItems = items.filter(item => {
    if (filter === 'all') return true;
    if (filter === 'completed') return item.completed;
    if (filter === 'pending') return !item.completed;
    return item.category === filter;
  });

  const progress = items.length
    ? Math.round((items.filter(item => item.completed).length / items.length) * 100)
    : 0;

  const categories = [
    { value: 'all', label: 'All Tasks' },
    { value: 'completed', label: 'Completed' },
    { value: 'pending', label: 'Pending' },
    { value: 'preparation', label: 'Preparation' },
    { value: 'documentation', label: 'Documentation' },
    { value: 'equipment', label: 'Equipment' },
    { value: 'health', label: 'Health' },
    { value: 'general', label: 'General' },
  ];

  return (
    <Card>
<Card>
<Card>
<Card>
<Card>
  <CardHeader>
    <div className="flex items-center justify-between">
      <div className="space-y-1">
        <CardTitle>Pre-Show Checklist</CardTitle>
        <p className="text-sm text-muted-foreground">
          Track and manage your show preparation tasks
        </p>
      </div>
      <Button size="sm">
        <Plus className="h-4 w-4 mr-2" />
        Add Task
      </Button>
    </div>
  </CardHeader>
  <CardContent>
    <div className="space-y-6">
      {/* Progress Overview */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span>Overall Progress</span>
          <span className="text-muted-foreground">{progress}% complete</span>
        </div>
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Filter */}
      <div className="flex items-center space-x-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <Select value={filter} onValueChange={setFilter}>
        <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter tasks" />
        </SelectTrigger>
        <SelectContent>
            {categories.map(category => (
                <SelectItem key={category.value} value={category.value}>
                    {category.label}
                </SelectItem>
            ))}
        </SelectContent>
        </Select>
      </div>

      {/* Checklist Items */}
      <div className="space-y-4">
        {filteredItems.map(item => (
          <div
            key={item.id}
            className="flex items-start space-x-4 p-4 rounded-lg border bg-card"
          >
            <Checkbox
              checked={item.completed}
              onCheckedChange={() => handleToggleItem(item.id)}
            />
            <div className="flex-1 space-y-1">
              <p className={`text-sm font-medium ${
                item.completed ? 'line-through text-muted-foreground' : ''
              }`}>
                {item.text}
              </p>
              <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                <div className="flex items-center">
                  <CheckSquare className="h-3 w-3 mr-1" />
                  {item.category}
                </div>
                {item.dueDate && (
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {new Date(item.dueDate).toLocaleDateString()}
                  </div>
                )}
                {item.assignedTo && (
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {item.assignedTo}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {filteredItems.length === 0 && (
          <div className="text-center py-6 text-muted-foreground">
            No tasks found for the selected filter
          </div>
        )}
      </div>
    </div>
  </CardContent>
</Card>
</Card>
</Card>
</Card>
    </Card>
  );
}
