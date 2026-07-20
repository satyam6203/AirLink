import React, { useState } from 'react';
import { useDispatch} from 'react-redux';
import {
  ArrowLeft,
  LayoutGrid,
  Table,
  Eye,
  Plane,
  Users,
  DollarSign,
  TrendingUp,
  Settings,
  RefreshCw,
  Download,
  Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import SeatMap from './SeatMap';
import SeatTable from './SeatTable';
import { formatCurrency } from '@/utils/formateCurrency';
import { getFlightInstanceCabinsByFlightInstance } from '@/Redux/flightInstanceCabin/flightInstanceCabinThunk';


const FlightInstanceCabinSeatManagement = ({ 
  cabin, 
  flightInstance, onBack, onSeatAction }) => {
  const dispatch = useDispatch();
  const [activeView, setActiveView] = useState('visual');
  const [refreshing, setRefreshing] = useState(false);
  

  // Use the actual seats data from your provided structure
  const seats = cabin?.seats || [];

  // Calculate enhanced statistics
  const getEnhancedStats = () => {
    const total = seats.length;
    const available = seats.filter(s => s.status === 'AVAILABLE').length;
    const booked = seats.filter(s => s.status === 'BOOKED' || s.booked).length;
    const blocked = seats.filter(s => s.status === 'BLOCKED').length;

    // Revenue calculations
    const totalRevenue = seats
      .filter(s => s.status === 'BOOKED' || s.booked)
      .reduce((sum, s) => sum + (parseFloat(s.fare) || cabin?.currentPrice || 0), 0);

    const potentialRevenue = total * (cabin?.currentPrice || 0);
    const occupancyRate = total > 0 ? Math.round((booked / total) * 100) : 0;
    const revenueRate = potentialRevenue > 0 ? Math.round((totalRevenue / potentialRevenue) * 100) : 0;

    // Seat type breakdown
    const windowSeats = seats.filter(s => s.seatType === 'WINDOW').length;
    const aisleSeats = seats.filter(s => s.seatType === 'AISLE').length;
    const middleSeats = seats.filter(s => s.seatType === 'MIDDLE').length;

    // Meal preferences
    const mealPreferences = seats
      .filter(s => s.mealPreference)
      .reduce((acc, s) => {
        acc[s.mealPreference] = (acc[s.mealPreference] || 0) + 1;
        return acc;
      }, {});

    return {
      total,
      available,
      booked,
      blocked,
      totalRevenue,
      potentialRevenue,
      occupancyRate,
      revenueRate,
      windowSeats,
      aisleSeats,
      middleSeats,
      mealPreferences
    };
  };

  const stats = getEnhancedStats();

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      if (flightInstance?.id) {
        await dispatch(getFlightInstanceCabinsByFlightInstance({ flightInstanceId: flightInstance.id }));
      }
    } catch (error) {
      console.error('Failed to refresh cabin data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleSeatClick = (seat) => {
    console.log('Seat clicked:', seat);
    onSeatAction?.(seat, 'view');
  };

  const getCabinClassColor = () => {
    const cabinType = cabin?.cabinClass?.name;
    switch (cabinType) {
      case 'FIRST_CLASS':
      case 'FIRST':
        return 'from-purple-600 to-pink-600';
      case 'BUSINESS_CLASS':
      case 'BUSINESS':
        return 'from-blue-600 to-indigo-600';
      case 'PREMIUM_ECONOMY':
        return 'from-orange-500 to-amber-500';
      case 'ECONOMY':
      default:
        return 'from-green-500 to-emerald-500';
    }
  };

  const getCabinClassIcon = () => {
    const cabinType = cabin?.cabinClass?.name;
    switch (cabinType) {
      case 'FIRST_CLASS':
      case 'FIRST':
        return '✈️';
      case 'BUSINESS_CLASS':
      case 'BUSINESS':
        return '🥇';
      case 'PREMIUM_ECONOMY':
        return '🥈';
      case 'ECONOMY':
      default:
        return '🥉';
    }
  };

  if (!cabin) {
    return (
      <Alert>
        <AlertDescription>
          No cabin data available. Please select a valid cabin to manage seats.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="flex items-center gap-6">
          <Button
            variant="ghost"
            onClick={onBack}
            className="flex items-center gap-2 hover:bg-white/60 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Cabins
          </Button>

          <div>
            <div className="flex items-center gap-4 mb-2">
              <div className={cn(
                "p-3 rounded-xl shadow-lg bg-gradient-to-r text-white",
                getCabinClassColor()
              )}>
                <span className="text-2xl">{getCabinClassIcon()}</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  {cabin.cabinClass?.name} Class
                  <Badge className={cn(
                    "flex items-center gap-1",
                    cabin.isActive
                      ? "bg-green-100 text-green-800 border-green-200"
                      : "bg-gray-100 text-gray-800 border-gray-200"
                  )}>
                    {cabin.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </h1>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Plane className="h-4 w-4" />
                    Flight {flightInstance?.flightNumber}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {stats.total} seats total
                  </span>
                  <span className="flex items-center gap-1">
                    <TrendingUp className="h-4 w-4" />
                    {stats.occupancyRate}% occupied
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={cn("h-4 w-4", refreshing && "animate-spin")} />
            Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Settings className="h-4 w-4" />
            Configure
          </Button>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">Occupancy Rate</p>
                <p className="text-3xl font-bold text-blue-900">{stats.occupancyRate}%</p>
                <p className="text-sm text-blue-600">{stats.booked} of {stats.total} seats</p>
              </div>
              <div className="p-3 bg-blue-600 rounded-lg">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">Available Seats</p>
                <p className="text-3xl font-bold text-green-900">{stats.available}</p>
                <p className="text-sm text-green-600">Ready for booking</p>
              </div>
              <div className="p-3 bg-green-600 rounded-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700">Current Revenue</p>
                <p className="text-2xl font-bold text-purple-900">{formatCurrency(stats.totalRevenue)}</p>
                <p className="text-sm text-purple-600">{stats.revenueRate}% of potential</p>
              </div>
              <div className="p-3 bg-purple-600 rounded-lg">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-700">Current Price</p>
                <p className="text-2xl font-bold text-orange-900">{formatCurrency(cabin.currentPrice)}</p>
                <p className="text-sm text-orange-600">Per seat</p>
              </div>
              <div className="p-3 bg-orange-600 rounded-lg">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Seat Type Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Window Seats</p>
                <p className="text-xl font-bold text-blue-600">{stats.windowSeats}</p>
              </div>
              <div className="text-2xl">🪟</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Aisle Seats</p>
                <p className="text-xl font-bold text-green-600">{stats.aisleSeats}</p>
              </div>
              <div className="text-2xl">🚶</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Middle Seats</p>
                <p className="text-xl font-bold text-gray-600">{stats.middleSeats}</p>
              </div>
              <div className="text-2xl">💺</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* View Toggle & Content */}
      <Card className="shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-slate-50 border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Seat Management
            </CardTitle>
            <Tabs value={activeView} onValueChange={setActiveView}>
              <TabsList className="bg-white shadow-sm">
                <TabsTrigger value="visual" className="flex items-center gap-2">
                  <LayoutGrid className="h-4 w-4" />
                  Visual Map
                </TabsTrigger>
                <TabsTrigger value="table" className="flex items-center gap-2">
                  <Table className="h-4 w-4" />
                  Table View
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <Tabs value={activeView} onValueChange={setActiveView}>
            <TabsContent value="visual" className="mt-0">
              <SeatMap
                seats={seats}
                cabin={cabin}
                onSeatClick={handleSeatClick}
                viewMode="visual"
              />
            </TabsContent>

            <TabsContent value="table" className="mt-0">
              <SeatTable
                seats={seats}
                cabin={cabin}
                onSeatAction={onSeatAction}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Additional Analytics */}
      {Object.keys(stats.mealPreferences).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Meal Preferences Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {Object.entries(stats.mealPreferences).map(([meal, count]) => (
                <Badge key={meal} variant="outline" className="px-3 py-1">
                  {meal.replace('_', ' ')}: {count}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FlightInstanceCabinSeatManagement;