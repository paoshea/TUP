"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Camera, Star, BarChart2, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ResizablePanelGroup, ResizablePanel } from '@/components/ui/resizable';
import { EnhancedTable } from '@/components/ui/enhanced-table';
import { useEvaluations } from '@/hooks/useEntities';
import { storage } from '@/services/storage';
import type { Evaluation } from '@/lib/types/mock';

export default function EvaluationsContent() {
  const router = useRouter();
  const { data: evaluations, isLoading, refetch } = useEvaluations();
  const [selectedEvaluation, setSelectedEvaluation] = useState<Evaluation | null>(null);

  const handleAction = async (action: string, evaluation: Evaluation) => {
    switch (action) {
      case 'edit':
        router.push(`/evaluations/${evaluation.id}/edit`);
        break;
      case 'delete':
        if (confirm('Are you sure you want to delete this evaluation?')) {
          await storage.deleteEvaluation(evaluation.id);
          refetch();
        }
        break;
    }
  };

  const columns = [
    {
      header: 'Animal',
      accessorKey: 'animalName',
      sortable: true,
    },
    {
      header: 'Date',
      accessorKey: 'date',
      cell: ({ row }: { row: Evaluation }) => (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-500" />
          {new Date(row.date).toLocaleDateString()}
        </div>
      ),
      sortable: true,
    },
    {
      header: 'Overall Score',
      accessorKey: 'overallScore',
      cell: ({ row }: { row: Evaluation }) => (
        <div className="flex items-center gap-2">
          <Star className="h-4 w-4 text-yellow-500" />
          {row.overallScore.toFixed(1)}
        </div>
      ),
      sortable: true,
    },
    {
      header: 'Photos',
      accessorKey: 'images',
      cell: ({ row }: { row: Evaluation }) => (
        <Badge>
          <Camera className="h-4 w-4 mr-1" />
          {row.images.length}
        </Badge>
      ),
    },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 9) return 'text-green-600';
    if (score >= 7.5) return 'text-blue-600';
    if (score >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Evaluations</h1>
        <Button
          onClick={() => router.push('/evaluations/new')}
          className="bg-purple-600 hover:bg-purple-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          New Evaluation
        </Button>
      </div>

      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={70}>
          <Card className="h-full p-6">
            <EnhancedTable
              data={evaluations || []}
              columns={columns}
              onRowClick={setSelectedEvaluation}
              onAction={handleAction}
              searchable
              searchKeys={['animalName']}
            />
          </Card>
        </ResizablePanel>

        <ResizablePanel defaultSize={30}>
          <Card className="h-full p-6">
            {selectedEvaluation ? (
              <div className="space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold">
                      {selectedEvaluation.animalName}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {new Date(selectedEvaluation.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">
                      <span className={getScoreColor(selectedEvaluation.overallScore)}>
                        {selectedEvaluation.overallScore.toFixed(1)}
                      </span>
                      <span className="text-sm text-gray-500">/10</span>
                    </div>
                    <div className="text-sm text-gray-600">Overall Score</div>
                  </div>
                </div>

                <Tabs defaultValue="scores">
                  <TabsList>
                    <TabsTrigger value="scores">Scores</TabsTrigger>
                    <TabsTrigger value="photos">Photos</TabsTrigger>
                    <TabsTrigger value="notes">Notes</TabsTrigger>
                  </TabsList>

                  <TabsContent value="scores" className="space-y-4">
                    {Object.entries(selectedEvaluation.scores).map(([key, value]) => (
                      <div key={key} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                          <span className={getScoreColor(value)}>{value.toFixed(1)}</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-purple-600"
                            style={{ width: `${(value / 10) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </TabsContent>

                  <TabsContent value="photos" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      {selectedEvaluation.images.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`Evaluation photo ${index + 1}`}
                          className="rounded-lg object-cover aspect-square"
                        />
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="notes">
                    <p className="text-gray-600 whitespace-pre-wrap">
                      {selectedEvaluation.notes}
                    </p>
                  </TabsContent>
                </Tabs>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                Select an evaluation to view details
              </div>
            )}
          </Card>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}