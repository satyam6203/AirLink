import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAircraftById } from '@/Redux/aircraft/aircraftThunks';
import { getCabinClassesByAircraft } from '@/Redux/cabinClass/cabinClassThunk';
import AircraftHeader from '@/components/aircraft/AircraftHeader';
import CabinCard from '@/components/aircraft/CabinCard';
import SeatConfigDrawer from '@/components/aircraft/SeatConfigDrawer';
import { Loader } from '@/components/common/Loader';
import { EmptyState } from '@/components/common/EmptyState';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, Grid3X3, Settings } from 'lucide-react';

const AircraftDetail = () => {
  const { aircraftId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { currentAircraft, loading: aircraftLoading } = useSelector(state => state.aircraft);
  const { cabinClasses, loading: cabinLoading } = useSelector(state => state.cabinClass);

  const [selectedSeat, setSelectedSeat] = useState(null);
  const [showSeatDrawer, setShowSeatDrawer] = useState(false);

  useEffect(() => {
    if (aircraftId) {
      dispatch(getAircraftById(aircraftId));
      dispatch(getCabinClassesByAircraft(aircraftId));
    }
  }, [dispatch, aircraftId]);

  const handleEditAircraft = () => {
    navigate(`/airline/aircraft/${aircraftId}/edit`);
  };

  const handleViewSeatmap = (cabin) => {
    navigate(`/airline/aircraft/${aircraftId}/cabin/${cabin.id}/seat-map/${cabin.seatMapId || 'view'}`);
  };

  const handleEditCabin = (cabin) => {
    navigate(`/airline/aircraft/${aircraftId}/cabin/${cabin.id}/edit`);
  };

  const handleCreateSeatMap = (cabin) => {
    navigate(`/airline/aircraft/${aircraftId}/cabin/${cabin.id}/seat-map/create`);
  };



  const handleSeatSave = async (seatData) => {
    try {
      // Dispatch seat update thunk here
      console.log('Saving seat data:', seatData);
      // await dispatch(updateSeat(seatData));
      setShowSeatDrawer(false);
    } catch (error) {
      console.error('Error saving seat:', error);
    }
  };

  const handleCreateCabin = () => {
    navigate(`/airline/aircraft/${aircraftId}/cabin/new`);
  };

  if (aircraftLoading && !currentAircraft) {
    return <Loader message="Loading aircraft details..." />;
  }

  if (!currentAircraft && !aircraftLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6">
            <EmptyState
              title="Aircraft Not Found"
              description="The requested aircraft could not be found."
              action={() => navigate('/airline/aircraft')}
              actionText="Back to Aircraft List"
            />
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
          onClick={() => navigate('/airline/aircraft')}
          className="flex items-center"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Aircraft
        </Button>
        <div className="text-sm text-gray-500">
          / Aircraft / {currentAircraft?.code}
        </div>
      </div>

      {/* Aircraft Header */}
      <AircraftHeader
        aircraft={currentAircraft}
        onEdit={handleEditAircraft}
      />

      {/* Cabin Classes Section */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center">
                <Grid3X3 className="h-5 w-5 mr-2" />
                Cabin Configuration
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Manage cabin classes and seat configurations
              </p>
            </div>
            <Button onClick={handleCreateCabin}>
              <Plus className="h-4 w-4 mr-2" />
              Add Cabin
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {cabinLoading ? (
            <div className="flex justify-center py-8">
              <Loader message="Loading cabin configuration..." />
            </div>
          ) : cabinClasses.length === 0 ? (
            <EmptyState
              icon={Grid3X3}
              title="No Cabin Classes Configured"
              description="This aircraft doesn't have any cabin classes configured yet. Add a cabin class to start managing seats."
              action={handleCreateCabin}
              actionText="Add First Cabin"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cabinClasses.map((cabin) => (
                <CabinCard
                  key={cabin.id}
                  cabin={cabin}
                  onViewSeatmap={handleViewSeatmap}
                  onEdit={handleEditCabin}
                  onCreateSeatMap={handleCreateSeatMap}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>


      {/* Seat Configuration Drawer */}
      <SeatConfigDrawer
        isOpen={showSeatDrawer}
        onClose={() => setShowSeatDrawer(false)}
        seat={selectedSeat}
        onSave={handleSeatSave}
      />

      {/* Summary Stats */}
      {currentAircraft && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold">
                  {currentAircraft.seatingCapacity || currentAircraft.totalSeats || 0}
                </p>
                <p className="text-sm text-gray-600">Total Seats</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold">{cabinClasses.length}</p>
                <p className="text-sm text-gray-600">Cabin Classes</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold">
                  {currentAircraft.rangeKm ? `${currentAircraft.rangeKm.toLocaleString()}` : 'N/A'}
                </p>
                <p className="text-sm text-gray-600">Range (km)</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold">
                  {currentAircraft.isAvailable ? 'Available' : 'Unavailable'}
                </p>
                <p className="text-sm text-gray-600">Status</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AircraftDetail;