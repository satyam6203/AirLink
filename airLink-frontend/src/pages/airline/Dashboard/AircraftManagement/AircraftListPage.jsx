import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AircraftTable from '@/components/aircraft/AircraftTable';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Plane } from 'lucide-react';

const AircraftListPage = () => {
  const navigate = useNavigate();

  const handleViewDetails = (aircraft) => {
    navigate(`/airline/aircraft/${aircraft.id}`);
  };

  const handleEdit = (aircraft) => {
    navigate(`/airline/aircraft/${aircraft.id}/edit`);
  };

  const handleDelete = (aircraft) => {
    // This would typically open a confirmation dialog
    console.log('Delete aircraft:', aircraft);
  };

  const handleCreateAircraft = () => {
    navigate('/airline/aircraft/new');
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <Plane className="h-8 w-8 mr-3" />
            Aircraft Management
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your airline's fleet of aircraft, cabin configurations, and seat layouts
          </p>
        </div>

        <Button onClick={handleCreateAircraft} size="lg">
          <Plus className="h-5 w-5 mr-2" />
          Add New Aircraft
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">24</p>
              <p className="text-sm text-gray-600">Total Aircraft</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">18</p>
              <p className="text-sm text-gray-600">Active</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">4</p>
              <p className="text-sm text-gray-600">Maintenance</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">4,280</p>
              <p className="text-sm text-gray-600">Total Seats</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Aircraft Table */}
      <AircraftTable
        onViewDetails={handleViewDetails}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default AircraftListPage;