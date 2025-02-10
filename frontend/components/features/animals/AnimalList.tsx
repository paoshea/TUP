import { useState, useMemo } from 'react';
import { Search, SortAsc, SortDesc } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { AnimalCard } from './AnimalCard';
import type { Animal } from '@/lib/types/mock';

interface AnimalListProps {
  animals: Animal[];
  onAnimalClick?: (animal: Animal) => void;
  onEdit?: (animal: Animal) => void;
  onDelete?: (animal: Animal) => void;
}

type SortField = 'name' | 'lastEvaluation' | 'score';
type SortOrder = 'asc' | 'desc';

export function AnimalList({ animals, onAnimalClick, onEdit, onDelete }: AnimalListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredAndSortedAnimals = useMemo(() => {
    return animals
      .filter(animal => {
        const matchesSearch = animal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          animal.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || animal.status.toLowerCase() === statusFilter;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        let comparison = 0;
        
        switch (sortField) {
          case 'name':
            comparison = a.name.localeCompare(b.name);
            break;
          case 'lastEvaluation':
            comparison = new Date(a.lastEvaluation).getTime() - new Date(b.lastEvaluation).getTime();
            break;
          case 'score':
            const aScore = Object.values(a.scores).reduce((sum, score) => sum + score, 0) / Object.keys(a.scores).length;
            const bScore = Object.values(b.scores).reduce((sum, score) => sum + score, 0) / Object.keys(b.scores).length;
            comparison = aScore - bScore;
            break;
        }

        return sortOrder === 'asc' ? comparison : -comparison;
      });
  }, [animals, searchTerm, sortField, sortOrder, statusFilter]);

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
            placeholder="Search animals..."
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
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </Select>

          <Select
            value={sortField}
            onValueChange={(value) => setSortField(value as SortField)}
          >
            <option value="name">Name</option>
            <option value="lastEvaluation">Last Evaluation</option>
            <option value="score">Score</option>
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

      {/* Animals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAndSortedAnimals.map(animal => (
          <AnimalCard
            key={animal.id}
            animal={animal}
            onClick={onAnimalClick}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredAndSortedAnimals.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No animals found matching your criteria
        </div>
      )}
    </div>
  );
}