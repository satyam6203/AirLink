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
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Plane,
  MapPin,
  Clock,
  Users,
  Plus,
  RotateCcw,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
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

const tableRow = [
  "Flight",
  "Route",
  "Schedule",
  "Recurrence",
  "Status",
  "Actions",
];
// FlightScheduleTable component
const FlightScheduleTable = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { flightSchedules, loading } = useSelector(
    (state) => state.flightSchedule || {}
  );



  useEffect(() => {
    dispatch(getAllFlightSchedules());
  }, [dispatch]);

 

  const getStatusBadge = (isActive) => (
   
     <Badge
      className={cn(
        "fle items-center gap-1",
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
      <span className="pl-1">
{isActive ? "Active" : "Inactive"}
      </span>
      
    </Badge>
  
  );

  const getRecurrenceBadge = (type, operatingDays) => {
    const config = {
      DAILY: { color: "bg-blue-100 text-blue-800", label: "Daily" },
      WEEKLY: {
        color: "bg-purple-100 text-purple-800",
        label: `Weekly (${operatingDays?.length || 0}d)`,
      },
      CUSTOM: { color: "bg-orange-100 text-orange-800", label: "Custom" },
    };
    const typeConfig = config[type] || config.CUSTOM;

    return (
      <Badge className={cn("", typeConfig.color)}>
        <RotateCcw className="h-3 w-3" />
        <span className="pl-1">{typeConfig.label}</span>
      </Badge>
    );
  };

  const getDuration = (depTime, arrTime) => {
    const [depHour, depMin] = depTime.split(":").map(Number);
    const [arrHour, arrMin] = arrTime.split(":").map(Number);
    let diffMin = arrHour * 60 + arrMin - (depHour * 60 + depMin);
    if (diffMin < 0) diffMin += 24 * 60;
    const hours = Math.floor(diffMin / 60);
    const minutes = diffMin % 60;
    return `${hours}h ${minutes}m`;
  };

  const handleDelete = async (scheduleId) => {
    if (
      window.confirm("Are you sure you want to delete this flight schedule?")
    ) {
      try {
        await dispatch(deleteFlightSchedule(scheduleId));
        dispatch(getAllFlightSchedules());
      } catch (error) {
        console.error("Error deleting schedule:", error);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Flight Schedules
          </h1>
          <p className="text-muted-foreground">
            Manage recurring flight schedule templates
          </p>
        </div>
        <Button
          onClick={() => navigate("/airline/schedules/new")}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Create Schedule
        </Button>
      </div>


      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Flight Schedules ({flightSchedules.length})</span>
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
                  {tableRow.map((head, idx) => (
                    <TableHead
                      key={idx}
                      className="cursor-pointer hover:bg-muted/50"
                    >
                      <div className="flex items-center gap-2">
                        {head}
                        {head !== "Actions" && (
                          <ArrowUpDown className="h-4 w-4" />
                        )}
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mr-2" />
                        Loading schedules...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : flightSchedules.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No flight schedules found
                    </TableCell>
                  </TableRow>
                ) : (
                  flightSchedules.map((schedule) => (
                    <TableRow key={schedule.id} className="hover:bg-muted/50">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Plane className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div className="font-medium">
                              {schedule.flightNumber}
                            </div>
                           
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div className="font-medium text-sm">
                              {schedule.departureAirport?.iataCode} →{" "}
                              {schedule.arrivalAirport?.iataCode}
                            </div>
                            <div className="text-xs text-muted-foreground">
                             <p> {schedule.departureAirport?.name}</p>
                             <p> {schedule.arrivalAirport?.name}</p>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div className="text-sm font-medium">
                              {schedule.departureTime} - {schedule.arrivalTime}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {getDuration(
                                schedule.departureTime,
                                schedule.arrivalTime
                              )}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getRecurrenceBadge(
                          schedule.recurrenceType,
                          schedule.operatingDays
                        )}
                        {schedule.recurrenceType === "WEEKLY" &&
                          schedule.operatingDays?.length > 0 && (
                            <div className="text-xs text-muted-foreground mt-1">
                              {schedule.operatingDays
                                .map((day) => day.slice(0, 3))
                                .join(", ")}
                            </div>
                          )}
                      </TableCell>

                      <TableCell>{getStatusBadge(schedule.isActive)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex-col items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              navigate(`/airline/schedules/${schedule.id}`)
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
                              navigate(`/airline/schedules/${schedule.id}/edit`)
                            }
                            className="flex items-center gap-1"
                          >
                            <Edit className="h-4 w-4" />
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(schedule.id)}
                            className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
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
