import React, { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { listAllAircrafts, deleteAircraft } from '@/Redux/aircraft/aircraftThunks';
import AircraftTable from '@/components/aircraft/AircraftTable';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Plane, CheckCircle2, Wrench, Users } from 'lucide-react';

const AircraftListPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { aircrafts = [], loading } = useSelector(state => state.aircraft || {});

  useEffect(() => {
    dispatch(listAllAircrafts());
  }, [dispatch]);

  const rawAircraftList = Array.isArray(aircrafts) ? aircrafts : [];

  const stats = useMemo(() => {
    const totalAircraft = rawAircraftList.length;
    const active = rawAircraftList.filter(
      a => String(a.status || '').toUpperCase() === 'ACTIVE'
    ).length;
    const maintenance = rawAircraftList.filter(
      a => String(a.status || '').toUpperCase() === 'MAINTENANCE'
    ).length;
    const totalSeats = rawAircraftList.reduce(
      (sum, a) => sum + Number(a.seatingCapacity || a.totalSeats || 0),
      0
    );

    return { totalAircraft, active, maintenance, totalSeats };
  }, [rawAircraftList]);

  const handleViewDetails = (aircraft) => {
    navigate(`/airline/aircraft/${aircraft.id}`);
  };

  const handleEdit = (aircraft) => {
    navigate(`/airline/aircraft/${aircraft.id}/edit`);
  };

  const handleDelete = async (aircraft) => {
    const confirmMessage = `Are you sure you want to delete aircraft "${aircraft.code}" (${aircraft.manufacturer} ${aircraft.model})?`;
    if (window.confirm(confirmMessage)) {
      try {
        await dispatch(deleteAircraft(aircraft.id)).unwrap();
        dispatch(listAllAircrafts());
      } catch (err) {
        console.error('Delete aircraft error:', err);
        alert(typeof err === 'string' ? err : 'Failed to delete aircraft');
      }
    }
  };

  const handleCreateAircraft = () => {
    navigate('/airline/aircraft/new');
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold flex items-center text-foreground">
            <Plane className="h-8 w-8 mr-3 text-primary" />
            Aircraft Management
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Manage your airline's fleet of aircraft, cabin configurations, and seat layouts
          </p>
        </div>

        <Button onClick={handleCreateAircraft} size="lg" className="shadow-sm">
          <Plus className="h-5 w-5 mr-2" />
          Add New Aircraft
        </Button>
      </div>

      {/* Dynamic Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Aircraft */}
        <Card className="border border-blue-200 dark:border-blue-900 bg-gradient-to-br from-blue-50/70 to-blue-100/50 dark:from-blue-950/40 dark:to-blue-900/20 shadow-sm">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-blue-700 dark:text-blue-300 uppercase tracking-wider">Total Aircraft</p>
              <p className="text-3xl font-extrabold text-blue-600 dark:text-blue-400 mt-1">{stats.totalAircraft}</p>
            </div>
            <div className="w-11 h-11 rounded-full bg-blue-500/10 dark:bg-blue-400/20 flex items-center justify-center text-blue-600 dark:text-blue-300">
              <Plane className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        {/* Active Aircraft */}
        <Card className="border border-green-200 dark:border-green-900 bg-gradient-to-br from-green-50/70 to-green-100/50 dark:from-green-950/40 dark:to-green-900/20 shadow-sm">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-green-700 dark:text-green-300 uppercase tracking-wider">Active</p>
              <p className="text-3xl font-extrabold text-green-600 dark:text-green-400 mt-1">{stats.active}</p>
            </div>
            <div className="w-11 h-11 rounded-full bg-green-500/10 dark:bg-green-400/20 flex items-center justify-center text-green-600 dark:text-green-300">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        {/* Maintenance */}
        <Card className="border border-amber-200 dark:border-amber-900 bg-gradient-to-br from-amber-50/70 to-amber-100/50 dark:from-amber-950/40 dark:to-amber-900/20 shadow-sm">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-amber-700 dark:text-amber-300 uppercase tracking-wider">Maintenance</p>
              <p className="text-3xl font-extrabold text-amber-600 dark:text-amber-400 mt-1">{stats.maintenance}</p>
            </div>
            <div className="w-11 h-11 rounded-full bg-amber-500/10 dark:bg-amber-400/20 flex items-center justify-center text-amber-600 dark:text-amber-300">
              <Wrench className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        {/* Total Seats */}
        <Card className="border border-purple-200 dark:border-purple-900 bg-gradient-to-br from-purple-50/70 to-purple-100/50 dark:from-purple-950/40 dark:to-purple-900/20 shadow-sm">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-purple-700 dark:text-purple-300 uppercase tracking-wider">Total Seats</p>
              <p className="text-3xl font-extrabold text-purple-600 dark:text-purple-400 mt-1">{stats.totalSeats.toLocaleString('en-IN')}</p>
            </div>
            <div className="w-11 h-11 rounded-full bg-purple-500/10 dark:bg-purple-400/20 flex items-center justify-center text-purple-600 dark:text-purple-300">
              <Users className="w-6 h-6" />
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
