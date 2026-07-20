import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Save,
  DollarSign,
  Star,
  CreditCard,
  Plane,
  Coffee,
  Wifi,
  Users,
  Crown,
  Info,
  Tag,
  Armchair,
  Calendar,
  Shield,
  Gift,
  Ticket,
  Percent,
  Award,
  FastForward,
  CheckCircle,
  Utensils,
  Monitor,
  Wine,
  RefreshCw,
  CircleDollarSign,
  TrendingUp,
  Car,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getFlightsByAirline } from "@/Redux/flight/flightThunk";
import { getCabinClassesByAircraft } from "@/Redux/cabinClass/cabinClassThunk";
import { createFare, updateFare } from "@/Redux/fare/fareThunk";
import { toast } from "sonner";

const FareManagementForm = ({ fare }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { flights } = useSelector((state) => state.flight);
  const { cabinClasses } = useSelector((state) => state.cabinClass);

  // State for cascading dropdowns
  const [selectedFlight, setSelectedFlight] = useState("");
  const [selectedCabin, setSelectedCabin] = useState("");

  // Initial form values
  const initialValues = {
    // Basic Information
    name: fare?.name || "",
    rbdCode: fare?.rbdCode || "",
    fareLabel: fare?.fareLabel || "",

    // Pricing
    baseFare: fare?.baseFare || "",
    taxesAndFees: fare?.taxesAndFees || "",
    airlineFees: fare?.airlineFees || "",

    // Seat Benefits
    extraSeatSpace: fare?.seatBenefits?.extraSeatSpace || false,
    preferredSeatChoice: fare?.seatBenefits?.preferredSeatChoice || false,
    advanceSeatSelection: fare?.seatBenefits?.advanceSeatSelection || false,
    guaranteedSeatTogether: fare?.seatBenefits?.guaranteedSeatTogether || false,

    // Boarding Benefits
    priorityBoarding: fare?.boardingBenefits?.priorityBoarding || false,
    priorityCheckin: fare?.boardingBenefits?.priorityCheckin || false,
    fastTrackSecurity: fare?.boardingBenefits?.fastTrackSecurity || false,

    // In-Flight Benefits
    complimentaryMeals: fare?.inFlightBenefits?.complimentaryMeals || false,
    premiumMealChoice: fare?.inFlightBenefits?.premiumMealChoice || false,
    inFlightInternet: fare?.inFlightBenefits?.inFlightInternet || false,
    inFlightEntertainment:
      fare?.inFlightBenefits?.inFlightEntertainment || false,
    complimentaryBeverages:
      fare?.inFlightBenefits?.complimentaryBeverages || false,

    // Flexibility Benefits
    freeDateChange: fare?.flexibilityBenefits?.freeDateChange || false,
    partialRefund: fare?.flexibilityBenefits?.partialRefund || false,
    fullRefund: fare?.flexibilityBenefits?.fullRefund || false,

    // Premium Service Benefits
    loungeAccess: fare?.premiumServiceBenefits?.loungeAccess || false,
    airportTransfer: fare?.premiumServiceBenefits?.airportTransfer || false,
  };

  // Validation schema
  const validationSchema = Yup.object({
    name: Yup.string().required("Fare name is required"),
    rbdCode: Yup.string()
      .length(1, "RBD code must be a single character")
      .required("RBD code is required"),
    fareLabel: Yup.string(),
    baseFare: Yup.number()
      .min(0, "Base fare must be positive")
      .required("Base fare is required"),
    taxesAndFees: Yup.number()
      .min(0, "Taxes and fees must be positive")
      .required("Taxes and fees are required"),
    airlineFees: Yup.number()
      .min(0, "Airline fees must be positive")
      .required("Airline fees are required"),
  });

  // Load flights on component mount
  useEffect(() => {
    dispatch(getFlightsByAirline());
  }, [dispatch]);

  // Load cabin classes when flight is selected (from aircraft)
  useEffect(() => {
    if (selectedFlight) {
      const flight = flights?.find((f) => f.id === parseInt(selectedFlight));
      if (flight?.aircraft?.id) {
        dispatch(getCabinClassesByAircraft(flight.aircraft.id));
      }
    }
  }, [selectedFlight, flights, dispatch]);

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const formattedValues = {
        // Basic Information
        name: values.name,
        rbdCode: values.rbdCode,
        fareLabel: values.fareLabel || null,
        flightId: selectedFlight ? parseInt(selectedFlight) : null,
        cabinClassId: selectedCabin ? parseInt(selectedCabin) : null,

        // Pricing
        baseFare: parseFloat(values.baseFare),
        taxesAndFees: parseFloat(values.taxesAndFees),
        airlineFees: parseFloat(values.airlineFees),
        currentPrice:
          parseFloat(values.baseFare) +
          parseFloat(values.taxesAndFees) +
          parseFloat(values.airlineFees),

        extraSeatSpace: values.extraSeatSpace,
        preferredSeatChoice: values.preferredSeatChoice,
        advanceSeatSelection: values.advanceSeatSelection,
        guaranteedSeatTogether: values.guaranteedSeatTogether,

        priorityBoarding: values.priorityBoarding,
        priorityCheckin: values.priorityCheckin,
        fastTrackSecurity: values.fastTrackSecurity,

        complimentaryMeals: values.complimentaryMeals,
        premiumMealChoice: values.premiumMealChoice,
        inFlightInternet: values.inFlightInternet,
        inFlightEntertainment: values.inFlightEntertainment,
        complimentaryBeverages: values.complimentaryBeverages,

        // Flexibility Benefits (Embedded)

        freeDateChange: values.freeDateChange,
        partialRefund: values.partialRefund,
        fullRefund: values.fullRefund,

        // Premium Service Benefits (Embedded)

        loungeAccess: values.loungeAccess,
        airportTransfer: values.airportTransfer,
      };

  

      // Dispatch action to save fare
      if (fare?.id) {
        await dispatch(
          updateFare({ id: fare.id, data: formattedValues }),
        ).unwrap();
        toast.success("Fare updated successfully!", {
          description: `${formattedValues.name} has been updated.`,
        });
      } else {
        console.log("formattedValues --- ", formattedValues);
        await dispatch(createFare(formattedValues)).unwrap();
        toast.success("Fare created successfully!", {
          description: `${formattedValues.name} has been created.`,
        });

        // Reset form and selections after successful creation
        resetForm();
        setSelectedFlight(null);
        setSelectedCabin(null);
      }

      console.log("Fare Data:", formattedValues);
      // navigate(-1);
    } catch (error) {
      console.error("Error saving fare:", error);
      toast.error("Failed to save fare", {
        description:
          error?.message ||
          "An error occurred while saving the fare. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const formatCurrency = (value) => {
    if (!value) return "";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(value);
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
            / Fare Management / {fare ? "Edit" : "New Fare"}
          </div>
        </div>

        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 z-10 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <DollarSign className="h-6 w-6 text-blue-600" />
                </div>
                {fare ? "Edit Fare" : "Create New Fare"}
              </h2>
              <p className="text-gray-600 mt-2">
                Configure fare pricing and features for your flights
              </p>
            </div>
            <div className="hidden md:block">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm font-medium text-blue-900">
                  💰 Smart Pricing
                </p>
                <p className="text-xs text-blue-700">
                  Define fares with flexible features
                </p>
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
                {/* Flight and Cabin Selection */}
                <Card className="border-l-4 border-l-indigo-500">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Plane className="h-5 w-5 text-indigo-600" />
                      Flight & Cabin Selection
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Flight Selection */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="flightSelect"
                          className="flex items-center gap-2"
                        >
                          <Plane className="h-4 w-4 text-indigo-800" />
                          Select Flight *
                        </Label>
                        <Select
                          value={selectedFlight}
                          onValueChange={(value) => {
                            setSelectedFlight(value);
                            setSelectedCabin(null);
                          }}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a flight" />
                          </SelectTrigger>
                          <SelectContent>
                            {flights && flights?.length > 0 ? (
                              flights.map((flight) => (
                                <SelectItem
                                  key={flight.id}
                                  value={flight.id.toString()}
                                >
                                  {flight.flightNumber} -{" "}
                                  {flight.departureAirport.iataCode} →{" "}
                                  {flight.arrivalAirport.iataCode}
                                </SelectItem>
                              ))
                            ) : (
                              <SelectItem value="no-flights" disabled>
                                No flights available
                              </SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground mt-1">
                          Choose the flight for this fare
                        </p>
                      </div>

                      {/* Cabin Selection */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="cabinSelect"
                          className="flex items-center gap-2"
                        >
                          <Armchair className="h-4 w-4 text-purple-600" />
                          Select Cabin *
                        </Label>
                        <Select
                          value={selectedCabin}
                          onValueChange={(value) => {
                            setSelectedCabin(value);
                          }}
                          disabled={
                            !selectedFlight || cabinClasses?.length === 0
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a cabin class" />
                          </SelectTrigger>
                          <SelectContent>
                            {cabinClasses && cabinClasses.length > 0 ? (
                              cabinClasses.map((cabinClass) => (
                                <SelectItem
                                  key={cabinClass.id}
                                  value={cabinClass.id.toString()}
                                >
                                  {cabinClass.name ||
                                    cabinClass.cabinClassType ||
                                    `Cabin ${cabinClass.id}`}
                                </SelectItem>
                              ))
                            ) : (
                              <SelectItem value="no-cabins" disabled>
                                {selectedFlight
                                  ? "No cabin classes available"
                                  : "Select a flight first"}
                              </SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground mt-1">
                          Choose the cabin class
                        </p>
                      </div>
                    </div>

                    {/* Display Selected Cabin Class ID */}
                    {selectedCabin && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-green-900">
                            Selected Cabin Class ID:
                          </span>
                          <Badge variant="default" className="bg-green-600">
                            {selectedCabin}
                          </Badge>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Basic Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Tag className="h-5 w-5 text-blue-600" />
                      Basic Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label
                          htmlFor="name"
                          className="flex items-center gap-2"
                        >
                          <Tag className="h-4 w-4 text-primary" />
                          Fare Name *
                        </Label>
                        <Field
                          as={Input}
                          id="name"
                          name="name"
                          placeholder="e.g., Economy Basic"
                        />
                        <ErrorMessage
                          name="name"
                          component="div"
                          className="text-sm text-red-600 mt-1"
                        />
                      </div>

                      <div>
                        <Label
                          htmlFor="rbdCode"
                          className="flex items-center gap-2"
                        >
                          <Ticket className="h-4 w-4 text-blue-600" />
                          RBD Code *
                        </Label>
                        <Field name="rbdCode">
                          {({ field }) => (
                            <Input
                              {...field}
                              id="rbdCode"
                              maxLength={1}
                              placeholder="Y"
                              className="uppercase"
                              onChange={(e) =>
                                setFieldValue(
                                  "rbdCode",
                                  e.target.value.toUpperCase(),
                                )
                              }
                            />
                          )}
                        </Field>
                        <ErrorMessage
                          name="rbdCode"
                          component="div"
                          className="text-sm text-red-600 mt-1"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Single character booking class code
                        </p>
                      </div>

                      <div>
                        <Label
                          htmlFor="fareLabel"
                          className="flex items-center gap-2"
                        >
                          <Star className="h-4 w-4 text-amber-600" />
                          Fare Label
                        </Label>
                        <Field
                          as={Input}
                          id="fareLabel"
                          name="fareLabel"
                          placeholder="e.g., MMT Special, Saver, Flex"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Marketing label for this fare
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Pricing Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-green-600" />
                      Pricing Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label
                          htmlFor="baseFare"
                          className="flex items-center gap-2"
                        >
                          <DollarSign className="h-4 w-4 text-green-600" />
                          Base Fare (₹) *
                        </Label>
                        <Field
                          as={Input}
                          id="baseFare"
                          name="baseFare"
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="0.00"
                        />
                        <ErrorMessage
                          name="baseFare"
                          component="div"
                          className="text-sm text-red-600 mt-1"
                        />
                        {values.baseFare && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatCurrency(values.baseFare)}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label
                          htmlFor="taxesAndFees"
                          className="flex items-center gap-2"
                        >
                          <CreditCard className="h-4 w-4 text-orange-600" />
                          Taxes & Fees (₹) *
                        </Label>
                        <Field
                          as={Input}
                          id="taxesAndFees"
                          name="taxesAndFees"
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="0.00"
                        />
                        <ErrorMessage
                          name="taxesAndFees"
                          component="div"
                          className="text-sm text-red-600 mt-1"
                        />
                        {values.taxesAndFees && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatCurrency(values.taxesAndFees)}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label
                          htmlFor="airlineFees"
                          className="flex items-center gap-2"
                        >
                          <Plane className="h-4 w-4 text-blue-600" />
                          Airline Fees (₹) *
                        </Label>
                        <Field
                          as={Input}
                          id="airlineFees"
                          name="airlineFees"
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="0.00"
                        />
                        <ErrorMessage
                          name="airlineFees"
                          component="div"
                          className="text-sm text-red-600 mt-1"
                        />
                        {values.airlineFees && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatCurrency(values.airlineFees)}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Total Price Display */}
                    {values.baseFare &&
                      values.taxesAndFees &&
                      values.airlineFees && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-green-900">
                              Total Price:
                            </span>
                            <span className="text-2xl font-bold text-green-600">
                              {formatCurrency(
                                parseFloat(values.baseFare) +
                                  parseFloat(values.taxesAndFees) +
                                  parseFloat(values.airlineFees),
                              )}
                            </span>
                          </div>
                        </div>
                      )}
                  </CardContent>
                </Card>

                {/* Seat Benefits */}
                <Card className="border-l-4 border-l-purple-500">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Armchair className="h-5 w-5 text-purple-600" />
                      Seat Benefits
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center justify-between p-4 border rounded-lg bg-purple-50/50">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-purple-600" />
                          <Label
                            htmlFor="extraSeatSpace"
                            className="font-medium"
                          >
                            Extra Seat Space
                          </Label>
                        </div>
                        <Field name="extraSeatSpace">
                          {({ field }) => (
                            <Switch
                              id="extraSeatSpace"
                              checked={field.value}
                              onCheckedChange={(checked) =>
                                setFieldValue("extraSeatSpace", checked)
                              }
                            />
                          )}
                        </Field>
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg bg-purple-50/50">
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4 text-purple-600" />
                          <Label
                            htmlFor="preferredSeatChoice"
                            className="font-medium"
                          >
                            Preferred Seat Choice
                          </Label>
                        </div>
                        <Field name="preferredSeatChoice">
                          {({ field }) => (
                            <Switch
                              id="preferredSeatChoice"
                              checked={field.value}
                              onCheckedChange={(checked) =>
                                setFieldValue("preferredSeatChoice", checked)
                              }
                            />
                          )}
                        </Field>
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg bg-purple-50/50">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-purple-600" />
                          <Label
                            htmlFor="advanceSeatSelection"
                            className="font-medium"
                          >
                            Advance Seat Selection
                          </Label>
                        </div>
                        <Field name="advanceSeatSelection">
                          {({ field }) => (
                            <Switch
                              id="advanceSeatSelection"
                              checked={field.value}
                              onCheckedChange={(checked) =>
                                setFieldValue("advanceSeatSelection", checked)
                              }
                            />
                          )}
                        </Field>
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg bg-purple-50/50">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-purple-600" />
                          <Label
                            htmlFor="guaranteedSeatTogether"
                            className="font-medium"
                          >
                            Guaranteed Seat Together
                          </Label>
                        </div>
                        <Field name="guaranteedSeatTogether">
                          {({ field }) => (
                            <Switch
                              id="guaranteedSeatTogether"
                              checked={field.value}
                              onCheckedChange={(checked) =>
                                setFieldValue("guaranteedSeatTogether", checked)
                              }
                            />
                          )}
                        </Field>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Boarding Benefits */}
                <Card className="border-l-4 border-l-blue-500">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Plane className="h-5 w-5 text-blue-600" />
                      Boarding & Check-in Benefits
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center justify-between p-4 border rounded-lg bg-blue-50/50">
                        <div className="flex items-center gap-2">
                          <Plane className="h-4 w-4 text-blue-600" />
                          <Label
                            htmlFor="priorityBoarding"
                            className="font-medium"
                          >
                            Priority Boarding
                          </Label>
                        </div>
                        <Field name="priorityBoarding">
                          {({ field }) => (
                            <Switch
                              id="priorityBoarding"
                              checked={field.value}
                              onCheckedChange={(checked) =>
                                setFieldValue("priorityBoarding", checked)
                              }
                            />
                          )}
                        </Field>
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg bg-blue-50/50">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-blue-600" />
                          <Label
                            htmlFor="priorityCheckin"
                            className="font-medium"
                          >
                            Priority Check-in
                          </Label>
                        </div>
                        <Field name="priorityCheckin">
                          {({ field }) => (
                            <Switch
                              id="priorityCheckin"
                              checked={field.value}
                              onCheckedChange={(checked) =>
                                setFieldValue("priorityCheckin", checked)
                              }
                            />
                          )}
                        </Field>
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg bg-blue-50/50">
                        <div className="flex items-center gap-2">
                          <FastForward className="h-4 w-4 text-blue-600" />
                          <Label
                            htmlFor="fastTrackSecurity"
                            className="font-medium"
                          >
                            Fast Track Security
                          </Label>
                        </div>
                        <Field name="fastTrackSecurity">
                          {({ field }) => (
                            <Switch
                              id="fastTrackSecurity"
                              checked={field.value}
                              onCheckedChange={(checked) =>
                                setFieldValue("fastTrackSecurity", checked)
                              }
                            />
                          )}
                        </Field>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* In-Flight Benefits */}
                <Card className="border-l-4 border-l-orange-500">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Coffee className="h-5 w-5 text-orange-600" />
                      In-Flight Benefits
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="flex items-center justify-between p-4 border rounded-lg bg-orange-50/50">
                        <div className="flex items-center gap-2">
                          <Utensils className="h-4 w-4 text-orange-600" />
                          <Label
                            htmlFor="complimentaryMeals"
                            className="font-medium"
                          >
                            Complimentary Meals
                          </Label>
                        </div>
                        <Field name="complimentaryMeals">
                          {({ field }) => (
                            <Switch
                              id="complimentaryMeals"
                              checked={field.value}
                              onCheckedChange={(checked) =>
                                setFieldValue("complimentaryMeals", checked)
                              }
                            />
                          )}
                        </Field>
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg bg-orange-50/50">
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4 text-orange-600" />
                          <Label
                            htmlFor="premiumMealChoice"
                            className="font-medium"
                          >
                            Premium Meal Choice
                          </Label>
                        </div>
                        <Field name="premiumMealChoice">
                          {({ field }) => (
                            <Switch
                              id="premiumMealChoice"
                              checked={field.value}
                              onCheckedChange={(checked) =>
                                setFieldValue("premiumMealChoice", checked)
                              }
                            />
                          )}
                        </Field>
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg bg-orange-50/50">
                        <div className="flex items-center gap-2">
                          <Wifi className="h-4 w-4 text-orange-600" />
                          <Label
                            htmlFor="inFlightInternet"
                            className="font-medium"
                          >
                            In-Flight Internet
                          </Label>
                        </div>
                        <Field name="inFlightInternet">
                          {({ field }) => (
                            <Switch
                              id="inFlightInternet"
                              checked={field.value}
                              onCheckedChange={(checked) =>
                                setFieldValue("inFlightInternet", checked)
                              }
                            />
                          )}
                        </Field>
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg bg-orange-50/50">
                        <div className="flex items-center gap-2">
                          <Monitor className="h-4 w-4 text-orange-600" />
                          <Label
                            htmlFor="inFlightEntertainment"
                            className="font-medium"
                          >
                            In-Flight Entertainment
                          </Label>
                        </div>
                        <Field name="inFlightEntertainment">
                          {({ field }) => (
                            <Switch
                              id="inFlightEntertainment"
                              checked={field.value}
                              onCheckedChange={(checked) =>
                                setFieldValue("inFlightEntertainment", checked)
                              }
                            />
                          )}
                        </Field>
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg bg-orange-50/50">
                        <div className="flex items-center gap-2">
                          <Wine className="h-4 w-4 text-orange-600" />
                          <Label
                            htmlFor="complimentaryBeverages"
                            className="font-medium"
                          >
                            Complimentary Beverages
                          </Label>
                        </div>
                        <Field name="complimentaryBeverages">
                          {({ field }) => (
                            <Switch
                              id="complimentaryBeverages"
                              checked={field.value}
                              onCheckedChange={(checked) =>
                                setFieldValue("complimentaryBeverages", checked)
                              }
                            />
                          )}
                        </Field>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Flexibility Benefits */}
                <Card className="border-l-4 border-l-green-500">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <RefreshCw className="h-5 w-5 text-green-600" />
                      Flexibility Benefits
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center justify-between p-4 border rounded-lg bg-green-50/50">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-green-600" />
                          <Label
                            htmlFor="freeDateChange"
                            className="font-medium"
                          >
                            Free Date Change
                          </Label>
                        </div>
                        <Field name="freeDateChange">
                          {({ field }) => (
                            <Switch
                              id="freeDateChange"
                              checked={field.value}
                              onCheckedChange={(checked) =>
                                setFieldValue("freeDateChange", checked)
                              }
                            />
                          )}
                        </Field>
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg bg-green-50/50">
                        <div className="flex items-center gap-2">
                          <CircleDollarSign className="h-4 w-4 text-green-600" />
                          <Label
                            htmlFor="partialRefund"
                            className="font-medium"
                          >
                            Partial Refund
                          </Label>
                        </div>
                        <Field name="partialRefund">
                          {({ field }) => (
                            <Switch
                              id="partialRefund"
                              checked={field.value}
                              onCheckedChange={(checked) =>
                                setFieldValue("partialRefund", checked)
                              }
                            />
                          )}
                        </Field>
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg bg-green-50/50">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-green-600" />
                          <Label htmlFor="fullRefund" className="font-medium">
                            Full Refund
                          </Label>
                        </div>
                        <Field name="fullRefund">
                          {({ field }) => (
                            <Switch
                              id="fullRefund"
                              checked={field.value}
                              onCheckedChange={(checked) =>
                                setFieldValue("fullRefund", checked)
                              }
                            />
                          )}
                        </Field>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Premium Service Benefits */}
                <Card className="border-l-4 border-l-pink-500">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Crown className="h-5 w-5 text-pink-600" />
                      Premium Service Benefits
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center justify-between p-4 border rounded-lg bg-pink-50/50">
                        <div className="flex items-center gap-2">
                          <Crown className="h-4 w-4 text-pink-600" />
                          <Label htmlFor="loungeAccess" className="font-medium">
                            Lounge Access
                          </Label>
                        </div>
                        <Field name="loungeAccess">
                          {({ field }) => (
                            <Switch
                              id="loungeAccess"
                              checked={field.value}
                              onCheckedChange={(checked) =>
                                setFieldValue("loungeAccess", checked)
                              }
                            />
                          )}
                        </Field>
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg bg-pink-50/50">
                        <div className="flex items-center gap-2">
                          <Car className="h-4 w-4 text-pink-600" />
                          <Label
                            htmlFor="airportTransfer"
                            className="font-medium"
                          >
                            Airport Transfer
                          </Label>
                        </div>
                        <Field name="airportTransfer">
                          {({ field }) => (
                            <Switch
                              id="airportTransfer"
                              checked={field.value}
                              onCheckedChange={(checked) =>
                                setFieldValue("airportTransfer", checked)
                              }
                            />
                          )}
                        </Field>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Fare Summary */}
                <Card className="bg-blue-50/50 border-blue-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-blue-900">
                      <Info className="h-5 w-5" />
                      Fare Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                      <div className="space-y-2">
                        <h4 className="font-medium text-blue-900 mb-2">
                          Selection Details
                        </h4>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span>Flight:</span>
                            <span className="font-medium text-xs">
                              {selectedFlight
                                ? flights?.find(
                                    (f) => f.id === parseInt(selectedFlight),
                                  )?.flightNumber
                                : "N/A"}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Cabin:</span>
                            <span className="font-medium text-xs">
                              {selectedCabin
                                ? cabinClasses?.find(
                                    (c) => c.id === parseInt(selectedCabin),
                                  )?.name
                                : "N/A"}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium text-blue-900 mb-2">
                          Fare Details
                        </h4>
                        <div className="flex items-center justify-between">
                          <span>Name:</span>
                          <span className="font-medium">
                            {values.name || "N/A"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>RBD Code:</span>
                          <Badge variant="secondary" className="font-mono">
                            {values.rbdCode || "N/A"}
                          </Badge>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium text-blue-900 mb-2">
                          Pricing Breakdown
                        </h4>
                        <div className="flex items-center justify-between">
                          <span>Base Fare:</span>
                          <span className="font-medium">
                            {values.baseFare
                              ? formatCurrency(values.baseFare)
                              : "N/A"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Taxes & Fees:</span>
                          <span className="font-medium">
                            {values.taxesAndFees
                              ? formatCurrency(values.taxesAndFees)
                              : "N/A"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Airline Fees:</span>
                          <span className="font-medium">
                            {values.airlineFees
                              ? formatCurrency(values.airlineFees)
                              : "N/A"}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium text-blue-900 mb-2">
                          Key Benefits
                        </h4>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs">Seat:</span>
                            <Badge
                              variant={
                                values.extraSeatSpace ||
                                values.preferredSeatChoice
                                  ? "default"
                                  : "secondary"
                              }
                              className="text-xs"
                            >
                              {values.extraSeatSpace ||
                              values.preferredSeatChoice
                                ? "Yes"
                                : "No"}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs">Boarding:</span>
                            <Badge
                              variant={
                                values.priorityBoarding ||
                                values.priorityCheckin
                                  ? "default"
                                  : "secondary"
                              }
                              className="text-xs"
                            >
                              {values.priorityBoarding || values.priorityCheckin
                                ? "Yes"
                                : "No"}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs">In-Flight:</span>
                            <Badge
                              variant={
                                values.complimentaryMeals ||
                                values.inFlightInternet
                                  ? "default"
                                  : "secondary"
                              }
                              className="text-xs"
                            >
                              {values.complimentaryMeals ||
                              values.inFlightInternet
                                ? "Yes"
                                : "No"}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs">Flexibility:</span>
                            <Badge
                              variant={
                                values.freeDateChange ||
                                values.partialRefund ||
                                values.fullRefund
                                  ? "default"
                                  : "secondary"
                              }
                              className="text-xs"
                            >
                              {values.freeDateChange ||
                              values.partialRefund ||
                              values.fullRefund
                                ? "Yes"
                                : "No"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Form Actions */}
                <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 z-10 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">
                        Fare: {values.name || "Untitled"}
                      </span>
                      {values.rbdCode && (
                        <span className="ml-2 text-gray-500">
                          • RBD: {values.rbdCode}
                        </span>
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
                        // disabled={isSubmitting}
                        className="flex items-center gap-2 min-w-[140px] bg-primary hover:bg-primary/90"
                      >
                        <Save className="h-4 w-4" />
                        {isSubmitting
                          ? "Saving..."
                          : fare
                            ? "Update Fare"
                            : "Create Fare"}
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

export default FareManagementForm;
