import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import {
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  LayoutGrid,
  Plus,
  DollarSign,
  Settings,
  Copy
} from 'lucide-react';
import { cn } from '@/lib/utils';

const CabinQuickActions = ({
  flightId, // For flight-level cabins
  flightInstanceId, // For flight instance-level operations
  cabinId,
  cabin,
  variant = 'default', // 'default', 'minimal', 'dropdown'
  className = '',
  onDelete,
  showSeats = true,
  level = 'instances' // 'flight' or 'instance'
}) => {
  const navigate = useNavigate();

  const baseUrl = level === 'flight'
    ? `/airline/flights/${flightId}/cabins`
    : `/airline/instances/${flightInstanceId}/cabins`;

  const actions = [
    {
      key: 'view',
      label: 'View Details',
      icon: Eye,
      onClick: () => navigate(`${baseUrl}/${cabinId}`),
      variant: 'default'
    },
    {
      key: 'edit',
      label: 'Edit Cabin',
      icon: Edit,
      onClick: () => navigate(`${baseUrl}/${cabinId}/edit`),
      variant: 'outline'
    },

    
    {
      key: 'delete',
      label: 'Delete Cabin',
      icon: Trash2,
      onClick: () => {
        if (onDelete) {
          onDelete(cabinId);
        } else {
          const confirmed = window.confirm('Are you sure you want to delete this cabin?');
          if (confirmed) {
            // TODO: Implement delete functionality
            console.log('Delete cabin functionality to be implemented');
          }
        }
      },
      variant: 'destructive',
      destructive: true
    }
  ];

  const visibleActions = actions.filter(action => action.show !== false);

  if (variant === 'dropdown') {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className={cn('h-8 w-8 p-0', className)}>
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {visibleActions.map((action, index) => (
            <React.Fragment key={action.key}>
              <DropdownMenuItem
                onClick={action.onClick}
                className={cn(
                  'flex items-center gap-2',
                  action.destructive && 'text-red-600 focus:text-red-600'
                )}
              >
                <action.icon className="h-4 w-4" />
                {action.label}
              </DropdownMenuItem>
              {(action.key === 'fares' || action.key === 'copy') && index < visibleActions.length - 1 && (
                <DropdownMenuSeparator />
              )}
            </React.Fragment>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  if (variant === 'minimal') {
    return (
      <div className={cn('flex items-center gap-1', className)}>
        <Button
          size="sm"
          onClick={() => navigate(`/airline/instances/${flightInstanceId}/cabins/${cabinId}`)}
          className="flex-1"
        >
          <Eye className="h-4 w-4 mr-1" />
          View
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(`/airline/instances/${flightInstanceId}/cabins/${cabinId}/edit`)}
        >
          <Edit className="h-4 w-4" />
        </Button>
        <CabinQuickActions
          flightId={flightId}
          flightInstanceId={flightInstanceId}
          cabinId={cabinId}
          cabin={cabin}
          variant="dropdown"
          onDelete={onDelete}
          showSeats={showSeats}
          level={level}
        />
      </div>
    );
  }

  // Default variant - full buttons
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <Button
        onClick={() => navigate(`${baseUrl}/${cabinId}`)}
        className="w-full"
      >
        <Eye className="h-4 w-4 mr-2" />
        View Cabin Details
      </Button>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(`${baseUrl}/${cabinId}/edit`)}
          className="flex-1"
        >
          <Edit className="h-4 w-4 mr-1" />
          Edit
        </Button>

        <CabinQuickActions
          flightId={flightId}
          flightInstanceId={flightInstanceId}
          cabinId={cabinId}
          cabin={cabin}
          variant="dropdown"
          onDelete={onDelete}
          showSeats={showSeats}
          level={level}
        />
      </div>
    </div>
  );
};

// Factory function for creating cabin navigation
export const createCabinNavigation = (flightId, flightInstanceId, level = 'flight') => {
  const baseUrl = level === 'flight'
    ? `/airline/flights/${flightId}/cabins`
    : `/airline/instances/${flightInstanceId}/cabins`;

  return {
    createNew: () => `${baseUrl}/new`,
    viewCabin: (cabinId) => `${baseUrl}/${cabinId}`,
    editCabin: (cabinId) => `${baseUrl}/${cabinId}/edit`,

    manageFares: (cabinId) => `${baseUrl}/${cabinId}#fares`,
    backToParent: () => level === 'flight' ? `/airline/flights/${flightId}` : `/airline/instances/${flightInstanceId}`,
  };
};

export default CabinQuickActions;