import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Edit, PlaneTakeoff, Calendar, MapPin, Armchair } from 'lucide-react';

const AircraftCard = ({ aircraft, onEdit, onView }) => {
  // Helper function to get status badge color
  const getStatusBadge = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'IN_MAINTENANCE':
        return 'bg-amber-100 text-amber-800';
      case 'GROUNDED':
        return 'bg-red-100 text-red-800';
      case 'DELIVERED':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Helper function to get availability badge
  const getAvailabilityBadge = (isAvailable) => {
    return isAvailable 
      ? 'bg-emerald-100 text-emerald-800' 
      : 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="border rounded-md bg-white hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="text-4xl">✈️</div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{aircraft?.code} - {aircraft?.model}</h3>
              <p className="text-sm text-gray-600">{aircraft?.manufacturer} • {aircraft?.yearOfManufacture}</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge className={`${getStatusBadge(aircraft?.status)}`}>
                  {aircraft?.status}
                </Badge>
                <Badge className={`${getAvailabilityBadge(aircraft?.isAvailable)}`}>
                  {aircraft?.isAvailable ? 'Available' : 'Not Available'}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Armchair className="h-4 w-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">Capacity</span>
            </div>
            <div className="text-sm">
              <div className="font-medium">{aircraft?.totalSeats} seats</div>
              <div className="text-gray-600">
                Eco: {aircraft?.economySeats}, Bus: {aircraft?.businessSeats}
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <PlaneTakeoff className="h-4 w-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">Performance</span>
            </div>
            <div className="text-sm">
              <div className="font-medium">{aircraft?.rangeKm} km range</div>
              <div className="text-gray-600">
                {aircraft?.cruisingSpeedKmh} km/h cruise
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">Maintenance</span>
            </div>
            <div className="text-sm">
              <div className="font-medium">
                {aircraft?.nextMaintenanceDate && 
                  new Date(aircraft?.nextMaintenanceDate).toLocaleDateString()
                }
              </div>
              <div className="text-gray-600">
                {aircraft?.requiresMaintenance ? 'Required' : 'Up to date'}
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="h-4 w-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">Location</span>
            </div>
            <div className="text-sm">
              <div className="font-medium">
                {aircraft?.currentAirportName || 'Not assigned'}
              </div>
              <div className="text-gray-600">
                {aircraft?.currentAirportCode || '-'}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="text-sm text-gray-500">
            {aircraft?.createdAt && 
              `Registered: ${new Date(aircraft?.createdAt).toLocaleDateString()}`
            }
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => onView(aircraft)}>
              <Eye className="h-3 w-3 mr-1" />
              View
            </Button>
            <Button size="sm" onClick={() => onEdit(aircraft)}>
              <Edit className="h-3 w-3 mr-1" />
              Edit
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AircraftCard;