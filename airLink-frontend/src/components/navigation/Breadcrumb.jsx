import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const Breadcrumb = ({ items, className = '' }) => {
  const navigate = useNavigate();

  const handleItemClick = (item) => {
    if (item.href && !item.disabled) {
      navigate(item.href);
    }
  };

  return (
    <nav className={cn('flex items-center space-x-1 text-sm', className)}>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <div className="flex items-center">
            {item.icon && (
              <item.icon className="h-4 w-4 mr-1" />
            )}
            {item.href && !item.disabled ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleItemClick(item)}
                className={cn(
                  'h-auto p-0 font-normal hover:bg-transparent',
                  index === items.length - 1
                    ? 'text-foreground font-medium'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {item.label}
              </Button>
            ) : (
              <span
                className={cn(
                  index === items.length - 1
                    ? 'text-foreground font-medium'
                    : 'text-muted-foreground',
                  item.disabled && 'opacity-50'
                )}
              >
                {item.label}
              </span>
            )}
          </div>
          {index < items.length - 1 && (
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

// Helper function to create common breadcrumb structures
export const createFlightInstanceBreadcrumbs = (flightInstanceId, additionalItems = []) => {
  const baseBreadcrumbs = [
    {
      label: 'Dashboard',
      href: '/airline',
      icon: Home
    },
    {
      label: 'Flight Instances',
      href: '/airline/instances'
    },
    {
      label: `Instance ${flightInstanceId}`,
      href: `/airline/instances/${flightInstanceId}`
    }
  ];

  return [...baseBreadcrumbs, ...additionalItems];
};

export const createFlightCabinBreadcrumbs = (flightInstanceId, cabinId, additionalItems = []) => {
  const baseBreadcrumbs = createFlightInstanceBreadcrumbs(flightInstanceId, [
    {
      label: 'Cabins',
      href: `/airline/instances/${flightInstanceId}#cabins`
    }
  ]);

  if (cabinId) {
    baseBreadcrumbs.push({
      label: `Cabin ${cabinId}`,
      href: `/airline/instances/${flightInstanceId}/cabins/${cabinId}`
    });
  }

  return [...baseBreadcrumbs, ...additionalItems];
};

export default Breadcrumb;