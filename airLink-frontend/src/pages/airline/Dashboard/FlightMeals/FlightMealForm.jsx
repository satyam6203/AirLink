import React, { useState } from "react";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import { Switch } from "../../../../components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../components/ui/table";
import { Trash2 } from "lucide-react";

const FlightMealForm = ({
  flightId,
  availableMeals,
  assignedMeals,
  onSubmit,
  onCancel,
}) => {
  const [selectedMeals, setSelectedMeals] = useState([]);

  const assignedMealIds = assignedMeals.map((fm) => fm.meal?.id);
  const unassignedMeals = availableMeals.filter(
    (meal) => !assignedMealIds.includes(meal.id)
  );

  const handleAddMeal = (mealId) => {
    const meal = availableMeals.find((m) => m.id === parseInt(mealId));
    if (meal && !selectedMeals.find((sm) => sm.mealId === meal.id)) {
      setSelectedMeals([
        ...selectedMeals,
        {
          mealId: meal.id,
          mealCode: meal.code,
          mealName: meal.name,
          available: true,
          price: meal.price || null,
          displayOrder: selectedMeals.length,
        },
      ]);
    }
  };

  const handleRemoveMeal = (mealId) => {
    setSelectedMeals(selectedMeals.filter((sm) => sm.mealId !== mealId));
  };

  const handleUpdateMeal = (mealId, field, value) => {
    setSelectedMeals(
      selectedMeals.map((sm) =>
        sm.mealId === mealId ? { ...sm, [field]: value } : sm
      )
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const flightMealsData = selectedMeals.map((sm) => ({
      flightId: parseInt(flightId),
      mealId: sm.mealId,
      available: sm.available,
      price: sm.price ? parseFloat(sm.price) : null,
      displayOrder: sm.displayOrder,
    }));
    onSubmit(flightMealsData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Meal Selection */}
      <div className="space-y-2">
        <Label>Select Meal to Add</Label>
        <Select onValueChange={handleAddMeal}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Choose a meal" />
          </SelectTrigger>
          <SelectContent>
            {unassignedMeals.length === 0 ? (
              <div className="p-2 text-sm text-muted-foreground">
                All meals are assigned or no meals available
              </div>
            ) : (
              unassignedMeals.map((meal) => (
                <SelectItem key={meal.id} value={meal.id.toString()}>
                  {meal.code} - {meal.name}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>

      {/* Selected Meals Configuration */}
      {selectedMeals.length > 0 && (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Meal</TableHead>
                <TableHead>Price Override</TableHead>
                <TableHead>Display Order</TableHead>
                <TableHead>Available</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {selectedMeals.map((meal) => (
                <TableRow key={meal.mealId}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{meal.mealCode}</div>
                      <div className="text-sm text-muted-foreground">
                        {meal.mealName}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={meal.price || ""}
                      onChange={(e) =>
                        handleUpdateMeal(meal.mealId, "price", e.target.value)
                      }
                      placeholder="Price override"
                      className="w-32"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min="0"
                      value={meal.displayOrder}
                      onChange={(e) =>
                        handleUpdateMeal(
                          meal.mealId,
                          "displayOrder",
                          e.target.value
                        )
                      }
                      placeholder="0"
                      className="w-24"
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={meal.available}
                      onCheckedChange={(checked) =>
                        handleUpdateMeal(meal.mealId, "available", checked)
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveMeal(meal.mealId)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {selectedMeals.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          Select meals from the dropdown above to configure them for this flight
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={selectedMeals.length === 0}>
          Assign {selectedMeals.length} Meal{selectedMeals.length !== 1 ? "s" : ""}
        </Button>
      </div>
    </form>
  );
};

export default FlightMealForm;
