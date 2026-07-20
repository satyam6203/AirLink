import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SpinnerLoader } from "@/components/common/Loader";
import { AlertCircle, Grid3X3, Save } from "lucide-react";
import {
  createSeatMap,
  getSeatMapsByCabinClass,
  updateSeatMap,
} from "@/Redux/SeatMap/seatMapThunk";
import { seatMapValues } from "./seatMapValue";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

// Validation Schema
const seatMapValidationSchema = Yup.object({
  name: Yup.string()
    .required("Name is required")
    .min(3, "Name must be at least 3 characters")
    .max(100, "Name must not exceed 100 characters"),
  totalRows: Yup.number()
    .required("Total rows is required")
    .min(1, "Must have at least 1 row")
    .max(100, "Cannot exceed 100 rows")
    .integer("Must be a whole number"),
  leftSeatsPerRow: Yup.number()
    .required("Left seats per row is required")
    .min(1, "Must have at least 1 seat")
    .max(10, "Cannot exceed 10 seats per side")
    .integer("Must be a whole number"),
  rightSeatsPerRow: Yup.number()
    .required("Right seats per row is required")
    .min(1, "Must have at least 1 seat")
    .max(10, "Cannot exceed 10 seats per side")
    .integer("Must be a whole number")
});

const SeatMapForm = ({
  isEdit = false,
  onSuccess,
  onCancel,
  className = "",
}) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.seatMap || {});

  const { cabinId } = useParams();
  const {seatMap}= useSelector(state => state.seatMap);

  // console.log()

  console.log("cabinId from params:", cabinId, seatMap);

  // Initial form values
  useEffect(() => {
    if (isEdit && cabinId) {

      fetchSeatMap(cabinId);
    }
  }, [isEdit, cabinId, dispatch]);

  const fetchSeatMap = async (cabinClassId) => {
    dispatch(getSeatMapsByCabinClass(cabinClassId));
  };

    useEffect(() => {
    if (seatMap) {
      const value={
        name: seatMap.name || '',
        totalRows: seatMap.totalRows || 12,
        leftSeatsPerRow: seatMap.leftSeatsPerRow || 3,
        rightSeatsPerRow: seatMap.rightSeatsPerRow || 3,
      }
      console.log("Initial values set to:", value);
      formik.setValues(value);
    }
  }, [seatMap]);

  // Formik configuration
  const formik = useFormik({
    initialValues:seatMapValues,
    validationSchema: seatMapValidationSchema,
    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      try {
        console.log("Submitting seat map form with values:", values);

        const seatMapData = {
          ...values,
          cabinClassId: parseInt(cabinId),
        };

        // TODO: Dispatch createSeatMap or updateSeatMap thunk
        var result;
        if (isEdit && seatMap) {
          const updateData={
              id: seatMap?.id,
              data: seatMapData,
            }
            console.log("Update data:", updateData);
          result = await dispatch(
            updateSeatMap(updateData)
          ).unwrap();
        } else {
          result = await dispatch(createSeatMap(seatMapData)).unwrap();
        }

        if (onSuccess) {
          onSuccess(result);
        }
      } catch (error) {
        console.error("Form submission error:", error);
        // Handle specific field errors if provided by backend
        if (error.includes("name") || error.includes("duplicate")) {
          setFieldError("name", "This seat map name is already in use");
        }
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleCancel = () => {
    formik.resetForm();
    if (onCancel) {
      onCancel();
    }
  };

  // Calculate total seats
  const totalSeats =
    formik.values.totalRows *
    (formik.values.leftSeatsPerRow + formik.values.rightSeatsPerRow);

  return (
    <div className={`max-w-2xl mx-auto ${className}`}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <Grid3X3 className="h-5 w-5 mr-2" />
            {isEdit ? "Edit Seat Map" : "Create Seat Map"}
          </CardTitle>
          <p className="text-sm text-gray-600">
            {isEdit
              ? "Update the seat map layout and configuration"
              : "Configure the seat layout for this cabin class"}
          </p>
        </CardHeader>

        <CardContent>
          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-red-800">Error</h4>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={formik.handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-semibold mb-5">
                Seat Map Information
              </h3>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Seat Map Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="e.g., Economy Class Layout, Business Premium Layout"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={
                      formik.errors.name && formik.touched.name
                        ? "border-red-500"
                        : ""
                    }
                  />
                  {formik.errors.name && formik.touched.name && (
                    <p className="text-sm text-red-600 mt-1">
                      {formik.errors.name}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    A descriptive name for this seat map configuration
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Layout Configuration */}
            <div>
              <h3 className="text-lg font-semibold mb-4">
                Layout Configuration
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="totalRows">Total Rows *</Label>
                  <Input
                    id="totalRows"
                    name="totalRows"
                    type="number"
                    min="1"
                    max="100"
                    value={formik.values.totalRows}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={
                      formik.errors.totalRows && formik.touched.totalRows
                        ? "border-red-500"
                        : ""
                    }
                  />
                  {formik.errors.totalRows && formik.touched.totalRows && (
                    <p className="text-sm text-red-600 mt-1">
                      {formik.errors.totalRows}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Number of seat rows
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="leftSeatsPerRow">Left Seats per Row *</Label>
                  <Input
                    id="leftSeatsPerRow"
                    name="leftSeatsPerRow"
                    type="number"
                    min="1"
                    max="10"
                    value={formik.values.leftSeatsPerRow}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={
                      formik.errors.leftSeatsPerRow &&
                      formik.touched.leftSeatsPerRow
                        ? "border-red-500"
                        : ""
                    }
                  />
                  {formik.errors.leftSeatsPerRow &&
                    formik.touched.leftSeatsPerRow && (
                      <p className="text-sm text-red-600 mt-1">
                        {formik.errors.leftSeatsPerRow}
                      </p>
                    )}
                  <p className="text-xs text-gray-500 mt-1">
                    Seats on left side of aisle
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rightSeatsPerRow">
                    Right Seats per Row *
                  </Label>
                  <Input
                    id="rightSeatsPerRow"
                    name="rightSeatsPerRow"
                    type="number"
                    min="1"
                    max="10"
                    value={formik.values.rightSeatsPerRow}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={
                      formik.errors.rightSeatsPerRow &&
                      formik.touched.rightSeatsPerRow
                        ? "border-red-500"
                        : ""
                    }
                  />
                  {formik.errors.rightSeatsPerRow &&
                    formik.touched.rightSeatsPerRow && (
                      <p className="text-sm text-red-600 mt-1">
                        {formik.errors.rightSeatsPerRow}
                      </p>
                    )}
                  <p className="text-xs text-gray-500 mt-1">
                    Seats on right side of aisle
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Layout Preview */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Layout Preview</h3>

              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="grid grid-cols-3 gap-4 text-center text-sm">
                  <div>
                    <p className="text-gray-600">Configuration</p>
                    <p className="font-semibold text-lg">
                      {formik.values.leftSeatsPerRow}-
                      {formik.values.rightSeatsPerRow}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Total Seats</p>
                    <p className="font-semibold text-lg text-blue-600">
                      {totalSeats}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Seats per Row</p>
                    <p className="font-semibold text-lg">
                      {formik.values.leftSeatsPerRow +
                        formik.values.rightSeatsPerRow}
                    </p>
                  </div>
                </div>

                {/* Visual Layout Preview */}
                <div className="mt-6">
                  <p className="text-sm text-gray-600 mb-3 text-center">
                    Seat Layout Example
                  </p>
                  <div className="flex justify-center">
                    <div className="space-y-1">
                      {/* Header Row */}
                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                        <div className="w-6 text-center">Row</div>
                        {Array.from(
                          { length: formik.values.leftSeatsPerRow },
                          (_, i) => (
                            <div key={`left-${i}`} className="w-6 text-center">
                              {String.fromCharCode(65 + i)}
                            </div>
                          )
                        )}
                        <div className="w-4 text-center text-gray-400">|</div>
                        {Array.from(
                          { length: formik.values.rightSeatsPerRow },
                          (_, i) => (
                            <div key={`right-${i}`} className="w-6 text-center">
                              {String.fromCharCode(
                                65 + formik.values.leftSeatsPerRow + i
                              )}
                            </div>
                          )
                        )}
                      </div>

                      {/* Sample Rows */}
                      {[1, 2, 3].map((rowNum) => (
                        <div
                          key={rowNum}
                          className="flex items-center space-x-1"
                        >
                          <div className="w-6 text-center text-xs font-medium">
                            {rowNum}
                          </div>
                          {Array.from(
                            { length: formik.values.leftSeatsPerRow },
                            (_, i) => (
                              <div
                                key={`left-${i}`}
                                className="w-6 h-6 bg-green-100 border border-green-300 rounded text-xs flex items-center justify-center"
                              >
                                {String.fromCharCode(65 + i)}
                              </div>
                            )
                          )}
                          <div className="w-4 text-center text-xs text-gray-400">
                            │
                          </div>
                          {Array.from(
                            { length: formik.values.rightSeatsPerRow },
                            (_, i) => (
                              <div
                                key={`right-${i}`}
                                className="w-6 h-6 bg-green-100 border border-green-300 rounded text-xs flex items-center justify-center"
                              >
                                {String.fromCharCode(
                                  65 + formik.values.leftSeatsPerRow + i
                                )}
                              </div>
                            )
                          )}
                        </div>
                      ))}

                      {formik.values.totalRows > 3 && (
                        <div className="text-center text-xs text-gray-500 py-1">
                          ... {formik.values.totalRows - 3} more rows
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={formik.isSubmitting || loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={formik.isSubmitting || loading || !formik.isValid}
              >
                {formik.isSubmitting || loading ? (
                  <>
                    <SpinnerLoader size="sm" className="mr-2" />
                    {isEdit ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {isEdit ? "Update Seat Map" : "Create Seat Map"}
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SeatMapForm;
