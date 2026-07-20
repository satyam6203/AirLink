import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Save,
  Shield,
  DollarSign,
  FileText,
  Phone,
  AlertCircle,
  Info,
  Hash,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
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
  createInsuranceCoverage,
  updateInsuranceCoverage,
} from "@/Redux/insuranceCoverage/insuranceCoverageThunk";
import { getAllAncillaries } from "@/Redux/ancillary/ancillaryThunk";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Badge } from "@/components/ui/badge";

// Coverage Type options matching CoverageType.java enum
const COVERAGE_TYPES = [
  { value: "BAGGAGE_LOSS", label: "Baggage Loss", category: "Baggage", description: "Loss of checked-in baggage" },
  { value: "BAGGAGE_DELAY", label: "Baggage Delay", category: "Baggage", description: "Delay of checked-in baggage (>4 hours)" },
  { value: "BAGGAGE_ASSISTANCE", label: "Baggage Assistance", category: "Baggage", description: "24x7 support for delayed/lost baggage" },
  { value: "PERSONAL_ACCIDENT", label: "Personal Accident", category: "Personal", description: "Death or permanent disability from accident" },
  { value: "TRIP_DELAY", label: "Trip Delay", category: "Flight Disruption", description: "Flight delayed by 120+ minutes" },
  { value: "TRIP_CANCELLATION", label: "Trip Cancellation", category: "Flight Disruption", description: "Trip cancelled before start date" },
  { value: "MISSED_CONNECTION", label: "Missed Connection", category: "Flight Disruption", description: "Missed connecting flight" },
  { value: "DIVERTED_FLIGHT", label: "Diverted Flight", category: "Flight Disruption", description: "Flight diverted due to emergency" },
  { value: "FREE_DATE_CHANGE", label: "Free Date Change", category: "Special Add-ons", description: "Free date change up to 3 hours before departure" },
  { value: "ZERO_CANCELLATION", label: "Zero Cancellation", category: "Special Add-ons", description: "Refund on cancellation up to 24 hours before departure" },
  { value: "EMERGENCY_ASSISTANCE", label: "Emergency Assistance", category: "General", description: "24x7 emergency support" },
  { value: "TRAVEL_DOCUMENT_LOSS", label: "Travel Document Loss", category: "General", description: "Support for lost travel documents" },
  { value: "MEDICAL_EMERGENCY", label: "Medical Emergency", category: "General", description: "Emergency medical coverage during trip" },
];

const CURRENCIES = ["INR", "USD", "EUR", "GBP", "AED"];

