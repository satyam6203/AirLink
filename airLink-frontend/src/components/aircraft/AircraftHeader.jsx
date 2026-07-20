import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plane, Calendar, MapPin, Settings, Edit } from 'lucide-react';

const AircraftHeader = ({ aircraft, onEdit }) => {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      case 'retired':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Plane className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-2xl">{aircraft.code}</CardTitle>
              <p className="text-gray-600">{aircraft.model} • {aircraft.manufacturer}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Badge className={getStatusColor(aircraft.status)}>
              {aircraft.status || 'Unknown'}
            </Badge>
            <Button onClick={onEdit} variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit Aircraft
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 flex items-center">
              <Settings className="h-4 w-4 mr-2" />
              Basic Information
            </h3>
            <div className="space-y-2">
              <div>
                <p className="text-sm text-gray-500">Registration</p>
                <p className="font-medium">{aircraft.registrationNumber || aircraft.code}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Year</p>
                <p className="font-medium">{aircraft.yearOfManufacture || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Configuration</p>
                <p className="font-medium">{aircraft.configuration || 'Standard'}</p>
              </div>
            </div>
          </div>

          {/* Capacity */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Seating Capacity</h3>
            <div className="space-y-2">
              <div>
                <p className="text-sm text-gray-500">Total Seats</p>
                <p className="font-medium text-xl">{aircraft.seatingCapacity || aircraft.totalSeats || 0}</p>
              </div>
              <div className="text-sm space-y-1">
                {aircraft.firstClassSeats > 0 && (
                  <p>First: <span className="font-medium">{aircraft.firstClassSeats}</span></p>
                )}
                {aircraft.businessSeats > 0 && (
                  <p>Business: <span className="font-medium">{aircraft.businessSeats}</span></p>
                )}
                {aircraft.premiumEconomySeats > 0 && (
                  <p>Premium Economy: <span className="font-medium">{aircraft.premiumEconomySeats}</span></p>
                )}
                {aircraft.economySeats > 0 && (
                  <p>Economy: <span className="font-medium">{aircraft.economySeats}</span></p>
                )}
              </div>
            </div>
          </div>

          {/* Performance */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Performance</h3>
            <div className="space-y-2">
              <div>
                <p className="text-sm text-gray-500">Range</p>
                <p className="font-medium">{aircraft.rangeKm ? `${aircraft.rangeKm.toLocaleString()} km` : 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Cruising Speed</p>
                <p className="font-medium">{aircraft.cruisingSpeedKmh ? `${aircraft.cruisingSpeedKmh} km/h` : 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Max Altitude</p>
                <p className="font-medium">{aircraft.maxAltitudeFt ? `${aircraft.maxAltitudeFt.toLocaleString()} ft` : 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Status & Dates */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              Important Dates
            </h3>
            <div className="space-y-2">
              <div>
                <p className="text-sm text-gray-500">Registration Date</p>
                <p className="font-medium">{formatDate(aircraft.registrationDate)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Next Maintenance</p>
                <p className="font-medium">{formatDate(aircraft.nextMaintenanceDate)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Last Updated</p>
                <p className="font-medium">{formatDate(aircraft.updatedAt || aircraft.createdAt)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Location & Availability */}
        {(aircraft.currentLocation || aircraft.isAvailable !== undefined) && (
          <div className="mt-6 pt-6 border-t">
            <div className="flex flex-col md:flex-row md:items-center justify-between space-y-2 md:space-y-0">
              {aircraft.currentLocation && (
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>Current Location: <span className="font-medium">{aircraft.currentLocation}</span></span>
                </div>
              )}
              {aircraft.isAvailable !== undefined && (
                <div className="flex items-center">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    aircraft.isAvailable
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {aircraft.isAvailable ? 'Available for Scheduling' : 'Not Available'}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AircraftHeader;