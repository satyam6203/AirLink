import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import SeatMapForm from '@/components/seatMap/SeatMapForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Grid3X3 } from 'lucide-react';

const SeatMapCreate = () => {
  const { aircraftId, cabinId } = useParams();
  const navigate = useNavigate();

  const { cabinClasses } = useSelector(state => state.cabinClass);
  const { currentAircraft } = useSelector(state => state.aircraft);

  // Find the specific cabin
  const cabin = cabinClasses.find(c => c.id === parseInt(cabinId));

  const handleSuccess = (result) => {
    console.log('Seat map created successfully:', result);
    // Navigate back to aircraft detail page
    navigate(`/airline/aircraft/${aircraftId}`);
  };

  const handleCancel = () => {
    navigate(`/airline/aircraft/${aircraftId}`);
  };

  if (!cabin) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Cabin Not Found</h2>
              <p className="text-gray-600 mb-4">The requested cabin could not be found.</p>
              <Button onClick={() => navigate(`/airline/aircraft/${aircraftId}`)}>
                Back to Aircraft
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Navigation */}
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          onClick={() => navigate(`/airline/aircraft/${aircraftId}`)}
          className="flex items-center"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Aircraft
        </Button>
        <div className="text-sm text-gray-500">
          / Aircraft / {currentAircraft?.code} / {cabin.name} / Create Seat Map
        </div>
      </div>

      {/* Page Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center">
            <Grid3X3 className="h-6 w-6 mr-3 text-blue-600" />
            <div>
              <CardTitle className="text-2xl">Create Seat Map</CardTitle>
              <p className="text-gray-600 mt-1">
                Configure the seat layout for <span className="font-medium">{cabin.name}</span> cabin class
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Aircraft</p>
              <p className="font-medium">{currentAircraft?.code || 'Unknown'}</p>
            </div>
            <div>
              <p className="text-gray-500">Cabin Class</p>
              <p className="font-medium">{cabin.name}</p>
            </div>
            <div>
              <p className="text-gray-500">Cabin Code</p>
              <p className="font-medium">{cabin.code}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Seat Map Form */}
      <SeatMapForm
        isEdit={false}
        cabinClassId={cabin.id}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default SeatMapCreate;