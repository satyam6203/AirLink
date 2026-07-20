import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
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
  RotateCcw,
  CheckCircle,
  XCircle,
  CalendarDays,
  Plus,
  Eye,
  Trash2,
  Globe,
  Navigation,
  Timer,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { getFlightScheduleById } from "@/Redux/flightSchedule/flightScheduleThunk";

// Mock data for flight schedule detail - matching the provided structure
const mockFlightScheduleDetail = {
  id: 1,
  flightId: 1,
  flightNumber: "ZA123",
  departureAirportId: 1,
  arrivalAirportId: 2,
  departureTime: "18:00:00",
  arrivalTime: "23:00:00",
  recurrenceType: "WEEKLY",
  operatingDays: ['TUESDAY', 'THURSDAY', 'WEDNESDAY', 'FRIDAY'],
  isActive: true,
  totalSeats: null,
  availableSeats: null,
  departureAirport: {
    id: 1,
    iataCode: 'DEL',
    name: 'Indira Gandhi International Airport',
    detailedName: 'Indira Gandhi International Airport - Terminal 2',
    timeZone: 'Asia/Kolkata',
    address: {
      street: 'Airport Road',
      postalCode: '110037',
      cityName: 'New Delhi',
      countryName: 'India',
      regionCode: 'ASIA'
    },
    city: {
      id: 1,
      name: 'New Delhi',
      cityCode: 'DEL',
      countryCode: 'IN',
      countryName: 'India'
    },
    geoCode: {
      latitude: 28.5562,
      longitude: 77.1000
    }
  },
  arrivalAirport: {
    id: 2,
    iataCode: 'BOM',
    name: 'Chhatrapati Shivaji Maharaj International Airport',
    detailedName: 'Chhatrapati Shivaji Maharaj International Airport - Terminal 2',
    timeZone: 'Asia/Kolkata',
    address: {
      street: 'Sahar Airport Road',
      postalCode: '400099',
      cityName: 'Mumbai',
      countryName: 'India',
      regionCode: 'ASIA'
    },
    city: {
      id: 3,
      name: 'Mumbai',
      cityCode: 'BOM',
      countryCode: 'IN',
      countryName: 'India'
    },
    geoCode: {
      latitude: 19.0896,
      longitude: 72.8656
    }
  }
};

const FlightScheduleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { currentFlightSchedule, loading } = useSelector(
    (state) => state.flightSchedule || {}
  );

  const [activeTab, setActiveTab] = useState("overview");
  const [flightSchedule, setFlightSchedule] = useState(null);

  useEffect(() => {
    if (id) {
      dispatch(getFlightScheduleById(id)).then((result) => {
        if (result.payload) {
          setFlightSchedule(result.payload);
        } else {
          // Use mock data if API call fails
          setFlightSchedule(mockFlightScheduleDetail);
        }
      });
    } else {
      setFlightSchedule(mockFlightScheduleDetail);
    }
  }, [dispatch, id]);

  if (loading || !flightSchedule) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Loading...</h2>
          <p className="text-gray-600">Fetching flight schedule details</p>
        </div>
      </div>
    );
  }

  const getStatusBadge = (isActive) => {
    return (
      <Badge
        className={cn(
          "flex items-center gap-1",
          isActive
            ? "bg-green-100 text-green-800 border-green-200"
            : "bg-gray-100 text-gray-800 border-gray-200"
        )}
      >
        {isActive ? (
          <CheckCircle className="h-3 w-3" />
        ) : (
          <XCircle className="h-3 w-3" />
        )}
        {isActive ? "Active" : "Inactive"}
      </Badge>
    );
  };

  const getRecurrenceBadge = (type, operatingDays) => {
    const config = {
      DAILY: { color: "bg-blue-100 text-blue-800", label: "Daily" },
      WEEKLY: {
        color: "bg-purple-100 text-purple-800",
        label: `Weekly (${operatingDays?.length || 0}d)`,
      },
      CUSTOM: { color: "bg-orange-100 text-orange-800", label: "Custom" },
    };

    const typeConfig = config[type] || config["CUSTOM"];

    return (
      <Badge className={cn("flex items-center gap-1", typeConfig.color)}>
        <RotateCcw className="h-3 w-3" />
        {typeConfig.label}
      </Badge>
    );
  };

  const getInstanceStatusBadge = (status) => {
    const statusConfig = {
      SCHEDULED: { color: "bg-blue-100 text-blue-800", icon: "📅" },
      ACTIVE: { color: "bg-green-100 text-green-800", icon: "✈️" },
      DELAYED: { color: "bg-yellow-100 text-yellow-800", icon: "⏰" },
      CANCELLED: { color: "bg-red-100 text-red-800", icon: "❌" },
      COMPLETED: { color: "bg-purple-100 text-purple-800", icon: "✅" },
    };

    const config = statusConfig[status] || statusConfig["SCHEDULED"];

    return (
      <Badge className={cn("flex items-center gap-1", config.color)}>
        <span>{config.icon}</span>
        {status.charAt(0) + status.slice(1).toLowerCase()}
      </Badge>
    );
  };

  const formatDateTime = (dateTime) => {
    return new Date(dateTime).toLocaleString("en-IN", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    const hour24 = parseInt(hours);
    const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
    const ampm = hour24 >= 12 ? 'PM' : 'AM';
    return `${hour12}:${minutes} ${ampm}`;
  };

  const formatTimeZone = (timeZone) => {
    return timeZone?.split('/').pop() || 'Local';
  };

  const getDuration = (depTime, arrTime) => {
    const [depHour, depMin] = depTime.split(":").map(Number);
    const [arrHour, arrMin] = arrTime.split(":").map(Number);

    let diffMin = arrHour * 60 + arrMin - (depHour * 60 + depMin);
    if (diffMin < 0) diffMin += 24 * 60; // Handle overnight flights

    const hours = Math.floor(diffMin / 60);
    const minutes = diffMin % 60;

    return `${hours}h ${minutes}m`;
  };

  const getOccupancyPercentage = (booked, total) => {
    return Math.round((booked / total) * 100);
  };

  const getOccupancyColor = (percentage) => {
    if (percentage >= 90) return "text-red-600";
    if (percentage >= 70) return "text-yellow-600";
    return "text-green-600";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
        <div className="flex items-center gap-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/airline/schedules")}
            className="flex items-center gap-2 hover:bg-white/60 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Schedules
          </Button>
          <div>
            <div className="flex items-center gap-4 mb-2">
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div className="p-2 bg-blue-600 rounded-lg shadow-lg">
                  <Plane className="h-8 w-8 text-white" />
                </div>
                {flightSchedule.flightNumber}
              </h1>
              {getStatusBadge(flightSchedule.isActive)}
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Navigation className="h-4 w-4" />
                {flightSchedule.departureAirport.city.cityCode} → {flightSchedule.arrivalAirport.city.cityCode}
              </span>
              <span className="flex items-center gap-1">
                <Timer className="h-4 w-4" />
                {getDuration(flightSchedule.departureTime, flightSchedule.arrivalTime)}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => navigate(`/airline/schedules/${id}/edit`)}
            className="flex items-center gap-2 bg-white border-blue-200 hover:bg-blue-50"
          >
            <Edit className="h-4 w-4" />
            Edit Schedule
          </Button>
        </div>
      </div>

      {/* Schedule Route Card */}
      <Card className="overflow-hidden shadow-lg border-0">
        <CardContent className="p-0">
          <div className="bg-gradient-to-r from-slate-50 to-gray-50 p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Departure */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 text-sm text-emerald-600 font-medium mb-4">
                  <div className="p-1.5 bg-emerald-100 rounded-lg">
                    <MapPin className="h-4 w-4" />
                  </div>
                  Departure
                </div>
                <div className="space-y-3">
                  <div className="flex items-baseline gap-2">
                    <div className="text-3xl font-bold text-gray-900">
                      {flightSchedule.departureAirport.iataCode}
                    </div>
                    <div className="text-lg font-semibold text-gray-700">
                      {formatTime(flightSchedule.departureTime)}
                    </div>
                  </div>
                  <div>
                    <div className="text-base font-semibold text-gray-800">
                      {flightSchedule.departureAirport.city.name}
                    </div>
                    <div className="text-sm text-gray-600 leading-relaxed">
                      {flightSchedule.departureAirport.name}
                    </div>
                  </div>
                  <div className="pt-2 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Globe className="h-3 w-3" />
                      <span>{formatTimeZone(flightSchedule.departureAirport.timeZone)}</span>
                      <span>•</span>
                      <span>{flightSchedule.departureAirport.city.countryName}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Flight Duration */}
              <div className="flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="flex items-center justify-center">
                    <div className="h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent flex-1"></div>
                    <div className="mx-6 p-3 bg-blue-600 rounded-full shadow-lg">
                      <Plane className="h-6 w-6 text-white" />
                    </div>
                    <div className="h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent flex-1"></div>
                  </div>
                  <div className="bg-white rounded-lg px-4 py-2 shadow-sm border border-gray-100">
                    <div className="text-sm font-semibold text-blue-700">
                      {getDuration(flightSchedule.departureTime, flightSchedule.arrivalTime)}
                    </div>
                    <div className="text-xs text-gray-500">Flight Duration</div>
                  </div>
                  <div className="text-xs text-gray-400">
                    Direct Flight
                  </div>
                </div>
              </div>

              {/* Arrival */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 text-sm text-orange-600 font-medium mb-4">
                  <div className="p-1.5 bg-orange-100 rounded-lg">
                    <MapPin className="h-4 w-4" />
                  </div>
                  Arrival
                </div>
                <div className="space-y-3">
                  <div className="flex items-baseline gap-2">
                    <div className="text-3xl font-bold text-gray-900">
                      {flightSchedule.arrivalAirport.iataCode}
                    </div>
                    <div className="text-lg font-semibold text-gray-700">
                      {formatTime(flightSchedule.arrivalTime)}
                    </div>
                  </div>
                  <div>
                    <div className="text-base font-semibold text-gray-800">
                      {flightSchedule.arrivalAirport.city.name}
                    </div>
                    <div className="text-sm text-gray-600 leading-relaxed">
                      {flightSchedule.arrivalAirport.name}
                    </div>
                  </div>
                  <div className="pt-2 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Globe className="h-3 w-3" />
                      <span>{formatTimeZone(flightSchedule.arrivalAirport.timeZone)}</span>
                      <span>•</span>
                      <span>{flightSchedule.arrivalAirport.city.countryName}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1 rounded-xl">
          <TabsTrigger value="overview" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg transition-all">
            <Info className="h-4 w-4" />
            Schedule Overview
          </TabsTrigger>
          <TabsTrigger value="instances" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg transition-all">
            <CalendarDays className="h-4 w-4" />
            Flight Instances
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Schedule Configuration */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {/* Schedule Configuration Card */}
            <Card className="shadow-sm border-gray-200">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
                <CardTitle className="flex items-center gap-2 text-blue-900">
                  <div className="p-2 bg-blue-600 rounded-lg">
                    <Settings className="h-5 w-5 text-white" />
                  </div>
                  Schedule Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">
                    Recurrence Pattern
                  </label>
                  <div className="flex items-center gap-2">
                    {getRecurrenceBadge(
                      flightSchedule.recurrenceType,
                      flightSchedule.operatingDays
                    )}
                  </div>
                </div>

                {flightSchedule.recurrenceType === "WEEKLY" &&
                  flightSchedule.operatingDays?.length > 0 && (
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-3 block">
                        Operating Days ({flightSchedule.operatingDays.length} days/week)
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {flightSchedule.operatingDays.map((day) => (
                          <div
                            key={day}
                            className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg border border-blue-100"
                          >
                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                            <span className="text-sm font-medium text-blue-900">
                              {day.charAt(0) + day.slice(1).toLowerCase()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">
                    Schedule Status
                  </label>
                  <div>
                    {getStatusBadge(flightSchedule.isActive)}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Airport Details Card */}
            <Card className="shadow-sm border-gray-200">
              <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100">
                <CardTitle className="flex items-center gap-2 text-emerald-900">
                  <div className="p-2 bg-emerald-600 rounded-lg">
                    <Globe className="h-5 w-5 text-white" />
                  </div>
                  Airport Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">
                      Departure Terminal
                    </label>
                    <div className="text-sm text-gray-600">
                      {flightSchedule.departureAirport.detailedName}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {flightSchedule.departureAirport.address.street}, {flightSchedule.departureAirport.address.cityName}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">
                      Arrival Terminal
                    </label>
                    <div className="text-sm text-gray-600">
                      {flightSchedule.arrivalAirport.detailedName}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {flightSchedule.arrivalAirport.address.street}, {flightSchedule.arrivalAirport.address.cityName}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-gray-100">
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-gray-500">Distance</span>
                        <div className="font-medium text-gray-700">~1,150 km</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Region</span>
                        <div className="font-medium text-gray-700">
                          {flightSchedule.departureAirport.address.regionCode}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Flight Metrics Card */}
            <Card className="shadow-sm border-gray-200">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-purple-100">
                <CardTitle className="flex items-center gap-2 text-purple-900">
                  <div className="p-2 bg-purple-600 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-white" />
                  </div>
                  Flight Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">
                    Capacity Configuration
                  </label>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Seats per flight</div>
                    <div className="text-2xl font-bold text-gray-900">
                      {flightSchedule.totalSeats || "TBD"}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">To be configured</div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">
                    Weekly Frequency
                  </label>
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-100">
                    <span className="text-sm text-purple-700">
                      {flightSchedule.operatingDays?.length || 0} flights/week
                    </span>
                    <div className="text-xl font-bold text-purple-900">
                      {flightSchedule.operatingDays?.length || 0}x
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">
                    Flight ID
                  </label>
                  <div className="font-mono text-sm bg-gray-100 px-3 py-2 rounded border">
                    #{flightSchedule.flightId}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Flight Instances Tab */}
        <TabsContent value="instances" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Flight Instances</h3>
            <Button
              onClick={() => navigate("/airline/instances/new")}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Create Instance
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>
                Upcoming Instances ({flightSchedule.instances?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Instance Code</TableHead>
                      <TableHead>Departure</TableHead>
                      <TableHead>Arrival</TableHead>
                      <TableHead>Occupancy</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {flightSchedule.instances?.length > 0 ? (
                      flightSchedule.instances.map((instance) => {
                        const occupancyPercentage = getOccupancyPercentage(
                          instance.bookedSeats,
                          instance.totalSeats
                        );

                        return (
                          <TableRow
                            key={instance.id}
                            className="hover:bg-muted/50"
                          >
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-2">
                                <Plane className="h-4 w-4 text-muted-foreground" />
                                {instance.flightInstanceCode}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                {formatDateTime(instance.departureDateTime)}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                {formatDateTime(instance.arrivalDateTime)}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-muted-foreground" />
                                <div>
                                  <div
                                    className={cn(
                                      "font-medium text-sm",
                                      getOccupancyColor(occupancyPercentage)
                                    )}
                                  >
                                    {instance.bookedSeats}/{instance.totalSeats}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {occupancyPercentage}% full
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              {getInstanceStatusBadge(instance.status)}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    navigate(
                                      `/airline/instances/${instance.id}`
                                    )
                                  }
                                  className="flex items-center gap-1"
                                >
                                  <Eye className="h-4 w-4" />
                                  View
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    navigate(
                                      `/airline/instances/${instance.id}/edit`
                                    )
                                  }
                                  className="flex items-center gap-1"
                                >
                                  <Edit className="h-4 w-4" />
                                  Edit
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="flex items-center gap-1 text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                  Cancel
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="text-center py-8 text-muted-foreground"
                        >
                          No flight instances found for this schedule
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FlightScheduleDetail;
