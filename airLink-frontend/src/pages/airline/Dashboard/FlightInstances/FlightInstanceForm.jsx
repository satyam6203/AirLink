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
  CalendarDays,
  Settings,
  Info,
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
  createFlightInstance,
  updateFlightInstance,
  getFlightInstanceById,
} from "@/Redux/flightInstance/flightInstanceThunk";
import { getAllFlightSchedules } from "@/Redux/flightSchedule/flightScheduleThunk";
import { getFlightsByAirline } from "@/Redux/flight/flightThunk";
import { listAllAirports } from "@/Redux/airport/airportThunk";

const formatDateTimeLocal = (date) => format(date, "yyyy-MM-dd'T'HH:mm"); // local datetime string

// Validation schema for create mode
const createFlightInstanceSchema = Yup.object().shape({
  scheduleId: Yup.string().required("Flight schedule is required"),
  flightId: Yup.string().required("Flight is required"),
  departureAirportId: Yup.string().required("Departure airport is required"),
  arrivalAirportId: Yup.string()
    .required("Arrival airport is required")
    .test(
      "different-airports",
      "Arrival airport must be different from departure airport",
      function (value) {
        return value !== this.parent.departureAirportId;
      }
    ),
  departureDateTime: Yup.date()
    .required("Departure date and time is required")
    .min(new Date(), "Departure date must be in the future"),
  arrivalDateTime: Yup.date()
    .required("Arrival date and time is required")
    .test(
      "arrival-after-departure",
      "Arrival must be after departure",
      function (value) {
        return (
          !this.parent.departureDateTime ||
          !value ||
          value > this.parent.departureDateTime
        );
      }
    ),
  status: Yup.string()
    .required("Status is required")
    .oneOf(
      ["SCHEDULED", "ACTIVE", "DELAYED", "CANCELLED", "COMPLETED"],
      "Invalid status"
    ),
});

// Validation schema for edit mode - only status and times can be updated
const editFlightInstanceSchema = Yup.object().shape({
  departureDateTime: Yup.date()
    .required("Departure date and time is required")
    .typeError("Please enter a valid date and time"),
  arrivalDateTime: Yup.date()
    .required("Arrival date and time is required")
    .typeError("Please enter a valid date and time")
    .test(
      "arrival-after-departure",
      "Arrival time must be after departure time",
      function (value) {
        return (
          !this.parent.departureDateTime ||
          !value ||
          new Date(value) > new Date(this.parent.departureDateTime)
        );
      }
    ),
  status: Yup.string()
    .required("Status is required")
    .oneOf(
      ["SCHEDULED", "ACTIVE", "DELAYED", "CANCELLED", "COMPLETED"],
      "Invalid status"
    ),
});

const statusOptions = [
  {
    value: "SCHEDULED",
    label: "Scheduled",
    color: "bg-blue-100 text-blue-800",
  },
  { value: "ACTIVE", label: "Active", color: "bg-green-100 text-green-800" },
  {
    value: "DELAYED",
    label: "Delayed",
    color: "bg-yellow-100 text-yellow-800",
  },
  { value: "CANCELLED", label: "Cancelled", color: "bg-red-100 text-red-800" },
  {
    value: "COMPLETED",
    label: "Completed",
    color: "bg-purple-100 text-purple-800",
  },
];

const FlightInstanceForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const { airports } = useSelector((state) => state.airport);

  const { flights } = useSelector(
    (state) => state.flight
  );
  const { flightSchedules: schedules,} = useSelector(
    (state) => state.flightSchedule || {}
  );
  const { loading: instanceLoading } = useSelector(
    (state) => state.flightInstance || {}
  );

  const [initialValues, setInitialValues] = useState({
    scheduleId: "",
    flightId: "",
    departureAirportId: "",
    arrivalAirportId: "",
    departureDateTime: "",
    arrivalDateTime: "",

    status: "SCHEDULED",
  });

  const [departureTime, setDepartureTime] = useState("");
  const [arrivalTime, setArrivalTime] = useState("");

  console.log("Initial Values: ", id);

  // Fetch required data on component mount
  useEffect(() => {
    dispatch(getFlightsByAirline());
    dispatch(getAllFlightSchedules());

    if (isEditMode) {
      dispatch(getFlightInstanceById(id)).then((result) => {
        if (result.payload) {
          const instance = result.payload;
          console.log("Fetched instance: ", instance);
          setInitialValues({
            scheduleId: instance.scheduleId || "",
            flightId: instance.flightId || "",
            departureAirportId: instance.departureAirportId || "",
            arrivalAirportId: instance.arrivalAirportId || "",
            departureDateTime: instance.departureDateTime
              ? formatDateTimeLocal(new Date(instance.departureDateTime))
              : "",
            arrivalDateTime: instance.arrivalDateTime
              ? formatDateTimeLocal(new Date(instance.arrivalDateTime))
              : "",

            status: instance.status || "SCHEDULED",
          });
        }
      });
    }
  }, [dispatch, id, isEditMode]);

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      let formData = {
        ...values,
        departureDateTime: new Date(values.departureDateTime).toISOString(),
        arrivalDateTime: new Date(values.arrivalDateTime).toISOString(),
      };

      // In edit mode, only send editable fields
      if (isEditMode) {
        formData = {
          departureDateTime: formData.departureDateTime,
          arrivalDateTime: formData.arrivalDateTime,
          status: formData.status,
        };
      }

      console.log("form data ", formData);

      let result;
      if (isEditMode) {
        result = await dispatch(updateFlightInstance({ id, data: formData }));
      } else {
        result = await dispatch(createFlightInstance(formData));
      }

      if (result.type.endsWith("/fulfilled")) {
        navigate("/airline/instances");
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

  useEffect(() => {
    dispatch(listAllAirports());
  }, []);

  useEffect(() => {
    if (initialValues.departureDateTime) {
      setDepartureTime(initialValues.departureDateTime.slice(11, 16)); // HH:mm
    }
  }, [initialValues.departureDateTime]);

  useEffect(() => {
    if (initialValues.arrivalDateTime) {
      setArrivalTime(initialValues.arrivalDateTime.slice(11, 16)); // HH:mm
    }
  }, [initialValues.arrivalDateTime]);

  const getSelectedFlight = (flightId) => {
    return flights?.find((flight) => flight.id == flightId);
  };

  const getSelectedSchedule = (scheduleId) => {
    return schedules?.find((schedule) => schedule.id == scheduleId);
  };

  const handleScheduleChange = (scheduleId, setFieldValue) => {
    const schedule = getSelectedSchedule(scheduleId);
    if (schedule) {
      setFieldValue("flightId", schedule.flightId || "");
      setFieldValue("departureAirportId", schedule.departureAirportId || "");
      setFieldValue("arrivalAirportId", schedule.arrivalAirportId || "");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/airline/instances")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Instances
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <CalendarDays className="h-8 w-8 text-primary" />
              {isEditMode ? "Edit Flight Instance" : "Create Flight Instance"}
            </h1>
            <p className="text-muted-foreground">
              {isEditMode
                ? "Update existing flight instance"
                : "Create a specific flight instance from a schedule"}
            </p>
          </div>
        </div>
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={
          isEditMode ? editFlightInstanceSchema : createFlightInstanceSchema
        }
        onSubmit={handleSubmit}
        enableReinitialize={true}
      >
        {({ values, errors, touched, setFieldValue, isSubmitting }) => (
          <Form className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Form */}
              <div className="lg:col-span-2 space-y-6">
                {/* Schedule and Flight Selection - Only show in create mode */}
                {!isEditMode && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CalendarIcon className="h-5 w-5" />
                        Schedule & Flight Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Schedule Selection */}
                      <div>
                        <Label htmlFor="scheduleId">Flight Schedule *</Label>
                        <Select
                          value={values.scheduleId}
                          onValueChange={(value) => {
                            setFieldValue("scheduleId", value);
                            handleScheduleChange(value, setFieldValue);
                          }}
                        >
                          <SelectTrigger
                            className={cn(
                              "mt-1 w-full",
                              errors.scheduleId &&
                                touched.scheduleId &&
                                "border-red-500"
                            )}
                          >
                            <SelectValue placeholder="Select a flight schedule" />
                          </SelectTrigger>
                          <SelectContent>
                            {schedules?.map((schedule) => (
                              <SelectItem
                                key={schedule.id}
                                value={String(schedule.id)}
                              >
                                <p className="flex items-center gap-2">
                                  <span className="font-medium">
                                    {schedule.flightNumber || "N/A"}
                                  </span>
                                  <span className="text-muted-foreground">
                                    -
                                  </span>
                                  <span className="text-sm">
                                    {schedule.departureAirport.city?.cityCode} →{" "}
                                    {schedule.arrivalAirport.city?.cityCode}
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    ({schedule.recurrenceType})
                                  </span>
                                </p>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <ErrorMessage
                          name="scheduleId"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>

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
                              <SelectItem
                                key={flight.id}
                                value={String(flight.id)}
                              >
                                {flight.flightNumber}
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

                      {/* Selected Schedule Info */}
                      {values.scheduleId && (
                        <div className="p-4 bg-muted/50 rounded-lg">
                          <h4 className="font-medium mb-2">Schedule Details</h4>
                          {(() => {
                            const schedule = getSelectedSchedule(
                              values.scheduleId
                            );
                            return schedule ? (
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <span className="text-muted-foreground">
                                    Recurrence:
                                  </span>
                                  <span className="ml-2 font-medium">
                                    {schedule.recurrenceType}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">
                                    Schedule Time:
                                  </span>
                                  <span className="ml-2">
                                    {schedule.departureTime} -{" "}
                                    {schedule.arrivalTime}
                                  </span>
                                </div>
                              </div>
                            ) : null;
                          })()}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Flight Info - Show in edit mode as read-only */}
                {isEditMode && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Plane className="h-5 w-5" />
                        Flight Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Flight Number</Label>
                          <Input
                            value={
                              getSelectedFlight(values.flightId)
                                ?.flightNumber || "N/A"
                            }
                            disabled
                            className="mt-1 bg-muted"
                          />
                        </div>
                        <div>
                          <Label>Aircraft Type</Label>
                          <Input
                            value={
                              getSelectedFlight(values.flightId)?.aircraft
                                ?.model || "N/A"
                            }
                            disabled
                            className="mt-1 bg-muted"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Route and Time */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      {isEditMode ? "Flight Times" : "Route & Schedule"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Airport Selection - Only in create mode */}
                    {!isEditMode && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="departureAirportId">
                            Departure Airport *
                          </Label>
                          <Select
                            value={String(values.departureAirportId)}
                            onValueChange={(value) =>
                              setFieldValue("departureAirportId", value)
                            }
                          >
                            <SelectTrigger
                              className={cn(
                                "mt-1 w-full",
                                errors.departureAirportId &&
                                  touched.departureAirportId &&
                                  "border-red-500"
                              )}
                            >
                              <SelectValue placeholder="Select departure" />
                            </SelectTrigger>
                            <SelectContent>
                              {airports.map((airport) => (
                                <SelectItem
                                  key={airport.id}
                                  value={String(airport.id)}
                                >
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium">
                                      {airport.iataCode}
                                    </span>
                                    <span className="text-muted-foreground">
                                      -
                                    </span>
                                    <span className="text-sm">
                                      {airport.name}
                                    </span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <ErrorMessage
                            name="departureAirportId"
                            component="div"
                            className="text-red-500 text-sm mt-1"
                          />
                        </div>

                        <div>
                          <Label htmlFor="arrivalAirportId">
                            Arrival Airport *
                          </Label>
                          <Select
                            value={values.arrivalAirportId}
                            onValueChange={(value) =>
                              setFieldValue("arrivalAirportId", value)
                            }
                          >
                            <SelectTrigger
                              className={cn(
                                "mt-1 w-full",
                                errors.arrivalAirportId &&
                                  touched.arrivalAirportId &&
                                  "border-red-500"
                              )}
                            >
                              <SelectValue placeholder="Select arrival" />
                            </SelectTrigger>
                            <SelectContent>
                              {airports.map((airport) => (
                                <SelectItem
                                  key={airport.id}
                                  value={String(airport.id)}
                                >
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium">
                                      {airport.iataCode}
                                    </span>
                                    <span className="text-muted-foreground">
                                      -
                                    </span>
                                    <span className="text-sm">
                                      {airport.name}
                                    </span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <ErrorMessage
                            name="arrivalAirportId"
                            component="div"
                            className="text-red-500 text-sm mt-1"
                          />
                        </div>
                      </div>
                    )}

                    {/* Airport Display - Read-only in edit mode */}
                    {isEditMode && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Departure Airport</Label>
                          <Input
                            value={
                              airports.find(
                                (a) => a.id == values.departureAirportId
                              )?.name || "N/A"
                            }
                            disabled
                            className="mt-1 bg-muted"
                          />
                        </div>
                        <div>
                          <Label>Arrival Airport</Label>
                          <Input
                            value={
                              airports.find(
                                (a) => a.id == values.arrivalAirportId
                              )?.name || "N/A"
                            }
                            disabled
                            className="mt-1 bg-muted"
                          />
                        </div>
                      </div>
                    )}

                    {/* Date Time Selection - Shadcn Date Picker with Time Input */}
                    <div className="grid grid-cols-2 gap-4">
                      {/* Departure Date & Time */}
                      <div>
                        <Label className="flex items-center gap-2 mb-2">
                          <CalendarIcon className="h-4 w-4" />
                          Departure Date & Time *
                        </Label>

                        {/* Date Picker */}
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !values.departureDateTime &&
                                  "text-muted-foreground",
                                errors.departureDateTime &&
                                  touched.departureDateTime &&
                                  "border-red-500"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {values.departureDateTime
                                ? format(
                                    new Date(values.departureDateTime),
                                    "PPP"
                                  )
                                : "Pick a date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={
                                values.departureDateTime
                                  ? new Date(values.departureDateTime)
                                  : undefined
                              }
                              onSelect={(date) => {
                                if (date) {
                                  const existingDate = values.departureDateTime
                                    ? new Date(values.departureDateTime)
                                    : new Date();
                                  const updated = new Date(date); // clone
                                  updated.setHours(
                                    existingDate.getHours(),
                                    existingDate.getMinutes(),
                                    0,
                                    0
                                  );

                                  setFieldValue(
                                    "departureDateTime",
                                    formatDateTimeLocal(updated)
                                  );
                                }
                              }}
                              disabled={
                                !isEditMode
                                  ? (date) =>
                                      date <
                                      new Date(new Date().setHours(0, 0, 0, 0))
                                  : undefined
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>

                        {/* Time Input */}
                        <div className="mt-2">
                          <Label
                            htmlFor="departureTime"
                            className="text-xs text-muted-foreground"
                          >
                            Time (HH:MM)
                          </Label>
                          <div className="relative mt-1">
                            <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                            <Input
                              id="departureTime"
                              type="text"
                              placeholder="14:30"
                              maxLength={5}
                              value={departureTime}
                              onChange={(e) => {
                                let timeValue = e.target.value.replace(
                                  /[^\d:]/g,
                                  ""
                                );

                                // Auto-add colon after 2 digits
                                if (
                                  timeValue.length === 2 &&
                                  !timeValue.includes(":")
                                ) {
                                  timeValue = timeValue + ":";
                                }

                                // Always update local state so user sees what they type
                                setDepartureTime(timeValue);

                                // If complete and valid HH:MM → update Formik
                                if (
                                  /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(
                                    timeValue
                                  )
                                ) {
                                  if (values.departureDateTime) {
                                    const date = new Date(
                                      values.departureDateTime
                                    );
                                    const [hours, minutes] =
                                      timeValue.split(":");
                                    date.setHours(
                                      parseInt(hours),
                                      parseInt(minutes),
                                      0,
                                      0
                                    );
                                    setFieldValue(
                                      "departureDateTime",
                                      formatDateTimeLocal(date)
                                    );
                                  } else {
                                    const date = new Date();
                                    const [hours, minutes] =
                                      timeValue.split(":");
                                    date.setHours(
                                      parseInt(hours),
                                      parseInt(minutes),
                                      0,
                                      0
                                    );
                                    setFieldValue(
                                      "departureDateTime",
                                      formatDateTimeLocal(date)
                                    );
                                  }
                                }
                              }}
                              onBlur={() => {
                                // If invalid on blur, snap back to the last valid Formik time or set a default
                                if (
                                  !/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(
                                    departureTime
                                  )
                                ) {
                                  if (values.departureDateTime) {
                                    setDepartureTime(
                                      values.departureDateTime.slice(11, 16)
                                    );
                                  } else {
                                    setDepartureTime("12:00");
                                    const date = new Date();
                                    date.setHours(12, 0, 0, 0);
                                    setFieldValue(
                                      "departureDateTime",
                                      formatDateTimeLocal(date)
                                    );
                                  }
                                }
                              }}
                              className={cn(
                                "pl-10",
                                errors.departureDateTime &&
                                  touched.departureDateTime &&
                                  "border-red-500"
                              )}
                            />
                          </div>
                        </div>

                        {/* Formatted Display */}
                        {values.departureDateTime && (
                          <div className="text-xs text-muted-foreground mt-1">
                            {new Date(values.departureDateTime).toLocaleString(
                              "en-US",
                              {
                                weekday: "short",
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                              }
                            )}
                          </div>
                        )}
                        <ErrorMessage
                          name="departureDateTime"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>

                      {/* Arrival Date & Time */}
                      <div>
                        <Label className="flex items-center gap-2 mb-2">
                          <CalendarIcon className="h-4 w-4" />
                          Arrival Date & Time *
                        </Label>

                        {/* Date Picker */}
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !values.arrivalDateTime &&
                                  "text-muted-foreground",
                                errors.arrivalDateTime &&
                                  touched.arrivalDateTime &&
                                  "border-red-500"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {values.arrivalDateTime
                                ? format(
                                    new Date(values.arrivalDateTime),
                                    "PPP"
                                  )
                                : "Pick a date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={
                                values.arrivalDateTime
                                  ? new Date(values.arrivalDateTime)
                                  : undefined
                              }
                              onSelect={(date) => {
                                if (date) {
                                  const existingDate = values.arrivalDateTime
                                    ? new Date(values.arrivalDateTime)
                                    : new Date();
                                  const updated = new Date(date);
                                  updated.setHours(
                                    existingDate.getHours(),
                                    existingDate.getMinutes(),
                                    0,
                                    0
                                  );

                                  setFieldValue(
                                    "arrivalDateTime",
                                    formatDateTimeLocal(updated)
                                  );
                                }
                              }}
                              disabled={
                                !isEditMode
                                  ? (date) =>
                                      date <
                                      new Date(new Date().setHours(0, 0, 0, 0))
                                  : undefined
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>

                        {/* Time Input */}
                        <div className="mt-2">
                          <Label
                            htmlFor="arrivalTime"
                            className="text-xs text-muted-foreground"
                          >
                            Time (HH:MM)
                          </Label>
                          <div className="relative mt-1">
                            <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                            <Input
                              id="arrivalTime"
                              type="text"
                              placeholder="18:30"
                              maxLength={5}
                              value={arrivalTime}
                              onChange={(e) => {
                                let timeValue = e.target.value.replace(
                                  /[^\d:]/g,
                                  ""
                                );

                                // Auto-add colon after 2 digits (HH → HH:)
                                if (
                                  timeValue.length === 2 &&
                                  !timeValue.includes(":")
                                ) {
                                  timeValue = timeValue + ":";
                                }

                                // Local state update for user typing
                                setArrivalTime(timeValue);

                                // If time fully valid → update Formik datetime field
                                if (
                                  /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(
                                    timeValue
                                  )
                                ) {
                                  const date = values.arrivalDateTime
                                    ? new Date(values.arrivalDateTime)
                                    : new Date();

                                  const [hours, minutes] = timeValue.split(":");
                                  date.setHours(
                                    parseInt(hours),
                                    parseInt(minutes),
                                    0,
                                    0
                                  );

                                  setFieldValue(
                                    "arrivalDateTime",
                                    formatDateTimeLocal(date)
                                  );
                                }
                              }}
                              onBlur={() => {
                                // Reset to valid Formik or default if invalid format on blur
                                if (
                                  !/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(
                                    arrivalTime
                                  )
                                ) {
                                  if (values.arrivalDateTime) {
                                    setArrivalTime(
                                      values.arrivalDateTime.slice(11, 16)
                                    );
                                  } else {
                                    setArrivalTime("18:00");
                                    const date = new Date();
                                    date.setHours(18, 0, 0, 0);
                                    setFieldValue(
                                      "arrivalDateTime",
                                      formatDateTimeLocal(date)
                                    );
                                  }
                                }
                              }}
                              className={cn(
                                "pl-10",
                                errors.arrivalDateTime &&
                                  touched.arrivalDateTime &&
                                  "border-red-500"
                              )}
                            />
                          </div>
                        </div>

                        {/* Formatted Display */}
                        {values.arrivalDateTime && (
                          <div className="text-xs text-muted-foreground mt-1">
                            {new Date(values.arrivalDateTime).toLocaleString(
                              "en-US",
                              {
                                weekday: "short",
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                              }
                            )}
                          </div>
                        )}
                        <ErrorMessage
                          name="arrivalDateTime"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>
                    </div>

                    {/* Duration Validation Error */}
                    {values.departureDateTime &&
                      values.arrivalDateTime &&
                      (() => {
                        const duration =
                          (new Date(values.arrivalDateTime) -
                            new Date(values.departureDateTime)) /
                          (1000 * 60);
                        if (duration < 0) {
                          return (
                            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm mt-4">
                              <div className="flex-shrink-0">
                                <svg
                                  className="h-5 w-5"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </div>
                              <div>
                                <strong>Invalid Duration:</strong> Arrival time
                                must be after departure time
                              </div>
                            </div>
                          );
                        }
                        return null;
                      })()}
                  </CardContent>
                </Card>

                {/* Flight Status */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      Flight Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div>
                      <Label htmlFor="status">Status *</Label>
                      <Select
                        value={values.status}
                        onValueChange={(value) =>
                          setFieldValue("status", value)
                        }
                      >
                        <SelectTrigger
                          className={cn(
                            "mt-1 w-full",
                            errors.status && touched.status && "border-red-500"
                          )}
                        >
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          {statusOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              <div className="flex items-center gap-2">
                                <div
                                  className={cn(
                                    "w-2 h-2 rounded-full",
                                    option.color.split(" ")[0]
                                  )}
                                />
                                {option.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <ErrorMessage
                        name="status"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                      {isEditMode && (
                        <p className="text-sm text-muted-foreground mt-2">
                          Only flight status and times can be updated in edit
                          mode
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Info className="h-5 w-5" />
                      Flight Instance Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Flight Info */}
                    {values.flightId && (
                      <div className="p-3 bg-muted/50 rounded-lg space-y-2">
                        <div className="flex items-center gap-2">
                          <Plane className="h-4 w-4 text-primary" />
                          <span className="font-semibold text-base">
                            {getSelectedFlight(values.flightId)?.flightNumber ||
                              "N/A"}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground space-y-1">
                          <div>
                            Aircraft:{" "}
                            {getSelectedFlight(values.flightId)?.aircraft
                              ?.model || "N/A"}
                          </div>
                          <div>
                            Airline:{" "}
                            {getSelectedFlight(values.flightId)?.airline
                              ?.name || "N/A"}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Route */}
                    {values.departureAirportId && values.arrivalAirportId && (
                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                          <div className="flex-1 space-y-2">
                            <div>
                              <div className="text-xs text-muted-foreground">
                                From
                              </div>
                              <div className="font-medium text-sm">
                                {airports.find(
                                  (a) => a.id == values.departureAirportId
                                )?.iataCode || values.departureAirportId}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {airports.find(
                                  (a) => a.id == values.departureAirportId
                                )?.city?.name || ""}
                              </div>
                            </div>
                            <div className="flex items-center justify-center">
                              <div className="h-px bg-border w-full" />
                            </div>
                            <div>
                              <div className="text-xs text-muted-foreground">
                                To
                              </div>
                              <div className="font-medium text-sm">
                                {airports.find(
                                  (a) => a.id == values.arrivalAirportId
                                )?.iataCode || values.arrivalAirportId}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {airports.find(
                                  (a) => a.id == values.arrivalAirportId
                                )?.city?.name || ""}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Schedule */}
                    {values.departureDateTime && values.arrivalDateTime && (
                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
                          <div className="flex-1 space-y-2 text-sm">
                            <div>
                              <div className="text-xs text-muted-foreground">
                                Departure
                              </div>
                              <div className="font-medium">
                                {new Date(
                                  values.departureDateTime
                                ).toLocaleString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </div>
                              <div className="text-muted-foreground">
                                {new Date(
                                  values.departureDateTime
                                ).toLocaleString("en-US", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: true,
                                })}
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-muted-foreground">
                                Arrival
                              </div>
                              <div className="font-medium">
                                {new Date(
                                  values.arrivalDateTime
                                ).toLocaleString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </div>
                              <div className="text-muted-foreground">
                                {new Date(
                                  values.arrivalDateTime
                                ).toLocaleString("en-US", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: true,
                                })}
                              </div>
                            </div>
                            {/* Duration */}
                            {(() => {
                              const duration =
                                (new Date(values.arrivalDateTime) -
                                  new Date(values.departureDateTime)) /
                                (1000 * 60);
                              const hours = Math.floor(Math.abs(duration) / 60);
                              const minutes = Math.floor(
                                Math.abs(duration) % 60
                              );
                              const isNegative = duration < 0;

                              return (
                                <div
                                  className={cn(
                                    "pt-1 border-t",
                                    isNegative && "text-red-600"
                                  )}
                                >
                                  <span className="text-xs">Duration: </span>
                                  <span className="font-medium">
                                    {isNegative && "- "}
                                    {hours}h {minutes}m
                                    {isNegative && " (Invalid)"}
                                  </span>
                                </div>
                              );
                            })()}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Status */}
                    {values.status && (
                      <div className="pt-2 border-t">
                        <div className="text-xs text-muted-foreground mb-1">
                          Status
                        </div>
                        <Badge
                          className={cn(
                            "font-medium",
                            statusOptions.find((s) => s.value === values.status)
                              ?.color || ""
                          )}
                        >
                          {statusOptions.find((s) => s.value === values.status)
                            ?.label || values.status}
                        </Badge>
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
                        disabled={isSubmitting || instanceLoading}
                        className="w-full"
                      >
                        {isSubmitting || instanceLoading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                            {isEditMode ? "Updating..." : "Creating..."}
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            {isEditMode ? "Update Instance" : "Create Instance"}
                          </>
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate("/airline/instances")}
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

export default FlightInstanceForm;
