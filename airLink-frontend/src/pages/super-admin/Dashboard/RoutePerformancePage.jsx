import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  MapPin,
  TrendingUp,
  DollarSign,
  Users,
  Plane,
  ArrowRight,
  BarChart3,
  Activity,
  Trophy
} from "lucide-react";
import { getRoutePerformanceForSuperAdmin } from '@/Redux/booking/bookingThunk';
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

const RoutePerformancePage = () => {
  const dispatch = useDispatch();
  const { superAdminRoutePerformance, superAdminRoutePerformanceLoading } = useSelector((store) => store.booking);
  const [selectedMetric, setSelectedMetric] = useState("bookings");
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    dispatch(getRoutePerformanceForSuperAdmin());
  }, [dispatch]);

  if (superAdminRoutePerformanceLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading route performance data...</p>
        </div>
      </div>
    );
  }

  if (!superAdminRoutePerformance) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="text-center space-y-4">
          <Activity className="h-16 w-16 text-muted-foreground mx-auto" />
          <p className="text-muted-foreground">No route performance data available</p>
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
  const totalRoutes = new Set([
    ...superAdminRoutePerformance.topRoutesByBookings.map(r => r.route),
    ...superAdminRoutePerformance.topRoutesByRevenue.map(r => r.route)
  ]).size;

  const totalBookings = superAdminRoutePerformance.topRoutesByBookings.reduce(
    (sum, route) => sum + (route.totalBookings || 0),
    0
  );

  const totalRevenue = superAdminRoutePerformance.topRoutesByRevenue.reduce(
    (sum, route) => sum + (route.totalRevenue || 0),
    0
  );

  const avgRevenuePerRoute = totalRoutes > 0 ? totalRevenue / totalRoutes : 0;

  // Chart colors
  const COLORS = [
    'hsl(var(--chart-1))',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
    'hsl(var(--chart-5))',
    '#8B5CF6',
    '#EC4899',
    '#F59E0B',
    '#10B981',
    '#3B82F6',
  ];

  // Prepare data for charts
  const bookingsChartData = superAdminRoutePerformance.topRoutesByBookings.map(route => ({
    route: route.route,
    bookings: route.totalBookings,
    revenue: route.totalRevenue,
  }));

  const revenueChartData = superAdminRoutePerformance.topRoutesByRevenue.map(route => ({
    route: route.route,
    bookings: route.totalBookings,
    revenue: route.totalRevenue,
  }));

  const chartConfig = {
    bookings: {
      label: "Bookings",
      color: "hsl(var(--chart-1))",
    },
    revenue: {
      label: "Revenue",
      color: "hsl(var(--chart-2))",
    },
  };

  const RouteCard = ({ route, index, showRevenue = false }) => {
    const rankColors = ['bg-yellow-500', 'bg-gray-400', 'bg-amber-600'];
    const rankColor = index < 3 ? rankColors[index] : 'bg-primary/10';
    const rankTextColor = index < 3 ? 'text-white' : 'text-primary';

    return (
      <div className="group relative overflow-hidden rounded-lg border bg-card hover:shadow-lg transition-all duration-200">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/5 to-transparent rounded-bl-full" />

        <div className="relative p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className={`flex items-center justify-center w-12 h-12 rounded-full ${rankColor} ${rankTextColor} font-bold text-lg shadow-md`}>
                {index < 3 ? <Trophy className="h-6 w-6" /> : index + 1}
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl font-bold">{route.departureAirportCode}</span>
                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
                  <span className="text-2xl font-bold">{route.arrivalAirportCode}</span>
                </div>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {route.departureAirportName} → {route.arrivalAirportName}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Bookings</p>
              <p className="text-lg font-semibold flex items-center gap-1">
                <Users className="h-4 w-4 text-blue-500" />
                {formatNumber(route.totalBookings)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Revenue</p>
              <p className="text-lg font-semibold flex items-center gap-1">
                <DollarSign className="h-4 w-4 text-green-500" />
                {formatCurrency(route.totalRevenue)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Avg/Booking</p>
              <p className="text-lg font-semibold flex items-center gap-1">
                <TrendingUp className="h-4 w-4 text-purple-500" />
                {formatCurrency(route.averageRevenuePerBooking)}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Plane className="h-8 w-8" />
            Route Performance Analysis
          </h1>
          <p className="text-muted-foreground mt-1">
            Analyze your most profitable and popular routes
          </p>
        </div>
        <Select value={selectedMetric} onValueChange={setSelectedMetric}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select metric" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="bookings">By Bookings</SelectItem>
            <SelectItem value="revenue">By Revenue</SelectItem>
            <SelectItem value="average">By Avg Revenue</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Routes</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRoutes}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Top performing routes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(totalBookings)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Across all top routes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              From top routes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg Revenue/Route</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(avgRevenuePerRoute)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Average per route
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="bookings">Top by Bookings</TabsTrigger>
          <TabsTrigger value="revenue">Top by Revenue</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Bookings Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Top Routes by Bookings
                </CardTitle>
                <CardDescription>Number of bookings per route</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={bookingsChartData} margin={{ top: 20, right: 20, bottom: 60, left: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis
                        dataKey="route"
                        angle={-45}
                        textAnchor="end"
                        height={80}
                        tickLine={false}
                      />
                      <YAxis tickLine={false} />
                      <ChartTooltip
                        content={
                          <ChartTooltipContent
                            formatter={(value, name) => [
                              name === 'bookings' ? formatNumber(value) : formatCurrency(value),
                              name === 'bookings' ? 'Bookings' : 'Revenue'
                            ]}
                          />
                        }
                      />
                      <Bar dataKey="bookings" radius={[8, 8, 0, 0]}>
                        {bookingsChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Revenue Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Top Routes by Revenue
                </CardTitle>
                <CardDescription>Revenue generated per route</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={revenueChartData} margin={{ top: 20, right: 20, bottom: 60, left: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis
                        dataKey="route"
                        angle={-45}
                        textAnchor="end"
                        height={80}
                        tickLine={false}
                      />
                      <YAxis
                        tickLine={false}
                        tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                      />
                      <ChartTooltip
                        content={
                          <ChartTooltipContent
                            formatter={(value, name) => [
                              name === 'revenue' ? formatCurrency(value) : formatNumber(value),
                              name === 'revenue' ? 'Revenue' : 'Bookings'
                            ]}
                          />
                        }
                      />
                      <Bar dataKey="revenue" radius={[8, 8, 0, 0]}>
                        {revenueChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Top by Bookings Tab */}
        <TabsContent value="bookings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Top Routes by Number of Bookings
              </CardTitle>
              <CardDescription>
                Routes ranked by total passenger bookings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {superAdminRoutePerformance.topRoutesByBookings && superAdminRoutePerformance.topRoutesByBookings.length > 0 ? (
                  superAdminRoutePerformance.topRoutesByBookings.map((route, index) => (
                    <RouteCard key={`bookings-${index}`} route={route} index={index} />
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-8">No booking data available</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Top by Revenue Tab */}
        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Top Routes by Revenue
              </CardTitle>
              <CardDescription>
                Routes ranked by total revenue generated
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {superAdminRoutePerformance.topRoutesByRevenue && superAdminRoutePerformance.topRoutesByRevenue.length > 0 ? (
                  superAdminRoutePerformance.topRoutesByRevenue.map((route, index) => (
                    <RouteCard key={`revenue-${index}`} route={route} index={index} showRevenue />
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-8">No revenue data available</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RoutePerformancePage;
