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
    const dateObj = new Date(date);
    // Use shorter format on mobile
    const mobileFormat = {
      month: 'short' as const,
      day: 'numeric' as const,
      year: 'numeric' as const
    };
    // Full format on larger screens
    const desktopFormat = {
      weekday: 'long' as const,
      day: 'numeric' as const,
      month: 'long' as const,
      year: 'numeric' as const
    };

    return (
      <span className="hidden sm:inline">
        {dateObj.toLocaleDateString('en-GB', desktopFormat)}
        <span className="sm:hidden">
          {dateObj.toLocaleDateString('en-GB', mobileFormat)}
        </span>
      </span>
    );
  };

  return (
    <Card 
      className={`p-4 sm:p-6 hover:shadow-md transition-shadow ${onClick ? 'cursor-pointer' : ''}`}
      onClick={handleClick}
    >
      <div className="flex flex-col sm:flex-row justify-between items-start gap-2 sm:gap-4 mb-4">
        <div className="w-full sm:w-auto">
          <h3 className="font-semibold text-base sm:text-lg mb-1">{show.name}</h3>
          <div className="flex items-center text-xs sm:text-sm text-muted-foreground mt-1">
            <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
            {formatDate(show.date)}
          </div>
        </div>
        <Badge 
          className={`${getStatusColor(show.status)} text-xs sm:text-sm px-2 py-1`}
        >
          {show.status}
        </Badge>
      </div>

      <div className="space-y-3 sm:space-y-4">
        <div className="flex items-center text-xs sm:text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
          <span className="truncate">{show.location}</span>
        </div>

        <div className="flex items-center text-xs sm:text-sm text-muted-foreground">
          <Users className="h-4 w-4 mr-2 flex-shrink-0" />
          <span>Entries: {show.entryCount} / {show.maxEntries}</span>
        </div>

        {show.description && (
          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mt-2">
            {show.description}
          </p>
        )}
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