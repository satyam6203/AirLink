import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Plane,
  Building2,
  Globe,
  Upload,
  MapPin,
  ArrowLeft,
  ArrowRight,
  Search,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Image,
  Star,
  Shield
} from "lucide-react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { getAllCities } from "@/Redux/city/cityThunk";

// const validationSchema = Yup.object({
//   iataCode: Yup.string()
//     .required("IATA code is required")
//     .matches(/^[A-Z]{2}$/, "IATA code must be exactly 2 uppercase letters"),
//   icaoCode: Yup.string()
//     .required("ICAO code is required")
//     .matches(/^[A-Z]{3}$/, "ICAO code must be exactly 3 uppercase letters"),
//   airlineName: Yup.string()
//     .required("Airline name is required")
//     .min(2, "Airline name must be at least 2 characters"),
//   country: Yup.string().required("Country is required"),
//   headquartersCity: Yup.string().required("Headquarters city is required"),
//   status: Yup.string()
//     .required("Status is required")
//     .oneOf(["ACTIVE", "INACTIVE", "SUSPENDED"], "Invalid status"),
//   website: Yup.string().url("Invalid website URL").nullable(),
//   logoUrl: Yup.string().url("Invalid logo URL").nullable(),
// });

const AirlineDetailsStep = ({ data, onDataChange, onNext, onPrevious }) => {
  const [logoPreview, setLogoPreview] = useState(data?.logoUrl || "");
  const { cities } = useSelector((state) => state.city);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllCities());
  }, []);

  // console.

  const initialValues = {
    iataCode: data?.iataCode || "",
    icaoCode: data?.icaoCode || "",
    airlineName: data?.airlineName || "",
    alias: data?.alias || "",
    country: data?.country || "",
    logoUrl: data?.logoUrl || "",
    website: data?.website || "",
    status: data?.status || "ACTIVE",
    alliance: data?.alliance || "",
   
    headquartersCity: data?.headquartersCity || "",
  };

  const countries = [
    "United States",
    "United Kingdom",
    "Canada",
    "Australia",
    "Germany",
    "France",
    "Japan",
    "Singapore",
    "United Arab Emirates",
    "Netherlands",
    "Switzerland",
    "Sweden",
    "Norway",
    "Denmark",
    "New Zealand",
    "India",
    "China",
    "South Korea",
    "Brazil",
    "Mexico",
    "Argentina",
    "Chile",
    "Italy",
    "Spain",
    "Portugal",
    "Ireland",
    "Austria",
    "Belgium",
    "Finland",
    "Iceland",
    "Luxembourg",
    "Turkey",
    "South Africa",
    "Egypt",
  ];

  const statusOptions = [
    { value: "ACTIVE", label: "Active" },
    { value: "INACTIVE", label: "Inactive" },
    { value: "SUSPENDED", label: "Suspended" },
  ];

  const alliances = ["Star Alliance", "SkyTeam", "Oneworld", "Unaligned"];

  

  const handleLogoUpload = (event, setFieldValue) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const logoUrl = e.target.result;
        setLogoPreview(logoUrl);
        setFieldValue("logoUrl", logoUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (values) => {
    console.log('Form Data at Step', values);
    onDataChange(values);
    onNext();
  };

  const FormField = ({ name, label, children, required = false, helpText, ...props }) => (
    <div className="space-y-2">
      <Label htmlFor={name} className="text-gray-700 flex items-center gap-2 font-medium">
        {props.icon && <props.icon className="w-4 h-4 text-gray-500" />}
        {label}
        {required && <span className="text-red-500 text-sm">*</span>}
        {helpText && (
          <div className="ml-auto">
            <div className="group relative">
              <AlertCircle className="w-4 h-4 text-gray-400 cursor-help" />
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 text-xs text-white bg-gray-900 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                {helpText}
              </div>
            </div>
          </div>
        )}
      </Label>
      {children}
      <ErrorMessage
        name={name}
        component="div"
        className="text-red-500 text-sm flex items-center gap-1"
      />
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-lg">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Configure Your Airline Profile
          </h3>
          <p className="text-gray-600 text-lg">
            Set up your airline's identity and operational details
          </p>
        </div>
      </div>

      <Formik
        initialValues={initialValues}
        // validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values, setFieldValue, isValid, dirty }) => {
          return (
            <Form className="space-y-4">
              {/* IATA and ICAO Codes */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
                <div className="flex items-center space-x-3 mb-4">
                  <Plane className="w-6 h-6 text-blue-600" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Airline Identification Codes</h4>
                    <p className="text-sm text-gray-600">Official IATA and ICAO codes for your airline</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    name="iataCode"
                    label="IATA Code"
                    icon={Plane}
                    required={true}
                    helpText="2-letter code assigned by IATA (e.g., AA for American Airlines)"
                  >
                    <Field name="iataCode">
                      {({ field, meta }) => (
                        <div className="relative">
                          <Input
                            {...field}
                            id="iataCode"
                            placeholder="e.g., AA"
                            maxLength={2}
                            className={`uppercase transition-all duration-300 hover:shadow-md focus:shadow-lg font-mono text-center text-lg pr-10 ${
                              meta.touched && meta.error
                                ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                                : meta.touched && !meta.error
                                ? "border-green-500 focus:border-green-500 focus:ring-green-500/20"
                                : "border-gray-300 focus:border-blue-500 focus:ring-blue-500/20"
                            }`}
                            onChange={(e) => {
                              const value = e.target.value.toUpperCase();
                              setFieldValue("iataCode", value);
                            }}
                          />
                          {meta.touched && (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                              {meta.error ? (
                                <AlertCircle className="w-4 h-4 text-red-500" />
                              ) : (
                                <CheckCircle className="w-4 h-4 text-green-500" />
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </Field>
                  </FormField>

                  <FormField
                    name="icaoCode"
                    label="ICAO Code"
                    icon={Plane}
                    required={true}
                    helpText="3-letter code assigned by ICAO (e.g., AAL for American Airlines)"
                  >
                    <Field name="icaoCode">
                      {({ field, meta }) => (
                        <div className="relative">
                          <Input
                            {...field}
                            id="icaoCode"
                            placeholder="e.g., AAL"
                            maxLength={3}
                            className={`uppercase transition-all duration-300 hover:shadow-md focus:shadow-lg font-mono text-center text-lg pr-10 ${
                              meta.touched && meta.error
                                ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                                : meta.touched && !meta.error
                                ? "border-green-500 focus:border-green-500 focus:ring-green-500/20"
                                : "border-gray-300 focus:border-blue-500 focus:ring-blue-500/20"
                            }`}
                            onChange={(e) => {
                              const value = e.target.value.toUpperCase();
                              setFieldValue("icaoCode", value);
                            }}
                          />
                          {meta.touched && (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                              {meta.error ? (
                                <AlertCircle className="w-4 h-4 text-red-500" />
                              ) : (
                                <CheckCircle className="w-4 h-4 text-green-500" />
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </Field>
                  </FormField>
                </div>
              </div>

              {/* Airline Name and Alias */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  name="airlineName"
                  label="Airline Name"
                  icon={Building2}
                >
                  <Field name="airlineName">
                    {({ field, meta }) => (
                      <Input
                        {...field}
                        id="airlineName"
                        placeholder="Enter airline name"
                        className={`transition-all duration-200 hover:shadow-md focus:shadow-lg ${
                          meta.touched && meta.error ? "border-red-500" : ""
                        }`}
                      />
                    )}
                  </Field>
                </FormField>

                <FormField name="alias" label="Alias (Optional)">
                  <Field name="alias">
                    {({ field }) => (
                      <Input
                        {...field}
                        id="alias"
                        placeholder="Enter airline alias"
                        className="transition-all duration-200 hover:shadow-md focus:shadow-lg"
                      />
                    )}
                  </Field>
                </FormField>
              </div>

              {/* Country and Headquarters */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField name="country" label="Country" icon={Globe}>
                  <Select
                    onValueChange={(value) => setFieldValue("country", value)}
                    value={values.country}
                  >
                    <SelectTrigger className="w-full transition-all duration-200 hover:shadow-md focus:shadow-lg">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country} value={country}>
                          {country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>

                <FormField
                  name="headquartersCity"
                  label="Headquarters City"
                  icon={MapPin}
                >
                  <Select
                    value={values.headquartersCity}
                    onValueChange={(value) =>
                      setFieldValue("headquartersCity", value)
                    }
                  >
                    <SelectTrigger

                      className={`w-full transition-all duration-200 hover:shadow-md focus:shadow-lg ${
                        values.headquartersCity === "" ? "border-red-500" : ""
                      }`}
                    >
                      <SelectValue placeholder="Search and select a city..." />
                    </SelectTrigger>
                    <SelectContent>
                      {cities &&
                        cities.map((city) => (
                          <SelectItem key={city.id} value={city.id.toString()}>
                            {city.name} ({city.cityCode}) – {city.countryName}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <ErrorMessage
                    name="headquartersCity"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </FormField>
              </div>

              {/* Logo Upload Section */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200">
                <div className="flex items-center space-x-3 mb-4">
                  <Image className="w-6 h-6 text-green-600" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Brand Identity</h4>
                    <p className="text-sm text-gray-600">Upload your airline logo to establish brand presence</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-col lg:flex-row items-start lg:items-center space-y-4 lg:space-y-0 lg:space-x-6">
                    <div className="flex-1 w-full">
                      <Field name="logoUrl">
                        {({ field }) => (
                          <Input
                            {...field}
                            id="logoUrl"
                            placeholder="Enter logo URL or upload file below"
                            className="transition-all duration-300 hover:shadow-md focus:shadow-lg"
                            onChange={(e) => {
                              setFieldValue("logoUrl", e.target.value);
                              setLogoPreview(e.target.value);
                            }}
                          />
                        )}
                      </Field>
                    </div>
                    <div className="flex space-x-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleLogoUpload(e, setFieldValue)}
                        className="hidden"
                        id="logo-upload"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                          document.getElementById("logo-upload").click()
                        }
                        className="hover:bg-green-50 border-green-300 hover:border-green-400"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Upload
                      </Button>
                    </div>
                  </div>

                  {logoPreview && (
                    <div className="flex items-center space-x-4 bg-white rounded-lg p-4 border">
                      <img
                        src={logoPreview}
                        alt="Logo preview"
                        className="w-20 h-20 object-contain border rounded-lg shadow-sm"
                        onError={() => setLogoPreview("")}
                      />
                      <div>
                        <p className="font-medium text-gray-900">Logo Preview</p>
                        <p className="text-sm text-gray-600">This is how your logo will appear</p>
                      </div>
                    </div>
                  )}

                  <p className="text-xs text-gray-500">
                    Recommended: PNG or SVG format, minimum 200x200px, transparent background
                  </p>
                </div>
              </div>

              {/* Website */}
              <FormField name="website" label="Website (Optional)" icon={Globe}>
                <Field name="website">
                  {({ field }) => (
                    <Input
                      {...field}
                      id="website"
                      placeholder="https://example.com"
                      className="transition-all duration-200 hover:shadow-md focus:shadow-lg"
                    />
                  )}
                </Field>
              </FormField>

              {/* Status and Alliance */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField name="status" label="Status">
                  <Select
                    onValueChange={(value) => setFieldValue("status", value)}
                    value={values.status}
                  >
                    <SelectTrigger className="transition-all duration-200 hover:shadow-md focus:shadow-lg">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>

                <FormField name="alliance" label="Alliance (Optional)">
                  <Select
                    onValueChange={(value) => setFieldValue("alliance", value)}
                    value={values.alliance}
                  >
                    <SelectTrigger className="transition-all duration-200 hover:shadow-md focus:shadow-lg">
                      <SelectValue placeholder="Select alliance" />
                    </SelectTrigger>
                    <SelectContent>
                      {alliances.map((alliance) => (
                        <SelectItem key={alliance} value={alliance}>
                          {alliance}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>
              </div>

              
              {/* Navigation Buttons */}
              <div className="flex justify-between pt-8 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onPrevious}
                  className="flex items-center gap-2 px-6 py-3 hover:bg-gray-50 transition-all duration-200"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Previous Step
                </Button>

                <Button
                  type="submit"
                  // onClick={handleSubmit}
                  // disabled={!isValid}
                  // className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-8 rounded-xl shadow-2xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-3xl flex items-center gap-2 group"
                >
                  Continue Setup
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default AirlineDetailsStep;
