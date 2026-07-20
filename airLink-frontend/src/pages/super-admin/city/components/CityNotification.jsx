import React from 'react';
import { Check, AlertTriangle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CityNotification = ({ notification, onClose }) => {
  if (!notification) return null;

  const { type, message } = notification;

  const getNotificationStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border border-green-200 text-green-800';
      case 'error':
        return 'bg-red-50 border border-red-200 text-red-800';
      case 'warning':
        return 'bg-yellow-50 border border-yellow-200 text-yellow-800';
      default:
        return 'bg-blue-50 border border-blue-200 text-blue-800';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <Check className="w-5 h-5" />;
      case 'error':
      case 'warning':
        return <AlertTriangle className="w-5 h-5" />;
      default:
        return <Check className="w-5 h-5" />;
    }
  };

  return (
    <div
      className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center gap-2 transition-all duration-300 ${getNotificationStyles()}`}
    >
      {getIcon()}
      <span className="flex-1">{message}</span>
      <Button
        variant="ghost"
        size="sm"
        onClick={onClose}
        className="h-auto p-1 hover:bg-transparent"
      >
        <X className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default CityNotification;