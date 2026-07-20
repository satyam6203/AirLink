import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Save,
  Plane,
  MapPin,
  Globe,
  BarChart3,
  Users,
  Star,
  TrendingUp,
  Clock,
  Hash,
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
import { useNavigate, useParams } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

// Common timezone options
const TIMEZONE_OPTIONS = [
  "UTC",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Mexico_City",
  "America/Sao_Paulo",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Europe/Moscow",
  "Asia/Dubai",
  "Asia/Kolkata",
  "Asia/Singapore",
  "Asia/Tokyo",
  "Asia/Shanghai",
  "Australia/Sydney",
  "Pacific/Auckland",
];

// Size category options
const SIZE_CATEGORIES = [
  { value: "LARGE_HUB", label: "Large Hub" },
  { value: "MEDIUM_HUB", label: "Medium Hub" },
  { value: "SMALL_HUB", label: "Small Hub" },
  { value: "NON_HUB", label: "Non-Hub" },
];

const AirportForm = ({ airport, cities = [], onSubmit, isLoading = false }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(airport?.id || id);

  // Initial form values
  const initialValues = {
    iataCode: airport?.iataCode || "",
    name: airport?.name || "",
    timeZoneId: airport?.timeZoneId || "",
    cityId: airport?.city?.id || "",

    // Address (only street-level details)
    street: airport?.address?.street || "",
    postalCode: airport?.address?.postalCode || "",

    // GeoCode
    latitude: airport?.geoCode?.latitude || "",
    longitude: airport?.geoCode?.longitude || "",

    // Analytics
    travelerScore: airport?.analytics?.travelerScore || "",
    annualPassengers: airport?.analytics?.annualPassengers || "",
    destinationsCount: airport?.analytics?.destinationsCount || "",
    sizeCategory: airport?.analytics?.sizeCategory || "",
    airlinesCount: airport?.analytics?.airlinesCount || "",
    onTimePerformance: airport?.analytics?.onTimePerformance || "",
  };

  // Validation schema
  const validationSchema = Yup.object({
    iataCode: Yup.string()
      .length(3, "IATA code must be exactly 3 characters")
      .matches(/^[A-Z]{3}$/, "IATA code must contain only uppercase letters")
      .required("IATA code is required"),
    name: Yup.string()
      .min(2, "Airport name must be at least 2 characters")
      .max(255, "Airport name must be less than 255 characters")
      .required("Airport name is required"),
    timeZoneId: Yup.string().required("Time zone is required"),
    cityId: Yup.string().required("City is required"),
    street: Yup.string().max(255, "Street must be less than 255 characters"),
    postalCode: Yup.string().max(20, "Postal code must be less than 20 characters"),
    latitude: Yup.number()
      .min(-90, "Latitude must be between -90 and 90")
      .max(90, "Latitude must be between -90 and 90")
      .nullable(),
    longitude: Yup.number()
      .min(-180, "Longitude must be between -180 and 180")
      .max(180, "Longitude must be between -180 and 180")
      .nullable(),
    travelerScore: Yup.number()
      .min(0, "Score must be between 0 and 100")
      .max(100, "Score must be between 0 and 100")
      .nullable(),
    annualPassengers: Yup.number().min(0, "Must be positive").nullable(),
    destinationsCount: Yup.number()
      .min(0, "Must be positive")
      .integer("Must be a whole number")
      .nullable(),
    sizeCategory: Yup.string().max(20, "Must be less than 20 characters"),
    airlinesCount: Yup.number()
      .min(0, "Must be positive")
      .integer("Must be a whole number")
      .nullable(),
    onTimePerformance: Yup.number()
      .min(0, "Must be between 0 and 100")
      .max(100, "Must be between 0 and 100")
      .nullable(),
  });

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const formattedValues = {
        iataCode: values.iataCode,
        name: values.name,
        timeZoneId: values.timeZoneId,
        cityId: parseInt(values.cityId),
        address:
          values.street || values.postalCode
            ? {
                street: values.street || null,
                postalCode: values.postalCode || null,
              }
            : null,
        geoCode:
          values.latitude && values.longitude
            ? {
                latitude: parseFloat(values.latitude),
                longitude: parseFloat(values.longitude),
              }
            : null,
        analytics:
          values.travelerScore ||
          values.annualPassengers ||
          values.destinationsCount ||
          values.sizeCategory ||
          values.airlinesCount ||
          values.onTimePerformance
            ? {
                travelerScore: values.travelerScore
                  ? parseInt(values.travelerScore)
                  : null,
                annualPassengers: values.annualPassengers
                  ? parseFloat(values.annualPassengers)
                  : null,
                destinationsCount: values.destinationsCount
                  ? parseInt(values.destinationsCount)
                  : null,
                sizeCategory: values.sizeCategory || null,
                airlinesCount: values.airlinesCount
                  ? parseInt(values.airlinesCount)
                  : null,
                onTimePerformance: values.onTimePerformance
                  ? parseFloat(values.onTimePerformance)
                  : null,
              }
            : null,
      };

      if (onSubmit) {
        await onSubmit(formattedValues);
        toast.success(
          isEditing ? "Airport updated successfully!" : "Airport created successfully!",
          {
            description: `${formattedValues.name} (${formattedValues.iataCode}) has been ${
              isEditing ? "updated" : "created"
            }.`,
          }
        );

        if (!isEditing) {
          resetForm();
        }
      }

      console.log("Airport Data:", formattedValues);
    } catch (error) {
      console.error("Error saving airport:", error);
      toast.error("Failed to save airport", {
        description:
          error?.message || "An error occurred while saving the airport. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="bg-white rounded-lg shadow-sm border w-full">
        <div className="flex items-center space-x-4 p-4 border-b bg-gray-50/50">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="flex items-center hover:bg-gray-100"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="text-sm text-gray-500 font-medium">
            / Airport / {isEditing ? "Edit" : "New Airport"}
          </div>
        </div>

        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 z-10 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Plane className="h-6 w-6 text-blue-600" />
                </div>
                {isEditing ? "Edit Airport" : "Create New Airport"}
              </h2>
              <p className="text-gray-600 mt-2">
                Configure airport information, location details, and analytics
              </p>
            </div>
            <div className="hidden md:block">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm font-medium text-blue-900">✈️ Airport Management</p>
                <p className="text-xs text-blue-700">Define comprehensive airport data</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ isSubmitting, values, setFieldValue }) => (
              <Form className="space-y-8">
                {/* Basic Information */}
                <Card className="border-l-4 border-l-blue-500">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Plane className="h-5 w-5 text-blue-600" />
                      Basic Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="iataCode" className="flex items-center gap-2">
                          <Hash className="h-4 w-4 text-blue-600" />
                          IATA Code *
                        </Label>
                        <Field name="iataCode">
                          {({ field }) => (
                            <Input
                              {...field}
                              id="iataCode"
                              maxLength={3}
                              placeholder="JFK"
                              className="w-full uppercase"
                              onChange={(e) =>
                                setFieldValue("iataCode", e.target.value.toUpperCase())
                              }
                            />
                          )}
                        </Field>
                        <ErrorMessage
                          name="iataCode"
                          component="div"
                          className="text-sm text-red-600 mt-1"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Exactly 3 uppercase letters
                        </p>
                      </div>

                      <div className="md:col-span-2">
                        <Label htmlFor="name" className="flex items-center gap-2">
                          <Plane className="h-4 w-4 text-blue-600" />
                          Airport Name *
                        </Label>
                        <Field
                          as={Input}
                          id="name"
                          name="name"
                          className="w-full"
                          placeholder="John F. Kennedy International Airport"
                        />
                        <ErrorMessage
                          name="name"
                          component="div"
                          className="text-sm text-red-600 mt-1"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Location Details */}
                <Card className="border-l-4 border-l-green-500">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-green-600" />
                      Location Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="cityId" className="flex items-center gap-2">
                          <Globe className="h-4 w-4 text-green-600" />
                          City *
                        </Label>
                        <Select
                          value={values.cityId}
                          onValueChange={(value) => setFieldValue("cityId", value)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a city" />
                          </SelectTrigger>
                          <SelectContent>
                            {cities && cities.length > 0 ? (
                              cities.map((city) => (
                                <SelectItem key={city.id} value={String(city.id)}>
                                  {city.cityCode} - {city.name}, {city.countryName || city.countryCode}
                                </SelectItem>
                              ))
                            ) : (
                              <SelectItem value="no-cities" disabled>
                                No cities available
                              </SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                        <ErrorMessage
                          name="cityId"
                          component="div"
                          className="text-sm text-red-600 mt-1"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          City provides country and region information
                        </p>
                      </div>

                      <div>
                        <Label htmlFor="timeZoneId" className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-green-600" />
                          Time Zone *
                        </Label>
                        <Select
                          value={values.timeZoneId}
                          onValueChange={(value) => setFieldValue("timeZoneId", value)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select timezone" />
                          </SelectTrigger>
                          <SelectContent>
                            {TIMEZONE_OPTIONS.map((tz) => (
                              <SelectItem key={tz} value={tz}>
                                {tz}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <ErrorMessage
                          name="timeZoneId"
                          component="div"
                          className="text-sm text-red-600 mt-1"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Address Information */}
                <Card className="border-l-4 border-l-purple-500">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="h-5 w-5 text-purple-600" />
                      Address Information (Optional)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <Label htmlFor="street">Street Address</Label>
                        <Field
                          as={Input}
                          id="street"
                          name="street"
                          className="w-full"
                          placeholder="123 Airport Avenue"
                        />
                        <ErrorMessage
                          name="street"
                          component="div"
                          className="text-sm text-red-600 mt-1"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          City/Country information comes from the selected City
                        </p>
                      </div>

                      <div>
                        <Label htmlFor="postalCode">Postal Code</Label>
                        <Field
                          as={Input}
                          id="postalCode"
                          name="postalCode"
                          className="w-full"
                          placeholder="11430"
                        />
                        <ErrorMessage
                          name="postalCode"
                          component="div"
                          className="text-sm text-red-600 mt-1"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Geographic Coordinates */}
                <Card className="border-l-4 border-l-orange-500">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-orange-600" />
                      Geographic Coordinates (Optional)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="latitude">Latitude</Label>
                        <Field
                          as={Input}
                          id="latitude"
                          name="latitude"
                          type="number"
                          step="any"
                          className="w-full"
                          placeholder="40.641766"
                        />
                        <ErrorMessage
                          name="latitude"
                          component="div"
                          className="text-sm text-red-600 mt-1"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Decimal degrees (-90 to 90)
                        </p>
                      </div>

                      <div>
                        <Label htmlFor="longitude">Longitude</Label>
                        <Field
                          as={Input}
                          id="longitude"
                          name="longitude"
                          type="number"
                          step="any"
                          className="w-full"
                          placeholder="-73.780968"
                        />
                        <ErrorMessage
                          name="longitude"
                          component="div"
                          className="text-sm text-red-600 mt-1"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Decimal degrees (-180 to 180)
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

               

                {/* Summary Card */}
                <Card className="bg-blue-50/50 border-blue-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-blue-900">
                      <Plane className="h-5 w-5" />
                      Airport Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                      <div className="space-y-2">
                        <h4 className="font-medium text-blue-900 mb-2">Basic Info</h4>
                        <div className="flex items-center justify-between">
                          <span>IATA Code:</span>
                          <Badge variant="secondary" className="font-mono">
                            {values.iataCode || "N/A"}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Name:</span>
                          <span className="font-medium text-xs truncate max-w-[120px]">
                            {values.name || "N/A"}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium text-blue-900 mb-2">Location</h4>
                        <div className="flex items-center justify-between">
                          <span>City ID:</span>
                          <span className="font-medium">{values.cityId || "N/A"}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Timezone:</span>
                          <span className="font-medium text-xs truncate max-w-[120px]">
                            {values.timeZoneId || "N/A"}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium text-blue-900 mb-2">Coordinates</h4>
                        <div className="flex items-center justify-between">
                          <span>Latitude:</span>
                          <span className="font-medium">{values.latitude || "N/A"}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Longitude:</span>
                          <span className="font-medium">{values.longitude || "N/A"}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium text-blue-900 mb-2">Analytics</h4>
                        <div className="flex items-center justify-between">
                          <span>Score:</span>
                          <span className="font-medium">{values.travelerScore || "N/A"}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Category:</span>
                          <span className="font-medium text-xs">
                            {values.sizeCategory
                              ? SIZE_CATEGORIES.find((c) => c.value === values.sizeCategory)
                                  ?.label || values.sizeCategory
                              : "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Form Actions */}
                <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 z-10 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Airport: {values.name || "Untitled"}</span>
                      {values.iataCode && (
                        <span className="ml-2 text-gray-500">• {values.iataCode}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate(-1)}
                        className="min-w-[100px]"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex items-center gap-2 min-w-[140px] bg-primary hover:bg-primary/90"
                      >
                        <Save className="h-4 w-4" />
                        {isSubmitting
                          ? "Saving..."
                          : isEditing
                          ? "Update Airport"
                          : "Create Airport"}
                      </Button>
                    </div>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default AirportForm;
