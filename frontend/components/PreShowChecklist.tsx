"use client";

import React, { useState } from 'react';
import { CheckSquare, Square, Plus, Trash2 } from 'lucide-react';

interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export function PreShowChecklist() {
  const [items, setItems] = useState<ChecklistItem[]>([
    { id: '1', text: 'Review breed standards', completed: false },
    { id: '2', text: 'Prepare evaluation sheets', completed: false },
    { id: '3', text: 'Check show schedule', completed: false },
  ]);
  const [newItemText, setNewItemText] = useState('');

  const handleToggle = (id: string) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemText.trim()) return;

    const newItem: ChecklistItem = {
      id: Date.now().toString(),
      text: newItemText.trim(),
      completed: false,
    };

    setItems([...items, newItem]);
    setNewItemText('');
  };

  const handleDeleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-6">Pre-Show Checklist</h2>

      {/* Add new item form */}
      <form onSubmit={handleAddItem} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={newItemText}
            onChange={(e) => setNewItemText(e.target.value)}
            placeholder="Add new checklist item..."
            className="flex-1 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>
      </form>

      {/* Checklist items */}
      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className={`flex items-center justify-between p-3 rounded-lg ${
              item.completed ? 'bg-green-50' : 'bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleToggle(item.id)}
                className={`text-${item.completed ? 'green' : 'gray'}-600 hover:text-${
                  item.completed ? 'green' : 'gray'
                }-700`}
              >
                {item.completed ? (
                  <CheckSquare className="h-5 w-5" />
                ) : (
                  <Square className="h-5 w-5" />
                )}
              </button>
              <span
                className={`${
                  item.completed
                    ? 'text-green-600 line-through'
                    : 'text-gray-700'
                }`}
              >
                {item.text}
              </span>
            </div>
            <button
              onClick={() => handleDeleteItem(item.id)}
              className="text-gray-400 hover:text-red-500 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Progress summary */}
      {items.length > 0 && (
        <div className="mt-6 pt-6 border-t">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Progress</span>
            <span>
              {items.filter(item => item.completed).length} of {items.length} completed
            </span>
          </div>
          <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 transition-all duration-300"
              style={{
                width: `${(items.filter(item => item.completed).length / items.length) * 100}%`
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}