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
      className={`p-4 hover:shadow-md transition-shadow ${onClick ? 'cursor-pointer' : ''}`}
      onClick={handleClick}
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-semibold text-lg">{animal.name}</h3>
          <p className="text-sm text-muted-foreground">ID: {animal.id}</p>
        </div>
        <Badge variant={animal.status === 'Active' ? 'success' : 'secondary'}>
          {animal.status}
        </Badge>
      </div>

      <div className="space-y-2">
        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar className="h-4 w-4 mr-2" />
          <span>Last Evaluation: {new Date(animal.lastEvaluation).toLocaleDateString()}</span>
        </div>

        <div className="flex items-center text-sm">
          <Star className="h-4 w-4 mr-2 text-yellow-500" />
          <span>Score: {getAverageScore().toFixed(1)}</span>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2">
          {animal.notes}
        </p>
      </div>

      {(onEdit || onDelete) && (
        <div className="flex justify-end gap-2 mt-4">
          {onEdit && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleEdit}
              className="text-blue-600 hover:text-blue-800"
            >
              <Edit className="h-4 w-4" />
            </Button>
          )}
          {onDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="text-red-600 hover:text-red-800"
            >
              <Trash className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}
    </Card>
  );
}