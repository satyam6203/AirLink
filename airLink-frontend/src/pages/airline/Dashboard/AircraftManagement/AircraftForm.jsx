import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { createAircraft } from '@/Redux/aircraft/aircraftThunks';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// AircraftStatus enum values from the DTO
const AIRCRAFT_STATUS = [
  { value: 'ACTIVE', label: 'Active' },
  { value: 'IN_MAINTENANCE', label: 'In Maintenance' },
  { value: 'GROUNDED', label: 'Grounded' },
  { value: 'DELIVERED', label: 'Delivered' },
];

const AircraftForm = ({ 
  onSave, 
  onCancel, 
  isEditMode = false, 
  aircraftData = null,
  loading = false,
  error = null
}) => {
  const [formData, setFormData] = useState({
    code: '',
    model: '',
    manufacturer: '',
    seatingCapacity: 0,
    economySeats: 0,
    premiumEconomySeats: 0,
    businessSeats: 0,
    firstClassSeats: 0,
    rangeKm: 0,
    cruisingSpeedKmh: 0,
    maxAltitudeFt: 0,
    yearOfManufacture: 0,
    registrationDate: null,
    nextMaintenanceDate: null,
    status: 'ACTIVE',
    isAvailable: true,
    currentAirportId: null,
  });
  const [successMessage, setSuccessMessage] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [errors, setErrors] = useState({});

  // Initialize form with data when editing
  useEffect(() => {
    if (isEditMode && aircraftData) {
      setFormData({
        code: aircraftData.code || '',
        model: aircraftData.model || '',
        manufacturer: aircraftData.manufacturer || '',
        seatingCapacity: aircraftData.seatingCapacity || 0,
        economySeats: aircraftData.economySeats || 0,
        premiumEconomySeats: aircraftData.premiumEconomySeats || 0,
        businessSeats: aircraftData.businessSeats || 0,
        firstClassSeats: aircraftData.firstClassSeats || 0,
        rangeKm: aircraftData.rangeKm || 0,
        cruisingSpeedKmh: aircraftData.cruisingSpeedKmh || 0,
        maxAltitudeFt: aircraftData.maxAltitudeFt || 0,
        yearOfManufacture: aircraftData.yearOfManufacture || 0,
        registrationDate: aircraftData.registrationDate ? new Date(aircraftData.registrationDate) : null,
        nextMaintenanceDate: aircraftData.nextMaintenanceDate ? new Date(aircraftData.nextMaintenanceDate) : null,
        status: aircraftData.status || 'ACTIVE',
        isAvailable: aircraftData.isAvailable !== undefined ? aircraftData.isAvailable : true,
        currentAirportId: aircraftData.currentAirportId || null,
      });
    } else {
      // Reset form when not editing
      setFormData({
        code: '',
        model: '',
        manufacturer: '',
        seatingCapacity: 0,
        economySeats: 0,
        premiumEconomySeats: 0,
        businessSeats: 0,
        firstClassSeats: 0,
        rangeKm: 0,
        cruisingSpeedKmh: 0,
        maxAltitudeFt: 0,
        yearOfManufacture: 0,
        registrationDate: null,
        nextMaintenanceDate: null,
        status: 'ACTIVE',
        isAvailable: true,
        currentAirportId: null,
      });
    }
    // Clear errors when form data changes
    setErrors({});
  }, [isEditMode, aircraftData]);

  // Validate form before submission
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.code.trim()) {
      newErrors.code = 'Aircraft code is required';
    }
    
    if (!formData.model.trim()) {
      newErrors.model = 'Aircraft model is required';
    }
    
    if (!formData.manufacturer.trim()) {
      newErrors.manufacturer = 'Manufacturer is required';
    }
    
    if (!formData.seatingCapacity || formData.seatingCapacity <= 0) {
      newErrors.seatingCapacity = 'Seating capacity must be positive';
    }
    
    if (!formData.status) {
      newErrors.status = 'Status is required';
    }
    
    if (formData.economySeats <= 0) {
      newErrors.economySeats = 'Economy seats must be positive';
    }
    
    if (formData.yearOfManufacture <= 1900 || formData.yearOfManufacture > new Date().getFullYear()) {
      newErrors.yearOfManufacture = 'Invalid year of manufacture';
    }
    
    // Calculate total seats from class seats
    const totalClassSeats = 
      formData.economySeats + 
      formData.premiumEconomySeats + 
      formData.businessSeats + 
      formData.firstClassSeats;
    
    if (totalClassSeats !== formData.seatingCapacity) {
      newErrors.seatingCapacity = `Total seating capacity (${formData.seatingCapacity}) must match sum of class seats (${totalClassSeats})`;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : 
              type === 'number' ? parseInt(value) || 0 : value
    }));
  };

  // Handle select changes
  const handleSelectChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle date changes
  const handleDateChange = (name, date) => {
    setFormData(prev => ({
      ...prev,
      [name]: date
    }));
  };



  // Handle form submission
  const handleSubmit = async(e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Form data on submit:", formData, onSave);
        // Handle create aircraft
        
          console.log("Creating aircraft with data:", formData);
          try {
            await dispatch(createAircraft(formData)).unwrap();
            
            setSuccessMessage("Aircraft created successfully");
            // dispatch(listAllAircrafts({ page: currentPage, limit: itemsPerPage }));
            // Clear success message after 3 seconds
            navigate('/airline/aircraft');
            setTimeout(() => setSuccessMessage(""), 3000);
          } catch (error) {
            console.error("Error creating aircraft:", error);
          }
        
    }
    
  };

  return (
    <div className="w-full max-w-4xl mx-auto border rounded-md bg-white">
      <div className="p-6 border-b">
        <h2 className="text-xl font-bold">{isEditMode ? 'Edit Aircraft' : 'Create New Aircraft'}</h2>
      </div>
      <div className="p-6">
        {error && (
          <div className="bg-red-50 text-red-800 border border-red-200 p-4 rounded-md mb-6">
            {error}
          </div>
        )}
        
        <ScrollArea className="h-[70vh] pr-4">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="code">Aircraft Code</Label>
                  <Input
                    className="w-full"
                    id="code"
                    name="code"
                    value={formData.code}
                    onChange={handleChange}
                    placeholder="e.g. A001"
                    required
                  />
                  {errors.code && (
                    <p className="text-sm text-red-500">{errors.code}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="model">Aircraft Model</Label>
                  <Input
                    className="w-full"
                    id="model"
                    name="model"
                    value={formData.model}
                    onChange={handleChange}
                    placeholder="e.g. Boeing 737-800"
                    required
                  />
                  {errors.model && (
                    <p className="text-sm text-red-500">{errors.model}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="manufacturer">Manufacturer</Label>
                  <Input
                    className="w-full"
                    id="manufacturer"
                    name="manufacturer"
                    value={formData.manufacturer}
                    onChange={handleChange}
                    placeholder="e.g. Boeing"
                    required
                  />
                  {errors.manufacturer && (
                    <p className="text-sm text-red-500">{errors.manufacturer}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="yearOfManufacture">Year of Manufacture</Label>
                  <Input
                    className="w-full"
                    id="yearOfManufacture"
                    name="yearOfManufacture"
                    type="number"
                    value={formData.yearOfManufacture}
                    onChange={handleChange}
                    placeholder="2020"
                    min="1900"
                    max={new Date().getFullYear()}
                    required
                  />
                  {errors.yearOfManufacture && (
                    <p className="text-sm text-red-500">{errors.yearOfManufacture}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Seating Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Seating Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="seatingCapacity">Total Seating Capacity</Label>
                  <Input
                    className="w-full"
                    id="seatingCapacity"
                    name="seatingCapacity"
                    type="number"
                    value={formData.seatingCapacity}
                    onChange={handleChange}
                    min="1"
                    required
                  />
                  {errors.seatingCapacity && (
                    <p className="text-sm text-red-500">{errors.seatingCapacity}</p>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div className="space-y-2">
                  <Label htmlFor="economySeats">Economy Seats</Label>
                  <Input
                    className="w-full"
                    id="economySeats"
                    name="economySeats"
                    type="number"
                    value={formData.economySeats}
                    onChange={handleChange}
                    min="1"
                    required
                  />
                  {errors.economySeats && (
                    <p className="text-sm text-red-500">{errors.economySeats}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="premiumEconomySeats">Premium Economy Seats</Label>
                  <Input
                    className="w-full"
                    id="premiumEconomySeats"
                    name="premiumEconomySeats"
                    type="number"
                    value={formData.premiumEconomySeats}
                    onChange={handleChange}
                    min="0"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="businessSeats">Business Seats</Label>
                  <Input
                    className="w-full"
                    id="businessSeats"
                    name="businessSeats"
                    type="number"
                    value={formData.businessSeats}
                    onChange={handleChange}
                    min="0"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="firstClassSeats">First Class Seats</Label>
                  <Input
                    className="w-full"
                    id="firstClassSeats"
                    name="firstClassSeats"
                    type="number"
                    value={formData.firstClassSeats}
                    onChange={handleChange}
                    min="0"
                  />
                </div>
              </div>
            </div>

            {/* Performance Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Performance Specifications</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rangeKm">Range (km)</Label>
                  <Input
                    className="w-full"
                    id="rangeKm"
                    name="rangeKm"
                    type="number"
                    value={formData.rangeKm}
                    onChange={handleChange}
                    min="1"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cruisingSpeedKmh">Cruising Speed (km/h)</Label>
                  <Input
                    className="w-full"
                    id="cruisingSpeedKmh"
                    name="cruisingSpeedKmh"
                    type="number"
                    value={formData.cruisingSpeedKmh}
                    onChange={handleChange}
                    min="1"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="maxAltitudeFt">Max Altitude (ft)</Label>
                  <Input
                    className="w-full"
                    id="maxAltitudeFt"
                    name="maxAltitudeFt"
                    type="number"
                    value={formData.maxAltitudeFt}
                    onChange={handleChange}
                    min="1"
                  />
                </div>
              </div>
            </div>

            {/* Status and Dates */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Status and Dates</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <div className="border rounded-md p-2">
                    <select 
                      id="status"
                      name="status"
                      className="w-full bg-transparent outline-none"
                      value={formData.status}
                      onChange={(e) => handleSelectChange('status', e.target.value)}
                    >
                      <option value="">Select status</option>
                      {AIRCRAFT_STATUS.map((status) => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.status && (
                    <p className="text-sm text-red-500">{errors.status}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      id="isAvailable" 
                      checked={formData.isAvailable} 
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isAvailable: checked }))}
                    />
                    <Label htmlFor="isAvailable">Is Available</Label>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="registrationDate">Registration Date</Label>
                  <Input
                    className="w-full"
                    id="registrationDate"
                    name="registrationDate"
                    type="date"
                    value={formData.registrationDate ? formData.registrationDate.toISOString().split('T')[0] : ''}
                    onChange={(e) => handleDateChange('registrationDate', e.target.value ? new Date(e.target.value) : null)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="nextMaintenanceDate">Next Maintenance Date</Label>
                  <Input
                    className="w-full"
                    id="nextMaintenanceDate"
                    name="nextMaintenanceDate"
                    type="date"
                    value={formData.nextMaintenanceDate ? formData.nextMaintenanceDate.toISOString().split('T')[0] : ''}
                    onChange={(e) => handleDateChange('nextMaintenanceDate', e.target.value ? new Date(e.target.value) : null)}
                  />
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Additional Information</h3>
              <div className="space-y-2">
                <Label htmlFor="currentAirportId">Current Airport ID</Label>
                <Input
                  className="w-full"
                  id="currentAirportId"
                  name="currentAirportId"
                  type="number"
                  value={formData.currentAirportId || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    currentAirportId: e.target.value ? parseInt(e.target.value) : null
                  }))}
                  placeholder="Leave blank if not assigned"
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : isEditMode ? 'Update Aircraft' : 'Create Aircraft'}
              </Button>
            </div>
          </form>
        </ScrollArea>
      </div>
    </div>
  );
};

export default AircraftForm;