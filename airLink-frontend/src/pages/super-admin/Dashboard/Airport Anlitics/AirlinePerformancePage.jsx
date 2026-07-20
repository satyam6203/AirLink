import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plane,
  TrendingUp,
  DollarSign,
  Users,
  BarChart3,
  Activity,
  Trophy,
  Building2,
  Globe,
  Award,
  TrendingDown
} from "lucide-react";
import { getAirlinePerformanceForSuperAdmin } from '@/Redux/booking/bookingThunk';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Cell,
  ResponsiveContainer,
} from "recharts";

const AirlinePerformancePage = () => {
  const dispatch = useDispatch();
  const { superAdminAirlinePerformance, superAdminAirlinePerformanceLoading } = useSelector((store) => store.booking);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    dispatch(getAirlinePerformanceForSuperAdmin());
  }, [dispatch]);

  if (superAdminAirlinePerformanceLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading airline performance data...</p>
        </div>
      </div>
    );
  }

  if (!superAdminAirlinePerformance) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="text-center space-y-4">
          <Activity className="h-16 w-16 text-muted-foreground mx-auto" />
          <p className="text-muted-foreground">No airline performance data available</p>
        </div>
      </div>
    );
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value) => {
    return new Intl.NumberFormat('en-US').format(value);
  };

  // Calculate summary statistics
  const totalAirlines = new Set([
    ...superAdminAirlinePerformance.topAirlinesByBookings.map(a => a.airlineId),
    ...superAdminAirlinePerformance.topAirlinesByRevenue.map(a => a.airlineId)
  ]).size;

  const totalBookings = superAdminAirlinePerformance.topAirlinesByBookings.reduce(
    (sum, airline) => sum + (airline.totalBookings || 0),
    0
  );

  const totalRevenue = superAdminAirlinePerformance.topAirlinesByRevenue.reduce(
    (sum, airline) => sum + (airline.totalRevenue || 0),
    0
  );

  const totalFlights = superAdminAirlinePerformance.topAirlinesByBookings.reduce(
    (sum, airline) => sum + (airline.totalFlights || 0),
    0
  );

  const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#6366f1', '#f97316', '#14b8a6', '#a855f7'];

  const AirlineCard = ({ airline, rank }) => {
    const getRankIcon = (rank) => {
      if (rank === 1) return <Trophy className="h-5 w-5 text-yellow-500" />;
      if (rank === 2) return <Award className="h-5 w-5 text-gray-400" />;
      if (rank === 3) return <Award className="h-5 w-5 text-amber-600" />;
      return <Badge variant="outline" className="rounded-full w-8 h-8 flex items-center justify-center">{rank}</Badge>;
    };

    const getStatusColor = (status) => {
      switch (status?.toUpperCase()) {
        case 'ACTIVE':
          return 'bg-green-500/10 text-green-700 border-green-200';
        case 'SUSPENDED':
          return 'bg-red-500/10 text-red-700 border-red-200';
        case 'PENDING':
          return 'bg-yellow-500/10 text-yellow-700 border-yellow-200';
        default:
          return 'bg-gray-500/10 text-gray-700 border-gray-200';
      }
    };

    return (
      <Card className="hover:shadow-lg transition-shadow duration-200">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              {getRankIcon(rank)}
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-lg">{airline.airlineName}</h3>
                  <Badge variant="outline" className="text-xs">{airline.airlineCode}</Badge>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Globe className="h-3 w-3 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">{airline.country}</p>
                </div>
              </div>
            </div>
            <Badge className={getStatusColor(airline.status)} variant="outline">
              {airline.status || 'ACTIVE'}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Users className="h-3 w-3" />
                Bookings
              </p>
              <p className="text-2xl font-bold">{formatNumber(airline.totalBookings)}</p>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <DollarSign className="h-3 w-3" />
                Revenue
              </p>
              <p className="text-2xl font-bold">{formatCurrency(airline.totalRevenue)}</p>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Plane className="h-3 w-3" />
                Flights
              </p>
              <p className="text-lg font-semibold">{formatNumber(airline.totalFlights)}</p>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                Avg Revenue
              </p>
              <p className="text-lg font-semibold">{formatCurrency(airline.averageRevenuePerBooking)}</p>
            </div>
          </div>

          {airline.totalRoutes && (
            <div className="mt-4 pt-4 border-t">
              <p className="text-xs text-muted-foreground">Routes Operated: {formatNumber(airline.totalRoutes)}</p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderBarChart = (data, dataKey, color, title) => {
    const chartData = data.slice(0, 10).map((item, index) => ({
      name: item.airlineCode || item.airlineName?.substring(0, 15),
      value: item[dataKey],
      fullName: item.airlineName,
      index
    }));

    const chartConfig = {
      value: {
        label: title,
        color: color,
      },
    };

    return (
      <ChartContainer config={chartConfig} className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="name"
              angle={-45}
              textAnchor="end"
              height={100}
              className="text-xs"
            />
            <YAxis className="text-xs" />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="value" radius={[8, 8, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    );
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Building2 className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Airline Performance Analytics</h1>
        </div>
        <p className="text-muted-foreground">
          System-wide airline performance metrics and insights
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Airlines</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAirlines}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Active carriers on platform
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(totalBookings)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Across all airlines
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Platform-wide revenue
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Flights</CardTitle>
            <Plane className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(totalFlights)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Flight instances served
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Section */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="bookings">By Bookings</TabsTrigger>
          <TabsTrigger value="revenue">By Revenue</TabsTrigger>
          <TabsTrigger value="avgRevenue">By Avg Revenue</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Top Airlines by Bookings
                </CardTitle>
                <CardDescription>Airlines with highest booking volume</CardDescription>
              </CardHeader>
              <CardContent>
                {renderBarChart(
                  superAdminAirlinePerformance.topAirlinesByBookings,
                  'totalBookings',
                  '#3b82f6',
                  'Bookings'
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Top Airlines by Revenue
                </CardTitle>
                <CardDescription>Highest revenue generating airlines</CardDescription>
              </CardHeader>
              <CardContent>
                {renderBarChart(
                  superAdminAirlinePerformance.topAirlinesByRevenue,
                  'totalRevenue',
                  '#10b981',
                  'Revenue'
                )}
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Premium Airlines (Avg Revenue)
                </CardTitle>
                <CardDescription>Airlines with highest average booking value</CardDescription>
              </CardHeader>
              <CardContent>
                {renderBarChart(
                  superAdminAirlinePerformance.topAirlinesByAverageRevenue,
                  'averageRevenuePerBooking',
                  '#8b5cf6',
                  'Avg Revenue'
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plane className="h-5 w-5" />
                  Most Active Airlines (Flights)
                </CardTitle>
                <CardDescription>Airlines operating most flights</CardDescription>
              </CardHeader>
              <CardContent>
                {renderBarChart(
                  superAdminAirlinePerformance.topAirlinesByFlightCount,
                  'totalFlights',
                  '#f59e0b',
                  'Flights'
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Top Airlines by Bookings Tab */}
        <TabsContent value="bookings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                Top 10 Airlines by Total Bookings
              </CardTitle>
              <CardDescription>
                Airlines ranked by booking volume across the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                {renderBarChart(
                  superAdminAirlinePerformance.topAirlinesByBookings,
                  'totalBookings',
                  '#3b82f6',
                  'Bookings'
                )}
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {superAdminAirlinePerformance.topAirlinesByBookings.slice(0, 10).map((airline, index) => (
              <AirlineCard key={airline.airlineId} airline={airline} rank={index + 1} type="bookings" />
            ))}
          </div>
        </TabsContent>

        {/* Top Airlines by Revenue Tab */}
        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-500" />
                Top 10 Airlines by Revenue
              </CardTitle>
              <CardDescription>
                Highest revenue generating airlines on the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                {renderBarChart(
                  superAdminAirlinePerformance.topAirlinesByRevenue,
                  'totalRevenue',
                  '#10b981',
                  'Revenue'
                )}
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {superAdminAirlinePerformance.topAirlinesByRevenue.slice(0, 10).map((airline, index) => (
              <AirlineCard key={airline.airlineId} airline={airline} rank={index + 1} type="revenue" />
            ))}
          </div>
        </TabsContent>

        {/* Top Airlines by Average Revenue Tab */}
        <TabsContent value="avgRevenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-purple-500" />
                Premium Airlines by Average Revenue
              </CardTitle>
              <CardDescription>
                Airlines with highest average booking value (minimum 10 bookings)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                {renderBarChart(
                  superAdminAirlinePerformance.topAirlinesByAverageRevenue,
                  'averageRevenuePerBooking',
                  '#8b5cf6',
                  'Avg Revenue'
                )}
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {superAdminAirlinePerformance.topAirlinesByAverageRevenue.slice(0, 10).map((airline, index) => (
              <AirlineCard key={airline.airlineId} airline={airline} rank={index + 1} type="avgRevenue" />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AirlinePerformancePage;
