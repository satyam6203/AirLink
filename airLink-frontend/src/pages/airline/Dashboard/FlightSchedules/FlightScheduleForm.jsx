
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  ArrowLeft,
  Save,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Plane,
  Users,
  RotateCcw,
  CheckCircle,
  Settings,
  ChevronDownIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  createFlightSchedule,
  updateFlightSchedule,
  getFlightScheduleById,

} from "@/Redux/flightSchedule/flightScheduleThunk";
import { getFlightsByAirline } from "@/Redux/flight/flightThunk";
import { daysOfWeek } from "./daysOfWeek";
import { listAllAirports } from "@/Redux/airport/airportThunk";


// Validation schema
const flightScheduleSchema = Yup.object().shape({
  flightId: Yup.string().required("Flight is required"),

  departureTime: Yup.string()
    .required("Departure time is required")
    .matches(
      /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
      "Invalid time format (HH:MM)"
    ),
  arrivalTime: Yup.string()
    .required("Arrival time is required")
    .matches(
      /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
      "Invalid time format (HH:MM)"
    ),
  recurrenceType: Yup.string()
    .required("Recurrence type is required")
    .oneOf(["DAILY", "WEEKLY", "CUSTOM"], "Invalid recurrence type"),
  operatingDays: Yup.array().when("recurrenceType", {
    is: "WEEKLY",
    then: (schema) =>
      schema.min(
        1,
        "At least one operating day is required for weekly schedule"
      ),
    otherwise: (schema) => schema,
  }),
  startDate: Yup.date()
    .required("Start date is required")
    .min(new Date(), "Start date cannot be in the past"),
  endDate: Yup.date()
    .required("End date is required")
    .min(Yup.ref('startDate'), "End date must be after start date"),
});

const FlightScheduleForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  // const { airports } = useSelector((state) => state.airport);

  const { flights} = useSelector(
    (state) => state.flight
  );
  const { loading: scheduleLoading } = useSelector(
    (state) => state.flightSchedule || {}
  );

  const [initialValues, setInitialValues] = useState({
    flightId: "",
    
    
    departureTime: "",
    arrivalTime: "",
    recurrenceType: "DAILY",
    operatingDays: [],
    isActive: true,
    totalSeats: "",
    availableSeats: "",
    startDate: "",
    endDate: "",
  });

  // Fetch flights on component mount
  useEffect(() => {
    dispatch(getFlightsByAirline());

    if (isEditMode) {
      dispatch(getFlightScheduleById(id)).then((result) => {
        if (result.payload) {
          const schedule = result.payload;
          setInitialValues({
            flightId: schedule.flightId || "",
         
            
            arrivalAirportId: schedule.arrivalAirportId || "",
            departureTime: schedule.departureTime || "",
            arrivalTime: schedule.arrivalTime || "",
            recurrenceType: schedule.recurrenceType || "DAILY",
            operatingDays: schedule.operatingDays || [],
            isActive:
              schedule.isActive !== undefined ? schedule.isActive : true,
            totalSeats: schedule.totalSeats || "",
            availableSeats: schedule.availableSeats || "",
            startDate: schedule.startDate || "",
            endDate: schedule.endDate || "",
          });
        }
      });
    }
  }, [dispatch, id, isEditMode]);

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      const formData = {
        ...values,
        totalSeats: parseInt(values.totalSeats),
        availableSeats: parseInt(values.availableSeats),
      };

      console.log("flight shedule form data ", formData)

      let result;
      if (isEditMode) {
        result = await dispatch(updateFlightSchedule({ id, data: formData }));
      } else {
        result = await dispatch(createFlightSchedule(formData));
      }

      if (result.type.endsWith("/fulfilled")) {
        navigate("/airline/schedules");
      } else {
        // Handle API errors
        const errorMessage = result.payload || "An error occurred";
        setFieldError("submit", errorMessage);
      }
    } catch (error) {
      setFieldError("submit error occurred - ", error);
    } finally {
      setSubmitting(false);
    }
  };

  const getSelectedFlight = (flightId) => {
    return flights?.find((flight) => flight.id == flightId);
  };

  useEffect(() => {
    dispatch(listAllAirports());
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/airline/schedules")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Schedules
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <CalendarIcon className="h-8 w-8 text-primary" />
              {isEditMode ? "Edit Flight Schedule" : "Create Flight Schedule"}
            </h1>
            <p className="text-muted-foreground">
              {isEditMode
                ? "Update existing flight schedule"
                : "Define a new recurring flight schedule"}
            </p>
          </div>
        </div>
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={flightScheduleSchema}
        onSubmit={handleSubmit}
        enableReinitialize={true}
      >
        {({ values, errors, touched, setFieldValue, isSubmitting }) => (
          <Form className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Flight Information */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Plane className="h-5 w-5" />
                      Flight Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Flight Selection */}
                    <div>
                      <Label htmlFor="flightId">Flight *</Label>
                      <Select
                        value={values.flightId}
                        onValueChange={(value) =>
                          setFieldValue("flightId", value)
                        }
                      >
                        <SelectTrigger
                          className={cn(
                            "mt-1 w-full",
                            errors.flightId &&
                              touched.flightId &&
                              "border-red-500"
                          )}
                        >
                          <SelectValue placeholder="Select a flight" />
                        </SelectTrigger>
                        <SelectContent>
                          {flights?.map((flight) => (
                            <SelectItem key={flight.id} value={String(flight.id)}>
                              <div className="flex items-center gap-2">
                                <div>
                                  <span className="font-medium">
                                  {flight.flightNumber}
                                </span>
                                </div>
                                <span className="text-muted-foreground">-</span>
                                <div>
                                  <p className="text-sm">{flight.departureAirport?.name}</p>
                                  <p className="text-sm">{flight.arrivalAirport?.name}</p>
                                </div>
                                
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <ErrorMessage
                        name="flightId"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>

                    {/* Flight Details Display */}
                    {values.flightId && (
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <h4 className="font-medium mb-2">
                          Selected Flight Details
                        </h4>
                        {(() => {
                          const flight = getSelectedFlight(values.flightId);

                          console.log("selected flight --- ", values.flightId);
                          return flight ? (
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-muted-foreground">
                                  Flight Number:
                                </span>
                                <span className="ml-2 font-medium">
                                  {flight.flightNumber}
                                </span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">
                                  Aircraft:
                                </span>
                                <span className="ml-2">
                                  {flight.aircraft?.code +" ("+flight.aircraft.manufacturer+")" || "Not specified"}
                                </span>
                              </div>
                            </div>
                          ) : null;
                        })()}
                      </div>
                    )}

                   
                   
            

                    {/* Time Selection */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="departureTime">Departure Time *</Label>
                        <div className="relative mt-1">
                          <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Field
                            name="departureTime"
                            type="time"
                            className={cn(
                              "flex h-10 w-full rounded-md border border-input bg-background px-10 py-2 text-sm ring-offset-background",
                              "file:border-0 file:bg-transparent file:text-sm file:font-medium",
                              "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                              "disabled:cursor-not-allowed disabled:opacity-50",
                              errors.departureTime &&
                                touched.departureTime &&
                                "border-red-500"
                            )}
                          />
                        </div>
                        <ErrorMessage
                          name="departureTime"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="arrivalTime">Arrival Time *</Label>
                        <div className="relative mt-1">
                          <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Field
                            name="arrivalTime"
                            type="time"
                            className={cn(
                              "flex h-10 w-full rounded-md border border-input bg-background px-10 py-2 text-sm ring-offset-background",
                              "file:border-0 file:bg-transparent file:text-sm file:font-medium",
                              "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                              "disabled:cursor-not-allowed disabled:opacity-50",
                              errors.arrivalTime &&
                                touched.arrivalTime &&
                                "border-red-500"
                            )}
                          />
                        </div>
                        <ErrorMessage
                          name="arrivalTime"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Schedule Configuration */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <RotateCcw className="h-5 w-5" />
                      Schedule Configuration
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Recurrence Type */}
                    <div>
                      <Label htmlFor="recurrenceType">Recurrence Type *</Label>
                      <Select
                        value={values.recurrenceType}
                        onValueChange={(value) => {
                          setFieldValue("recurrenceType", value);
                          if (value !== "WEEKLY") {
                            setFieldValue("operatingDays", []);
                          }
                        }}
                      >
                        <SelectTrigger className="mt-1 w-full">
                          <SelectValue placeholder="Select recurrence type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="DAILY">Daily</SelectItem>
                          <SelectItem value="WEEKLY">Weekly</SelectItem>
                          <SelectItem value="CUSTOM">Custom</SelectItem>
                        </SelectContent>
                      </Select>
                      <ErrorMessage
                        name="recurrenceType"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>

                    {/* Operating Days (for Weekly) */}
                    {values.recurrenceType === "WEEKLY" && (
                      <div>
                        <Label>Operating Days *</Label>
                        <div className="mt-2 grid grid-cols-4 sm:grid-cols-7 gap-2">
                          {daysOfWeek.map((day) => (
                            <div
                              key={day.id}
                              className="flex items-center space-x-2"
                            >
                              <Checkbox
                                id={day.id}
                                checked={values.operatingDays.includes(day.id)}
                                onCheckedChange={(checked) => {
                                  const updatedDays = checked
                                    ? [...values.operatingDays, day.id]
                                    : values.operatingDays.filter(
                                        (d) => d !== day.id
                                      );
                                  setFieldValue("operatingDays", updatedDays);
                                }}
                              />
                              <Label
                                htmlFor={day.id}
                                className="text-sm font-normal"
                              >
                                {day.short}
                              </Label>
                            </div>
                          ))}
                        </div>
                        <ErrorMessage
                          name="operatingDays"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>
                    )}

                    {/* Schedule Duration */}
                    <div className="space-y-4">
                      <div className="border-t pt-4">
                        <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
                          <CalendarIcon className="h-4 w-4" />
                          Schedule Duration
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Start Date */}
                          <div>
                            <Label htmlFor="startDate">Start Date *</Label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "w-full justify-between font-normal mt-1",
                                    !values.startDate && "text-muted-foreground",
                                    errors.startDate &&
                                      touched.startDate &&
                                      "border-red-500"
                                  )}
                                >
                                  <div className="flex items-center gap-2">
                                    <CalendarIcon className="h-4 w-4" />
                                    {values.startDate
                                      ? format(new Date(values.startDate), "PPP")
                                      : "Select start date"}
                                  </div>
                                  <ChevronDownIcon className="h-4 w-4" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={values.startDate ? new Date(values.startDate) : undefined}
                                  onSelect={(date) => {
                                    if (date) {
                                      setFieldValue("startDate", date.toISOString().split('T')[0]);
                                    }
                                  }}
                                  disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <ErrorMessage
                              name="startDate"
                              component="div"
                              className="text-red-500 text-sm mt-1"
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                              First day this schedule becomes active
                            </p>
                          </div>

                          {/* End Date */}
                          <div>
                            <Label htmlFor="endDate">End Date *</Label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "w-full justify-between font-normal mt-1",
                                    !values.endDate && "text-muted-foreground",
                                    errors.endDate &&
                                      touched.endDate &&
                                      "border-red-500"
                                  )}
                                >
                                  <div className="flex items-center gap-2">
                                    <CalendarIcon className="h-4 w-4" />
                                    {values.endDate
                                      ? format(new Date(values.endDate), "PPP")
                                      : "Select end date"}
                                  </div>
                                  <ChevronDownIcon className="h-4 w-4" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={values.endDate ? new Date(values.endDate) : undefined}
                                  onSelect={(date) => {
                                    if (date) {
                                      setFieldValue("endDate", date.toISOString().split('T')[0]);
                                    }
                                  }}
                                  disabled={(date) => {
                                    const minDate = values.startDate
                                      ? new Date(values.startDate)
                                      : new Date(new Date().setHours(0, 0, 0, 0));
                                    return date < minDate;
                                  }}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <ErrorMessage
                              name="endDate"
                              component="div"
                              className="text-red-500 text-sm mt-1"
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                              Last day this schedule will be active
                            </p>
                          </div>
                        </div>

                        {/* Duration Info */}
                        {values.startDate && values.endDate && (
                          <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <div className="flex items-center gap-2 text-sm text-blue-800">
                              <CalendarIcon className="h-4 w-4" />
                              <span className="font-medium">
                                Duration: {(() => {
                                  const start = new Date(values.startDate);
                                  const end = new Date(values.endDate);
                                  const diffTime = Math.abs(end - start);
                                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

                                  if (diffDays === 1) return "1 day";
                                  if (diffDays < 7) return `${diffDays} days`;
                                  if (diffDays < 30) {
                                    const weeks = Math.floor(diffDays / 7);
                                    const remainingDays = diffDays % 7;
                                    return `${weeks} week${weeks > 1 ? 's' : ''}${remainingDays > 0 ? ` ${remainingDays} day${remainingDays > 1 ? 's' : ''}` : ''}`;
                                  }
                                  if (diffDays < 365) {
                                    const months = Math.floor(diffDays / 30);
                                    return `~${months} month${months > 1 ? 's' : ''}`;
                                  }
                                  const years = Math.floor(diffDays / 365);
                                  return `~${years} year${years > 1 ? 's' : ''}`;
                                })()}
                              </span>
                            </div>
                            <p className="text-xs text-blue-600 mt-1">
                              Flight instances will be generated for this date range based on the recurrence pattern
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Status */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      Schedule Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="isActive">Active Schedule</Label>
                        <p className="text-sm text-muted-foreground">
                          Enable this schedule for flight instances
                        </p>
                      </div>
                      <Switch
                        checked={values.isActive}
                        onCheckedChange={(checked) =>
                          setFieldValue("isActive", checked)
                        }
                      />
                    </div>
                    <div className="mt-4 ">
                      <Badge
                        variant={values.isActive ? "default" : "secondary"}
                        className="p-2 text-md px-5 gap-1"
                      >
                        <CheckCircle className=" pr-1" />
                        {values.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle>Schedule Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    
                    {values.departureTime && values.arrivalTime && (
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {values.departureTime} - {values.arrivalTime}
                        </span>
                      </div>
                    )}
                    {values.recurrenceType && (
                      <div className="flex items-center gap-2 text-sm">
                        <RotateCcw className="h-4 w-4 text-muted-foreground" />
                        <span>{values.recurrenceType}</span>
                      </div>
                    )}
                    {values.startDate && values.endDate && (
                      <div className="flex items-center gap-2 text-sm">
                        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {new Date(values.startDate).toLocaleDateString()} - {new Date(values.endDate).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                    {values.recurrenceType === "WEEKLY" && values.operatingDays.length > 0 && (
                      <div className="flex items-start gap-2 text-sm">
                        <CalendarIcon className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <div className="text-xs text-muted-foreground mb-1">Operating Days:</div>
                          <div className="flex flex-wrap gap-1">
                            {values.operatingDays.map((dayId) => {
                              const day = daysOfWeek.find(d => d.id === dayId);
                              return day ? (
                                <Badge key={dayId} variant="outline" className="text-xs px-1 py-0">
                                  {day.short}
                                </Badge>
                              ) : null;
                            })}
                          </div>
                        </div>
                      </div>
                    )}
                    {values.totalSeats && (
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {values.availableSeats || 0}/{values.totalSeats} seats
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Actions */}
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <Button
                        type="submit"
                        disabled={isSubmitting || scheduleLoading}
                        className="w-full"
                      >
                        {isSubmitting || scheduleLoading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                            {isEditMode ? "Updating..." : "Creating..."}
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            {isEditMode ? "Update Schedule" : "Create Schedule"}
                          </>
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate("/airline/schedules")}
                        className="w-full"
                      >
                        Cancel
                      </Button>
                    </div>
                    {errors.submit && (
                      <div className="mt-3 text-red-500 text-sm">
                        {errors.submit}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default FlightScheduleForm;
