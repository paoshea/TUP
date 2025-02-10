"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Calendar, Users, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EnhancedTable } from '@/components/ui/enhanced-table';
import { useShows } from '@/hooks/useEntities';
import { storage } from '@/services/storage';
import type { Show } from '@/lib/types/mock';

export default function ShowsContent() {
  const router = useRouter();
  const { data: shows, isLoading, refetch } = useShows();
  const [activeTab, setActiveTab] = useState('upcoming');

  const handleAction = async (action: string, show: Show) => {
    switch (action) {
      case 'edit':
        router.push(`/shows/${show.id}/edit`);
        break;
      case 'delete':
        if (confirm('Are you sure you want to delete this show?')) {
          await storage.deleteShow(show.id);
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
      header: 'Date',
      accessorKey: 'date',
      cell: ({ row }: { row: Show }) => (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-500" />
          {new Date(row.date).toLocaleDateString()}
        </div>
      ),
      sortable: true,
    },
    {
      header: 'Location',
      accessorKey: 'location',
      cell: ({ row }: { row: Show }) => (
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-gray-500" />
          {row.location}
        </div>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: ({ row }: { row: Show }) => (
        <Badge
          className={
            row.status === 'upcoming'
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
          }
        >
          {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
        </Badge>
      ),
    },
    {
      header: 'Entries',
      accessorKey: 'entryCount',
      cell: ({ row }: { row: Show }) => (
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-gray-500" />
          {row.entryCount} / {row.maxEntries}
        </div>
      ),
    },
  ];

  const filteredShows = (status: string) =>
    shows?.filter(show => show.status === status) || [];

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Shows</h1>
        <Button
          onClick={() => router.push('/shows/new')}
          className="bg-purple-600 hover:bg-purple-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Show
        </Button>
      </div>

      <Card className="p-6">
        <Tabs defaultValue="upcoming" onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="upcoming">
              Upcoming Shows
              {shows && (
                <Badge className="ml-2 bg-green-100 text-green-800">
                  {filteredShows('upcoming').length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed Shows
              {shows && (
                <Badge className="ml-2">
                  {filteredShows('completed').length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming">
            <EnhancedTable
              data={filteredShows('upcoming')}
              columns={columns}
              onRowClick={(row) => router.push(`/shows/${row.id}`)}
              onAction={handleAction}
              searchable
              searchKeys={['name', 'location']}
            />
          </TabsContent>

          <TabsContent value="completed">
            <EnhancedTable
              data={filteredShows('completed')}
              columns={columns}
              onRowClick={(row) => router.push(`/shows/${row.id}`)}
              onAction={handleAction}
              searchable
              searchKeys={['name', 'location']}
            />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}