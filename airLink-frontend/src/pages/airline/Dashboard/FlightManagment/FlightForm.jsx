import * as React from "react";
import { Plane, Save, ArrowLeft, DollarSign, Plus } from "lucide-react";
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
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  createFlight,
  updateFlight,
  getFlightById,
} from "@/Redux/flight/flightThunk";
import { getAllCities } from "@/Redux/city/cityThunk";
import { listAllAirports } from "@/Redux/airport/airportThunk";
import { listAllAircrafts } from "@/Redux/aircraft/aircraftThunks";
import { getAllFareRules } from "@/Redux/fareRules/fareRulesThunk";
import { getCabinClassesByAircraft } from "@/Redux/cabinClass/cabinClassThunk";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";

const FlightForm = () => {
  const { airports } = useSelector((state) => state.airport);
  const { aircrafts } = useSelector((state) => state.aircraft);
  const [initialValues, setInitialValues] = React.useState({
    flightNumber:  "",
    aircraftId: "",
    departureAirportId: "",
    arrivalAirportId: "",
    departureTime: "",
  });

  const { flight } = useSelector((state) => state.flight);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { flightId } = useParams();

  const [selectedAircraftId, setSelectedAircraftId] = React.useState("");

  const [isLoadingFlight, setIsLoadingFlight] = React.useState(false);

  // Fetch flight data if editing
  React.useEffect(() => {
    if (flightId) {
      setIsLoadingFlight(true);
      dispatch(getFlightById(flightId))
        .unwrap()
        .finally(() => {
          setIsLoadingFlight(false);
        });
    }
  }, [flightId, dispatch]);


  // Update selectedAircraftId when flight data is loaded
  React.useEffect(() => {
    if (flight) {
      setSelectedAircraftId(flight?.aircraft?.id);
      const initialValues = {
        flightNumber: flight?.flightNumber || "",
        aircraftId: flight?.aircraft?.id || "",
        departureAirportId: flight?.departureAirport?.id || "",
        arrivalAirportId: flight?.arrivalAirport?.id || "",
        departureTime: flight?.departureTime || "",
      };
      setInitialValues(initialValues);
    }
  }, [flight]);

  // Initial form values

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      if (flightId) {
        await dispatch(
          updateFlight({ id: flightId, flightData: values })
        ).unwrap();
        navigate("/airline/flights");
      } else {
        console.log("flight data ", values);
        await dispatch(createFlight(values)).unwrap();
        navigate("/airline/flights");
      }
    } catch (error) {
      console.error("Error saving flight:", error);
      // TODO: Show error notification
    } finally {
      setSubmitting(false);
    }
  };

  // Handle aircraft selection change
  const handleAircraftChange = async (aircraftId, setFieldValue) => {
    setSelectedAircraftId(aircraftId);
    setFieldValue("aircraftId", parseInt(aircraftId));

    if (aircraftId) {
      try {
        await dispatch(getCabinClassesByAircraft(aircraftId)).unwrap();

        // Reset fares when aircraft changes
        setFieldValue("fares", []);
      } catch (error) {
        console.error("Failed to fetch cabin classes:", error);
      }
    } else {
      setFieldValue("fares", []);
    }
  };

  React.useEffect(() => {
    dispatch(getAllCities());
    dispatch(listAllAircrafts());
    dispatch(listAllAirports());
    dispatch(getAllFareRules());
  }, []);

  // Load cabin classes if aircraft is pre-selected
  React.useEffect(() => {
    if (selectedAircraftId) {
      const aircraftId = selectedAircraftId;
      dispatch(getCabinClassesByAircraft(aircraftId));
    }
  }, [selectedAircraftId, dispatch, aircrafts]);

  if (isLoadingFlight) {
    return (
      <div className="min-h-screen bg-gray-50/50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading flight data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="bg-white rounded-lg shadow-sm border w-full">
        <div className="flex items-center space-x-4 p-4 border-b bg-gray-50/50">
          <Button
            variant="ghost"
            onClick={() => navigate("/airline/flights")}
            className="flex items-center hover:bg-gray-100"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Flights
          </Button>
          <div className="text-sm text-gray-500 font-medium">
            / Flight Management / {flightId ? "Edit" : "New Flight"}
          </div>
        </div>
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 z-10 ">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <Plane className="h-6 w-6 text-primary" />
                </div>
                {flightId ? "Edit Flight" : "Create New Flight"}
              </h2>
              <p className="text-gray-600 mt-2">
                Configure all flight details, aircraft selection, and dynamic
                fare pricing
              </p>
            </div>
            <div className="hidden md:block">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm font-medium text-blue-900">
                  💡 Smart Pricing
                </p>
                <p className="text-xs text-blue-700">
                  Fares will automatically adapt based on selected aircraft
                  cabin classes
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-10">
          <Formik
            initialValues={initialValues}
            // validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ isSubmitting, values, setFieldValue }) => (
              <Form className="space-y-8">
                {/* Basic Flight Information */}
                <div className="">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <Label htmlFor="flightNumber">Flight Number *</Label>
                        <Field
                          as={Input}
                          id="flightNumber"
                          name="flightNumber"
                          placeholder="e.g., ZA123"
                        />
                        <ErrorMessage
                          name="flightNumber"
                          component="div"
                          className="text-sm text-red-600 mt-1"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="aircraftId">Aircraft *</Label>
                        <Field name="aircraftId">
                          {({ field }) => (
                            <Select
                              value={field.value.toString()}
                              onValueChange={(value) =>
                                handleAircraftChange(value, setFieldValue)
                              }
                            >
                              <SelectTrigger className={"w-full"}>
                                <SelectValue placeholder="Select aircraft" />
                              </SelectTrigger>
                              <SelectContent>
                                {aircrafts.map((aircraft) => (
                                  <SelectItem
                                    key={aircraft?.id}
                                    value={aircraft?.id.toString()}
                                  >
                                    <div className="flex flex-col">
                                      <span className="font-medium">
                                        {aircraft.code} ({aircraft.manufacturer}
                                        )
                                      </span>
                                      <span className="text-xs text-muted-foreground">
                                        {aircraft.model} -{" "}
                                        {aircraft.seatingCapacity} seats
                                      </span>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        </Field>
                        <ErrorMessage
                          name="aircraftId"
                          component="div"
                          className="text-sm text-red-600 mt-1"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <Label htmlFor="departureAirportId">
                          Departure Airport *
                        </Label>
                        <Field name="departureAirportId">
                          {({ field }) => (
                            <Select
                              value={field.value.toString()}
                              onValueChange={(value) =>
                                setFieldValue(
                                  "departureAirportId",
                                  parseInt(value)
                                )
                              }
                            >
                              <SelectTrigger className={"w-full"}>
                                <SelectValue placeholder="Select departure airport" />
                              </SelectTrigger>
                              <SelectContent>
                                {airports.map((airport) => (
                                  <SelectItem
                                    key={airport?.id}
                                    value={airport?.id.toString()}
                                  >
                                    {airport.iataCode} - {airport.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        </Field>
                        <ErrorMessage
                          name="departureAirportId"
                          component="div"
                          className="text-sm text-red-600 mt-1"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="arrivalAirportId">
                          Arrival Airport *
                        </Label>
                        <Field name="arrivalAirportId">
                          {({ field }) => (
                            <Select
                              value={field.value.toString()}
                              onValueChange={(value) =>
                                setFieldValue(
                                  "arrivalAirportId",
                                  parseInt(value)
                                )
                              }
                            >
                              <SelectTrigger className={"w-full"}>
                                <SelectValue placeholder="Select arrival airport" />
                              </SelectTrigger>
                              <SelectContent>
                                {airports.map((airport) => (
                                  <SelectItem
                                    key={airport?.id}
                                    value={airport?.id.toString()}
                                  >
                                    {airport.iataCode} - {airport.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        </Field>
                        <ErrorMessage
                          name="arrivalAirportId"
                          component="div"
                          className="text-sm text-red-600 mt-1"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dynamic Fares Section */}

                {/* Form Actions */}
                <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 z-10 ">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      {selectedAircraftId && (
                        <span className="ml-2 text-gray-500">
                          • Aircraft:{" "}
                          {
                            aircrafts.find(
                              (a) => a.id === parseInt(selectedAircraftId)
                            )?.code
                          }
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate("/airline/flights")}
                        className="min-w-[100px]"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={!selectedAircraftId}
                        className="flex items-center gap-2 min-w-[140px] bg-primary hover:bg-primary/90"
                      >
                        <Save className="h-4 w-4" />
                        {isSubmitting
                          ? "Saving..."
                          : flightId
                          ? "Update Flight"
                          : "Create Flight"}
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

export default FlightForm;
