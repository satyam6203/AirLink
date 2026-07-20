import React, { useState, useEffect } from "react";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import { Textarea } from "../../../../components/ui/textarea";
import { Switch } from "../../../../components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";

import { useSelector } from "react-redux";

const MEAL_TYPES = [
  "BREAKFAST",
  "LUNCH",
  "DINNER",
  "SNACK",
  "BEVERAGE",
  "DESSERT",
];

const DIETARY_RESTRICTIONS = [
  "VEGETARIAN",
  "VEGAN",
  "HALAL",
  "KOSHER",
  "GLUTEN_FREE",
  "DAIRY_FREE",
  "NUT_FREE",
  "DIABETIC",
  "LOW_SODIUM",
  "LOW_FAT",
];

const MealForm = ({ onSubmit, onCancel }) => {
 
  const { currentMeal } = useSelector((state) => state.meal);

 
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    mealType: "",
    dietaryRestriction: "",
    ingredients: "",
    imageUrl: "",

    available: true,
    requiresAdvanceBooking: false,
    advanceBookingHours: "",
    displayOrder: "",
  });

  useEffect(() => {
    if (currentMeal) {
      const initialValues = {
        code: currentMeal?.code ?? "",
        name: currentMeal?.name ?? "",
        mealType: currentMeal?.mealType ?? "",
        dietaryRestriction: currentMeal?.dietaryRestriction ?? "",
        ingredients: currentMeal?.ingredients ?? "",
        imageUrl: currentMeal?.imageUrl ?? "",

    
        available: currentMeal?.available ?? true,

        requiresAdvanceBooking: currentMeal?.requiresAdvanceBooking ?? false,
        advanceBookingHours: currentMeal?.advanceBookingHours ?? "",
        displayOrder: currentMeal?.displayOrder ?? "",
      };

      setFormData(initialValues);
    }
  }, [currentMeal]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      
      
      advanceBookingHours: formData.advanceBookingHours
        ? parseInt(formData.advanceBookingHours)
        : null,
      displayOrder: formData.displayOrder
        ? parseInt(formData.displayOrder)
        : null,
    };
    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Code and Name */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="code">
            Meal Code <span className="text-destructive">*</span>
          </Label>
          <div className="space-y-2">
            <Input
              id="code"
              value={formData.code}
              onChange={(e) =>
                handleChange("code", e.target.value.toUpperCase())
              }
              placeholder="Or enter custom code (e.g., MEAL01)"
              maxLength={10}
              pattern="[A-Z0-9]+"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">
            Meal Name <span className="text-destructive">*</span>
          </Label>
          <Input
            className={"w-full"}
            id="name"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="e.g., Vegetarian Meal"
            maxLength={200}
            required
          />
        </div>
      </div>

      {/* Meal Type and Dietary Restriction */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="mealType">
            Meal Type <span className="text-destructive">*</span>
          </Label>
          <Select
            value={formData.mealType}
            onValueChange={(value) => handleChange("mealType", value)}
            required
          >
            <SelectTrigger className={"w-full"}>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {MEAL_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="dietaryRestriction">Dietary Restriction</Label>
          <Select
            className={"w-full"}
            value={formData.dietaryRestriction}
            onValueChange={(value) => handleChange("dietaryRestriction", value)}
          >
            <SelectTrigger className={"w-full"}>
              <SelectValue placeholder="Select restriction" />
            </SelectTrigger>
            <SelectContent>
              {DIETARY_RESTRICTIONS.map((restriction) => (
                <SelectItem key={restriction} value={restriction}>
                  {restriction}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Ingredients */}
      <div className="space-y-2">
        <Label htmlFor="ingredients">Ingredients</Label>
        <Textarea
          className="w-full"
          id="ingredients"
          value={formData.ingredients}
          onChange={(e) => handleChange("ingredients", e.target.value)}
          placeholder="List ingredients (max 2000 characters)"
          maxLength={2000}
          rows={3}
        />
      </div>

 
 

      {/* Image URL */}
      <div className="space-y-2">
        <Label htmlFor="imageUrl">Image URL</Label>
        <Input
          className="w-full"
          id="imageUrl"
          type="url"
          value={formData.imageUrl}
          onChange={(e) => handleChange("imageUrl", e.target.value)}
          placeholder="https://example.com/meal-image.jpg"
          maxLength={500}
        />
      </div>

      {/* Advance Booking Settings */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Switch
              id="requiresAdvanceBooking"
              checked={formData.requiresAdvanceBooking}
              onCheckedChange={(checked) =>
                handleChange("requiresAdvanceBooking", checked)
              }
            />
            <Label htmlFor="requiresAdvanceBooking">
              Requires Advance Booking
            </Label>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="advanceBookingHours">Advance Booking Hours</Label>
          <Input
            className="w-full"
            id="advanceBookingHours"
            type="number"
            min="0"
            value={formData.advanceBookingHours}
            onChange={(e) =>
              handleChange("advanceBookingHours", e.target.value)
            }
            placeholder="24"
            disabled={!formData.requiresAdvanceBooking}
          />
        </div>
      </div>

      {/* Display Order */}
      <div className="space-y-2">
        <Label htmlFor="displayOrder">Display Order</Label>
        <Input
          className="w-full"
          id="displayOrder"
          type="number"
          min="0"
          value={formData.displayOrder}
          onChange={(e) => handleChange("displayOrder", e.target.value)}
          placeholder="0"
        />
      </div>

      {/* Available Switch */}
      <div className="flex items-center space-x-2">
        <Switch
          id="available"
          checked={formData.available}
          onCheckedChange={(checked) => handleChange("available", checked)}
        />
        <Label htmlFor="available">
          Available for booking <span className="text-destructive">*</span>
        </Label>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{currentMeal ? "Update Meal" : "Create Meal"}</Button>
      </div>
    </form>
  );
};

export default MealForm;
