import React from 'react';
import { Button } from '@/components/ui/button';

export const EmptyState = ({
  icon: Icon,
  title,
  description,
  action,
  actionText = "Get Started",
  className = ""
}) => {
  return (
    <div className={`flex flex-col items-center justify-center py-12 text-center space-y-4 ${className}`}>
      {Icon && (
        <div className="text-gray-400 mb-4">
          <Icon className="w-16 h-16" />
        </div>
      )}

      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="text-gray-500 max-w-md mx-auto">{description}</p>
      </div>

      {action && (
        <Button onClick={action} className="mt-6">
          {actionText}
        </Button>
      )}
    </div>
  );
};