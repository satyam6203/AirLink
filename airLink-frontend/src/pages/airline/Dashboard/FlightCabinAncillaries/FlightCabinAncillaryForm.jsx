import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Package, Plane, Armchair } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { SpinnerLoader } from '@/components/common/Loader';
import { Badge } from '@/components/ui/badge';
import {
  createFlightCabinAncillary,
  updateFlightCabinAncillary
} from '@/Redux/flightCabinAncillary/flightCabinAncillaryThunk';
import { getAllAncillaries } from '@/Redux/ancillary/ancillaryThunk';
import { getFlightsByAirline } from '@/Redux/flight/flightThunk';
import { getCabinClassesByAircraft } from '@/Redux/cabinClass/cabinClassThunk';

const validationSchema = Yup.object({
  flightId: Yup.number().required('Flight is required'),
  cabinClassId: Yup.number().required('Cabin class is required'),
  ancillaryId: Yup.number().required('Ancillary is required'),
  available: Yup.boolean().required(),
  maxQuantity: Yup.number().integer().min(1).nullable(),
  price: Yup.number().min(0).nullable(),
  currency: Yup.string(),
  includedInFare: Yup.boolean().required()
});

const FlightCabinAncillaryForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { flights } = useSelector((state) => state.flight);
  const { cabinClasses } = useSelector((state) => state.cabinClass);
  const { ancillaries, loading: ancillariesLoading } = useSelector((state) => state.ancillary);
  const { loading } = useSelector((state) => state.flightCabinAncillary);

  const [selectedFlight, setSelectedFlight] = useState(null);

  useEffect(() => {
    dispatch(getAllAncillaries());
    dispatch(getFlightsByAirline());
  }, [dispatch]);

  // Load cabin classes when flight is selected
  useEffect(() => {
    if (selectedFlight) {
      const flight = flights?.find((f) => f.id === parseInt(selectedFlight));
      if (flight?.aircraft?.id) {
        dispatch(getCabinClassesByAircraft(flight.aircraft.id));
      }
    }
  }, [selectedFlight, flights, dispatch]);

 

  const formik = useFormik({
    initialValues: {
      flightId: '',
      cabinClassId: '',
      ancillaryId: '',
      available: true,
      maxQuantity: 1,
      price: '',
      currency: 'USD',
      includedInFare: false
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await dispatch(createFlightCabinAncillary({
          ...values,
          flightId: parseInt(values.flightId),
          cabinClassId: parseInt(values.cabinClassId),
          ancillaryId: parseInt(values.ancillaryId)
        })).unwrap();
        // navigate(`/airline/ancillaries`);
      } catch (error) {
        console.error('Error creating cabin ancillary:', error);
      }
    }
  });

  const selectedAncillary = ancillaries.find(a => a.id === formik.values.ancillaryId);

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-6">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Package className="h-8 w-8" />
            Add Cabin Ancillary
          </h1>
          <p className="text-muted-foreground">
            Configure cabin-specific ancillary pricing and availability
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={formik.handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Cabin Ancillary Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Flight & Cabin Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Flight Selection */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Plane className="h-4 w-4 text-blue-600" />
                  Select Flight *
                </Label>
                <Select
                  value={formik.values.flightId?.toString()}
                  onValueChange={(value) => {
                    formik.setFieldValue('flightId', parseInt(value));
                    formik.setFieldValue('cabinClassId', '');
                    setSelectedFlight(value);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a flight" />
                  </SelectTrigger>
                  <SelectContent>
                    {flights && flights.length > 0 ? (
                      flights.map((flight) => (
                        <SelectItem key={flight.id} value={flight.id.toString()}>
                          {flight.flightNumber} - {flight.departureAirport?.iataCode} → {flight.arrivalAirport?.iataCode}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-flights" disabled>No flights available</SelectItem>
                    )}
                  </SelectContent>
                </Select>
                {formik.touched.flightId && formik.errors.flightId && (
                  <p className="text-sm text-red-600">{formik.errors.flightId}</p>
                )}
              </div>

              {/* Cabin Class Selection */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Armchair className="h-4 w-4 text-purple-600" />
                  Select Cabin Class *
                </Label>
                <Select
                  value={formik.values.cabinClassId?.toString()}
                  onValueChange={(value) => formik.setFieldValue('cabinClassId', parseInt(value))}
                  disabled={!selectedFlight || cabinClasses?.length === 0}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a cabin class" />
                  </SelectTrigger>
                  <SelectContent>
                    {cabinClasses && cabinClasses.length > 0 ? (
                      cabinClasses.map((cabinClass) => (
                        <SelectItem key={cabinClass.id} value={cabinClass.id.toString()}>
                          {cabinClass.name || cabinClass.cabinClassType || `Cabin ${cabinClass.id}`}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-cabins" disabled>
                        {selectedFlight ? "No cabin classes available" : "Select a flight first"}
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                {formik.touched.cabinClassId && formik.errors.cabinClassId && (
                  <p className="text-sm text-red-600">{formik.errors.cabinClassId}</p>
                )}
              </div>
            </div>

            {/* Ancillary Selection */}
            <div className="space-y-2">
              <Label>Select Ancillary * (Cabin-level only)</Label>
              <Select
                value={formik.values.ancillaryId?.toString()}
                onValueChange={(value) => formik.setFieldValue('ancillaryId', parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select ancillary" />
                </SelectTrigger>
                <SelectContent>
                  {ancillariesLoading ? (
                    <SelectItem disabled value="loading">Loading...</SelectItem>
                  ) : (
                    ancillaries.map((ancillary) => (
                      <SelectItem key={ancillary.id} value={ancillary.id.toString()}>
                        <div className="flex items-center gap-2">
                          {ancillary.iconUrl && <span>{ancillary.iconUrl}</span>}
                          <span>{ancillary.name}</span>
                          <Badge variant="outline">{ancillary.category}</Badge>
                        </div>
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {formik.touched.ancillaryId && formik.errors.ancillaryId && (
                <p className="text-sm text-red-600">{formik.errors.ancillaryId}</p>
              )}
            </div>

            {/* Selected Ancillary Info */}
            {selectedAncillary && (
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-4">
                  <div className="flex items-start gap-3">
                    <span className="text-3xl">{selectedAncillary.iconUrl}</span>
                    <div>
                      <h4 className="font-semibold">{selectedAncillary.name}</h4>
                      <p className="text-sm text-muted-foreground">{selectedAncillary.description}</p>
                      <div className="flex gap-2 mt-2">
                        <Badge>{selectedAncillary.type}</Badge>
                        <Badge variant="outline">{selectedAncillary.level}</Badge>
                        {selectedAncillary.rfisc && <Badge variant="outline">RFISC: {selectedAncillary.rfisc}</Badge>}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Availability */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="available"
                checked={formik.values.available}
                onCheckedChange={(checked) => formik.setFieldValue('available', checked)}
              />
              <Label htmlFor="available" className="cursor-pointer">
                Available in this cabin
              </Label>
            </div>

            {/* Included in Fare */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="includedInFare"
                checked={formik.values.includedInFare}
                onCheckedChange={(checked) => formik.setFieldValue('includedInFare', checked)}
              />
              <Label htmlFor="includedInFare" className="cursor-pointer">
                Included in fare (Free for this cabin)
              </Label>
            </div>

            {/* Price & Currency (only if not included) */}
            {!formik.values.includedInFare && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Price</Label>
                  <Input
                    className="w-full"
                    type="number"
                    name="price"
                    step="0.01"
                    value={formik.values.price}
                    onChange={formik.handleChange}
                    placeholder="0.00"
                  />
                </div>

                {/* Max Quantity */}
            <div className="space-y-2">
              <Label>Max Quantity per Passenger</Label>
              <Input
                className="w-full"
                type="number"
                name="maxQuantity"
                value={formik.values.maxQuantity}
                onChange={formik.handleChange}
                min="1"
                placeholder="1"
              />
            </div>
              </div>
            )}

            
          </CardContent>
        </Card>

        {/* Form Actions */}
        <div className="flex justify-between pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading || !formik.isValid}
            className="bg-gradient-to-r from-blue-600 to-purple-600"
          >
            {loading ? (
              <>
                <SpinnerLoader size="sm" className="mr-2" />
                Creating...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Create Cabin Ancillary
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default FlightCabinAncillaryForm;