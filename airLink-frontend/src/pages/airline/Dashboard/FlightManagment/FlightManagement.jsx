import React from 'react';
import { useDispatch } from 'react-redux';
import { Plus, Search, Filter, Calendar, Grid, List } from 'lucide-react';
import { deleteFlight, getFlightsByAirline } from '@/Redux/flight/flightThunk';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import FlightCard from './FlightCard';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const FlightManagement = () => {
  const dispatch = useDispatch();

  const navigate=useNavigate();
  const {flights}=useSelector(state=>state.flight)
 





 

  const handleDeleteFlight = async (flightId) => {
    try {
      await dispatch(deleteFlight(flightId)).unwrap();
      // Refresh flights list
      dispatch(getFlightsByAirline());
      console.log('Flight deleted successfully:', flightId);
    } catch (error) {
      console.error('Error deleting flight:', error);
      // TODO: Show error notification
    }
  };

  const handleAddNewFlight = () => {
    navigate('/airline/flights/new');
  };

  const handleViewFlight = (flight) => {
    navigate(`/airline/flights/${flight.id}`);
  };

  const handleEditFlight = (flight) => {
    navigate(`/airline/flights/${flight.id}/edit`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Flight Management</h2>
          <p className="text-muted-foreground">Manage your flight schedules and operations</p>
        </div>
        <Button onClick={handleAddNewFlight} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add New Flight
        </Button>
      </div>


      {/* Flight Cards Grid */}
      {flights.length === 0 ? (
        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="text-muted-foreground mb-2">No flights found</div>
              <div className="text-sm text-muted-foreground">
                {flights.length === 0
                  ? "Start by adding your first flight"
                  : "Try adjusting your search criteria"
                }
              </div>
              {flights.length === 0 && (
                <Button onClick={handleAddNewFlight} className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Flight
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className={
          "space-y-4"
        }>
          {flights.map((flight) => (
            <FlightCard
              key={flight.id || flight.flightNumber}
              flight={flight}
              onEdit={handleEditFlight}
              onDelete={handleDeleteFlight}
              onView={handleViewFlight}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FlightManagement;