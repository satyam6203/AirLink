import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ArrowLeft, Save, X } from "lucide-react";
import {
  createCoupon,
  getCouponById,
  updateCoupon,
} from "@/Redux/coupon/couponThunk";
import { clearCoupon } from "@/Redux/coupon/couponSlice";
import { Badge } from "@/components/ui/badge";
import DatePicker from "@/components/DatePicker";

const couponSchema = Yup.object().shape({
  code: Yup.string()
    .required("Coupon code is required")
    .min(3, "Code must be at least 3 characters")
    .max(50, "Code must not exceed 50 characters")
    .matches(
      /^[A-Z0-9_-]+$/,
      "Code must contain only uppercase letters, numbers, hyphens, and underscores"
    ),
  description: Yup.string()
    .required("Description is required")
    .max(500, "Description must not exceed 500 characters"),
  discountType: Yup.string()
    .required("Discount type is required")
    .oneOf(["PERCENTAGE", "FIXED_AMOUNT"]),
  discountValue: Yup.number()
    .required("Discount value is required")
    .positive("Discount value must be positive")
    .when("discountType", {
      is: "PERCENTAGE",
      then: (schema) => schema.max(100, "Percentage cannot exceed 100"),
    }),
  minPurchaseAmount: Yup.number().min(0, "Must be non-negative").nullable(),
  maxDiscountAmount: Yup.number().min(0, "Must be non-negative").nullable(),
  validFrom: Yup.string().required("Valid from date is required"),
  validUntil: Yup.string().required("Valid until date is required"),
  usageLimit: Yup.number()
    .required("Usage limit is required")
    .positive("Must be at least 1")
    .integer("Must be a whole number"),
  perUserLimit: Yup.number()
    .required("Per user limit is required")
    .positive("Must be at least 1")
    .max(10, "Cannot exceed 10")
    .integer("Must be a whole number"),
});

const CouponForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const { coupon, createLoading, updateLoading } = useSelector(
    (store) => store.coupon
  );
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // Fetch coupon data in edit mode
  useEffect(() => {
    if (isEditMode && id) {
      dispatch(getCouponById(id));
    }
    return () => {
      dispatch(clearCoupon());
    };
  }, [dispatch, id, isEditMode]);

  const formik = useFormik({
    initialValues: {
      code: "",
      description: "",
      discountType: "PERCENTAGE",
      discountValue: "",
      minPurchaseAmount: "",
      maxDiscountAmount: "",
      validFrom: new Date().toISOString().split("T")[0],
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      usageLimit: 100,
      perUserLimit: 1,
      status: "ACTIVE",
      applicableCabinClasses: [], // Array of cabin class types
      applicableRoutes: [], // Array of route IDs
    },
    validationSchema: couponSchema,
    onSubmit: async (values) => {
      try {
        const payload = {
          ...values,
          code: values.code.toUpperCase(),
          discountValue: parseFloat(values.discountValue),
          minPurchaseAmount: values.minPurchaseAmount
            ? parseFloat(values.minPurchaseAmount)
            : null,
          maxDiscountAmount: values.maxDiscountAmount
            ? parseFloat(values.maxDiscountAmount)
            : null,
          usageLimit: parseInt(values.usageLimit),
          perUserLimit: parseInt(values.perUserLimit),
          validFrom: new Date(values.validFrom + "T00:00:00"),
          validUntil: new Date(values.validUntil + "T23:59:59"),
          applicableCabinClasses:
            values.applicableCabinClasses.length > 0
              ? values.applicableCabinClasses
              : null,
          applicableRoutes:
            values.applicableRoutes.length > 0 ? values.applicableRoutes : null,
        };

        if (isEditMode) {
          await dispatch(updateCoupon({ id, data: payload })).unwrap();
          toast.success("Coupon updated successfully");
        } else {
          await dispatch(createCoupon(payload)).unwrap();
          toast.success("Coupon created successfully");
        }
        navigate("/airline/coupons");
      } catch (error) {
        toast.error(error || "Failed to save coupon");
      }
    },
  });

  // Populate form with coupon data when loaded
  useEffect(() => {
    if (isEditMode && coupon && coupon.id && !isDataLoaded) {
      formik.setValues({
        code: coupon.code || "",
        description: coupon.description || "",
        discountType: coupon.discountType || "PERCENTAGE",
        discountValue: coupon.discountValue || "",
        minPurchaseAmount: coupon.minPurchaseAmount || "",
        maxDiscountAmount: coupon.maxDiscountAmount || "",
        validFrom: coupon.validFrom
          ? new Date(coupon.validFrom).toISOString().split("T")[0]
          : "",
        validUntil: coupon.validUntil
          ? new Date(coupon.validUntil).toISOString().split("T")[0]
          : "",
        usageLimit: coupon.usageLimit || 100,
        perUserLimit: coupon.perUserLimit || 1,
        status: coupon.status || "ACTIVE",
        applicableCabinClasses: coupon.applicableCabinClasses || [],
        applicableRoutes: coupon.applicableRoutes || [],
      });
      setIsDataLoaded(true);
    }
  }, [coupon, isEditMode, isDataLoaded]);

  // Cabin class options
  const cabinClasses = [
    { value: "ECONOMY", label: "Economy" },
    { value: "PREMIUM_ECONOMY", label: "Premium Economy" },
    { value: "BUSINESS", label: "Business" },
    { value: "FIRST", label: "First Class" },
  ];

  // Toggle cabin class selection
  const toggleCabinClass = (classType) => {
    const current = formik.values.applicableCabinClasses;
    if (current.includes(classType)) {
      formik.setFieldValue(
        "applicableCabinClasses",
        current.filter((c) => c !== classType)
      );
    } else {
      formik.setFieldValue("applicableCabinClasses", [...current, classType]);
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/airline/coupons")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {isEditMode ? "Edit Coupon" : "Create Coupon"}
          </h1>
          <p className="text-muted-foreground">
            {isEditMode
              ? "Update coupon details"
              : "Create a new discount coupon"}
          </p>
        </div>
      </div>

      <form onSubmit={formik.handleSubmit}>
        <div className="">
          {/* Main Form */}
          <div className=" space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Code */}
                <div>
                  <Label htmlFor="code">
                    Coupon Code <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="code"
                    name="code"
                    placeholder="e.g., SUMMER2025, FIRST50"
                    value={formik.values.code}
                    onChange={(e) =>
                      formik.setFieldValue("code", e.target.value.toUpperCase())
                    }
                    onBlur={formik.handleBlur}
                    disabled={isEditMode}
                    className="font-mono"
                  />
                  {formik.touched.code && formik.errors.code && (
                    <p className="text-sm text-red-500 mt-1">
                      {formik.errors.code}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    Only uppercase letters, numbers, hyphens, and underscores
                  </p>
                </div>

                {/* Description */}
                <div>
                  <Label htmlFor="description">
                    Description <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Describe what this coupon offers"
                    rows={3}
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.description && formik.errors.description && (
                    <p className="text-sm text-red-500 mt-1">
                      {formik.errors.description}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Discount Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Discount Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {/* Discount Type */}
                  <div>
                    <Label htmlFor="discountType">
                      Discount Type <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formik.values.discountType}
                      onValueChange={(value) =>
                        formik.setFieldValue("discountType", value)
                      }
                    >
                      <SelectTrigger className={"w-full"}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PERCENTAGE">
                          Percentage (%)
                        </SelectItem>
                        <SelectItem value="FIXED_AMOUNT">
                          Fixed Amount ($)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Discount Value */}
                  <div>
                    <Label htmlFor="discountValue">
                      Discount Value <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="discountValue"
                      name="discountValue"
                      type="number"
                      step="0.01"
                      placeholder={
                        formik.values.discountType === "PERCENTAGE"
                          ? "10"
                          : "50"
                      }
                      value={formik.values.discountValue}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.discountValue &&
                      formik.errors.discountValue && (
                        <p className="text-sm text-red-500 mt-1">
                          {formik.errors.discountValue}
                        </p>
                      )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Min Purchase Amount */}
                  <div>
                    <Label htmlFor="minPurchaseAmount">
                      Min Purchase Amount ($)
                    </Label>
                    <Input
                      id="minPurchaseAmount"
                      name="minPurchaseAmount"
                      type="number"
                      step="0.01"
                      placeholder="Optional"
                      value={formik.values.minPurchaseAmount}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Minimum booking amount required
                    </p>
                  </div>

                  {/* Max Discount Amount */}
                  <div>
                    <Label htmlFor="maxDiscountAmount">
                      Max Discount Amount ($)
                    </Label>
                    <Input
                      id="maxDiscountAmount"
                      name="maxDiscountAmount"
                      type="number"
                      step="0.01"
                      placeholder="Optional"
                      value={formik.values.maxDiscountAmount}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Cap for percentage discounts
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Validity Period */}
            <Card>
              <CardHeader>
                <CardTitle>Validity Period</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {/* Valid From */}
                  {/* Valid From */}
                  <DatePicker
                    label="Valid From"
                    name="validFrom"
                    value={formik.values.validFrom}
                    touched={formik.touched.validFrom}
                    error={formik.errors.validFrom}
                    onChange={(value) =>
                      formik.setFieldValue("validFrom", value)
                    }
                  />

                  {/* Valid Until */}
                  <DatePicker
                    label="Valid Until"
                    name="validUntil"
                    value={formik.values.validUntil}
                    touched={formik.touched.validUntil}
                    error={formik.errors.validUntil}
                    onChange={(value) =>
                      formik.setFieldValue("validUntil", value)
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Usage Limits */}
            <Card>
              <CardHeader>
                <CardTitle>Usage Limits</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {/* Total Usage Limit */}
                  <div>
                    <Label htmlFor="usageLimit">
                      Total Usage Limit <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="usageLimit"
                      name="usageLimit"
                      type="number"
                      placeholder="100"
                      value={formik.values.usageLimit}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.usageLimit && formik.errors.usageLimit && (
                      <p className="text-sm text-red-500 mt-1">
                        {formik.errors.usageLimit}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      Total times this coupon can be used
                    </p>
                  </div>

                  {/* Per User Limit */}
                  <div>
                    <Label htmlFor="perUserLimit">
                      Per User Limit <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="perUserLimit"
                      name="perUserLimit"
                      type="number"
                      placeholder="1"
                      value={formik.values.perUserLimit}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.perUserLimit &&
                      formik.errors.perUserLimit && (
                        <p className="text-sm text-red-500 mt-1">
                          {formik.errors.perUserLimit}
                        </p>
                      )}
                    <p className="text-xs text-muted-foreground mt-1">
                      How many times one user can use this
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Applicable Restrictions */}
            <Card>
              <CardHeader>
                <CardTitle>Applicable Restrictions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Cabin Classes */}
                <div>
                  <Label>Applicable Cabin Classes</Label>
                  <p className="text-xs text-muted-foreground mb-2">
                    Leave empty to apply to all cabin classes
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {cabinClasses.map((cabin) => (
                      <Badge
                        key={cabin.value}
                        variant={
                          formik.values.applicableCabinClasses.includes(
                            cabin.value
                          )
                            ? "default"
                            : "outline"
                        }
                        className="cursor-pointer"
                        onClick={() => toggleCabinClass(cabin.value)}
                      >
                        {cabin.label}
                        {formik.values.applicableCabinClasses.includes(
                          cabin.value
                        ) && <X className="ml-1 h-3 w-3" />}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Routes */}
                {/* <div>
                  <Label htmlFor="applicableRoutes">Applicable Route IDs</Label>
                  <Input
                    id="applicableRoutes"
                    name="applicableRoutes"
                    placeholder="e.g., 1,2,3 or leave empty for all routes"
                    value={formik.values.applicableRoutes.join(",")}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === "") {
                        formik.setFieldValue("applicableRoutes", []);
                      } else {
                        const routeIds = value
                          .split(",")
                          .map((id) => parseInt(id.trim()))
                          .filter((id) => !isNaN(id));
                        formik.setFieldValue("applicableRoutes", routeIds);
                      }
                    }}
                    onBlur={formik.handleBlur}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Comma-separated route IDs. Leave empty to apply to all routes
                  </p>
                </div> */}
              </CardContent>
            </Card>
          </div>

          <div className="mt-6 space-y-6">
            {/* Status (Edit mode only) */}
            {isEditMode && (
              <Card>
                <CardHeader>
                  <CardTitle>Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <Select
                    value={formik.values.status}
                    onValueChange={(value) =>
                      formik.setFieldValue("status", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ACTIVE">Active</SelectItem>
                      <SelectItem value="INACTIVE">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>
            )}

            {/* Actions */}
            <Card>
              <CardContent className="pt-6 space-y-3 grid grid-cols-2 gap-3">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={createLoading || updateLoading}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isEditMode ? "Update Coupon" : "Create Coupon"}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate("/airline/coupons")}
                >
                  Cancel
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CouponForm;
