import { useState, useMemo } from 'react';
import { Search, SortAsc, SortDesc, Star } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { EvaluationCard } from './EvaluationCard';
import type { Evaluation } from '@/lib/types/mock';

interface EvaluationListProps {
  evaluations: Evaluation[];
  onEvaluationClick?: (evaluation: Evaluation) => void;
  onEdit?: (evaluation: Evaluation) => void;
  onDelete?: (evaluation: Evaluation) => void;
}

type SortField = 'date' | 'animalName' | 'overallScore';
type SortOrder = 'asc' | 'desc';

export function EvaluationList({
  evaluations,
  onEvaluationClick,
  onEdit,
  onDelete,
}: EvaluationListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [scoreFilter, setScoreFilter] = useState<string>('all');

  const getScoreRange = (filter: string): [number, number] => {
    switch (filter) {
      case 'excellent':
        return [9, 10];
      case 'good':
        return [7.5, 8.9];
      case 'average':
        return [6, 7.4];
      case 'needsImprovement':
        return [0, 5.9];
      default:
        return [0, 10];
    }
  };

  const filteredAndSortedEvaluations = useMemo(() => {
    return evaluations
      .filter(evaluation => {
        const matchesSearch = 
          evaluation.animalName.toLowerCase().includes(searchTerm.toLowerCase());
        
        if (scoreFilter !== 'all') {
          const [min, max] = getScoreRange(scoreFilter);
          const score = evaluation.overallScore;
          return matchesSearch && score >= min && score <= max;
        }
        
        return matchesSearch;
      })
      .sort((a, b) => {
        let comparison = 0;
        
        switch (sortField) {
          case 'date':
            comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
            break;
          case 'animalName':
            comparison = a.animalName.localeCompare(b.animalName);
            break;
          case 'overallScore':
            comparison = a.overallScore - b.overallScore;
            break;
        }

        return sortOrder === 'asc' ? comparison : -comparison;
      });
  }, [evaluations, searchTerm, sortField, sortOrder, scoreFilter]);

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
            placeholder="Search evaluations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          <Select
            value={scoreFilter}
            onValueChange={setScoreFilter}
          >
            <option value="all">All Scores</option>
            <option value="excellent">Excellent (9-10)</option>
            <option value="good">Good (7.5-8.9)</option>
            <option value="average">Average (6-7.4)</option>
            <option value="needsImprovement">Needs Improvement (&lt;6)</option>
          </Select>

          <Select
            value={sortField}
            onValueChange={(value) => setSortField(value as SortField)}
          >
            <option value="date">Date</option>
            <option value="animalName">Animal Name</option>
            <option value="overallScore">Score</option>
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

      {/* Evaluations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAndSortedEvaluations.map(evaluation => (
          <EvaluationCard
            key={evaluation.id}
            evaluation={evaluation}
            onClick={onEvaluationClick}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredAndSortedEvaluations.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Star className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p>No evaluations found matching your criteria</p>
        </div>
      )}
    </div>
  );
}