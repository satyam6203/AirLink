import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Filter,
  Calendar,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Plane,
  MapPin,
  Clock,
  Users,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import {
  getAllFlightInstances,
  deleteFlightInstance,
} from "@/Redux/flightInstance/flightInstanceThunk";
import { useSelector } from "react-redux";

import { getFlightsByAirline } from "@/Redux/flight/flightThunk";
import { toast } from "sonner";
import { listAllAirports } from "@/Redux/airport/airportThunk";

const FlightInstanceTable = () => {
  const navigate = useNavigate();
  const [dateFilter, setDateFilter] = useState(null);
  const [departureAirportFilter, setDepartureAirportFilter] = useState("all");
  const [arrivalAirportFilter, setArrivalAirportFilter] = useState("all");
  const [flightFilter, setFlightFilter] = useState("all");
  const [sortField, setSortField] = useState("departureDateTime");
  const [sortDirection, setSortDirection] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const dispatch = useDispatch();
  const { paginatedFlightInstances } = useSelector(
    (store) => store.flightInstance,
  );

  const { flights } = useSelector((store) => store.flight);
  const { airports } = useSelector((store) => store.airport);



  useEffect(() => {

    dispatch(listAllAirports());
    dispatch(getFlightsByAirline());
  }, []);

  useEffect(() => {
    dispatch(
      getAllFlightInstances({
        page: currentPage - 1, // Spring uses 0-based pagination
        size: itemsPerPage,
        onDate: dateFilter ? format(dateFilter, "yyyy-MM-dd") : undefined,
        departureAirportId:
          departureAirportFilter !== "all" ? departureAirportFilter : undefined,
        arrivalAirportId:
          arrivalAirportFilter !== "all" ? arrivalAirportFilter : undefined,
        flightId: flightFilter !== "all" ? flightFilter : undefined,
        sort: `${sortField},${sortDirection}`,
      }),
    );
    console.log("arival ", arrivalAirportFilter, departureAirportFilter);
  }, [
    dispatch,
    currentPage,
    dateFilter,
    departureAirportFilter,
    arrivalAirportFilter,
    flightFilter,
    sortField,
    sortDirection,
  ]);

  // Use data directly from backend (already filtered, sorted, and paginated)
  const paginatedData = paginatedFlightInstances?.content || [];
  const totalPages = paginatedFlightInstances?.totalPages || 0;
  const totalElements = paginatedFlightInstances?.totalElements || 0;

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const clearFilters = () => {
    setDateFilter(null);

    setFlightFilter("all");
    setCurrentPage(1);
  };

  const hasActiveFilters =
    dateFilter ||
    departureAirportFilter !== "all" ||
    arrivalAirportFilter !== "all" ||
    flightFilter !== "all";

  const getStatusBadge = (status) => {
    const statusConfig = {
      Active: {
        color: "bg-green-100 text-green-800 border-green-200",
        icon: "✓",
      },
      "On-time": {
        color: "bg-green-100 text-green-800 border-green-200",
        icon: "✓",
      },
      Delayed: {
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        icon: "!",
      },
      Cancelled: { color: "bg-red-100 text-red-800 border-red-200", icon: "✗" },
      Boarding: {
        color: "bg-blue-100 text-blue-800 border-blue-200",
        icon: "→",
      },
      Landed: {
        color: "bg-purple-100 text-purple-800 border-purple-200",
        icon: "↓",
      },
    };

    const config = statusConfig[status] || statusConfig["Active"];

    return (
      <Badge className={cn("flex items-center gap-1 border", config.color)}>
        <span>{config.icon}</span>
        {status}
      </Badge>
    );
  };

  const formatDateTime = (dateTime) => {
    return new Date(dateTime).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getOccupancyColor = (available, total) => {
    const percentage = ((total - available) / total) * 100;
    if (percentage >= 90) return "text-red-600";
    if (percentage >= 70) return "text-yellow-600";
    return "text-green-600";
  };

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteFlightInstance(id));
      toast.success("deleted successfuly");
    } catch (error) {
      console.log("error ", error);
      toast.error("An error occurred while deleting the flight instance");
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Flight Instances
          </h1>
          <p className="text-muted-foreground">
            Manage flight schedules and operations
          </p>
        </div>
        <Button
          onClick={() => navigate("/airline/instances/new")}
          className="flex items-center gap-2"
        >
          <Plane className="h-4 w-4" />
          Create Instance
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}

            {/* Date Filter */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dateFilter && "text-muted-foreground",
                  )}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {dateFilter ? format(dateFilter, "PPP") : "select a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={dateFilter}
                  onSelect={setDateFilter}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            {/* Departure City Filter */}
            <Select
              value={departureAirportFilter}
              onValueChange={setDepartureAirportFilter}
            >
              <SelectTrigger className={"w-full"}>
                <SelectValue placeholder="Departure city" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departure Cities</SelectItem>
                {airports.map((airport) => (
                  <SelectItem key={airport.cityCode} value={airport.id}>
                    <span className="font-bold">{airport.city?.name}</span>
                    -
                    <span>{airport.name}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Arrival City Filter */}
            <Select
              value={arrivalAirportFilter}
              onValueChange={setArrivalAirportFilter}
            >
              <SelectTrigger className={"w-full"}>
                <SelectValue placeholder="Arrival city" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Arrival Cities</SelectItem>
                {airports.map((airport) => (
                  <SelectItem key={airport.id} value={airport.id}>
                    <span className="font-bold">{airport.city?.name}</span>
                    -
                    <span>{airport.name}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Flight Filter */}
            <Select value={flightFilter} onValueChange={setFlightFilter}>
              <SelectTrigger className={"w-full"}>
                <SelectValue placeholder="Filter by flight" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Flights</SelectItem>
                {flights.map((flight) => (
                  <SelectItem key={flight.id} value={flight.id.toString()}>
                    {flight.flightNumber}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <div className="mt-4 flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Clear All Filters
              </Button>
              <span className="text-sm text-muted-foreground">
                {totalElements} result
                {totalElements !== 1 ? "s" : ""} found
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Flight Instances ({totalElements})</span>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              {new Date().toLocaleDateString("en-IN")}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort("flightNumber")}
                  >
                    <div className="flex items-center gap-2">
                      Flight Number
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort("departureAirport")}
                  >
                    <div className="flex items-center gap-2">
                      Route
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort("departureDateTime")}
                  >
                    <div className="flex items-center gap-2">
                      Departure
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort("arrivalDateTime")}
                  >
                    <div className="flex items-center gap-2">
                      Arrival
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort("totalSeats")}
                  >
                    <div className="flex items-center gap-2">
                      Capacity
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort("status")}
                  >
                    <div className="flex items-center gap-2">
                      Status
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No flight instances found matching your filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedData.map((instance) => (
                    <TableRow key={instance.id} className="hover:bg-muted/50">
                      {/* Flight Number */}
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Plane className="h-4 w-4 text-muted-foreground" />
                          {instance.flightNumber}
                        </div>
                      </TableCell>

                      {/* Airports */}
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div className="font-medium text-sm">
                              {instance.departureAirport?.iataCode} →{" "}
                              {instance.arrivalAirport?.iataCode}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {instance.departureAirport?.city?.name} →{" "}
                              {instance.arrivalAirport?.city?.name}
                            </div>
                          </div>
                        </div>
                      </TableCell>

                      {/* Departure Time */}
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <div className="text-sm">
                            {formatDateTime(
                              instance.departureDateTime ||
                                instance.departureTime,
                            )}
                          </div>
                        </div>
                      </TableCell>

                      {/* Arrival Time */}
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <div className="text-sm">
                            {formatDateTime(
                              instance.arrivalDateTime || instance.arrivalTime,
                            )}
                          </div>
                        </div>
                      </TableCell>

                      {/* Seats */}
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div
                              className={cn(
                                "font-medium text-sm",
                                getOccupancyColor(
                                  instance.availableSeats ??
                                    instance.totalAvailableSeats,
                                  instance.totalSeats,
                                ),
                              )}
                            >
                              {instance.totalSeats -
                                (instance.availableSeats ??
                                  instance.totalAvailableSeats)}
                              /{instance.totalSeats}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {(instance.availableSeats ??
                                instance.totalAvailableSeats) ||
                                0}{" "}
                              available
                            </div>
                          </div>
                        </div>
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        <div>{getStatusBadge(instance.status)}</div>
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              navigate(`/airline/instances/${instance.id}`)
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
                              navigate(`/airline/instances/${instance.id}/edit`)
                            }
                            className="flex items-center gap-1"
                          >
                            <Edit className="h-4 w-4" />
                            Edit
                          </Button>

                          {/* Delete Button with Confirmation */}
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                                Delete
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Are you sure?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will permanently delete the flight
                                  instance{" "}
                                  <strong>
                                    {instance.flight?.flightNumber}
                                  </strong>{" "}
                                  from{" "}
                                  <strong>
                                    {instance.departureAirport?.iataCode}
                                  </strong>{" "}
                                  to{" "}
                                  <strong>
                                    {instance.arrivalAirport?.iataCode}
                                  </strong>{" "}
                                  on{" "}
                                  <strong>
                                    {new Date(
                                      instance.departureDateTime,
                                    ).toLocaleDateString("en-US", {
                                      month: "short",
                                      day: "numeric",
                                      year: "numeric",
                                    })}
                                  </strong>
                                  .
                                  <br />
                                  <br />
                                  This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() =>
                                    handleDelete(
                                      instance.id,
                                      instance.flight?.flightNumber,
                                    )
                                  }
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-muted-foreground">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                {Math.min(currentPage * itemsPerPage, totalElements)} of{" "}
                {totalElements} results
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={currentPage === 1}
                  className="flex items-center gap-1"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <Button
                        key={pageNum}
                        variant={
                          currentPage === pageNum ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => setCurrentPage(pageNum)}
                        className="w-8 h-8 p-0"
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-1"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FlightInstanceTable;
