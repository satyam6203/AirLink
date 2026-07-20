import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { updateCabinClass, getCabinClassById, createCabinClass, deleteCabinClass } from '@/Redux/cabinClass/cabinClassThunk';
import { clearCabinClassError } from '@/Redux/cabinClass/cabinClassSlice';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { SpinnerLoader } from '@/components/common/Loader';
import { AlertCircle, Plane, Settings, Users, CheckCircle, Trash2 } from 'lucide-react';
import { getSeatTypeColor } from '@/utils/seatTypeColor';
import { cabinClassValue } from './initialValues';
import { useState } from 'react';
import { premiumFeatures } from './premiumFeatures';


// Validation Schema
const cabinClassValidationSchema = Yup.object({
  name: Yup.string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must not exceed 50 characters'),
  code: Yup.string()
    .required('Code is required')
    .matches(/^[A-Z0-9]{1,2}$/, 'Code must be 1-2 uppercase letters or numbers')
    .min(1, 'Code must be at least 1 character')
    .max(2, 'Code must not exceed 2 characters'),
  description: Yup.string()
    .max(500, 'Description must not exceed 500 characters'),
  displayOrder: Yup.number()
    .min(0, 'Display order must be 0 or greater')
    .max(100, 'Display order must not exceed 100'),
  typicalSeatPitch: Yup.number()
    .min(28, 'Seat pitch must be at least 28 inches')
    .max(84, 'Seat pitch must not exceed 84 inches'),
  typicalSeatWidth: Yup.number()
    .min(16, 'Seat width must be at least 16 inches')
    .max(26, 'Seat width must not exceed 26 inches'),
  seatType: Yup.string()
    .oneOf(['STANDARD', 'LIE_FLAT', 'ANGLE_FLAT', 'RECLINER'], 'Invalid seat type'),
});

