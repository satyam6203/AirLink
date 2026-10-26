import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Search,
  Filter,
  Calendar,
  Eye,
  Edit,
  Trash2,
  ArrowUpDown,
  Plane,
  MapPin,
  Clock,
  Plus,
  RotateCcw,
  CheckCircle,
  XCircle,
  ArrowRight,
  CalendarRange,
  Layers
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
  getAllFlightSchedules,
  deleteFlightSchedule,
} from "@/Redux/flightSchedule/flightScheduleThunk";
import { getFlightsByAirline } from "@/Redux/flight/flightThunk";

const FlightScheduleTable = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { flightSchedules = [], loading, error } = useSelector(
    (state) => state.flightSchedule || {}
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [recurrenceFilter, setRecurrenceFilter] = useState("all");

  useEffect(() => {
    dispatch(getAllFlightSchedules());
    dispatch(getFlightsByAirline());
  }, [dispatch]);

  const rawSchedules = useMemo(() => {
    return Array.isArray(flightSchedules) ? flightSchedules : [];
  }, [flightSchedules]);

  // Safe time formatter
  const formatTime = (timeVal) => {
    if (!timeVal) return "--:--";
    if (typeof timeVal === "string") {
      const parts = timeVal.split(":");
      return `${parts[0].padStart(2, "0")}:${(parts[1] || "00").padStart(2, "0")}`;
    }
    if (Array.isArray(timeVal) && timeVal.length >= 2) {
      return `${String(timeVal[0]).padStart(2, "0")}:${String(timeVal[1]).padStart(2, "0")}`;
    }
    return String(timeVal);
  };

  // Safe duration calculator
  const getDuration = (depTime, arrTime) => {
    if (!depTime || !arrTime) return "";
    try {
      const depStr = formatTime(depTime);
      const arrStr = formatTime(arrTime);
      const [depH, depM] = depStr.split(":").map(Number);
      const [arrH, arrM] = arrStr.split(":").map(Number);
      let diff = arrH * 60 + arrM - (depH * 60 + depM);
      if (diff < 0) diff += 24 * 60;
      const h = Math.floor(diff / 60);
      const m = diff % 60;
      return `${h}h ${m}m`;
    } catch {
      return "";
    }
  };

  // Safe date formatter
  const formatDate = (dateVal) => {
    if (!dateVal) return "";
    try {
      if (typeof dateVal === "string") {
        const d = new Date(dateVal);
        if (!isNaN(d.getTime())) {
          return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
        }
      }
      return String(dateVal);
    } catch {
      return String(dateVal);
    }
  };

  // Safe active check
  const isScheduleActive = (s) => {
    if (s.active !== undefined) return Boolean(s.active);
    if (s.isActive !== undefined) return Boolean(s.isActive);
    return true;
  };

  // Recurrence resolver
  const getScheduleDays = (s) => {
    return s.operationalDays || s.operatingDays || [];
  };

  // Dynamic quick stats
  const stats = useMemo(() => {
    const total = rawSchedules.length;
    const active = rawSchedules.filter(isScheduleActive).length;
    const daily = rawSchedules.filter((s) => getScheduleDays(s).length === 7).length;
    const weekly = rawSchedules.filter((s) => {
      const len = getScheduleDays(s).length;
      return len > 0 && len < 7;
    }).length;

    return { total, active, daily, weekly };
  }, [rawSchedules]);

  // Client-side filtering
  const filteredSchedules = useMemo(() => {
    return rawSchedules.filter((s) => {
      // Status filter
      if (statusFilter !== "all") {
        const active = isScheduleActive(s);
        if (statusFilter === "active" && !active) return false;
        if (statusFilter === "inactive" && active) return false;
      }

      // Recurrence filter
      const days = getScheduleDays(s);
      if (recurrenceFilter !== "all") {
        if (recurrenceFilter === "daily" && days.length !== 7) return false;
        if (recurrenceFilter === "weekly" && (days.length === 0 || days.length === 7)) return false;
        if (recurrenceFilter === "custom" && days.length !== 0) return false;
      }

      // Search filter
      if (searchTerm && searchTerm.trim()) {
        const q = searchTerm.toLowerCase().trim();
        const fn = String(s.flightNumber || "").toLowerCase();
        const depCode = String(s.departureAirport?.iataCode || "").toLowerCase();
        const arrCode = String(s.arrivalAirport?.iataCode || "").toLowerCase();
        const depName = String(s.departureAirport?.name || "").toLowerCase();
        const arrName = String(s.arrivalAirport?.name || "").toLowerCase();
        const depCity = String(s.departureAirport?.city?.name || "").toLowerCase();
        const arrCity = String(s.arrivalAirport?.city?.name || "").toLowerCase();

        return (
          fn.includes(q) ||
          depCode.includes(q) ||
          arrCode.includes(q) ||
          depName.includes(q) ||
          arrName.includes(q) ||
          depCity.includes(q) ||
          arrCity.includes(q)
        );
      }

      return true;
    });
  }, [rawSchedules, statusFilter, recurrenceFilter, searchTerm]);

  const handleDelete = async (scheduleId) => {
    if (window.confirm("Are you sure you want to delete this flight schedule?")) {
      try {
        await dispatch(deleteFlightSchedule(scheduleId)).unwrap();
        dispatch(getAllFlightSchedules());
      } catch (error) {
        console.error("Error deleting schedule:", error);
        alert(typeof error === "string" ? error : "Failed to delete schedule");
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-3xl font-bold text-foreground tracking-tight">
              Flight Schedules
            </h1>
            <Badge variant="outline" className="font-semibold text-xs px-2.5 py-0.5">
              {filteredSchedules.length} {filteredSchedules.length === 1 ? "schedule" : "schedules"}
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm mt-0.5">
            Manage recurring flight schedule templates, operating days, and route rotations
          </p>
        </div>

        <Button
          onClick={() => navigate("/airline/schedules/new")}
          className="flex items-center gap-2 shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Create Schedule
        </Button>
      </div>

      {/* Dynamic Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Schedules */}
        <Card className="border border-blue-200 dark:border-blue-900 bg-gradient-to-br from-blue-50/70 to-blue-100/50 dark:from-blue-950/40 dark:to-blue-900/20 shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-blue-700 dark:text-blue-300 uppercase tracking-wider">Total Schedules</p>
              <p className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 mt-0.5">{stats.total}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-500/10 dark:bg-blue-400/20 flex items-center justify-center text-blue-600 dark:text-blue-300">
              <CalendarRange className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        {/* Active Schedules */}
        <Card className="border border-green-200 dark:border-green-900 bg-gradient-to-br from-green-50/70 to-green-100/50 dark:from-green-950/40 dark:to-green-900/20 shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-green-700 dark:text-green-300 uppercase tracking-wider">Active</p>
              <p className="text-2xl font-extrabold text-green-600 dark:text-green-400 mt-0.5">{stats.active}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-green-500/10 dark:bg-green-400/20 flex items-center justify-center text-green-600 dark:text-green-300">
              <CheckCircle className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        {/* Daily Schedules */}
        <Card className="border border-indigo-200 dark:border-indigo-900 bg-gradient-to-br from-indigo-50/70 to-indigo-100/50 dark:from-indigo-950/40 dark:to-indigo-900/20 shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider">Daily Recurring</p>
              <p className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-0.5">{stats.daily}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-indigo-500/10 dark:bg-indigo-400/20 flex items-center justify-center text-indigo-600 dark:text-indigo-300">
              <RotateCcw className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        {/* Weekly Schedules */}
        <Card className="border border-purple-200 dark:border-purple-900 bg-gradient-to-br from-purple-50/70 to-purple-100/50 dark:from-purple-950/40 dark:to-purple-900/20 shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-purple-700 dark:text-purple-300 uppercase tracking-wider">Weekly / Rotations</p>
              <p className="text-2xl font-extrabold text-purple-600 dark:text-purple-400 mt-0.5">{stats.weekly}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-purple-500/10 dark:bg-purple-400/20 flex items-center justify-center text-purple-600 dark:text-purple-300">
              <Layers className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <Card className="shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by flight #, route, airport, or city..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 h-9 text-sm"
              />
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40 h-9 text-sm">
                <Filter className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>

            {/* Recurrence Filter */}
            <Select value={recurrenceFilter} onValueChange={setRecurrenceFilter}>
              <SelectTrigger className="w-full sm:w-44 h-9 text-sm">
                <RotateCcw className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Recurrence" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Main Schedule Table */}
      <Card className="shadow-sm">
        <CardHeader className="pb-3 border-b border-border/60">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              Schedule Master Templates
            </CardTitle>
            <div className="text-xs text-muted-foreground flex items-center gap-1.5">
              <span>Today:</span>
              <span className="font-medium text-foreground">{new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="rounded-b-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  <TableHead className="font-semibold text-foreground">Flight</TableHead>
                  <TableHead className="font-semibold text-foreground">Route</TableHead>
                  <TableHead className="font-semibold text-foreground">Timing</TableHead>
                  <TableHead className="font-semibold text-foreground">Recurrence</TableHead>
                  <TableHead className="font-semibold text-foreground">Validity Period</TableHead>
                  <TableHead className="font-semibold text-foreground text-center">Status</TableHead>
                  <TableHead className="font-semibold text-foreground text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading && rawSchedules.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mr-2" />
                        <span className="text-sm text-muted-foreground">Loading flight schedules...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredSchedules.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12">
                      <div className="max-w-xs mx-auto text-center">
                        <Calendar className="w-10 h-10 text-muted-foreground opacity-30 mx-auto mb-2" />
                        <p className="font-semibold text-foreground text-sm">No flight schedules found</p>
                        <p className="text-xs text-muted-foreground mt-0.5 mb-3">
                          {searchTerm || statusFilter !== "all" || recurrenceFilter !== "all"
                            ? "Try adjusting your search or filters."
                            : "Create a recurring flight schedule to automate daily or weekly flights."}
                        </p>
                        {searchTerm || statusFilter !== "all" || recurrenceFilter !== "all" ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSearchTerm("");
                              setStatusFilter("all");
                              setRecurrenceFilter("all");
                            }}
                          >
                            Reset Filters
                          </Button>
                        ) : (
                          <Button onClick={() => navigate("/airline/schedules/new")} size="sm">
                            <Plus className="w-3.5 h-3.5 mr-1" />
                            Create First Schedule
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSchedules.map((schedule) => {
                    const days = getScheduleDays(schedule);
                    const isDaily = days.length === 7;
                    const active = isScheduleActive(schedule);
                    const depTimeFormatted = formatTime(schedule.departureTime);
                    const arrTimeFormatted = formatTime(schedule.arrivalTime);
                    const duration = getDuration(schedule.departureTime, schedule.arrivalTime);

                    return (
                      <TableRow key={schedule.id} className="hover:bg-muted/50 transition-colors">
                        {/* Flight */}
                        <TableCell>
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs flex-shrink-0">
                              <Plane className="h-4 w-4" />
                            </div>
                            <div>
                              <div className="font-bold text-foreground text-sm">
                                {schedule.flightNumber || `Flight #${schedule.flightId}`}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Schedule ID: #{schedule.id}
                              </div>
                            </div>
                          </div>
                        </TableCell>

                        {/* Route */}
                        <TableCell>
                          <div className="text-sm">
                            <div className="font-bold text-foreground flex items-center gap-1.5">
                              <span>{schedule.departureAirport?.iataCode || "DEP"}</span>
                              <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
                              <span>{schedule.arrivalAirport?.iataCode || "ARR"}</span>
                            </div>
                            <div className="text-xs text-muted-foreground truncate max-w-[200px] mt-0.5">
                              {schedule.departureAirport?.city?.name || schedule.departureAirport?.name || "Origin"} →{" "}
                              {schedule.arrivalAirport?.city?.name || schedule.arrivalAirport?.name || "Destination"}
                            </div>
                          </div>
                        </TableCell>

                        {/* Timing */}
                        <TableCell>
                          <div className="text-sm">
                            <div className="font-semibold text-foreground flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                              <span>{depTimeFormatted} - {arrTimeFormatted}</span>
                            </div>
                            {duration && (
                              <div className="text-xs text-muted-foreground mt-0.5">
                                Duration: {duration}
                              </div>
                            )}
                          </div>
                        </TableCell>

                        {/* Recurrence */}
                        <TableCell>
                          <div>
                            {isDaily ? (
                              <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-none font-medium text-xs">
                                <RotateCcw className="h-3 w-3 mr-1 inline" />
                                Daily (All 7 Days)
                              </Badge>
                            ) : days.length > 0 ? (
                              <div>
                                <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border-none font-medium text-xs">
                                  Weekly ({days.length} Days)
                                </Badge>
                                <div className="text-[11px] text-muted-foreground mt-1 flex flex-wrap gap-1">
                                  {days.map((d) => (
                                    <span key={d} className="px-1 py-0.5 bg-muted rounded text-[10px] font-medium">
                                      {d.slice(0, 3)}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            ) : (
                              <Badge variant="outline" className="text-xs">
                                Custom
                              </Badge>
                            )}
                          </div>
                        </TableCell>

                        {/* Validity Period */}
                        <TableCell>
                          <div className="text-xs">
                            <div className="font-medium text-foreground">
                              {formatDate(schedule.startDate)}
                            </div>
                            <div className="text-muted-foreground">
                              to {formatDate(schedule.endDate)}
                            </div>
                          </div>
                        </TableCell>

                        {/* Status */}
                        <TableCell className="text-center">
                          <Badge
                            className={cn(
                              "border-none text-xs font-medium inline-flex items-center gap-1",
                              active
                                ? "bg-green-100 text-green-800 dark:bg-green-950/60 dark:text-green-300"
                                : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                            )}
                          >
                            {active ? (
                              <CheckCircle className="h-3 w-3" />
                            ) : (
                              <XCircle className="h-3 w-3" />
                            )}
                            <span>{active ? "Active" : "Inactive"}</span>
                          </Badge>
                        </TableCell>

                        {/* Actions */}
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => navigate(`/airline/schedules/${schedule.id}`)}
                              className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => navigate(`/airline/schedules/${schedule.id}/edit`)}
                              className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                              title="Edit Schedule"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(schedule.id)}
                              className="h-8 w-8 p-0 text-destructive/80 hover:text-destructive hover:bg-destructive/10"
                              title="Delete Schedule"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FlightScheduleTable;