const InsuranceCoverageForm = ({ coverage, onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const isEdit = Boolean(id || coverage);

  const { ancillaries } = useSelector((state) => state.ancillary);
  const [selectedAncillary, setSelectedAncillary] = useState(null);

  // Initial form values
  const initialValues = {
    ancillaryId: coverage?.ancillary?.id || "",
    coverageType: coverage?.coverageType || "",
    name: coverage?.name || "",
    description: coverage?.description || "",
    coverageAmount: coverage?.coverageAmount || "",
    currency: coverage?.currency || "INR",
    isFlat: coverage?.isFlat ?? true,
    claimCondition: coverage?.claimCondition || "",
    emergencyContact: coverage?.emergencyContact || "",
    displayOrder: coverage?.displayOrder || "",
    active: coverage?.active ?? true,
  };

  // Validation schema
  const validationSchema = Yup.object({
    ancillaryId: Yup.number().required("Ancillary is required"),
    coverageType: Yup.string().required("Coverage type is required"),
    name: Yup.string()
      .required("Name is required")
      .max(200, "Name must be less than 200 characters"),
    description: Yup.string().max(1000, "Description must be less than 1000 characters"),
    coverageAmount: Yup.number()
      .required("Coverage amount is required")
      .min(0, "Coverage amount must be positive"),
    currency: Yup.string().required("Currency is required"),
    isFlat: Yup.boolean(),
    claimCondition: Yup.string().max(500, "Claim condition must be less than 500 characters"),
    emergencyContact: Yup.string().max(100, "Emergency contact must be less than 100 characters"),
    displayOrder: Yup.number().min(0, "Display order must be positive").nullable(),
    active: Yup.boolean(),
  });

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const formattedValues = {
        ...values,
        ancillaryId: parseInt(values.ancillaryId),
        coverageAmount: parseFloat(values.coverageAmount),
        displayOrder: values.displayOrder ? parseInt(values.displayOrder) : null,
      };

      if (isEdit) {
        await dispatch(
          updateInsuranceCoverage({ id: id || coverage.id, data: formattedValues })
        ).unwrap();
      } else {
        await dispatch(createInsuranceCoverage(formattedValues)).unwrap();
      }

      if (onClose) {
        onClose();
      } else {
        navigate("/airline/insurance-coverages");
      }
    } catch (error) {
      console.error("Error saving insurance coverage:", error);
    } finally {
      setSubmitting(false);
    }
  };

  // Load ancillaries on component mount
  useEffect(() => {
    dispatch(getAllAncillaries());
  }, [dispatch]);

  // Update selected ancillary when ancillary changes
  useEffect(() => {
    if (initialValues.ancillaryId && ancillaries.length > 0) {
      const ancillary = ancillaries.find(
        (a) => a.id === parseInt(initialValues.ancillaryId)
      );
      setSelectedAncillary(ancillary);
    }
  }, [initialValues.ancillaryId, ancillaries]);

  const formatCurrency = (value, currency = "INR") => {
    if (!value) return "";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
    }).format(value);
  };

  // Filter ancillaries to show only TRAVEL_PROTECTION type
  const travelProtectionAncillaries = ancillaries.filter(
    (a) => (a.type === "TRAVEL_PROTECTION")
  );

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="bg-white rounded-lg shadow-sm border w-full">
        <div className="flex items-center space-x-4 p-4 border-b bg-gray-50/50">
          <Button
            variant="ghost"
            onClick={() => onClose ? onClose() : navigate("/airline/insurance-coverages")}
            className="flex items-center hover:bg-gray-100"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="text-sm text-gray-500 font-medium">
            / Insurance Coverages / {isEdit ? "Edit" : "New Coverage"}
          </div>
        </div>

        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 z-10 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-lg">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                {isEdit ? "Edit Insurance Coverage" : "Create New Insurance Coverage"}
              </h2>
              <p className="text-gray-600 mt-2">
                Configure coverage details for your travel protection
              </p>
            </div>
            <div className="hidden md:block">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm font-medium text-blue-900">
                  🛡️ Protection First
                </p>
                <p className="text-xs text-blue-700">
                  Define comprehensive coverage for travelers
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
                {/* Ancillary Selection */}
                <Card className="border-l-4 border-l-blue-500">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-blue-600" />
                      Insurance Ancillary Selection
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label
                        htmlFor="ancillaryId"
                        className="flex items-center gap-2"
                      >
                        <Shield className="h-4 w-4 text-blue-600" />
                        Select Insurance Ancillary *
                      </Label>
                      <Select
                        value={values.ancillaryId.toString()}
                        onValueChange={(value) => {
                          setFieldValue("ancillaryId", value);
                          const ancillary = travelProtectionAncillaries.find(
                            (a) => a.id === parseInt(value)
                          );
                          setSelectedAncillary(ancillary);
                        }}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select an insurance ancillary" />
                        </SelectTrigger>
                        <SelectContent>
                          {travelProtectionAncillaries && travelProtectionAncillaries.length > 0 ? (
                            travelProtectionAncillaries.map((ancillary) => (
                              <SelectItem
                                key={ancillary.id}
                                value={ancillary.id.toString()}
                              >
                                {ancillary.name} - {ancillary.subType}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="no-ancillaries" disabled>
                              No insurance ancillaries available
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      <ErrorMessage
                        name="ancillaryId"
                        component="div"
                        className="text-sm text-red-600 mt-1"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Choose the parent insurance product for this coverage
                      </p>
                    </div>

                    {selectedAncillary && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-blue-900">
                              Selected: {selectedAncillary.name}
                            </span>
                            <Badge variant="default" className="bg-blue-600">
                              {selectedAncillary.subType}
                            </Badge>
                          </div>
                          <p className="text-xs text-blue-700">
                            {selectedAncillary.description}
                          </p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Coverage Details */}
                <Card className="border-l-4 border-l-purple-500">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-purple-600" />
                      Coverage Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Coverage Type */}
                      <div>
                        <Label
                          htmlFor="coverageType"
                          className="flex items-center gap-2"
                        >
                          <Shield className="h-4 w-4 text-purple-600" />
                          Coverage Type *
                        </Label>
                        <Select
                          value={values.coverageType}
                          onValueChange={(value) =>
                            setFieldValue("coverageType", value)
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select coverage type" />
                          </SelectTrigger>
                          <SelectContent>
                            {COVERAGE_TYPES.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                <div className="flex flex-col">
                                  <span className="font-medium">{type.label}</span>
                                  <span className="text-xs text-muted-foreground">
                                    {type.category} - {type.description}
                                  </span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <ErrorMessage
                          name="coverageType"
                          component="div"
                          className="text-sm text-red-600 mt-1"
                        />
                      </div>

                      {/* Coverage Name */}
                      <div>
                        <Label htmlFor="name" className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-purple-600" />
                          Coverage Name *
                        </Label>
                        <Field
                          as={Input}
                          className="w-full"
                          id="name"
                          name="name"
                          placeholder="e.g., Personal Accident Coverage ₹50,00,000"
                          maxLength={200}
                        />
                        <ErrorMessage
                          name="name"
                          component="div"
                          className="text-sm text-red-600 mt-1"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Display name for this coverage (max 200 chars)
                        </p>
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <Label
                        htmlFor="description"
                        className="flex items-center gap-2"
                      >
                        <Info className="h-4 w-4 text-purple-600" />
                        Description
                      </Label>
                      <Field
                        as={Textarea}
                        className="w-full resize-none"
                        id="description"
                        name="description"
                        placeholder="Detailed description of what's covered..."
                        rows={3}
                        maxLength={1000}
                      />
                      <ErrorMessage
                        name="description"
                        component="div"
                        className="text-sm text-red-600 mt-1"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        {values.description?.length || 0} / 1000 characters
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Coverage Amount */}
                <Card className="border-l-4 border-l-green-500">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-green-600" />
                      Coverage Amount
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Coverage Amount */}
                      <div>
                        <Label
                          htmlFor="coverageAmount"
                          className="flex items-center gap-2"
                        >
                          <DollarSign className="h-4 w-4 text-green-600" />
                          Coverage Amount *
                        </Label>
                        <Field
                          as={Input}
                          className="w-full"
                          id="coverageAmount"
                          name="coverageAmount"
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="50000"
                        />
                        <ErrorMessage
                          name="coverageAmount"
                          component="div"
                          className="text-sm text-red-600 mt-1"
                        />
                        {values.coverageAmount && (
                          <p className="text-xs text-green-600 mt-1 font-medium">
                            {formatCurrency(values.coverageAmount, values.currency)}
                          </p>
                        )}
                      </div>

                      {/* Currency */}
                      <div>
                        <Label
                          htmlFor="currency"
                          className="flex items-center gap-2"
                        >
                          <DollarSign className="h-4 w-4 text-green-600" />
                          Currency *
                        </Label>
                        <Select
                          value={values.currency}
                          onValueChange={(value) =>
                            setFieldValue("currency", value)
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select currency" />
                          </SelectTrigger>
                          <SelectContent>
                            {CURRENCIES.map((currency) => (
                              <SelectItem key={currency} value={currency}>
                                {currency}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <ErrorMessage
                          name="currency"
                          component="div"
                          className="text-sm text-red-600 mt-1"
                        />
                      </div>

                      {/* Display Order */}
                      <div>
                        <Label
                          htmlFor="displayOrder"
                          className="flex items-center gap-2"
                        >
                          <Hash className="h-4 w-4 text-green-600" />
                          Display Order
                        </Label>
                        <Field
                          as={Input}
                          className="w-full"
                          id="displayOrder"
                          name="displayOrder"
                          type="number"
                          min="0"
                          placeholder="1"
                        />
                        <ErrorMessage
                          name="displayOrder"
                          component="div"
                          className="text-sm text-red-600 mt-1"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Lower number = shown first
                        </p>
                      </div>
                    </div>

                    {/* Amount Type Toggle */}
                    <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-50/50">
                      <div>
                        <Label htmlFor="isFlat" className="font-medium">
                          Flat Amount
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Coverage is a fixed amount (not percentage-based)
                        </p>
                      </div>
                      <Field name="isFlat">
                        {({ field }) => (
                          <Switch
                            checked={field.value}
                            onCheckedChange={(checked) =>
                              setFieldValue("isFlat", checked)
                            }
                          />
                        )}
                      </Field>
                    </div>
                  </CardContent>
                </Card>

                {/* Additional Information */}
                <Card className="border-l-4 border-l-orange-500">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-orange-600" />
                      Additional Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Claim Condition */}
                    <div>
                      <Label
                        htmlFor="claimCondition"
                        className="flex items-center gap-2"
                      >
                        <FileText className="h-4 w-4 text-orange-600" />
                        Claim Condition
                      </Label>
                      <Field
                        as={Textarea}
                        className="w-full resize-none"
                        id="claimCondition"
                        name="claimCondition"
                        placeholder="e.g., Baggage delayed by more than 4 hours"
                        rows={2}
                        maxLength={500}
                      />
                      <ErrorMessage
                        name="claimCondition"
                        component="div"
                        className="text-sm text-red-600 mt-1"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        {values.claimCondition?.length || 0} / 500 characters
                      </p>
                    </div>

                    {/* Emergency Contact */}
                    <div>
                      <Label
                        htmlFor="emergencyContact"
                        className="flex items-center gap-2"
                      >
                        <Phone className="h-4 w-4 text-orange-600" />
                        Emergency Contact
                      </Label>
                      <Field
                        as={Input}
                        className="w-full"
                        id="emergencyContact"
                        name="emergencyContact"
                        placeholder="e.g., 1800-XXX-XXXX or support@example.com"
                        maxLength={100}
                      />
                      <ErrorMessage
                        name="emergencyContact"
                        component="div"
                        className="text-sm text-red-600 mt-1"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Emergency helpline for this coverage type
                      </p>
                    </div>

                    {/* Active Toggle */}
                    <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-50/50">
                      <div>
                        <Label htmlFor="active" className="font-medium">
                          Active Coverage
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Make this coverage available to travelers
                        </p>
                      </div>
                      <Field name="active">
                        {({ field }) => (
                          <Switch
                            checked={field.value}
                            onCheckedChange={(checked) =>
                              setFieldValue("active", checked)
                            }
                          />
                        )}
                      </Field>
                    </div>
                  </CardContent>
                </Card>

                {/* Coverage Summary */}
                <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-blue-900">
                      <Info className="h-5 w-5" />
                      Coverage Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="space-y-2">
                        <h4 className="font-medium text-blue-900 mb-2">
                          Coverage Details
                        </h4>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span>Type:</span>
                            <span className="font-medium">
                              {COVERAGE_TYPES.find(
                                (t) => t.value === values.coverageType
                              )?.label || "Not selected"}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Amount:</span>
                            <span className="font-medium text-green-700">
                              {values.coverageAmount
                                ? formatCurrency(
                                    values.coverageAmount,
                                    values.currency
                                  )
                                : "N/A"}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Type:</span>
                            <Badge variant="secondary">
                              {values.isFlat ? "Flat Amount" : "Percentage"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium text-blue-900 mb-2">
                          Status & Order
                        </h4>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span>Status:</span>
                            <Badge
                              variant={values.active ? "default" : "secondary"}
                              className="flex items-center gap-1"
                            >
                              {values.active ? (
                                <>
                                  <Check className="h-3 w-3" /> Active
                                </>
                              ) : (
                                "Inactive"
                              )}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Display Order:</span>
                            <span className="font-medium">
                              {values.displayOrder || "Not set"}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Currency:</span>
                            <Badge variant="outline">{values.currency}</Badge>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium text-blue-900 mb-2">
                          Contact & Conditions
                        </h4>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span>Emergency:</span>
                            <span className="font-medium text-xs">
                              {values.emergencyContact || "Not provided"}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Has Conditions:</span>
                            <Badge variant="secondary">
                              {values.claimCondition ? "Yes" : "No"}
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
                        {values.name || "Untitled Coverage"}
                      </span>
                      <span className="ml-2 text-gray-500">
                        • {values.active ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => onClose ? onClose() : navigate("/airline/insurance-coverages")}
                        className="min-w-[100px]"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex items-center gap-2 min-w-[140px] bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      >
                        <Save className="h-4 w-4" />
                        {isSubmitting
                          ? "Saving..."
                          : isEdit
                          ? "Update Coverage"
                          : "Create Coverage"}
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

export default InsuranceCoverageForm;
