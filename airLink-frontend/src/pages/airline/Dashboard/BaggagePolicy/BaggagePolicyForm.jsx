import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Save,
  Luggage,
  Package,
  Briefcase,
  Weight,
  Ruler,
  DollarSign,
  Info,
  AlertCircle,
  Plane,
  Armchair,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Badge } from "@/components/ui/badge";
import {
  createPolicy,
  getPolicyById,
  updatePolicy,
} from "@/Redux/baggagePolicy/baggagePolicyThunk";
import { formatCurrency } from "@/utils/formateCurrency";
import { getFlightsByAirline } from "@/Redux/flight/flightThunk";
import { getCabinClassesByAircraft } from "@/Redux/cabinClass/cabinClassThunk";

import { toast } from "sonner";
import { getFlightFares } from "@/Redux/fare/fareThunk";

const BaggagePolicyForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

  const { flights } = useSelector((state) => state.flight);
  const { cabinClasses } = useSelector((state) => state.cabinClass);
  const { fares } = useSelector((state) => state.fare);
  const { policy } = useSelector((state) => state.baggagePolicy);
  const [initialValues, setInitialValues] = useState({
    name: "",
    description: "",
  });

  // State for cascading dropdowns
  const [selectedFlight, setSelectedFlight] = useState("");
  const [selectedCabin, setSelectedCabin] = useState("");
  const [selectedFare, setSelectedFare] = useState("");

  useEffect(() => {
    if (id) {
      dispatch(getPolicyById(id));
    }
  }, [id]);

  // Initial form values

  useEffect(() => {
    if (policy) {
      const baggagePolicy = policy;
      const initialValues = {
        name: baggagePolicy?.name ?? "",
        description: baggagePolicy?.description ?? "",
        fareId: baggagePolicy?.fareId ?? "",

        cabinBaggageMaxWeight: baggagePolicy?.cabinBaggageMaxWeight ?? "",
        cabinBaggagePieces: baggagePolicy?.cabinBaggagePieces ?? "", // null → ''
        cabinBaggageWeightPerPiece:
          baggagePolicy?.cabinBaggageWeightPerPiece ?? "",
        cabinBaggageMaxDimension: baggagePolicy?.cabinBaggageMaxDimension ?? "",

        checkInBaggageMaxWeight: baggagePolicy?.checkInBaggageMaxWeight ?? "",
        checkInBaggagePieces: baggagePolicy?.checkInBaggagePieces ?? "", // null → ''
        checkInBaggageWeightPerPiece:
          baggagePolicy?.checkInBaggageWeightPerPiece ?? "",

        freeCheckedBagsAllowance: baggagePolicy?.freeCheckedBagsAllowance ?? "",
        priorityBaggage: baggagePolicy?.priorityBaggage ?? false,
        extraBaggageAllowance: baggagePolicy?.extraBaggageAllowance ?? false,
      };
      setInitialValues(initialValues);
    }
  }, [policy]);

  // Validation schema
  const validationSchema = Yup.object({
    name: Yup.string().required("Policy name is required"),
    description: Yup.string(),
    fareId: Yup.number()
      .required("Fare ID is required")
      .positive("Fare ID must be positive"),
    cabinBaggageMaxWeight: Yup.number().min(0, "Must be positive").nullable(),
    cabinBaggagePieces: Yup.number()
      .min(0, "Must be positive")
      .integer("Must be an integer")
      .nullable(),
    cabinBaggageWeightPerPiece: Yup.number()
      .min(0, "Must be positive")
      .nullable(),
    cabinBaggageMaxDimension: Yup.number()
      .min(0, "Must be positive")
      .nullable(),
    checkInBaggageMaxWeight: Yup.number().min(0, "Must be positive").nullable(),
    checkInBaggagePieces: Yup.number()
      .min(0, "Must be positive")
      .integer("Must be an integer")
      .nullable(),
    checkInBaggageWeightPerPiece: Yup.number()
      .min(0, "Must be positive")
      .nullable(),
    freeCheckedBagsAllowance: Yup.number()
      .min(0, "Must be positive")
      .integer("Must be an integer")
      .nullable(),
    priorityBaggage: Yup.boolean(),
    extraBaggageAllowance: Yup.boolean(),
  });

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const formattedValues = {
        ...values,
        fareId: parseInt(values.fareId),
        cabinBaggageMaxWeight: values.cabinBaggageMaxWeight
          ? parseFloat(values.cabinBaggageMaxWeight)
          : null,
        cabinBaggagePieces: values.cabinBaggagePieces
          ? parseInt(values.cabinBaggagePieces)
          : null,
        cabinBaggageWeightPerPiece: values.cabinBaggageWeightPerPiece
          ? parseFloat(values.cabinBaggageWeightPerPiece)
          : null,
        cabinBaggageMaxDimension: values.cabinBaggageMaxDimension
          ? parseFloat(values.cabinBaggageMaxDimension)
          : null,
        checkInBaggageMaxWeight: values.checkInBaggageMaxWeight
          ? parseFloat(values.checkInBaggageMaxWeight)
          : null,
        checkInBaggagePieces: values.checkInBaggagePieces
          ? parseInt(values.checkInBaggagePieces)
          : null,
        checkInBaggageWeightPerPiece: values.checkInBaggageWeightPerPiece
          ? parseFloat(values.checkInBaggageWeightPerPiece)
          : null,
        freeCheckedBagsAllowance: values.freeCheckedBagsAllowance
          ? parseInt(values.freeCheckedBagsAllowance)
          : null,
        priorityBaggage: values.priorityBaggage || false,
        extraBaggageAllowance: values.extraBaggageAllowance || false,
      };

      // Dispatch action to save baggage policy
      if (policy?.id) {
        await dispatch(
          updatePolicy({ id: policy.id, data: formattedValues })
        ).unwrap();
        toast.success("Baggage policy updated successfully!", {
          description: `${formattedValues.name} has been updated.`,
        });
      } else {
        await dispatch(createPolicy(formattedValues)).unwrap();
        toast.success("Baggage policy created successfully!", {
          description: `${formattedValues.name} has been created.`,
        });

        // Reset form and selections after successful creation
        resetForm();
        setSelectedFlight(null);
        setSelectedCabin(null);
        setSelectedFare(null);
      }

      console.log("Baggage Policy Data:", formattedValues);
      // navigate("/airline/baggage-policies");
    } catch (error) {
      console.error("Error saving baggage policy:", error);
      toast.error("Failed to save baggage policy", {
        description:
          error?.message ||
          "An error occurred while saving the baggage policy. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

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

  // Load fares when cabin is selected
  useEffect(() => {
    if (selectedFlight && selectedCabin) {
      dispatch(getFlightFares({
        flightId: parseInt(selectedFlight),
        cabinId: parseInt(selectedCabin)
      }));
      setSelectedFare(null);
    }
  }, [selectedCabin, selectedFlight, dispatch]);

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
            / Baggage Policy / {policy ? "Edit" : "New Policy"}
          </div>
        </div>

        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 z-10 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <Luggage className="h-6 w-6 text-purple-600" />
                </div>
                {policy
                  ? "Edit Baggage Policy"
                  : "Create New Baggage Policy"}
              </h2>
              <p className="text-gray-600 mt-2">
                Configure baggage allowances and policies for your flights
              </p>
            </div>
            <div className="hidden md:block">
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                <p className="text-sm font-medium text-purple-900">
                  💼 Smart Baggage
                </p>
                <p className="text-xs text-purple-700">
                  Define policies for different fare classes
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
                {/* Flight, Cabin, and Fare Selection */}
             {!policy &&   <Card className="border-l-4 border-l-indigo-500">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Plane className="h-5 w-5 text-indigo-600" />
                      Flight & Fare Selection
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Flight Selection */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="flightSelect"
                          className="flex items-center gap-2"
                        >
                          <Plane className="h-4 w-4 text-blue-600" />
                          Select Flight *
                        </Label>
                        <Select
                          value={selectedFlight}
                          onValueChange={(value) => {
                            setSelectedFlight(value);
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
                          Choose the flight for this baggage policy
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
                                  {cabinClass.name || cabinClass.cabinClassType ||
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

                      {/* Fare Selection */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="fareSelect"
                          className="flex items-center gap-2"
                        >
                          <DollarSign className="h-4 w-4 text-green-600" />
                          Select Fare *
                        </Label>
                        <Select
                          value={selectedFare}
                          onValueChange={(value) => {
                            setSelectedFare(value);
                            setFieldValue("fareId", value);
                          }}
                          disabled={!selectedCabin || fares?.length === 0}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a fare" />
                          </SelectTrigger>
                          <SelectContent>
                            {fares && fares.length > 0 ? (
                              fares.map((fare) => (
                                <SelectItem
                                  key={fare.id}
                                  value={fare.id.toString()}
                                >
                                  {fare.name || `Fare ${fare.id}`} -{" "}
                                  {formatCurrency(fare.baseFare)}
                                </SelectItem>
                              ))
                            ) : (
                              <SelectItem value="no-fares" disabled>
                                {selectedCabin
                                  ? "No fares available"
                                  : "Select a cabin first"}
                              </SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground mt-1">
                          Choose the fare for this baggage policy
                        </p>
                        <ErrorMessage
                          name="fareId"
                          component="div"
                          className="text-sm text-red-600 mt-1"
                        />
                      </div>
                    </div>

                    {/* Display Selected Fare ID */}
                    {selectedFare && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-green-900">
                            Selected Fare ID:
                          </span>
                          <Badge variant="default" className="bg-green-600">
                            {selectedFare}
                          </Badge>
                        </div>
                      </div>
                    )}

                    {/* Hidden fareId field */}
                    <Field type="hidden" name="fareId" />
                  </CardContent>
                </Card>}

                {/* Basic Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5 text-purple-600" />
                      Basic Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label
                          htmlFor="name"
                          className="flex items-center gap-2"
                        >
                          <Package className="h-4 w-4 text-primary" />
                          Policy Name *
                        </Label>
                        <Field
                          as={Input}
                          id="name"
                          name="name"
                          placeholder="e.g., Economy Baggage Policy"
                        />
                        <ErrorMessage
                          name="name"
                          component="div"
                          className="text-sm text-red-600 mt-1"
                        />
                      </div>

                      <div>
                        <Label
                          htmlFor="description"
                          className="flex items-center gap-2"
                        >
                          <Info className="h-4 w-4 text-blue-600" />
                          Description
                        </Label>
                        <Field
                          as={Input}
                          id="description"
                          name="description"
                          placeholder="Brief description of the policy"
                        />
                        <ErrorMessage
                          name="description"
                          component="div"
                          className="text-sm text-red-600 mt-1"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Cabin Baggage */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Briefcase className="h-5 w-5 text-blue-600" />
                      Cabin Baggage (Carry-On)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label
                          htmlFor="cabinBaggageMaxWeight"
                          className="flex items-center gap-2"
                        >
                          <Weight className="h-4 w-4 text-blue-600" />
                          Max Weight (kg)
                        </Label>
                        <Field
                          as={Input}
                          id="cabinBaggageMaxWeight"
                          name="cabinBaggageMaxWeight"
                          type="number"
                          step="0.1"
                          min="0"
                          placeholder="7.0"
                        />
                        <ErrorMessage
                          name="cabinBaggageMaxWeight"
                          component="div"
                          className="text-sm text-red-600 mt-1"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Maximum total weight allowed for cabin baggage
                        </p>
                      </div>

                      <div>
                        <Label
                          htmlFor="cabinBaggagePieces"
                          className="flex items-center gap-2"
                        >
                          <Package className="h-4 w-4 text-blue-600" />
                          Number of Pieces
                        </Label>
                        <Field
                          as={Input}
                          id="cabinBaggagePieces"
                          name="cabinBaggagePieces"
                          type="number"
                          min="0"
                          placeholder="1"
                        />
                        <ErrorMessage
                          name="cabinBaggagePieces"
                          component="div"
                          className="text-sm text-red-600 mt-1"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Number of cabin baggage pieces allowed
                        </p>
                      </div>

                      <div>
                        <Label
                          htmlFor="cabinBaggageWeightPerPiece"
                          className="flex items-center gap-2"
                        >
                          <Weight className="h-4 w-4 text-blue-600" />
                          Weight per Piece (kg)
                        </Label>
                        <Field
                          as={Input}
                          id="cabinBaggageWeightPerPiece"
                          name="cabinBaggageWeightPerPiece"
                          type="number"
                          step="0.1"
                          min="0"
                          placeholder="7.0"
                        />
                        <ErrorMessage
                          name="cabinBaggageWeightPerPiece"
                          component="div"
                          className="text-sm text-red-600 mt-1"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Maximum weight per piece of cabin baggage
                        </p>
                      </div>

                      <div>
                        <Label
                          htmlFor="cabinBaggageMaxDimension"
                          className="flex items-center gap-2"
                        >
                          <Ruler className="h-4 w-4 text-blue-600" />
                          Max Dimension (cm)
                        </Label>
                        <Field
                          as={Input}
                          id="cabinBaggageMaxDimension"
                          name="cabinBaggageMaxDimension"
                          type="number"
                          step="0.1"
                          min="0"
                          placeholder="115.0"
                        />
                        <ErrorMessage
                          name="cabinBaggageMaxDimension"
                          component="div"
                          className="text-sm text-red-600 mt-1"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Sum of length + width + height (in cm)
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Checked Baggage */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Luggage className="h-5 w-5 text-green-600" />
                      Checked Baggage
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label
                          htmlFor="checkInBaggageMaxWeight"
                          className="flex items-center gap-2"
                        >
                          <Weight className="h-4 w-4 text-green-600" />
                          Max Weight (kg)
                        </Label>
                        <Field
                          as={Input}
                          id="checkInBaggageMaxWeight"
                          name="checkInBaggageMaxWeight"
                          type="number"
                          step="0.1"
                          min="0"
                          placeholder="23.0"
                        />
                        <ErrorMessage
                          name="checkInBaggageMaxWeight"
                          component="div"
                          className="text-sm text-red-600 mt-1"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Maximum total weight for checked baggage
                        </p>
                      </div>

                      <div>
                        <Label
                          htmlFor="checkInBaggagePieces"
                          className="flex items-center gap-2"
                        >
                          <Package className="h-4 w-4 text-green-600" />
                          Number of Pieces
                        </Label>
                        <Field
                          as={Input}
                          id="checkInBaggagePieces"
                          name="checkInBaggagePieces"
                          type="number"
                          min="0"
                          placeholder="1"
                        />
                        <ErrorMessage
                          name="checkInBaggagePieces"
                          component="div"
                          className="text-sm text-red-600 mt-1"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Number of checked baggage pieces allowed
                        </p>
                      </div>

                      <div>
                        <Label
                          htmlFor="checkInBaggageWeightPerPiece"
                          className="flex items-center gap-2"
                        >
                          <Weight className="h-4 w-4 text-green-600" />
                          Weight per Piece (kg)
                        </Label>
                        <Field
                          as={Input}
                          id="checkInBaggageWeightPerPiece"
                          name="checkInBaggageWeightPerPiece"
                          type="number"
                          step="0.1"
                          min="0"
                          placeholder="23.0"
                        />
                        <ErrorMessage
                          name="checkInBaggageWeightPerPiece"
                          component="div"
                          className="text-sm text-red-600 mt-1"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Maximum weight per piece of checked baggage
                        </p>
                      </div>

                      <div>
                        <Label
                          htmlFor="freeCheckedBagsAllowance"
                          className="flex items-center gap-2"
                        >
                          <Package className="h-4 w-4 text-green-600" />
                          Free Bags Allowance
                        </Label>
                        <Field
                          as={Input}
                          id="freeCheckedBagsAllowance"
                          name="freeCheckedBagsAllowance"
                          type="number"
                          min="0"
                          placeholder="1"
                        />
                        <ErrorMessage
                          name="freeCheckedBagsAllowance"
                          component="div"
                          className="text-sm text-red-600 mt-1"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Number of free checked bags allowed
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Baggage Benefits */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5 text-orange-600" />
                      Baggage Benefits
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex items-center justify-between space-x-2 p-4 border rounded-lg">
                        <div className="flex-1">
                          <Label
                            htmlFor="priorityBaggage"
                            className="text-base font-medium cursor-pointer"
                          >
                            Priority Baggage
                          </Label>
                          <p className="text-sm text-muted-foreground mt-1">
                            Enable priority handling for checked baggage
                          </p>
                        </div>
                        <Field name="priorityBaggage">
                          {({ field, form }) => (
                            <Switch
                              id="priorityBaggage"
                              checked={field.value}
                              onCheckedChange={(checked) =>
                                form.setFieldValue("priorityBaggage", checked)
                              }
                            />
                          )}
                        </Field>
                      </div>

                      <div className="flex items-center justify-between space-x-2 p-4 border rounded-lg">
                        <div className="flex-1">
                          <Label
                            htmlFor="extraBaggageAllowance"
                            className="text-base font-medium cursor-pointer"
                          >
                            Extra Baggage Allowance
                          </Label>
                          <p className="text-sm text-muted-foreground mt-1">
                            Allow additional baggage beyond standard limits
                          </p>
                        </div>
                        <Field name="extraBaggageAllowance">
                          {({ field, form }) => (
                            <Switch
                              id="extraBaggageAllowance"
                              checked={field.value}
                              onCheckedChange={(checked) =>
                                form.setFieldValue(
                                  "extraBaggageAllowance",
                                  checked
                                )
                              }
                            />
                          )}
                        </Field>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Policy Summary */}
                <Card className="bg-purple-50/50 border-purple-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-purple-900">
                      <Info className="h-5 w-5" />
                      Policy Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                      <div className="space-y-2">
                        <h4 className="font-medium text-purple-900 mb-2">
                          Selection Details
                        </h4>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span>Flight:</span>
                            <span className="font-medium text-xs">
                              {selectedFlight
                                ? flights?.find(
                                    (f) => f.id === parseInt(selectedFlight)
                                  )?.flightNumber
                                : "N/A"}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Cabin:</span>
                            <span className="font-medium text-xs">
                              {selectedCabin
                                ? cabinClasses?.find(
                                    (c) => c.id === parseInt(selectedCabin)
                                  )?.name
                                : "N/A"}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Fare:</span>
                            <span className="font-medium text-xs">
                              {selectedFare
                                ? fares.find(
                                    (f) => f.id === parseInt(selectedFare)
                                  )?.name || `Fare ${selectedFare}`
                                : "N/A"}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium text-purple-900 mb-2">
                          Cabin Baggage
                        </h4>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span>Max Weight:</span>
                            <span className="font-medium">
                              {values.cabinBaggageMaxWeight || "0"} kg
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Pieces:</span>
                            <span className="font-medium">
                              {values.cabinBaggagePieces || "0"}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Per Piece:</span>
                            <span className="font-medium">
                              {values.cabinBaggageWeightPerPiece || "0"} kg
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Max Dimension:</span>
                            <span className="font-medium">
                              {values.cabinBaggageMaxDimension || "0"} cm
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium text-purple-900 mb-2">
                          Checked Baggage
                        </h4>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span>Max Weight:</span>
                            <span className="font-medium">
                              {values.checkInBaggageMaxWeight || "0"} kg
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Pieces:</span>
                            <span className="font-medium">
                              {values.checkInBaggagePieces || "0"}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Per Piece:</span>
                            <span className="font-medium">
                              {values.checkInBaggageWeightPerPiece || "0"} kg
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Free Allowance:</span>
                            <span className="font-medium">
                              {values.freeCheckedBagsAllowance || "0"} bags
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium text-purple-900 mb-2">
                          Benefits & Info
                        </h4>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span>Priority Baggage:</span>
                            <Badge
                              variant={
                                values.priorityBaggage ? "default" : "secondary"
                              }
                            >
                              {values.priorityBaggage ? "Yes" : "No"}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Extra Allowance:</span>
                            <Badge
                              variant={
                                values.extraBaggageAllowance
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {values.extraBaggageAllowance ? "Yes" : "No"}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Fare ID:</span>
                            <Badge variant="secondary">
                              {values.fareId || "N/A"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Form Actions */}
                <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 z-10 ">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">
                        Policy: {values.name || "Untitled"}
                      </span>
                      {values.freeCheckedBagsAllowance && (
                        <span className="ml-2 text-gray-500">
                          • {values.freeCheckedBagsAllowance} free bag(s)
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
                        disabled={isSubmitting}
                        className="flex items-center gap-2 min-w-[140px] bg-primary hover:bg-primary/90"
                      >
                        <Save className="h-4 w-4" />
                        {isSubmitting
                          ? "Saving..."
                          : policy
                          ? "Update Policy"
                          : "Create Policy"}
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

export default BaggagePolicyForm;
