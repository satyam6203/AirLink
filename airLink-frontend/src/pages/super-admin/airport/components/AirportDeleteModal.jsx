import React from 'react';
import { AlertTriangle, Loader2, Plane, MapPin, Clock } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const AirportDeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  airport,
  isLoading = false
}) => {
  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  const handleConfirm = () => {
    if (airport && !isLoading) {
      onConfirm(airport.id);
    }
  };

  if (!airport) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="w-5 h-5" />
            Confirm Deletion
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-gray-700">
            Are you sure you want to delete this airport?
          </p>

          {/* Airport Preview Card */}
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg space-y-3">
            <div className="flex items-center gap-3">
              <Plane className="w-5 h-5 text-blue-600" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-gray-900">{airport.name}</span>
                  <Badge variant="secondary" className="font-mono">
                    {airport.iataCode}
                  </Badge>
                </div>
                {airport.detailedName && (
                  <p className="text-sm text-gray-600">{airport.detailedName}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-600">
              {airport.city?.name && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  <span>{airport.city.name}</span>
                  {airport.address?.countryName && (
                    <span>, {airport.address.countryName}</span>
                  )}
                </div>
              )}

              {airport.timeZone && (
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{airport.timeZone}</span>
                </div>
              )}
            </div>

            {airport.geoCode?.latitude && airport.geoCode?.longitude && (
              <div className="text-sm text-gray-600">
                <span>Coordinates: {airport.geoCode.latitude.toFixed(4)}, {airport.geoCode.longitude.toFixed(4)}</span>
              </div>
            )}
          </div>

          {/* Warning Message */}
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-amber-800 mb-1">Warning: This action cannot be undone</p>
                <p className="text-amber-700">
                  Any flights, routes, or schedules associated with this airport may be affected.
                  Please ensure this airport is not currently in use before proceeding.
                </p>
              </div>
            </div>
          </div>
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
            {isLoading && (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            )}
            Delete Airport
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

AirportDeleteModal.displayName = 'AirportDeleteModal';

export default AirportDeleteModal;