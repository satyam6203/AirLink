import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

export const Loader = ({ message = "Loading...", size = "default" }) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    default: "w-8 h-8",
    lg: "w-12 h-12"
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col items-center justify-center py-8 space-y-4">
          <div className={`${sizeClasses[size]} animate-spin rounded-full border-4 border-gray-300 border-t-blue-600`}></div>
          <p className="text-gray-600 text-center">{message}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export const SpinnerLoader = ({ size = "default", className = "" }) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    default: "w-6 h-6",
    lg: "w-8 h-8"
  };

  return (
    <div className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 ${className}`}></div>
  );
};