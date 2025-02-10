import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Star, Camera, Edit, Trash } from 'lucide-react';
import type { Evaluation } from '@/lib/types/mock';

interface EvaluationCardProps {
  evaluation: Evaluation;
  onEdit?: (evaluation: Evaluation) => void;
  onDelete?: (evaluation: Evaluation) => void;
  onClick?: (evaluation: Evaluation) => void;
}

export function EvaluationCard({ evaluation, onEdit, onDelete, onClick }: EvaluationCardProps) {
  const handleClick = () => {
    if (onClick) onClick(evaluation);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) onEdit(evaluation);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) onDelete(evaluation);
  };

  const getScoreColor = (score: number) => {
    if (score >= 9) return 'text-green-600';
    if (score >= 7.5) return 'text-blue-600';
    if (score >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <Card 
      className={`p-4 hover:shadow-md transition-shadow ${onClick ? 'cursor-pointer' : ''}`}
      onClick={handleClick}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold text-lg">{evaluation.animalName}</h3>
          <div className="flex items-center text-sm text-muted-foreground mt-1">
            <Calendar className="h-4 w-4 mr-2" />
            <span>{formatDate(evaluation.date)}</span>
          </div>
        </div>
        <div className="flex items-center">
          <Star className="h-5 w-5 text-yellow-500 mr-1" />
          <span className={`font-semibold ${getScoreColor(evaluation.overallScore)}`}>
            {evaluation.overallScore.toFixed(1)}
          </span>
        </div>
      </div>

      {/* Scores Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {Object.entries(evaluation.scores).map(([category, score]) => (
          <div key={category} className="text-sm">
            <div className="flex justify-between items-center mb-1">
              <span className="text-muted-foreground capitalize">
                {category.replace(/([A-Z])/g, ' $1').trim()}
              </span>
              <span className={getScoreColor(score)}>{score.toFixed(1)}</span>
            </div>
            <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-600"
                style={{ width: `${(score / 10) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Photos and Notes */}
      <div className="space-y-2">
        {evaluation.images.length > 0 && (
          <div className="flex items-center text-sm text-muted-foreground">
            <Camera className="h-4 w-4 mr-2" />
            <span>{evaluation.images.length} photos</span>
          </div>
        )}

        {evaluation.notes && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {evaluation.notes}
          </p>
        )}
      </div>

      {/* Actions */}
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