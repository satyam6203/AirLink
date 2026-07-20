import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
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
  Navigation,
  Activity,
  AlertCircle,
  CheckCircle,
  Calendar as CalendarIcon,
  ChevronRight,
  Gauge,
  Fuel,
  Weight,
  Timer,
  Route,
  Building2,
  MapIcon,
  Zap,
  Star,
  Bookmark,
  Share2,
  Download,
  MoreVertical,
  RefreshCw,
  Phone,
  Mail,
  Globe,
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
  UtensilsCrossed,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { getFlightById } from "@/Redux/flight/flightThunk";
import { formatDateTime } from "@/utils/formateDateTime";
import { formatCurrency } from "@/utils/formateCurrency";
import FloatingActionButton from "@/components/navigation/FloatingActionButton";
import { getCabinClassesByAircraft } from "@/Redux/cabinClass/cabinClassThunk";
import { getFlightFares } from "@/Redux/fare/fareThunk";
import { getFlightCabinAncillariesByFlightAndCabinClass } from "@/Redux/flightCabinAncillary/flightCabinAncillaryThunk";
import { fetchFlightMealsByFlightId } from "@/Redux/flightMeal/flightMealThunk";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import FareDetailsCard from "./FareDetailsCard";


const FlightDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("overview");
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [selectedCabinClassId, setSelectedCabinClassId] = useState("");
  const [selectedAncillaryCabinId, setSelectedAncillaryCabinId] = useState("");
  const { cabinClasses } = useSelector((store) => store.cabinClass);

  const { flight, loading, error } = useSelector((store) => store.flight);
  const { fares, loading: faresLoading } = useSelector((store) => store.fare);
  const { cabinAncillaries, loading: ancillariesLoading } = useSelector((store) => store.flightCabinAncillary);
  const { flightMeals, loading: mealsLoading } = useSelector((store) => store.flightMeal);

  // Use cabin classes from the aircraft
  const cabins = cabinClasses || [];

  useEffect(() => {
    if (id) {
      dispatch(getFlightById(id));
    }
  }, [id, dispatch]);

  // Load cabin classes when flight data is available
  useEffect(() => {
    if (flight?.aircraft?.id) {
      dispatch(getCabinClassesByAircraft(flight.aircraft.id));
    }
  }, [flight?.aircraft?.id, dispatch]);

  // Fetch flight meals when flight is loaded
  useEffect(() => {
    if (id) {
      dispatch(fetchFlightMealsByFlightId(id));
    }
  }, [id, dispatch]);

  // Fetch fares when a cabin class is selected
  useEffect(() => {
    if (id && selectedCabinClassId) {
      const data={ flightId: id, cabinId: selectedCabinClassId }
      console.log("flightId, cabin id ",data)
      dispatch(getFlightFares(data));
    }
  }, [id, selectedCabinClassId, dispatch]);

  // Fetch ancillaries when a cabin class is selected in Ancillaries tab
  useEffect(() => {
    if (id && selectedAncillaryCabinId) {
      dispatch(getFlightCabinAncillariesByFlightAndCabinClass({
        flightId: id,
        cabinClassId: selectedAncillaryCabinId
      }));
    }
  }, [id, selectedAncillaryCabinId, dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto"></div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold animate-pulse">Loading Flight Details</h2>
            <p className="text-muted-foreground animate-pulse">Please wait while we fetch the information...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Alert className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error || "Failed to load flight details. Please try again."}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!flight) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Plane className="h-16 w-16 mx-auto text-muted-foreground" />
          <h2 className="text-xl font-semibold">Flight Not Found</h2>
          <p className="text-muted-foreground">The requested flight could not be found.</p>
          <Button onClick={() => navigate("/airline/flights")}>
            Back to Flights
          </Button>
        </div>
      </div>
    );
  }

  const getStatusConfig = (status) => {
    const configs = {
      SCHEDULED: { color: "bg-blue-100 text-blue-800 border-blue-200", icon: Clock, label: "Scheduled" },
      BOARDING: { color: "bg-green-100 text-green-800 border-green-200", icon: Users, label: "Boarding" },
      DELAYED: { color: "bg-yellow-100 text-yellow-800 border-yellow-200", icon: AlertTriangle, label: "Delayed" },
      DEPARTED: { color: "bg-purple-100 text-purple-800 border-purple-200", icon: Plane, label: "Departed" },
      ARRIVED: { color: "bg-green-100 text-green-800 border-green-200", icon: CheckCircle, label: "Arrived" },
      CANCELLED: { color: "bg-red-100 text-red-800 border-red-200", icon: AlertCircle, label: "Cancelled" },
    };
    return configs[status] || configs.SCHEDULED;
  };

  const statusConfig = getStatusConfig(flight.status);
  const StatusIcon = statusConfig.icon;

  const amenities = [
    { icon: Wifi, label: "Wi-Fi", available: true },
    { icon: Coffee, label: "Beverages", available: true },
    { icon: Utensils, label: "Meals", available: flight.aircraft?.hasmeals || false },
    { icon: MonitorSpeaker, label: "Entertainment", available: flight.aircraft?.hasEntertainment || true },
  ];

  const flightStats = [
    { label: "On-time Performance", value: "94%", trend: "+2%", icon: Target, color: "text-green-600" },
    { label: "Average Load Factor", value: "87%", trend: "+5%", icon: TrendingUp, color: "text-blue-600" },
    { label: "Customer Rating", value: "4.8", trend: "+0.2", icon: Star, color: "text-yellow-600" },
    { label: "Safety Score", value: "A+", trend: "↑", icon: Shield, color: "text-green-600" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex items-center gap-6">
            <Button
              variant="ghost"
              onClick={() => navigate("/airline/flights")}
              className="flex items-center gap-2 hover:bg-white/50 animate-fade-in"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Flights
            </Button>

            <div className="space-y-2 animate-slide-in-left">
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-2xl shadow-lg">
                  <Plane className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold flex items-center gap-3">
                    {flight.flightNumber}
                    <Badge className={cn("flex items-center gap-1 border animate-scale-in", statusConfig.color)}>
                      <StatusIcon className="h-3 w-3" />
                      {statusConfig.label}
                    </Badge>
                  </h1>
                  <p className="text-muted-foreground text-lg">
                    {flight.airline?.name || "Airline"} • {flight.aircraft?.model}
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
              className={cn("hover-lift", isBookmarked && "bg-yellow-50 border-yellow-200")}
            >
              <Bookmark className={cn("h-4 w-4", isBookmarked && "fill-yellow-500 text-yellow-500")} />
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
              onClick={() => navigate(`/airline/flights/${id}/edit`)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover-lift"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Flight
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
                    {flight.departureAirport?.iataCode || "DEP"}
                  </div>
                  <div className="text-xl font-semibold">
                    {flight.departureAirport?.city?.name || "Departure City"}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {flight.departureAirport?.name || "Departure Airport"}
                  </div>
                  <div className="flex items-center gap-2 mt-4 p-3 bg-blue-50 rounded-xl">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <div>
                      <div className="font-semibold">
                        {formatDateTime(flight.departureTime)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Terminal {flight.departureTerminal || "TBD"}
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
                      {flight.duration || "Flight Duration"}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {flight.distance || "Distance"} • Non-stop
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {flight.aircraft?.registration || "Aircraft Registration"}
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
                    {flight.arrivalAirport?.iataCode || "ARR"}
                  </div>
                  <div className="text-xl font-semibold">
                    {flight.arrivalAirport?.city?.name || "Arrival City"}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {flight.arrivalAirport?.name || "Arrival Airport"}
                  </div>
                  <div className="flex items-center gap-2 mt-4 p-3 bg-purple-50 rounded-xl">
                    <Clock className="h-5 w-5 text-purple-600" />
                    <div>
                      <div className="font-semibold">
                        {formatDateTime(flight.arrivalTime)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Terminal {flight.arrivalTerminal || "TBD"}
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
            <Card key={index} className={`hover-lift animate-fade-in animation-delay-${(index + 1) * 100} glass`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className={cn("text-xs font-medium", stat.color)}>{stat.trend}</p>
                  </div>
                  <stat.icon className={cn("h-8 w-8", stat.color)} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-7 bg-white/50 backdrop-blur-sm">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Info className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="aircraft" className="flex items-center gap-2">
              <Plane className="h-4 w-4" />
              Aircraft
            </TabsTrigger>
            <TabsTrigger value="route" className="flex items-center gap-2">
              <Route className="h-4 w-4" />
              Route
            </TabsTrigger>
            <TabsTrigger value="cabins" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Fares
            </TabsTrigger>
            <TabsTrigger value="meals" className="flex items-center gap-2">
              <UtensilsCrossed className="h-4 w-4" />
              Meals
            </TabsTrigger>
            <TabsTrigger value="ancillaries" className="flex items-center gap-2">
              <Coffee className="h-4 w-4" />
              Ancillaries
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
                    Flight Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Flight Number</label>
                      <div className="font-mono">{flight.flightNumber}</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Airline</label>
                      <div>{flight.airline?.name || "N/A"}</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Aircraft</label>
                      <div>{flight.aircraft?.model || "N/A"}</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Registration</label>
                      <div className="font-mono">{flight.aircraft?.registration || "N/A"}</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Status</label>
                      <div>
                        <Badge className={cn("flex items-center gap-1 border w-fit", statusConfig.color)}>
                          <StatusIcon className="h-3 w-3" />
                          {statusConfig.label}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Gate</label>
                      <div>{flight.gate || "TBD"}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Timing Details */}
              <Card className="hover-lift animate-slide-in-right">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Timing Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-sm font-medium">Scheduled Departure</span>
                      </div>
                      <span className="font-semibold">{formatDateTime(flight.departureTime)}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span className="text-sm font-medium">Scheduled Arrival</span>
                      </div>
                      <span className="font-semibold">{formatDateTime(flight.arrivalTime)}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Timer className="h-4 w-4 text-gray-500" />
                        <span className="text-sm font-medium">Flight Duration</span>
                      </div>
                      <span className="font-semibold">{flight.duration || "2h 30m"}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Cabin Configuration Summary */}
            <Card className="hover-lift animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Cabin Configuration Summary
                  <Badge variant="outline" className="ml-auto">
                    {cabins.length} cabin{cabins.length !== 1 ? 's' : ''}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {cabins.length > 0 ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {cabins.map((cabinClass) => (
                        <div
                          key={cabinClass.id}
                          className="p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
                          onClick={() => navigate(`/airline/fares`)}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant="secondary">{cabinClass.code}</Badge>
                          </div>
                          <div className="font-medium text-sm">{cabinClass.name}</div>
                          <div className="text-xs text-muted-foreground truncate">
                            {cabinClass.description}
                          </div>
                          <div className="text-xs text-blue-600 mt-1">
                            Capacity: {cabinClass.capacity || 0} seats
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t">
                      <span className="text-sm text-muted-foreground">
                        Total configured cabin classes
                      </span>
                      <Button
                        onClick={() => setActiveTab('cabins')}
                        variant="outline"
                        size="sm"
                      >
                        View All Cabins
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Users className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <div className="text-sm text-muted-foreground">No cabin classes configured for this aircraft</div>
                    <Button
                      onClick={() => navigate(`/airline/cabin-classes`)}
                      size="sm"
                      className="mt-2"
                    >
                      Create First Cabin
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

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

          {/* Aircraft Tab */}
          <TabsContent value="aircraft" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="hover-lift animate-slide-in-left">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plane className="h-5 w-5" />
                    Aircraft Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Plane className="h-12 w-12 text-white" />
                    </div>
                    <h3 className="text-xl font-bold">{flight.aircraft?.model || "Aircraft Model"}</h3>
                    <p className="text-muted-foreground">{flight.aircraft?.registration || "Registration"}</p>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <label className="font-medium text-muted-foreground">Manufacturer</label>
                      <div>{flight.aircraft?.manufacturer || "Boeing"}</div>
                    </div>
                    <div>
                      <label className="font-medium text-muted-foreground">Year</label>
                      <div>{flight.aircraft?.year || "2020"}</div>
                    </div>
                    <div>
                      <label className="font-medium text-muted-foreground">Max Speed</label>
                      <div>{flight.aircraft?.maxSpeed || "900 km/h"}</div>
                    </div>
                    <div>
                      <label className="font-medium text-muted-foreground">Range</label>
                      <div>{flight.aircraft?.range || "6,000 km"}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover-lift animate-slide-in-right">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Seating Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                      <span className="font-medium">First Class</span>
                      <span className="font-bold">{flight.aircraft?.firstClassSeats || 12}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <span className="font-medium">Business Class</span>
                      <span className="font-bold">{flight.aircraft?.businessSeats || 28}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span className="font-medium">Premium Economy</span>
                      <span className="font-bold">{flight.aircraft?.premiumEconomySeats || 36}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">Economy</span>
                      <span className="font-bold">{flight.aircraft?.economySeats || 150}</span>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center font-semibold text-lg">
                    <span>Total Capacity</span>
                    <span>{flight.aircraft?.totalSeats || 226}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Route Tab */} 
          <TabsContent value="route" className="space-y-6">
            <Card className="hover-lift animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Route className="h-5 w-5" />
                  Route Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Departure Airport
                      </h4>
                      <div className="space-y-2 pl-6">
                        <p><strong>Name:</strong> {flight.departureAirport?.name || "Departure Airport"}</p>
                        <p><strong>IATA:</strong> {flight.departureAirport?.iataCode || "DEP"}</p>
                        <p><strong>City:</strong> {flight.departureAirport?.city?.name || "Departure City"}</p>
                        <p><strong>Country:</strong> {flight.departureAirport?.country || "Country"}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-semibold flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Arrival Airport
                      </h4>
                      <div className="space-y-2 pl-6">
                        <p><strong>Name:</strong> {flight.arrivalAirport?.name || "Arrival Airport"}</p>
                        <p><strong>IATA:</strong> {flight.arrivalAirport?.iataCode || "ARR"}</p>
                        <p><strong>City:</strong> {flight.arrivalAirport?.city?.name || "Arrival City"}</p>
                        <p><strong>Country:</strong> {flight.arrivalAirport?.country || "Country"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Fare Tab - Fare Details */}
          <TabsContent value="cabins" className="space-y-6">
            <div className="space-y-6">
              {/* Header with cabin class selector */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold">Fare Details</h3>
                  <p className="text-sm text-muted-foreground">
                    View fare configurations per cabin class for this flight
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {cabins?.length > 0 && (
                    <Select
                      value={selectedCabinClassId}
                      onValueChange={setSelectedCabinClassId}
                    >
                      <SelectTrigger className="w-[220px]">
                        <SelectValue placeholder="Select cabin class" />
                      </SelectTrigger>
                      <SelectContent>
                        {cabins.map((cabinClass) => (
                          <SelectItem key={cabinClass.id} value={String(cabinClass.id)}>
                            #{cabinClass.id} {cabinClass.name}({cabinClass.code})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  <Button
                    onClick={() => navigate(`/airline/fares/new`)}
                    className="flex items-center gap-2 bg-gradient-to-r from-[#5400bc] to-[indigo] hover:from-[#610098] hover:to-indigo-700"
                  >
                    <Plus className="h-4 w-4" />
                    Add Fare
                  </Button>
                </div>
              </div>

              {/* Content */}
              {!cabins?.length ? (
                <Card className="border-2 border-dashed border-gray-300 bg-gray-50/50">
                  <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                    <Users className="h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">No Cabin Classes</h3>
                    <p className="text-gray-500 mb-4 max-w-md">
                      Configure cabin classes for the aircraft to enable fare management for this flight.
                    </p>
                    <Button
                      onClick={() => navigate(`/airline/cabin-classes`)}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Configure Cabin Classes
                    </Button>
                  </CardContent>
                </Card>
              ) : !selectedCabinClassId ? (
                <Card className="border-2 border-dashed border-gray-300 bg-gray-50/50">
                  <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                    <DollarSign className="h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">Select a Cabin Class</h3>
                    <p className="text-gray-500 max-w-md">
                      Choose a cabin class from the dropdown above to view its fare details.
                    </p>
                  </CardContent>
                </Card>
              ) : faresLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center space-y-4">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto"></div>
                    <p className="text-muted-foreground">Loading fares...</p>
                  </div>
                </div>
              ) : fares?.length === 0 ? (
                <Card className="border-2 border-dashed border-gray-300 bg-gray-50/50">
                  <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                    <DollarSign className="h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">No Fares Found</h3>
                    <p className="text-gray-500 mb-4 max-w-md">
                      No fares have been configured for the selected cabin class on this flight.
                    </p>
                    <Button
                      onClick={() => navigate(`/airline/fares/new`)}
                      className="bg-gradient-to-r from-[#5400bc] to-[indigo] hover:from-[#610098] hover:to-indigo-700"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create Fare
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-6">
                  {fares.map((fare) => (
                    <FareDetailsCard fare={fare} key={fare.id}/>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Meals Tab */}
          <TabsContent value="meals" className="space-y-6">
            <div className="space-y-6">
              {/* Header with Add Meal button */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold">Flight Meals</h3>
                  <p className="text-sm text-muted-foreground">
                    In-flight meal options configured for this flight
                  </p>
                </div>
                <Button
                  onClick={() => navigate(`/airline/flights/${id}/meals/assign`)}
                  className="flex items-center gap-2 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                >
                  <Plus className="h-4 w-4" />
                  Add Meal
                </Button>
              </div>

              {/* Content */}
              {mealsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center space-y-4">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto"></div>
                    <p className="text-muted-foreground">Loading meals...</p>
                  </div>
                </div>
              ) : flightMeals?.length === 0 ? (
                <Card className="border-2 border-dashed border-gray-300 bg-gray-50/50">
                  <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                    <UtensilsCrossed className="h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">No Meals Configured</h3>
                    <p className="text-gray-500 mb-4 max-w-md">
                      No meals have been assigned to this flight yet. Add meals to offer in-flight dining options.
                    </p>
                    <Button
                      onClick={() => navigate(`/airline/flights/${id}/meals/assign`)}
                      className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Meal
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {flightMeals.map((flightMeal) => (
                    <Card key={flightMeal.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {flightMeal.meal?.imageUrl ? (
                              <img
                                src={flightMeal.meal.imageUrl}
                                alt={flightMeal.meal.name}
                                className="w-10 h-10 rounded-lg object-cover"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                                <UtensilsCrossed className="h-5 w-5 text-orange-600" />
                              </div>
                            )}
                            <div>
                              <CardTitle className="text-base">{flightMeal.meal?.name || "Meal"}</CardTitle>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {flightMeal.meal?.category || flightMeal.meal?.mealType}
                              </p>
                            </div>
                          </div>
                          <Badge
                            variant={flightMeal.available ? "default" : "secondary"}
                            className={flightMeal.available ? "bg-green-100 text-green-800 border-green-200" : ""}
                          >
                            {flightMeal.available ? "Available" : "Unavailable"}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {flightMeal.meal?.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {flightMeal.meal.description}
                          </p>
                        )}

                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="p-2 bg-orange-50 rounded-lg text-center">
                            <div className="text-xs text-muted-foreground">Price</div>
                            <div className="font-semibold">
                              {flightMeal.complimentary
                                ? "Free"
                                : formatCurrency(flightMeal.price || 0)}
                            </div>
                          </div>
                          <div className="p-2 bg-red-50 rounded-lg text-center">
                            <div className="text-xs text-muted-foreground">Max Qty</div>
                            <div className="font-semibold">{flightMeal.maxQuantity || "N/A"}</div>
                          </div>
                        </div>

                        {flightMeal.complimentary && (
                          <div className="flex items-center gap-1.5 text-xs text-green-700 bg-green-50 px-2 py-1 rounded">
                            <CheckCircle className="h-3 w-3" />
                            Complimentary
                          </div>
                        )}

                        
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Ancillaries Tab */}
          <TabsContent value="ancillaries" className="space-y-6">
            <div className="space-y-6">
              {/* Header with cabin class selector */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold">Ancillary Services</h3>
                  <p className="text-sm text-muted-foreground">
                    View ancillary configurations per cabin class for this flight
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {cabins?.length > 0 && (
                    <Select
                      value={selectedAncillaryCabinId}
                      onValueChange={setSelectedAncillaryCabinId}
                    >
                      <SelectTrigger className="w-[220px]">
                        <SelectValue placeholder="Select cabin class" />
                      </SelectTrigger>
                      <SelectContent>
                        {cabins.map((cabinClass) => (
                          <SelectItem key={cabinClass.id} value={String(cabinClass.id)}>
                            #{cabinClass.id} {cabinClass.name}({cabinClass.code})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  <Button
                    onClick={() => navigate(`/airline/cabin-ancillaries/new`)}
                    className="flex items-center gap-2 bg-gradient-to-r from-[#5400bc] to-[indigo] hover:from-[#610098] hover:to-indigo-700"
                  >
                    <Plus className="h-4 w-4" />
                    Add Ancillary
                  </Button>
                </div>
              </div>

              {/* Content */}
              {!cabins?.length ? (
                <Card className="border-2 border-dashed border-gray-300 bg-gray-50/50">
                  <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                    <Users className="h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">No Cabin Classes</h3>
                    <p className="text-gray-500 mb-4 max-w-md">
                      Configure cabin classes for the aircraft to enable ancillary management for this flight.
                    </p>
                    <Button
                      onClick={() => navigate(`/airline/cabin-classes`)}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Configure Cabin Classes
                    </Button>
                  </CardContent>
                </Card>
              ) : !selectedAncillaryCabinId ? (
                <Card className="border-2 border-dashed border-gray-300 bg-gray-50/50">
                  <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                    <Coffee className="h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">Select a Cabin Class</h3>
                    <p className="text-gray-500 max-w-md">
                      Choose a cabin class from the dropdown above to view its ancillary services.
                    </p>
                  </CardContent>
                </Card>
              ) : ancillariesLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center space-y-4">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto"></div>
                    <p className="text-muted-foreground">Loading ancillaries...</p>
                  </div>
                </div>
              ) : cabinAncillaries?.length === 0 ? (
                <Card className="border-2 border-dashed border-gray-300 bg-gray-50/50">
                  <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                    <Coffee className="h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">No Ancillaries Found</h3>
                    <p className="text-gray-500 mb-4 max-w-md">
                      No ancillary services have been configured for the selected cabin class on this flight.
                    </p>
                    <Button
                      onClick={() => navigate(`/airline/cabin-ancillaries/new`)}
                      className="bg-gradient-to-r from-[#5400bc] to-[indigo] hover:from-[#610098] hover:to-indigo-700"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Ancillary
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {cabinAncillaries.map((cabinAnc) => (
                    <Card key={cabinAnc.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {cabinAnc.ancillary?.iconUrl && (
                              <span className="text-2xl">{cabinAnc.ancillary.iconUrl}</span>
                            )}
                            <div>
                              <CardTitle className="text-base">{cabinAnc.ancillary?.name || "Ancillary"}</CardTitle>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {cabinAnc.ancillary?.category || cabinAnc.ancillary?.type}
                              </p>
                            </div>
                          </div>
                          <Badge
                            variant={cabinAnc.available ? "default" : "secondary"}
                            className={cabinAnc.available ? "bg-green-100 text-green-800 border-green-200" : ""}
                          >
                            {cabinAnc.available ? "Available" : "Unavailable"}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {cabinAnc.ancillary?.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {cabinAnc.ancillary.description}
                          </p>
                        )}

                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="p-2 bg-blue-50 rounded-lg text-center">
                            <div className="text-xs text-muted-foreground">Price</div>
                            <div className="font-semibold">
                              {cabinAnc.includedInFare
                                ? "Included"
                                : formatCurrency(cabinAnc.price || 0)}
                            </div>
                          </div>
                          <div className="p-2 bg-purple-50 rounded-lg text-center">
                            <div className="text-xs text-muted-foreground">Max Qty</div>
                            <div className="font-semibold">{cabinAnc.maxQuantity || "N/A"}</div>
                          </div>
                        </div>

                        {cabinAnc.includedInFare && (
                          <div className="flex items-center gap-1.5 text-xs text-green-700 bg-green-50 px-2 py-1 rounded">
                            <CheckCircle className="h-3 w-3" />
                            Included in fare
                          </div>
                        )}

                        <div className="flex gap-2 flex-wrap">
                          {cabinAnc.ancillary?.type && (
                            <Badge variant="outline" className="text-xs">{cabinAnc.ancillary.type}</Badge>
                          )}
                          {cabinAnc.ancillary?.subType && (
                            <Badge variant="outline" className="text-xs">{cabinAnc.ancillary.subType}</Badge>
                          )}
                          {cabinAnc.currency && !cabinAnc.includedInFare && (
                            <Badge variant="outline" className="text-xs">{cabinAnc.currency}</Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
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
                        <span className="text-sm font-medium">On-time Performance</span>
                        <span className="text-sm text-green-600 font-semibold">94%</span>
                      </div>
                      <Progress value={94} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Load Factor</span>
                        <span className="text-sm text-blue-600 font-semibold">87%</span>
                      </div>
                      <Progress value={87} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Customer Satisfaction</span>
                        <span className="text-sm text-purple-600 font-semibold">4.8/5</span>
                      </div>
                      <Progress value={96} className="h-2" />
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
                        {formatCurrency(flight.estimatedRevenue || 125000)}
                      </div>
                      <p className="text-sm text-muted-foreground">Estimated Revenue</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="font-semibold">{formatCurrency(flight.ticketRevenue || 105000)}</div>
                        <div className="text-muted-foreground">Ticket Sales</div>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <div className="font-semibold">{formatCurrency(flight.ancillaryRevenue || 20000)}</div>
                        <div className="text-muted-foreground">Ancillary</div>
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

export default FlightDetail;