const CabinClassForm = ({
  isEdit = false,
  cabinClassId = null,
  aircraftId = null,
  onSuccess,
  onCancel,
  onDelete,
  className = ''
}) => {
  const dispatch = useDispatch();
  const { loading, error, cabinClass } = useSelector(state => state.cabinClass);
  const [initialValues, setInitialValues] = useState(cabinClassValue);

  useEffect(()=>{

    let values = {...cabinClassValue};

    
    if (isEdit && cabinClass && cabinClass?.id == cabinClassId) {
      values = {
        name: cabinClass.name || '',
        code: cabinClass.code || '',
        description: cabinClass.description || '',
        aircraftId: cabinClass.aircraftId || aircraftId || '',
        displayOrder: cabinClass.displayOrder || 1,
        isActive: cabinClass.isActive !== undefined ? cabinClass.isActive : true,
        isBookable: cabinClass.isBookable !== undefined ? cabinClass.isBookable : true,
        typicalSeatPitch: cabinClass.typicalSeatPitch || 32,
        typicalSeatWidth: cabinClass.typicalSeatWidth || 17.5,
        seatType: cabinClass.seatType || 'STANDARD',
        hasPriorityBoarding: cabinClass.hasPriorityBoarding || false,
        hasLoungeAccess: cabinClass.hasLoungeAccess || false,
        hasExtraLegroom: cabinClass.hasExtraLegroom || false,
        hasPreferredSeating: cabinClass.hasPreferredSeating || false,
        hasMealService: cabinClass.hasMealService || false,
        hasWifiAccess: cabinClass.hasWifiAccess || false,
        hasPowerOutlet: cabinClass.hasPowerOutlet || false,
        hasEntertainment: cabinClass.hasEntertainment || false
      };
    setInitialValues(values);


    
  };

 

  },[cabinClass])

  // Get initial form values based on edit mode and loaded data
  

  // Formik configuration
  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    validationSchema: cabinClassValidationSchema,
    onSubmit: async (values, { setSubmitting, setFieldError }) => {

      console.log('Submitting form with values:', values);
      try {
        // Clear any previous errors
        dispatch(clearCabinClassError());

        const cabinClassData = {
          ...values,
          aircraftId: parseInt(aircraftId || 1)
        };

        let result;
        if (isEdit && cabinClassId) {
          result = await dispatch(updateCabinClass({
            id: cabinClassId,
            data: cabinClassData
          })).unwrap();
        } else {
          result = await dispatch(createCabinClass(cabinClassData)).unwrap();
        }

        // Call success callback
        if (onSuccess) {
          onSuccess(result);
        }
      } catch (error) {
        console.error('Form submission error:', error);
        // Handle specific field errors if provided by backend
        if (error.includes('code') || error.includes('duplicate')) {
          setFieldError('code', 'This code is already in use');
        }
      } finally {
        setSubmitting(false);
      }
    }
  });

  // Load cabin class data for editing
  useEffect(() => {
    if (isEdit && cabinClassId) {
      dispatch(getCabinClassById(cabinClassId));
    }
  }, [dispatch, isEdit, cabinClassId]);


  const handleCancel = () => {
    formik.resetForm();
    if (onCancel) {
      onCancel();
    }
  };

  const handleDelete = async () => {
    if (!isEdit || !cabinClassId) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete cabin class "${cabinClass?.name || 'this cabin class'}"? This action cannot be undone.`
    );

    if (confirmed) {
      try {
        await dispatch(deleteCabinClass(cabinClassId)).unwrap();
        if (onDelete) {
          onDelete();
        }
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }
  };



  return (
    <div className={`max-w-4xl mx-auto ${className}`}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <Plane className="h-5 w-5 mr-2" />
            {isEdit ? 'Edit Cabin Class' : 'Create New Cabin Class'}
          </CardTitle>
          <p className="text-sm text-gray-600">
            {isEdit ? 'Update cabin class configuration and settings' : 'Add a new cabin class to your aircraft configuration'}
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

          <form onSubmit={formik.handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-semibold flex items-center mb-4">
                <Settings className="h-4 w-4 mr-2" />
                Basic Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Cabin Class Name *
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="e.g., Business Class, First Class"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={formik.errors.name && formik.touched.name ? 'border-red-500' : ''}
                  />
                  {formik.errors.name && formik.touched.name && (
                    <p className="text-sm text-red-600">{formik.errors.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="code">
                    Cabin Code *
                  </Label>
                  <Input
                    id="code"
                    name="code"
                    type="text"
                    placeholder="e.g., F, B, Y"
                    value={formik.values.code}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={formik.errors.code && formik.touched.code ? 'border-red-500' : ''}
                    maxLength={2}
                    style={{ textTransform: 'uppercase' }}
                  />
                  {formik.errors.code && formik.touched.code && (
                    <p className="text-sm text-red-600">{formik.errors.code}</p>
                  )}
                  <p className="text-xs text-gray-500">1-2 uppercase letters or numbers</p>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="description">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Describe the features and amenities of this cabin class..."
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    rows={3}
                    className={formik.errors.description && formik.touched.description ? 'border-red-500' : ''}
                  />
                  {formik.errors.description && formik.touched.description && (
                    <p className="text-sm text-red-600">{formik.errors.description}</p>
                  )}
                  <p className="text-xs text-gray-500">
                    {formik.values.description.length}/500 characters
                  </p>
                </div>

                {/* <div className="space-y-2">
                  <Label htmlFor="aircraftId">
                    Aircraft *
                  </Label>
                  <Select
                    value={formik.values.aircraftId.toString() || aircraftId?.toString() || ''}
                    onValueChange={(value) => formik.setFieldValue('aircraftId', value)}
                    disabled={!!aircraftId} 
                    // Disable if aircraftId is provided as prop
                  >
                    <SelectTrigger className={formik.errors.aircraftId && formik.touched.aircraftId ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select aircraft" />
                    </SelectTrigger>
                    <SelectContent>
                      {aircrafts?.map((aircraft) => (
                        <SelectItem key={aircraft.id} value={aircraft.id.toString()}>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{aircraft.code}</span>
                            <span className="text-gray-500">- {aircraft.model}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formik.errors.aircraftId && formik.touched.aircraftId && (
                    <p className="text-sm text-red-600">{formik.errors.aircraftId}</p>
                  )}
                </div> */}

                <div className="space-y-2">
                  <Label htmlFor="displayOrder">
                    Display Order
                  </Label>
                  <Input
                    id="displayOrder"
                    name="displayOrder"
                    type="number"
                    min="0"
                    max="100"
                    value={formik.values.displayOrder}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={formik.errors.displayOrder && formik.touched.displayOrder ? 'border-red-500' : ''}
                  />
                  {formik.errors.displayOrder && formik.touched.displayOrder && (
                    <p className="text-sm text-red-600">{formik.errors.displayOrder}</p>
                  )}
                  <p className="text-xs text-gray-500">Order in which this cabin appears</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Seat Configuration */}
            <div>
              <h3 className="text-lg font-semibold flex items-center mb-4">
                <Users className="h-4 w-4 mr-2" />
                Seat Configuration
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="typicalSeatPitch">
                    Seat Pitch (inches)
                  </Label>
                  <Input
                    id="typicalSeatPitch"
                    name="typicalSeatPitch"
                    type="number"
                    min="28"
                    max="84"
                    value={formik.values.typicalSeatPitch}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={formik.errors.typicalSeatPitch && formik.touched.typicalSeatPitch ? 'border-red-500' : ''}
                  />
                  {formik.errors.typicalSeatPitch && formik.touched.typicalSeatPitch && (
                    <p className="text-sm text-red-600">{formik.errors.typicalSeatPitch}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="typicalSeatWidth">
                    Seat Width (inches)
                  </Label>
                  <Input
                    id="typicalSeatWidth"
                    name="typicalSeatWidth"
                    type="number"
                    step="0.5"
                    min="16"
                    max="26"
                    value={formik.values.typicalSeatWidth}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={formik.errors.typicalSeatWidth && formik.touched.typicalSeatWidth ? 'border-red-500' : ''}
                  />
                  {formik.errors.typicalSeatWidth && formik.touched.typicalSeatWidth && (
                    <p className="text-sm text-red-600">{formik.errors.typicalSeatWidth}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="seatType">
                    Seat Type
                  </Label>
                  <Select
                    value={formik.values.seatType}
                    onValueChange={(value) => formik.setFieldValue('seatType', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="STANDARD">
                        <Badge className={getSeatTypeColor('STANDARD')}>Standard</Badge>
                      </SelectItem>
                      <SelectItem value="RECLINER">
                        <Badge className={getSeatTypeColor('RECLINER')}>Recliner</Badge>
                      </SelectItem>
                      <SelectItem value="ANGLE_FLAT">
                        <Badge className={getSeatTypeColor('ANGLE_FLAT')}>Angle Flat</Badge>
                      </SelectItem>
                      <SelectItem value="LIE_FLAT">
                        <Badge className={getSeatTypeColor('LIE_FLAT')}>Lie Flat</Badge>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <Separator />

            {/* Status & Availability */}
            <div>
              <h3 className="text-lg font-semibold flex items-center mb-4">
                <CheckCircle className="h-4 w-4 mr-2" />
                Status & Availability
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label htmlFor="isActive" className="text-sm font-medium">
                      Active Status
                    </Label>
                    <p className="text-xs text-gray-500">Enable this cabin class for operations</p>
                  </div>
                  <Switch
                    id="isActive"
                    checked={formik.values.isActive}
                    onCheckedChange={(checked) => formik.setFieldValue('isActive', checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label htmlFor="isBookable" className="text-sm font-medium">
                      Bookable
                    </Label>
                    <p className="text-xs text-gray-500">Allow passengers to book this cabin class</p>
                  </div>
                  <Switch
                    id="isBookable"
                    checked={formik.values.isBookable}
                    onCheckedChange={(checked) => formik.setFieldValue('isBookable', checked)}
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Premium Features */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Premium Features & Amenities</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {premiumFeatures.map((feature) => (
                  <div key={feature.key} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <Label htmlFor={feature.key} className="text-sm font-medium">
                        {feature.label}
                      </Label>
                      <p className="text-xs text-gray-500">{feature.description}</p>
                    </div>
                    <Switch
                      id={feature.key}
                      checked={formik.values[feature.key]}
                      onCheckedChange={(checked) => formik.setFieldValue(feature.key, checked)}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-between pt-6 border-t">
              <div>
                {isEdit && (
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={handleDelete}
                    disabled={formik.isSubmitting || loading}
                    className="flex items-center"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Cabin Class
                  </Button>
                )}
              </div>
              <div className="flex space-x-4">
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
                      {isEdit ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    <>
                      {isEdit ? 'Update Cabin Class' : 'Create Cabin Class'}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CabinClassForm;