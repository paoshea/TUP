"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Calendar, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EnhancedTable } from '@/components/ui/enhanced-table';
import { useAnimals } from '@/hooks/useEntities';
import { storage } from '@/services/storage';
import type { Animal } from '@/lib/types/mock';

export default function AnimalsContent() {
  const router = useRouter();
  const { data: animals, isLoading, refetch } = useAnimals();
  const [view, setView] = useState<'table' | 'grid'>('table');

  const handleAction = async (action: string, animal: Animal) => {
    switch (action) {
      case 'edit':
        router.push(`/animals/${animal.id}/edit`);
        break;
      case 'delete':
        if (confirm('Are you sure you want to delete this animal?')) {
          await storage.deleteAnimal(animal.id);
          refetch();
        }
        break;
    }
  };

  const columns = [
    {
      header: 'Name',
      accessorKey: 'name',
      sortable: true,
    },
    {
      header: 'Breed',
      accessorKey: 'breed',
      sortable: true,
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: ({ row }: { row: Animal }) => (
        <Badge variant={row.status === 'Active' ? 'success' : 'secondary'}>
          {row.status}
        </Badge>
      ),
    },
    {
      header: 'Registration',
      accessorKey: 'registrationNumber',
    },
    {
      header: 'Last Evaluation',
      accessorKey: 'lastEvaluation',
      cell: ({ row }: { row: Animal }) => (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-500" />
          {row.lastEvaluation ? new Date(row.lastEvaluation).toLocaleDateString() : 'No evaluation'}
        </div>
      ),
    },
    {
      header: 'Score',
      accessorKey: 'scores',
      cell: ({ row }: { row: Animal }) => {
        const average = Object.values(row.scores).reduce((a, b) => a + b, 0) / 4;
        return (
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-yellow-500" />
            {average.toFixed(1)}
          </div>
        );
      },
    },
  ];

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Animals</h1>
        <Button
          onClick={() => router.push('/animals/new')}
          className="bg-purple-600 hover:bg-purple-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Animal
        </Button>
      </div>

      <Card className="p-6">
        <EnhancedTable
          data={animals || []}
          columns={columns}
          onRowClick={(row) => router.push(`/animals/${row.id}`)}
          onAction={handleAction}
          searchable
          searchKeys={['name', 'breed', 'registrationNumber']}
        />
      </Card>
    </div>
  );
}