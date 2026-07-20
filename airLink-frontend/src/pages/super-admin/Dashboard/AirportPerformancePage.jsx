import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MapPin,
  TrendingUp,
  DollarSign,
  Users,
  Plane,
  PlaneTakeoff,
  PlaneLanding,
  BarChart3,
  Activity,
  Trophy,
  Globe,
} from "lucide-react";
import { getAirportPerformanceForSuperAdmin } from "@/Redux/booking/bookingThunk";
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
import AirportBookingChart from "./Airport Anlitics/AirportBookingChart";
import { formatCurrency } from "@/utils/formateCurrency";
import { formatNumber } from "@/utils/formateNumber";
import { COLORS } from "./chartColor";
import AirportRevenueChart from "./Airport Anlitics/AirportRevenueChart";

const AirportPerformancePage = () => {
  const dispatch = useDispatch();
  const { superAdminAirportPerformance, superAdminAirportPerformanceLoading } =
    useSelector((store) => store.booking);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    dispatch(getAirportPerformanceForSuperAdmin());
  }, [dispatch]);

  if (superAdminAirportPerformanceLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">
            Loading airport performance data...
          </p>
        </div>
      </div>
    );
  }

  if (!superAdminAirportPerformance) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="text-center space-y-4">
          <Activity className="h-16 w-16 text-muted-foreground mx-auto" />
          <p className="text-muted-foreground">
            No airport performance data available
          </p>
        </div>
      </div>
    );
  }

 

  

  // Calculate summary statistics
  const totalAirports = new Set([
    ...superAdminAirportPerformance.topAirportsByBookings.map(
      (a) => a.airportCode
    ),
    ...superAdminAirportPerformance.topAirportsByRevenue.map(
      (a) => a.airportCode
    ),
  ]).size;

  const totalBookings =
    superAdminAirportPerformance.topAirportsByBookings.reduce(
      (sum, airport) => sum + (airport.totalBookings || 0),
      0
    );

  const totalRevenue = superAdminAirportPerformance.topAirportsByRevenue.reduce(
    (sum, airport) => sum + (airport.totalRevenue || 0),
    0
  );

  const totalFlights =
    superAdminAirportPerformance.topAirportsByBookings.reduce(
      (sum, airport) => sum + (airport.totalFlights || 0),
      0
    );

  // Chart colors
  

  // Prepare data for charts




  const AirportCard = ({ airport, index }) => {
    const rankColors = ["bg-yellow-500", "bg-gray-400", "bg-amber-600"];
    const rankColor = index < 3 ? rankColors[index] : "bg-primary/10";
    const rankTextColor = index < 3 ? "text-white" : "text-primary";

    const getPerformanceIcon = (type) => {
      if (type === "departure") return <PlaneTakeoff className="h-4 w-4" />;
      if (type === "arrival") return <PlaneLanding className="h-4 w-4" />;
      return <Plane className="h-4 w-4" />;
    };

    const getPerformanceBadge = (type) => {
      if (type === "departure")
        return { label: "Departure Hub", color: "bg-blue-100 text-blue-800" };
      if (type === "arrival")
        return { label: "Arrival Hub", color: "bg-green-100 text-green-800" };
      return { label: "Both", color: "bg-purple-100 text-purple-800" };
    };

    const perfBadge = getPerformanceBadge(airport.performanceType);

    return (
      <div className="group relative overflow-hidden rounded-lg border bg-card hover:shadow-lg transition-all duration-200">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/5 to-transparent rounded-bl-full" />

        <div className="relative p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <div
                className={`flex items-center justify-center w-12 h-12 rounded-full ${rankColor} ${rankTextColor} font-bold text-lg shadow-md`}
              >
                {index < 3 ? <Trophy className="h-6 w-6" /> : index + 1}
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl font-bold">
                    {airport.airportCode}
                  </span>
                  <Badge className={perfBadge.color}>
                    {getPerformanceIcon(airport.performanceType)}
                    <span className="ml-1">{perfBadge.label}</span>
                  </Badge>
                </div>
                <p className="text-sm font-semibold text-foreground">
                  {airport.airportName}
                </p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Globe className="h-3 w-3" />
                  {airport.city}, {airport.country}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4 pt-4 border-t">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Bookings</p>
              <p className="text-lg font-semibold flex items-center gap-1">
                <Users className="h-4 w-4 text-blue-500" />
                {formatNumber(airport.totalBookings)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Revenue</p>
              <p className="text-lg font-semibold flex items-center gap-1">
                <DollarSign className="h-4 w-4 text-green-500" />
                {formatCurrency(airport.totalRevenue)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Avg/Booking</p>
              <p className="text-lg font-semibold flex items-center gap-1">
                <TrendingUp className="h-4 w-4 text-purple-500" />
                {formatCurrency(airport.averageRevenuePerBooking)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Flights</p>
              <p className="text-lg font-semibold flex items-center gap-1">
                <Plane className="h-4 w-4 text-orange-500" />
                {formatNumber(airport.totalFlights)}
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
            <MapPin className="h-8 w-8" />
            Airport Performance Analysis
          </h1>
          <p className="text-muted-foreground mt-1">
            Track your most active and profitable airports
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Active Airports
            </CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAirports}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Top performing airports
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Bookings
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(totalBookings)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Across all airports
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalRevenue)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              From top airports
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Flights</CardTitle>
            <Plane className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(totalFlights)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Operations count
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="bookings">Top by Bookings</TabsTrigger>
          <TabsTrigger value="revenue">Top by Revenue</TabsTrigger>
          <TabsTrigger value="hubs">Departure & Arrival</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 ">
            {/* Bookings Chart */}
            <AirportBookingChart/>

            {/* Revenue Chart */}
            <AirportRevenueChart/>
          </div>
        </TabsContent>

        {/* Top by Bookings Tab */}
        <TabsContent value="bookings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Top Airports by Number of Bookings
              </CardTitle>
              <CardDescription>
                Airports ranked by total passenger bookings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {superAdminAirportPerformance.topAirportsByBookings &&
                superAdminAirportPerformance.topAirportsByBookings.length >
                  0 ? (
                  superAdminAirportPerformance.topAirportsByBookings.map(
                    (airport, index) => (
                      <AirportCard
                        key={`bookings-${index}`}
                        airport={airport}
                        index={index}
                      />
                    )
                  )
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    No booking data available
                  </p>
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
                Top Airports by Revenue
              </CardTitle>
              <CardDescription>
                Airports ranked by total revenue generated
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {superAdminAirportPerformance.topAirportsByRevenue &&
                superAdminAirportPerformance.topAirportsByRevenue.length > 0 ? (
                  superAdminAirportPerformance.topAirportsByRevenue.map(
                    (airport, index) => (
                      <AirportCard
                        key={`revenue-${index}`}
                        airport={airport}
                        index={index}
                      />
                    )
                  )
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    No revenue data available
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Departure & Arrival Hubs Tab */}
        <TabsContent value="hubs" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Departure Airports */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PlaneTakeoff className="h-5 w-5" />
                  Top Departure Airports
                </CardTitle>
                <CardDescription>Most active departure hubs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {superAdminAirportPerformance.topDepartureAirports &&
                  superAdminAirportPerformance.topDepartureAirports.length >
                    0 ? (
                    superAdminAirportPerformance.topDepartureAirports
                      .slice(0, 5)
                      .map((airport, index) => (
                        <AirportCard
                          key={`departure-${index}`}
                          airport={airport}
                          index={index}
                        />
                      ))
                  ) : (
                    <p className="text-center text-muted-foreground py-8">
                      No departure data available
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Top Arrival Airports */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PlaneLanding className="h-5 w-5" />
                  Top Arrival Airports
                </CardTitle>
                <CardDescription>Most active arrival hubs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {superAdminAirportPerformance.topArrivalAirports &&
                  superAdminAirportPerformance.topArrivalAirports.length > 0 ? (
                    superAdminAirportPerformance.topArrivalAirports
                      .slice(0, 5)
                      .map((airport, index) => (
                        <AirportCard
                          key={`arrival-${index}`}
                          airport={airport}
                          index={index}
                        />
                      ))
                  ) : (
                    <p className="text-center text-muted-foreground py-8">
                      No arrival data available
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AirportPerformancePage;
