import React from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const CityDeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  city,
  isLoading = false
}) => {
  if (!city) return null;

  const handleConfirm = () => {
    onConfirm(city.id);
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="w-5 h-5" />
            Delete City
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <p className="text-gray-600">
            Are you sure you want to delete the city{' '}
            <span className="font-semibold">{city.name}</span> ({city.cityCode})?
          </p>
          <p className="text-sm text-gray-500 mt-2">
            This action cannot be undone. All associated data will be permanently removed.
          </p>
        </div>

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Delete City
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CityDeleteModal;