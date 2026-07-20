import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

// Validation schema
const cityValidationSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "City name must be at least 2 characters")
    .max(100, "City name must be less than 100 characters")
    .required("City name is required"),
  cityCode: Yup.string()
    .min(2, "City code must be at least 2 characters")
    .max(10, "City code must be less than 10 characters")
    .matches(
      /^[A-Z0-9]+$/,
      "City code must contain only uppercase letters and numbers"
    )
    .required("City code is required"),
  countryName: Yup.string()
    .min(2, "Country name must be at least 2 characters")
    .max(100, "Country name must be less than 100 characters")
    .required("Country name is required"),
  countryCode: Yup.string()
    .min(2, "Country code must be at least 2 characters")
    .max(5, "Country code must be less than 5 characters")
    .matches(/^[A-Z]+$/, "Country code must contain only uppercase letters")
    .required("Country code is required"),
  regionCode: Yup.string()
    .max(10, "Region code must be less than 10 characters")
    .matches(
      /^[A-Z0-9]*$/,
      "Region code must contain only uppercase letters and numbers"
    ),
  timezoneOffset: Yup.string().matches(
    /^(UTC[+-]\d{1,2}(:\d{2})?)?$/,
    "Invalid timezone format (e.g., UTC+5:30, UTC-5)"
  ),
});

const CityFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  city = null,
  isLoading = false,
  checkCityCodeExists = null,
}) => {
  const isEditing = Boolean(city);

  const initialValues = {
    name: city?.name || "",
    cityCode: city?.cityCode || "",
    countryName: city?.countryName || "",
    countryCode: city?.countryCode || "",
    regionCode: city?.regionCode || "",
    timezoneOffset: city?.timezoneOffset || "",
  };

  const handleCityCodeValidation = async (cityCode, setFieldError) => {
    if (cityCode && checkCityCodeExists) {
      try {
        const codeCheck = await checkCityCodeExists(cityCode, city?.id);
        if (codeCheck.exists) {
          setFieldError(
            "cityCode",
            codeCheck.error || "City code already exists"
          );
          return false;
        }
        return true;
      } catch (error) {
        console.warn("Failed to check city code existence:", error);
        return true; // Don't block submission on API error
      }
    }
    return true;
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md ">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit City" : "Add New City"}</DialogTitle>
        </DialogHeader>
        <ScrollArea className={"h-[75vh]"}>
          <Formik
            initialValues={initialValues}
            validationSchema={cityValidationSchema}
            enableReinitialize={true}
            onSubmit={async (values, { setFieldError, setSubmitting }) => {
              try {
                // Check city code existence before submitting
                const isCodeValid = await handleCityCodeValidation(
                  values.cityCode,
                  setFieldError
                );
                if (!isCodeValid) {
                  setSubmitting(false);
                  return;
                }

                // Submit the data
                await onSubmit(values);
              } catch (error) {
                console.error("Form submission error:", error);
                setFieldError(
                  "general",
                  "Failed to submit form. Please try again."
                );
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({
              errors,
              touched,
              isSubmitting,
              setFieldValue,
              setFieldError,
              values,
            }) => (
              <Form className="space-y-4">
                {/* General Error */}
                {errors.general && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-600">{errors.general}</p>
                  </div>
                )}

                <div className="space-y-1">
                  <Label htmlFor="name">City Name *</Label>
                  <Field
                    as={Input}
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter city name"
                    className={
                      errors.name && touched.name ? "border-red-500" : ""
                    }
                    disabled={isLoading || isSubmitting}
                  />
                  {errors.name && touched.name && (
                    <p className="text-sm text-red-600 mt-1">{errors.name}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="cityCode">City Code *</Label>
                  <Field
                    as={Input}
                    id="cityCode"
                    name="cityCode"
                    type="text"
                    placeholder="e.g., NYC, LON"
                    className={
                      errors.cityCode && touched.cityCode
                        ? "border-red-500"
                        : ""
                    }
                    maxLength={10}
                    disabled={isLoading || isSubmitting}
                    onChange={(e) => {
                      setFieldValue("cityCode", e.target.value.toUpperCase());
                    }}
                    onBlur={async () => {
                      if (values.cityCode) {
                        await handleCityCodeValidation(
                          values.cityCode,
                          setFieldError
                        );
                      }
                    }}
                  />
                  {errors.cityCode && touched.cityCode && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.cityCode}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    2-10 uppercase letters and numbers only
                  </p>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="countryName">Country Name *</Label>
                  <Field
                    as={Input}
                    id="countryName"
                    name="countryName"
                    type="text"
                    placeholder="Enter country name"
                    className={
                      errors.countryName && touched.countryName
                        ? "border-red-500"
                        : ""
                    }
                    disabled={isLoading || isSubmitting}
                  />
                  {errors.countryName && touched.countryName && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.countryName}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="countryCode">Country Code *</Label>
                  <Field
                    as={Input}
                    id="countryCode"
                    name="countryCode"
                    type="text"
                    placeholder="e.g., US, UK, IN"
                    className={
                      errors.countryCode && touched.countryCode
                        ? "border-red-500"
                        : ""
                    }
                    maxLength={5}
                    disabled={isLoading || isSubmitting}
                    onChange={(e) => {
                      setFieldValue(
                        "countryCode",
                        e.target.value.toUpperCase()
                      );
                    }}
                  />
                  {errors.countryCode && touched.countryCode && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.countryCode}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    2-5 uppercase letters only
                  </p>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="regionCode">Region Code</Label>
                  <Field
                    as={Input}
                    id="regionCode"
                    name="regionCode"
                    type="text"
                    placeholder="e.g., NY, CA (optional)"
                    className={
                      errors.regionCode && touched.regionCode
                        ? "border-red-500"
                        : ""
                    }
                    maxLength={10}
                    disabled={isLoading || isSubmitting}
                    onChange={(e) => {
                      setFieldValue("regionCode", e.target.value.toUpperCase());
                    }}
                  />
                  {errors.regionCode && touched.regionCode && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.regionCode}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Optional. Up to 10 uppercase letters and numbers
                  </p>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="timezoneOffset">Timezone Offset</Label>
                  <Field
                    as={Input}
                    id="timezoneOffset"
                    name="timezoneOffset"
                    type="text"
                    placeholder="e.g., UTC+5:30, UTC-5"
                    className={
                      errors.timezoneOffset && touched.timezoneOffset
                        ? "border-red-500"
                        : ""
                    }
                    disabled={isLoading || isSubmitting}
                  />
                  {errors.timezoneOffset && touched.timezoneOffset && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.timezoneOffset}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Optional. Format: UTC±H or UTC±HH:MM
                  </p>
                </div>

                <DialogFooter className="gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClose}
                    disabled={isLoading || isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading || isSubmitting}>
                    {(isLoading || isSubmitting) && (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    )}
                    {isEditing ? "Update City" : "Add City"}
                  </Button>
                </DialogFooter>
              </Form>
            )}
          </Formik>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

CityFormModal.displayName = "CityFormModal";

export default CityFormModal;
