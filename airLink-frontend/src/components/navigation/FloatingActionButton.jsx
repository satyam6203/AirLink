import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Plus, Plane, Users, DollarSign, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const FloatingActionButton = ({
  items = [],
  className = '',
  position = 'bottom-right' // 'bottom-right', 'bottom-left', 'top-right', 'top-left'
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const positionClasses = {
    'bottom-right': 'fixed bottom-6 right-6',
    'bottom-left': 'fixed bottom-6 left-6',
    'top-right': 'fixed top-6 right-6',
    'top-left': 'fixed top-6 left-6'
  };

  if (items.length === 0) return null;

  if (items.length === 1) {
    const item = items[0];
    return (
      <Button
        onClick={item.onClick}
        className={cn(
          'h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 z-50',
          'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700',
          positionClasses[position],
          className
        )}
        size="lg"
      >
        <item.icon className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <div className={cn(positionClasses[position], 'z-50', className)}>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            className={cn(
              'h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200',
              'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700',
              isOpen && 'rotate-45'
            )}
            size="lg"
          >
            <Plus className="h-6 w-6" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align={position.includes('right') ? 'end' : 'start'}
          side={position.includes('bottom') ? 'top' : 'bottom'}
          className="w-48 mb-2"
        >
          {items.map((item, index) => (
            <React.Fragment key={item.key || index}>
              <DropdownMenuItem
                onClick={() => {
                  item.onClick();
                  setIsOpen(false);
                }}
                className="flex items-center gap-3 py-3"
              >
                <item.icon className="h-4 w-4" />
                <div>
                  <div className="font-medium">{item.label}</div>
                  {item.description && (
                    <div className="text-xs text-muted-foreground">{item.description}</div>
                  )}
                </div>
              </DropdownMenuItem>
              {item.separator && index < items.length - 1 && <DropdownMenuSeparator />}
            </React.Fragment>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

// Preset configurations for common use cases
export const CabinManagementFAB = ({
  flightInstanceId,
  onCreateCabin,
  onManageSeats,
  onManageFares,
  className = ''
}) => {
  const items = [
    {
      key: 'cabin',
      label: 'New Cabin',
      description: 'Create cabin configuration',
      icon: Plane,
      onClick: () => onCreateCabin(flightInstanceId),
      separator: true
    },
    {
      key: 'seats',
      label: 'Manage Seats',
      description: 'Configure seat layouts',
      icon: Users,
      onClick: () => onManageSeats && onManageSeats()
    },
    {
      key: 'fares',
      label: 'Manage Fares',
      description: 'Configure pricing',
      icon: DollarSign,
      onClick: () => onManageFares && onManageFares()
    }
  ];

  return (
    <FloatingActionButton
      items={items.filter(item => item.onClick)}
      className={className}
    />
  );
};

export default FloatingActionButton;