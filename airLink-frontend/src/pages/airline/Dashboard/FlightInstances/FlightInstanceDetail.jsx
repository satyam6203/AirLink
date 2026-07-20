import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Plane,
  MapPin,
  Clock,
  Users,
  Settings,
  Edit,
  Calendar,
  Info,
  DollarSign,
  Activity,
  AlertCircle,
  CheckCircle,
  Bookmark,
  Share2,
  Download,
  RefreshCw,
  AlertTriangle,
  TrendingUp,
  BarChart3,
  PieChart,
  Target,
  Shield,
  Wifi,
  Coffee,
  MonitorSpeaker,
  Utensils,
  Grid3X3,
  Plus,
  Loader,
  Sofa,
  LayoutGrid,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { formatDateTime } from "@/utils/formateDateTime";
import { formatCurrency } from "@/utils/formateCurrency";
import { useSelector, useDispatch } from "react-redux";
import { getFlightInstanceById } from "@/Redux/flightInstance/flightInstanceThunk";

import {

  getFlightInstanceCabinsByFlightInstance,
} from "@/Redux/flightInstanceCabin/flightInstanceCabinThunk";

import EmptyCabin from "./EmptyCabin";
import { getOccupancyColor, getOccupancyPercentage } from "@/utils/occupancy";
import FlightInstanceCabinCard from "./FlightInstanceCabinCard";
import { CabinManagementFAB } from "@/components/navigation/FloatingActionButton";

const FlightInstanceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("overview");

  const [isBookmarked, setIsBookmarked] = useState(false);

  const { flightInstance, loading } = useSelector(
    (store) => store.flightInstance
  );
  const { cabins, loading: cabinsLoading } = useSelector(
    (store) => store.flightInstanceCabin
  );

  useEffect(() => {
    if (id) {
      dispatch(getFlightInstanceById(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (flightInstance?.id) {
      dispatch(
        getFlightInstanceCabinsByFlightInstance({
          flightInstanceId: flightInstance.id,
        })
      );
    }
  }, [flightInstance, dispatch]);

  console.log("id", id);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto"></div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold animate-pulse">
              Loading Flight Instance
            </h2>
            <p className="text-muted-foreground animate-pulse">
              Please wait while we fetch the information...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!flightInstance) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center space-y-4">
          <Plane className="h-16 w-16 mx-auto text-muted-foreground" />
          <h2 className="text-xl font-semibold">Flight Instance Not Found</h2>
          <p className="text-muted-foreground">
            The requested flight instance could not be found.
          </p>
          <Button onClick={() => navigate("/airline/instances")}>
            Back to Instances
          </Button>
        </div>
      </div>
    );
  }

  const getStatusConfig = (status) => {
    const configs = {
      SCHEDULED: {
        color: "bg-blue-100 text-blue-800 border-blue-200",
        icon: Clock,
        label: "Scheduled",
      },
      BOARDING: {
        color: "bg-green-100 text-green-800 border-green-200",
        icon: Users,
        label: "Boarding",
      },
      DELAYED: {
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        icon: AlertTriangle,
        label: "Delayed",
      },
      DEPARTED: {
        color: "bg-purple-100 text-purple-800 border-purple-200",
        icon: Plane,
        label: "Departed",
      },
      ARRIVED: {
        color: "bg-green-100 text-green-800 border-green-200",
        icon: CheckCircle,
        label: "Arrived",
      },
      CANCELLED: {
        color: "bg-red-100 text-red-800 border-red-200",
        icon: AlertCircle,
        label: "Cancelled",
      },
      Active: {
        color: "bg-green-100 text-green-800 border-green-200",
        icon: CheckCircle,
        label: "Active",
      },
    };
    return configs[status] || configs.SCHEDULED;
  };

  const statusConfig = getStatusConfig(flightInstance.status);
  const StatusIcon = statusConfig.icon;

  // const handleCreateCabin = () => {
  //   navigate(`/airline/instances/${flightInstance.id}/cabins/new`);
  // };

  const flightStats = [
    {
      label: "On-time Performance",
      value: "96%",
      trend: "+3%",
      icon: Target,
      color: "text-green-600",
      description: "Above average",
    },
    {
      label: "Load Factor",
      value: `${getOccupancyPercentage(
        flightInstance?.totalSeats - flightInstance?.availableSeats,
        flightInstance?.totalSeats
      )}%`,
      trend: "+8%",
      icon: TrendingUp,
      color: "text-blue-600",
      description: "Current occupancy",
    },
    {
      label: "Revenue Index",
      value: "A+",
      trend: "↑",
      icon: DollarSign,
      color: "text-purple-600",
      description: "Excellent performance",
    },
    {
      label: "Safety Rating",
      value: "5.0",
      trend: "↑",
      icon: Shield,
      color: "text-green-600",
      description: "Perfect score",
    },
  ];

  const amenities = [
    { icon: Wifi, label: "Wi-Fi", available: true },
    { icon: Coffee, label: "Beverages", available: true },
    { icon: Utensils, label: "Meals", available: true },
    { icon: MonitorSpeaker, label: "Entertainment", available: true },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex items-center gap-6">
            <Button
              variant="ghost"
              onClick={() => navigate("/airline/instances")}
              className="flex items-center gap-2 hover:bg-white/50 animate-fade-in"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Instances
            </Button>

            <div className="space-y-2 animate-slide-in-left">
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-2xl shadow-lg">
                  <Plane className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold flex items-center gap-3">
                    {flightInstance.flightNumber}
                    <Badge
                      className={cn(
                        "flex items-center gap-1 border animate-scale-in",
                        statusConfig.color
                      )}
                    >
                      <StatusIcon className="h-3 w-3" />
                      {statusConfig.label}
                    </Badge>
                  </h1>
                  <p className="text-muted-foreground text-lg">
                    {flightInstance.flightName} •{" "}
                    {flightInstance.flight?.aircraft?.model}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 animate-slide-in-right">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsBookmarked(!isBookmarked)}
              className={cn(
                "hover-lift",
                isBookmarked && "bg-yellow-50 border-yellow-200"
              )}
            >
              <Bookmark
                className={cn(
                  "h-4 w-4",
                  isBookmarked && "fill-yellow-500 text-yellow-500"
                )}
              />
            </Button>
            <Button variant="outline" size="sm" className="hover-lift">
              <Share2 className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" className="hover-lift">
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" className="hover-lift">
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button
              onClick={() => navigate(`/airline/instances/${id}/edit`)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover-lift"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Instance
            </Button>
          </div>
        </div>

        {/* Flight Route Hero Card */}
        <Card className="overflow-hidden shadow-2xl border-0 bg-white/95 backdrop-blur-sm animate-scale-in hover-lift">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Departure */}
              <div className="space-y-4 animate-fade-in">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  Departure
                </div>
                <div className="space-y-2">
                  <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {flightInstance?.departureAirport?.city?.cityCode ||
                      flightInstance?.departureAirport?.iataCode}
                  </div>
                  <div className="text-xl font-semibold">
                    {flightInstance?.departureAirport?.city?.name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {flightInstance?.departureAirport?.name}
                  </div>
                  <div className="flex items-center gap-2 mt-4 p-3 bg-blue-50 rounded-xl">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <div>
                      <div className="font-semibold">
                        {formatDateTime(flightInstance?.departureDateTime)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Terminal {flightInstance?.departureTerminal || "TBD"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Flight Path */}
              <div className="flex items-center justify-center animate-fade-in animation-delay-200">
                <div className="text-center space-y-4 w-full">
                  <div className="flex items-center justify-center">
                    <div className="h-px bg-gradient-to-r from-blue-200 via-blue-500 to-purple-500 flex-1"></div>
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-full mx-4 shadow-lg animate-float">
                      <Plane className="h-8 w-8 text-white" />
                    </div>
                    <div className="h-px bg-gradient-to-r from-purple-500 via-blue-500 to-blue-200 flex-1"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-lg font-semibold">
                      {Math.round(
                        (new Date(flightInstance?.arrivalDateTime) -
                          new Date(flightInstance?.departureDateTime)) /
                          (1000 * 60)
                      )}{" "}
                      min
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {flightInstance?.flight?.aircraft?.model} • Non-stop
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {flightInstance?.flight?.aircraft?.registration}
                    </div>
                  </div>
                </div>
              </div>

              {/* Arrival */}
              <div className="space-y-4 animate-fade-in animation-delay-400">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  Arrival
                </div>
                <div className="space-y-2">
                  <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    {flightInstance?.arrivalAirport?.iataCode}
                  </div>
                  <div className="text-xl font-semibold">
                    {flightInstance?.arrivalAirport?.city?.name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {flightInstance?.arrivalAirport?.name}
                  </div>
                  <div className="flex items-center gap-2 mt-4 p-3 bg-purple-50 rounded-xl">
                    <Clock className="h-5 w-5 text-purple-600" />
                    <div>
                      <div className="font-semibold">
                        {formatDateTime(flightInstance?.arrivalDateTime)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Terminal {flightInstance?.arrivalTerminal || "TBD"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {flightStats.map((stat, index) => (
            <Card
              key={index}
              className={`hover-lift animate-fade-in animation-delay-${
                (index + 1) * 100
              } glass`}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <div className="flex items-center gap-2">
                      <p className={cn("text-xs font-medium", stat.color)}>
                        {stat.trend}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {stat.description}
                      </p>
                    </div>
                  </div>
                  <stat.icon className={cn("h-8 w-8", stat.color)} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-3 bg-white/50 backdrop-blur-sm">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Info className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="cabins" className="flex items-center gap-2">
              <Sofa className="h-4 w-4" />
              Cabins
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Flight Information */}
              <Card className="hover-lift animate-slide-in-left">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="h-5 w-5" />
                    Flight Instance Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Flight Number
                      </label>
                      <div className="font-mono">
                        {flightInstance.flightNumber}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Airline
                      </label>
                      <div>
                        {flightInstance?.flight?.aircraft?.airlineName ||
                          flightInstance?.airline?.name}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Aircraft
                      </label>
                      <div>{flightInstance?.flight?.aircraft?.model}</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Registration
                      </label>
                      <div className="font-mono">
                        {flightInstance?.flight?.aircraft?.code}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Status
                      </label>
                      <div>
                        <Badge
                          className={cn(
                            "flex items-center gap-1 border w-fit",
                            statusConfig.color
                          )}
                        >
                          <StatusIcon className="h-3 w-3" />
                          {statusConfig.label}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Gate
                      </label>
                      <div>{flightInstance.gate || "TBD"}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Seat Statistics */}
              <Card className="hover-lift animate-slide-in-right">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Seat Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-sm font-medium">Total Seats</span>
                      </div>
                      <span className="font-semibold">
                        {flightInstance?.totalSeats}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm font-medium">
                          Booked Seats
                        </span>
                      </div>
                      <span className="font-semibold">
                        {flightInstance?.totalSeats -
                          flightInstance?.availableSeats}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <span className="text-sm font-medium">
                          Available Seats
                        </span>
                      </div>
                      <span className="font-semibold">
                        {flightInstance?.availableSeats}
                      </span>
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">
                        Occupancy Rate
                      </span>
                      <span
                        className={cn(
                          "font-semibold",
                          getOccupancyColor(
                            getOccupancyPercentage(
                              flightInstance?.totalSeats -
                                flightInstance?.availableSeats,
                              flightInstance?.totalSeats
                            )
                          )
                        )}
                      >
                        {getOccupancyPercentage(
                          flightInstance?.totalSeats -
                            flightInstance?.availableSeats,
                          flightInstance?.totalSeats
                        )}
                        %
                      </span>
                    </div>
                    <Progress
                      value={getOccupancyPercentage(
                        flightInstance?.totalSeats -
                          flightInstance?.availableSeats,
                        flightInstance?.totalSeats
                      )}
                      className="h-2"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Amenities */}
            <Card className="hover-lift animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Coffee className="h-5 w-5" />
                  Flight Amenities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {amenities.map((amenity, index) => (
                    <div
                      key={index}
                      className={cn(
                        "flex items-center gap-3 p-4 rounded-xl transition-all duration-300",
                        amenity.available
                          ? "bg-green-50 text-green-700 hover:bg-green-100"
                          : "bg-gray-50 text-gray-400"
                      )}
                    >
                      <amenity.icon className="h-5 w-5" />
                      <span className="font-medium">{amenity.label}</span>
                      {amenity.available && (
                        <CheckCircle className="h-4 w-4 ml-auto" />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Cabins Tab */}
          <TabsContent value="cabins" className="space-y-6">
            {
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold">Cabin Classes</h3>
                    <div className="text-sm text-muted-foreground">
                      {cabins?.length || 0} cabin
                      {(cabins?.length || 0) !== 1 ? "s" : ""} configured for
                      this flight
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() =>
                        navigate(
                          `/airline/instances/${flightInstance.id}/cabins/new`
                        )
                      }
                      className="flex items-center gap-2 bg-gradient-to-r from-[#5400bc] to-[indigo] hover:from-[#610098] hover:to-indigo-700"
                    >
                      <Plus className="h-4 w-4" />
                      Create New Cabin
                    </Button>

                    {cabins?.length > 0 && (
                      <Badge variant="outline" className="text-sm">
                        {cabins.length} cabin{cabins.length !== 1 ? "s" : ""}{" "}
                        configured
                      </Badge>
                    )}
                  </div>
                </div>

                {cabinsLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : cabins?.length === 0 ? (
                  <EmptyCabin />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {cabins?.map((cabin) => {
                      const occupancyPercentage = getOccupancyPercentage(
                        cabin.bookedSeats,
                        cabin.totalSeats
                      );

                      return (
                        <FlightInstanceCabinCard
                          cabin={cabin}
                          occupancyPercentage={occupancyPercentage}
                        />
                      );
                    })}
                  </div>
                )}

              
              </div>
            }
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="hover-lift animate-slide-in-left">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Performance Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">
                          On-time Performance
                        </span>
                        <span className="text-sm text-green-600 font-semibold">
                          96%
                        </span>
                      </div>
                      <Progress value={96} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Load Factor</span>
                        <span className="text-sm text-blue-600 font-semibold">
                          {getOccupancyPercentage(
                            flightInstance?.totalSeats -
                              flightInstance?.availableSeats,
                            flightInstance?.totalSeats
                          )}
                          %
                        </span>
                      </div>
                      <Progress
                        value={getOccupancyPercentage(
                          flightInstance?.totalSeats -
                            flightInstance?.availableSeats,
                          flightInstance?.totalSeats
                        )}
                        className="h-2"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">
                          Customer Satisfaction
                        </span>
                        <span className="text-sm text-purple-600 font-semibold">
                          4.9/5
                        </span>
                      </div>
                      <Progress value={98} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover-lift animate-slide-in-right">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5" />
                    Revenue Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">
                        {formatCurrency(
                          cabins?.reduce(
                            (sum, cabin) =>
                              sum + cabin.currentPrice * cabin.bookedSeats,
                            0
                          ) || 145000
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Estimated Revenue
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="font-semibold">
                          {formatCurrency(
                            cabins?.reduce(
                              (sum, cabin) =>
                                sum + cabin.baseFare * cabin.bookedSeats,
                              0
                            ) || 120000
                          )}
                        </div>
                        <div className="text-muted-foreground">Base Fare</div>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <div className="font-semibold">
                          {formatCurrency(
                            cabins?.reduce(
                              (sum, cabin) =>
                                sum + cabin.taxesAndFees * cabin.bookedSeats,
                              0
                            ) || 25000
                          )}
                        </div>
                        <div className="text-muted-foreground">
                          Taxes & Fees
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

       
      </div>
    </div>
  );
};

export default FlightInstanceDetail;
