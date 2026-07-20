import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerBody,
  DrawerFooter,
  DrawerClose
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { SpinnerLoader } from '@/components/common/Loader';
import {
  Settings,
  MapPin,
  Ruler,
  Monitor,
  Wifi,
  Coffee,
  Utensils,
  Zap,
  Headphones,
  Plus,
  X,
  Save
} from 'lucide-react';

const SeatConfigDrawer = ({ isOpen, onClose, seat, onSave }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector(state => state.seat);

  const [formData, setFormData] = useState({
    seatNumber: '',
    seatType: 'MIDDLE',
    seatClass: 'ECONOMY',
    seatPitch: 32,
    seatWidth: 17.5,
    hasRecline: true,
    reclineAngle: 120,
    isAvailable: true,
    status: 'AVAILABLE',
    amenities: [],
    specialFeatures: [],
    notes: ''
  });

  const [newAmenity, setNewAmenity] = useState('');
  const [newFeature, setNewFeature] = useState('');

  // Reset form when seat changes
  useEffect(() => {
    if (seat) {
      setFormData({
        seatNumber: seat.seatNumber || '',
        seatType: seat.seatType || 'MIDDLE',
        seatClass: seat.seatClass || 'ECONOMY',
        seatPitch: seat.seatPitch || 32,
        seatWidth: seat.seatWidth || 17.5,
        hasRecline: seat.hasRecline !== undefined ? seat.hasRecline : true,
        reclineAngle: seat.reclineAngle || 120,
        isAvailable: seat.isAvailable !== undefined ? seat.isAvailable : true,
        status: seat.status || 'AVAILABLE',
        amenities: seat.amenities || [],
        specialFeatures: seat.specialFeatures || [],
        notes: seat.notes || ''
      });
    }
  }, [seat]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddAmenity = () => {
    if (newAmenity.trim() && !formData.amenities.includes(newAmenity.trim())) {
      setFormData(prev => ({
        ...prev,
        amenities: [...prev.amenities, newAmenity.trim()]
      }));
      setNewAmenity('');
    }
  };

  const handleRemoveAmenity = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.filter(a => a !== amenity)
    }));
  };

  const handleAddFeature = () => {
    if (newFeature.trim() && !formData.specialFeatures.includes(newFeature.trim())) {
      setFormData(prev => ({
        ...prev,
        specialFeatures: [...prev.specialFeatures, newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const handleRemoveFeature = (feature) => {
    setFormData(prev => ({
      ...prev,
      specialFeatures: prev.specialFeatures.filter(f => f !== feature)
    }));
  };

  const handleQuickAmenity = (amenity) => {
    if (!formData.amenities.includes(amenity)) {
      setFormData(prev => ({
        ...prev,
        amenities: [...prev.amenities, amenity]
      }));
    }
  };

  const handleSave = async () => {
    try {
      await onSave({
        ...seat,
        ...formData
      });
      onClose();
    } catch (error) {
      console.error('Error saving seat configuration:', error);
    }
  };

  const getSeatTypeIcon = (type) => {
    switch (type) {
      case 'WINDOW':
        return '🪟';
      case 'AISLE':
        return '🚶';
      case 'MIDDLE':
        return '🪑';
      default:
        return '💺';
    }
  };

  const quickAmenities = [
    { name: 'WiFi', icon: Wifi },
    { name: 'Power Outlet', icon: Zap },
    { name: 'In-Flight Entertainment', icon: Monitor },
    { name: 'Food Service', icon: Utensils },
    { name: 'Beverage Service', icon: Coffee },
    { name: 'Headphones', icon: Headphones }
  ];

  if (!isOpen) return null;

  return (
    <Drawer>
      <DrawerContent className="w-full max-w-lg overflow-y-auto">
        <DrawerHeader>
          <DrawerClose onClick={onClose} />
          <DrawerTitle className="flex items-center">
            <Settings className="h-5 w-5 mr-2" />
            Configure Seat {seat?.seatNumber}
          </DrawerTitle>
          <DrawerDescription>
            Modify seat attributes, amenities, and availability settings
          </DrawerDescription>
        </DrawerHeader>

        <DrawerBody className="space-y-6 overflow-y-auto">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 ">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="seatNumber">Seat Number</Label>
                  <Input
                    id="seatNumber"
                    value={formData.seatNumber}
                    onChange={(e) => handleInputChange('seatNumber', e.target.value)}
                    placeholder="e.g., 12A"
                  />
                </div>
                <div>
                  <Label htmlFor="seatType">Seat Type</Label>
                  <Select
                    value={formData.seatType}
                    onValueChange={(value) => handleInputChange('seatType', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="WINDOW">🪟 Window</SelectItem>
                      <SelectItem value="AISLE">🚶 Aisle</SelectItem>
                      <SelectItem value="MIDDLE">🪑 Middle</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="seatClass">Seat Class</Label>
                <Select
                  value={formData.seatClass}
                  onValueChange={(value) => handleInputChange('seatClass', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FIRST">First Class</SelectItem>
                    <SelectItem value="BUSINESS">Business</SelectItem>
                    <SelectItem value="PREMIUM_ECONOMY">Premium Economy</SelectItem>
                    <SelectItem value="ECONOMY">Economy</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleInputChange('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AVAILABLE">Available</SelectItem>
                    <SelectItem value="BLOCKED">Blocked</SelectItem>
                    <SelectItem value="EXTRA_LEGROOM">Extra Legroom</SelectItem>
                    <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="isAvailable">Available for Booking</Label>
                <Switch
                  id="isAvailable"
                  checked={formData.isAvailable}
                  onCheckedChange={(checked) => handleInputChange('isAvailable', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Physical Dimensions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center">
                <Ruler className="h-4 w-4 mr-2" />
                Seat Dimensions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="seatPitch">Seat Pitch (inches)</Label>
                  <Input
                    id="seatPitch"
                    type="number"
                    min="28"
                    max="84"
                    value={formData.seatPitch}
                    onChange={(e) => handleInputChange('seatPitch', parseFloat(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="seatWidth">Seat Width (inches)</Label>
                  <Input
                    id="seatWidth"
                    type="number"
                    min="16"
                    max="26"
                    step="0.5"
                    value={formData.seatWidth}
                    onChange={(e) => handleInputChange('seatWidth', parseFloat(e.target.value))}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="hasRecline">Recline Feature</Label>
                <Switch
                  id="hasRecline"
                  checked={formData.hasRecline}
                  onCheckedChange={(checked) => handleInputChange('hasRecline', checked)}
                />
              </div>

              {formData.hasRecline && (
                <div>
                  <Label htmlFor="reclineAngle">Recline Angle (degrees)</Label>
                  <Input
                    id="reclineAngle"
                    type="number"
                    min="90"
                    max="180"
                    value={formData.reclineAngle}
                    onChange={(e) => handleInputChange('reclineAngle', parseInt(e.target.value))}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Amenities */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Amenities & Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Quick Add Amenities */}
              <div>
                <Label className="text-xs text-gray-500">Quick Add</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {quickAmenities.map((amenity) => {
                    const IconComponent = amenity.icon;
                    const isAdded = formData.amenities.includes(amenity.name);
                    return (
                      <Button
                        key={amenity.name}
                        variant={isAdded ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleQuickAmenity(amenity.name)}
                        disabled={isAdded}
                        className="justify-start text-xs"
                      >
                        <IconComponent className="h-3 w-3 mr-1" />
                        {amenity.name}
                      </Button>
                    );
                  })}
                </div>
              </div>

              <Separator />

              {/* Current Amenities */}
              <div>
                <Label>Current Amenities</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.amenities.map((amenity) => (
                    <Badge key={amenity} variant="secondary" className="text-xs">
                      {amenity}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 ml-1"
                        onClick={() => handleRemoveAmenity(amenity)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                  {formData.amenities.length === 0 && (
                    <p className="text-sm text-gray-500">No amenities added</p>
                  )}
                </div>
              </div>

              {/* Add Custom Amenity */}
              <div>
                <Label>Add Custom Amenity</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    placeholder="Enter amenity name"
                    value={newAmenity}
                    onChange={(e) => setNewAmenity(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddAmenity()}
                  />
                  <Button size="sm" onClick={handleAddAmenity}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Special Features */}
              <div>
                <Label>Special Features</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.specialFeatures.map((feature) => (
                    <Badge key={feature} variant="outline" className="text-xs">
                      {feature}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 ml-1"
                        onClick={() => handleRemoveFeature(feature)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2 mt-2">
                  <Input
                    placeholder="Enter special feature"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddFeature()}
                  />
                  <Button size="sm" onClick={handleAddFeature}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Additional Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Enter any additional notes or special instructions..."
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                rows={3}
              />
            </CardContent>
          </Card>
        </DrawerBody>

        <DrawerFooter>
          <div className="flex gap-2 w-full">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={loading} className="flex-1">
              {loading ? (
                <>
                  <SpinnerLoader size="sm" className="mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default SeatConfigDrawer;