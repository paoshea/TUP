import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Star, Edit, Trash } from 'lucide-react';
import type { Animal } from '@/lib/types/mock';

interface AnimalCardProps {
  animal: Animal;
  onEdit?: (animal: Animal) => void;
  onDelete?: (animal: Animal) => void;
  onClick?: (animal: Animal) => void;
}

export function AnimalCard({ animal, onEdit, onDelete, onClick }: AnimalCardProps) {
  const handleClick = () => {
    if (onClick) onClick(animal);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) onEdit(animal);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) onDelete(animal);
  };

  const getAverageScore = () => {
    const scores = Object.values(animal.scores);
    return scores.reduce((a, b) => a + b, 0) / scores.length;
  };

  return (
    <Card 
      className={`p-4 sm:p-6 hover:shadow-md transition-shadow ${onClick ? 'cursor-pointer' : ''}`}
      onClick={handleClick}
    >
      <div className="flex flex-col sm:flex-row justify-between items-start gap-2 sm:gap-4 mb-4">
        <div className="w-full sm:w-auto">
          <h3 className="font-semibold text-base sm:text-lg mb-1">{animal.name}</h3>
          <p className="text-xs sm:text-sm text-muted-foreground">ID: {animal.id}</p>
        </div>
        <Badge 
          variant={animal.status === 'Active' ? 'success' : 'secondary'}
          className="text-xs sm:text-sm px-2 py-1"
        >
          {animal.status}
        </Badge>
      </div>

      <div className="space-y-3 sm:space-y-4">
        <div className="flex items-center text-xs sm:text-sm text-muted-foreground">
          <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
          <span className="truncate">
            Last Evaluation: {new Date(animal.lastEvaluation).toLocaleDateString()}
          </span>
        </div>

        <div className="flex items-center text-xs sm:text-sm">
          <Star className="h-4 w-4 mr-2 text-yellow-500 flex-shrink-0" />
          <span>Score: {getAverageScore().toFixed(1)}</span>
        </div>

        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
          {animal.notes}
        </p>
      </div>

      {(onEdit || onDelete) && (
        <div className="flex justify-end gap-3 mt-4">
          {onEdit && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleEdit}
              className="text-blue-600 hover:text-blue-800 p-3 sm:p-2"
            >
              <Edit className="h-5 w-5 sm:h-4 sm:w-4" />
              <span className="sr-only">Edit</span>
            </Button>
          )}
          {onDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="text-red-600 hover:text-red-800 p-3 sm:p-2"
            >
              <Trash className="h-5 w-5 sm:h-4 sm:w-4" />
              <span className="sr-only">Delete</span>
            </Button>
          )}
        </div>
      )}
    </Card>
  );
}