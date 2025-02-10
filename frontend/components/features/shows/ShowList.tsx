import { useState, useMemo } from 'react';
import { Search, SortAsc, SortDesc, Calendar } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { ShowCard } from './ShowCard';
import type { Show } from '@/lib/types/mock';

interface ShowListProps {
  shows: Show[];
  onShowClick?: (show: Show) => void;
  onEdit?: (show: Show) => void;
  onDelete?: (show: Show) => void;
}

type SortField = 'name' | 'date' | 'entryCount';
type SortOrder = 'asc' | 'desc';

export function ShowList({ shows, onShowClick, onEdit, onDelete }: ShowListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredAndSortedShows = useMemo(() => {
    return shows
      .filter(show => {
        const matchesSearch = 
          show.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          show.location.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || show.status.toLowerCase() === statusFilter;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        let comparison = 0;
        
        switch (sortField) {
          case 'name':
            comparison = a.name.localeCompare(b.name);
            break;
          case 'date':
            comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
            break;
          case 'entryCount':
            comparison = a.entryCount - b.entryCount;
            break;
        }

        return sortOrder === 'asc' ? comparison : -comparison;
      });
  }, [shows, searchTerm, sortField, sortOrder, statusFilter]);

  const toggleSortOrder = () => {
    setSortOrder(current => current === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div className="space-y-4">
      {/* Filters and Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
          <Input
            placeholder="Search shows..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          <Select
            value={statusFilter}
            onValueChange={setStatusFilter}
          >
            <option value="all">All Status</option>
            <option value="upcoming">Upcoming</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </Select>

          <Select
            value={sortField}
            onValueChange={(value) => setSortField(value as SortField)}
          >
            <option value="date">Date</option>
            <option value="name">Name</option>
            <option value="entryCount">Entries</option>
          </Select>

          <Button
            variant="outline"
            size="icon"
            onClick={toggleSortOrder}
            className="w-10 h-10"
          >
            {sortOrder === 'asc' ? (
              <SortAsc className="h-4 w-4" />
            ) : (
              <SortDesc className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Shows Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAndSortedShows.map(show => (
          <ShowCard
            key={show.id}
            show={show}
            onClick={onShowClick}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredAndSortedShows.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p>No shows found matching your criteria</p>
        </div>
      )}
    </div>
  );
}