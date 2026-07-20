import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Save,
  FileText,
  RefreshCw,
  Clock,
  DollarSign,
  CreditCard,
  Percent,
  AlertTriangle,
  Info,
  Plane,
  Armchair,
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
import { useNavigate, useParams } from "react-router-dom";
import {
  createFareRule,
  updateFareRule,
  getFareRuleById,
} from "@/Redux/fareRules/fareRulesThunk";
import { getFlightsByAirline} from "@/Redux/flight/flightThunk";
import { getCabinClassesByAircraft } from "@/Redux/cabinClass/cabinClassThunk";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { getFlightFares } from "@/Redux/fare/fareThunk";

const FareRulesForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

  const { flights } = useSelector((state) => state.flight);
  const { cabinClasses } = useSelector((state) => state.cabinClass);
  const { fares } = useSelector((state) => state.fare);
  const { currentFareRule } = useSelector((state) => state.fareRules);

  // State for cascading dropdowns
  const [selectedFlight, setSelectedFlight] = useState("");
  const [selectedCabin, setSelectedCabin] = useState("");
  const [selectedFare, setSelectedFare] = useState("");
  const [initialValues, setInitialValues] = useState({
    ruleName: "",
    fareId: "",
    isRefundable: false,
    changeFee: "",
    cancellationFee: "",
    refundDeadlineDays: "",
    changeDeadlineHours: "",
    noShowFee: "",
    upgradePossible: false,
    mileageEarnPercentage: "",
  });

  // Fetch fare rule by ID when editing
  useEffect(() => {
    if (id) {
      dispatch(getFareRuleById(id));
    }
  }, [id, dispatch]);

  // Update initialValues when currentFareRule is loaded
  useEffect(() => {
    if (currentFareRule) {
      const fareRuleData = currentFareRule;
      const initialValues = {
        ruleName: fareRuleData?.ruleName ?? "",
        fareId: fareRuleData?.fareId ?? "",
        isRefundable: fareRuleData?.isRefundable ?? false,
        changeFee: fareRuleData?.changeFee ?? "",
        cancellationFee: fareRuleData?.cancellationFee ?? "",
        refundDeadlineDays: fareRuleData?.refundDeadlineDays ?? "",
        changeDeadlineHours: fareRuleData?.changeDeadlineHours ?? "",
        noShowFee: fareRuleData?.noShowFee ?? "",
        upgradePossible: fareRuleData?.upgradePossible ?? false,
        mileageEarnPercentage: fareRuleData?.mileageEarnPercentage ?? "",
      };
      setInitialValues(initialValues);
    }
  }, [currentFareRule]);

  // Validation schema (matching FareRulesRequest.java validations)
  const validationSchema = Yup.object({
    ruleName: Yup.string().required("Rule name is required"),
    fareId: Yup.number()
      .required("Fare ID is required")
      .positive("Fare ID must be positive"),
    isRefundable: Yup.boolean(),
    changeFee: Yup.number()
      .min(0, "Change fee must be positive or zero")
      .nullable(),
    cancellationFee: Yup.number()
      .min(0, "Cancellation fee must be positive or zero")
      .nullable(),
    refundDeadlineDays: Yup.number()
      .min(0, "Refund deadline days must be positive or zero")
      .integer()
      .nullable(),
    changeDeadlineHours: Yup.number()
      .min(0, "Change deadline hours must be positive or zero")
      .integer()
      .nullable(),
    noShowFee: Yup.number()
      .min(0, "No show fee must be positive or zero")
      .nullable(),
    upgradePossible: Yup.boolean(),
    mileageEarnPercentage: Yup.number()
      .min(0, "Mileage earn percentage must be positive or zero")
      .max(500, "Maximum 500%")
      .integer()
      .nullable(),
  });

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const formattedValues = {
        ...values,
        fareId: parseInt(values.fareId),
        changeFee: values.changeFee ? parseFloat(values.changeFee) : null,
        cancellationFee: values.cancellationFee
          ? parseFloat(values.cancellationFee)
          : null,
        refundDeadlineDays: values.refundDeadlineDays
          ? parseInt(values.refundDeadlineDays)
          : null,
        changeDeadlineHours: values.changeDeadlineHours
          ? parseInt(values.changeDeadlineHours)
          : null,
        noShowFee: values.noShowFee ? parseFloat(values.noShowFee) : null,
        mileageEarnPercentage: values.mileageEarnPercentage
          ? parseInt(values.mileageEarnPercentage)
          : null,
      };

      if (currentFareRule?.id) {
        await dispatch(
          updateFareRule({ id: currentFareRule.id, fareRuleData: formattedValues })
        ).unwrap();
        toast.success("Fare rule updated successfully!", {
          description: `${formattedValues.ruleName} has been updated.`,
        });
      } else {
        await dispatch(createFareRule(formattedValues)).unwrap();
        toast.success("Fare rule created successfully!", {
          description: `${formattedValues.ruleName} has been created.`,
        });

        // Reset form and selections after successful creation
        resetForm();
        setSelectedFlight(null);
        setSelectedCabin(null);
        setSelectedFare(null);
      }
      // navigate("/airline/fare-rules");
    } catch (error) {
      console.error("Error saving fare rule:", error);
      toast.error("Failed to save fare rule", {
        description:
          error?.message ||
          "An error occurred while saving the fare rule. Please try again.",
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
    console.log("selected flight", selectedFlight);
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

  const formatCurrency = (value) => {
    if (!value) return "";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="bg-white rounded-lg shadow-sm border w-full">
        <div className="flex items-center space-x-4 p-4 border-b bg-gray-50/50">
          <Button
            variant="ghost"
            onClick={() => navigate("/airline/fare-rules")}
            className="flex items-center hover:bg-gray-100"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Fare Rules
          </Button>
          <div className="text-sm text-gray-500 font-medium">
            / Fare Rules / {currentFareRule ? "Edit" : "New Rule"}
          </div>
        </div>

        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 z-10 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                {currentFareRule ? "Edit Fare Rule" : "Create New Fare Rule"}
              </h2>
              <p className="text-gray-600 mt-2">
                Configure fare rules and policies for your airline
              </p>
            </div>
            <div className="hidden md:block">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm font-medium text-blue-900">
                  💡 Smart Rules
                </p>
                <p className="text-xs text-blue-700">
                  Define policies that apply to specific fares
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
             {!currentFareRule &&   <Card className="border-l-4 border-l-indigo-500">
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
                          Choose the flight for this fare rule
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
                          disabled={!selectedFlight || cabinClasses?.length === 0}
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
                                  {fare.name} ({fare.rbdCode}) -{" "}
                                  {formatCurrency(fare.baseFare)}
                                </SelectItem>
                              ))
                            ) : (
                              <SelectItem value="no-fares" disabled>
                                {selectedCabin
                                  ? "No fares available"
                                  : "Select a cabin class first"}
                              </SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground mt-1">
                          Choose the fare for this rule
                        </p>
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
                  </CardContent>
                </Card>}

                {/* Basic Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-blue-600" />
                      Basic Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <Label
                          htmlFor="ruleName"
                          className="flex items-center gap-2"
                        >
                          <FileText className="h-4 w-4 text-primary" />
                          Rule Name *
                        </Label>
                        <Field
                          as={Input}
                          id="ruleName"
                          name="ruleName"
                          placeholder="e.g., Economy Standard Rules"
                        />
                        <ErrorMessage
                          name="ruleName"
                          component="div"
                          className="text-sm text-red-600 mt-1"
                        />
                      </div>

                      {/* Hidden fareId field - auto-populated from fare selection */}
                      <Field type="hidden" name="fareId" />
                    </div>
                  </CardContent>
                </Card>

                {/* Refund & Change Policies */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <RefreshCw className="h-5 w-5 text-green-600" />
                      Refund & Change Policies
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Toggle Switches */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-50/50">
                        <div>
                          <Label htmlFor="isRefundable" className="font-medium">
                            Refundable Fare
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Allow passengers to get full or partial refunds
                          </p>
                        </div>
                        <Field name="isRefundable">
                          {({ field }) => (
                            <Switch
                              checked={field.value}
                              onCheckedChange={(checked) =>
                                setFieldValue("isRefundable", checked)
                              }
                            />
                          )}
                        </Field>
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-50/50">
                        <div>
                          <Label
                            htmlFor="upgradePossible"
                            className="font-medium"
                          >
                            Upgrade Possible
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Allow passengers to upgrade their fare class
                          </p>
                        </div>
                        <Field name="upgradePossible">
                          {({ field }) => (
                            <Switch
                              checked={field.value}
                              onCheckedChange={(checked) =>
                                setFieldValue("upgradePossible", checked)
                              }
                            />
                          )}
                        </Field>
                      </div>
                    </div>

                    {/* Fee Structure */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <Label
                          htmlFor="changeFee"
                          className="flex items-center gap-2"
                        >
                          <RefreshCw className="h-4 w-4 text-blue-600" />
                          Change Fee (₹)
                        </Label>
                        <Field
                          as={Input}
                          className="w-full"
                          id="changeFee"
                          name="changeFee"
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="0.00"
                        />
                        <ErrorMessage
                          name="changeFee"
                          component="div"
                          className="text-sm text-red-600 mt-1"
                        />
                        {values.changeFee && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatCurrency(values.changeFee)}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label
                          htmlFor="cancellationFee"
                          className="flex items-center gap-2"
                        >
                          <CreditCard className="h-4 w-4 text-red-600" />
                          Cancellation Fee (₹)
                        </Label>
                        <Field
                          as={Input}
                          className="w-full"
                          id="cancellationFee"
                          name="cancellationFee"
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="0.00"
                        />
                        <ErrorMessage
                          name="cancellationFee"
                          component="div"
                          className="text-sm text-red-600 mt-1"
                        />
                        {values.cancellationFee && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatCurrency(values.cancellationFee)}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label
                          htmlFor="noShowFee"
                          className="flex items-center gap-2"
                        >
                          <AlertTriangle className="h-4 w-4 text-orange-600" />
                          No-Show Fee (₹)
                        </Label>
                        <Field
                          as={Input}
                          className="w-full"
                          id="noShowFee"
                          name="noShowFee"
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="0.00"
                        />
                        <ErrorMessage
                          name="noShowFee"
                          component="div"
                          className="text-sm text-red-600 mt-1"
                        />
                        {values.noShowFee && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatCurrency(values.noShowFee)}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Deadlines & Rewards */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-purple-600" />
                      Deadlines & Rewards
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label
                          htmlFor="refundDeadlineDays"
                          className="flex items-center gap-2"
                        >
                          <Clock className="h-4 w-4 text-blue-600" />
                          Refund Deadline (Days)
                        </Label>
                        <Field
                          as={Input}
                          className="w-full"
                          id="refundDeadlineDays"
                          name="refundDeadlineDays"
                          type="number"
                          min="0"
                          placeholder="30"
                        />
                        <ErrorMessage
                          name="refundDeadlineDays"
                          component="div"
                          className="text-sm text-red-600 mt-1"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Days before departure to request refund
                        </p>
                      </div>

                      <div>
                        <Label
                          htmlFor="changeDeadlineHours"
                          className="flex items-center gap-2"
                        >
                          <Clock className="h-4 w-4 text-green-600" />
                          Change Deadline (Hours)
                        </Label>
                        <Field
                          as={Input}
                          className="w-full"
                          id="changeDeadlineHours"
                          name="changeDeadlineHours"
                          type="number"
                          min="0"
                          placeholder="24"
                        />
                        <ErrorMessage
                          name="changeDeadlineHours"
                          component="div"
                          className="text-sm text-red-600 mt-1"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Hours before departure to make changes
                        </p>
                      </div>

                      <div>
                        <Label
                          htmlFor="mileageEarnPercentage"
                          className="flex items-center gap-2"
                        >
                          <Percent className="h-4 w-4 text-yellow-600" />
                          Mileage Earn %
                        </Label>
                        <Field
                          as={Input}
                          className="w-full"
                          id="mileageEarnPercentage"
                          name="mileageEarnPercentage"
                          type="number"
                          min="0"
                          max="500"
                          placeholder="100"
                        />
                        <ErrorMessage
                          name="mileageEarnPercentage"
                          component="div"
                          className="text-sm text-red-600 mt-1"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Percentage of miles earned from base fare
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Policy Summary */}
                <Card className="bg-blue-50/50 border-blue-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-blue-900">
                      <Info className="h-5 w-5" />
                      Rule Summary
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
                                  )?.name
                                : "N/A"}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium text-blue-900 mb-2">
                          Rule Details
                        </h4>
                        <div className="flex items-center justify-between">
                          <span>Rule Name:</span>
                          <span className="font-medium">
                            {values.ruleName || "N/A"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Fare ID:</span>
                          <Badge variant="secondary">
                            {values.fareId || "N/A"}
                          </Badge>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium text-blue-900 mb-2">
                          Policy Details
                        </h4>
                        <div className="flex items-center justify-between">
                          <span>Refundable:</span>
                          <Badge
                            variant={
                              values.isRefundable ? "default" : "secondary"
                            }
                          >
                            {values.isRefundable ? "Yes" : "No"}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Upgrade Possible:</span>
                          <Badge
                            variant={
                              values.upgradePossible ? "default" : "secondary"
                            }
                          >
                            {values.upgradePossible ? "Yes" : "No"}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Mileage Earn:</span>
                          <span className="font-medium">
                            {values.mileageEarnPercentage || 0}%
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium text-blue-900 mb-2">
                          Fees Structure
                        </h4>
                        <div className="flex items-center justify-between">
                          <span>Change Fee:</span>
                          <span className="font-medium">
                            {values.changeFee
                              ? formatCurrency(values.changeFee)
                              : "Free"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Cancellation Fee:</span>
                          <span className="font-medium">
                            {values.cancellationFee
                              ? formatCurrency(values.cancellationFee)
                              : "Free"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>No-Show Fee:</span>
                          <span className="font-medium">
                            {values.noShowFee
                              ? formatCurrency(values.noShowFee)
                              : "Free"}
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
                      <span className="font-medium">
                        Rule: {values.ruleName || "Untitled"}
                      </span>
                      <span className="ml-2 text-gray-500">
                        •{" "}
                        {values.isRefundable ? "Refundable" : "Non-Refundable"}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate("/airline/fare-rules")}
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
                          : currentFareRule
                          ? "Update Rule"
                          : "Create Rule"}
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

export default FareRulesForm;
