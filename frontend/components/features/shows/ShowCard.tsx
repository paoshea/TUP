import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users, Edit, Trash } from 'lucide-react';
import type { Show } from '@/lib/types/mock';

interface ShowCardProps {
  show: Show;
  onEdit?: (show: Show) => void;
  onDelete?: (show: Show) => void;
  onClick?: (show: Show) => void;
}

export function ShowCard({ show, onEdit, onDelete, onClick }: ShowCardProps) {
  const handleClick = () => {
    if (onClick) onClick(show);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) onEdit(show);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) onDelete(show);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-GB', {
      weekday: 'long',
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
          <h3 className="font-semibold text-lg">{show.name}</h3>
          <div className="flex items-center text-sm text-muted-foreground mt-1">
            <Calendar className="h-4 w-4 mr-2" />
            <span>{formatDate(show.date)}</span>
          </div>
        </div>
        <Badge className={getStatusColor(show.status)}>
          {show.status}
        </Badge>
      </div>

      <div className="space-y-2">
        <div className="flex items-center text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 mr-2" />
          <span>{show.location}</span>
        </div>

        <div className="flex items-center text-sm text-muted-foreground">
          <Users className="h-4 w-4 mr-2" />
          <span>Entries: {show.entryCount} / {show.maxEntries}</span>
        </div>

        {show.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
            {show.description}
          </p>
        )}
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