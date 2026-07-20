import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchMealsByAirlineId,
  updateMealAvailability,
  deleteMeal,
  searchMeals,
} from "../../../../Redux/meal/mealThunk";
import { clearMealError } from "../../../../Redux/meal/mealSlice";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../components/ui/table";
import { Badge } from "../../../../components/ui/badge";
import { Switch } from "../../../../components/ui/switch";
import { Plus, Search, Edit, Trash2, UtensilsCrossed } from "lucide-react";
import { Loader } from "@/components/common/Loader";

const MealManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { meals, loading, error } = useSelector((state) => state.meal);
  const { user } = useSelector((state) => state.auth);

  const [searchKeyword, setSearchKeyword] = useState("");

  useEffect(() => {
    
      dispatch(fetchMealsByAirlineId());
    
  }, [dispatch, user]);

  useEffect(() => {
    if (error) {
      dispatch(clearMealError());
    }
  }, [error, dispatch]);

  const handleSearch = () => {
    if (searchKeyword.trim()) {
      dispatch(searchMeals({ keyword: searchKeyword }));
    } else if (user?.airline?.id) {
      dispatch(fetchMealsByAirlineId(user.airline.id));
    }
  };

  const handleToggleAvailability = async (mealId, currentAvailability) => {
    try {
      await dispatch(
        updateMealAvailability({
          mealId,
          available: !currentAvailability,
        })
      ).unwrap();
    } catch (err) {
      console.error("Failed to update availability:", err);
    }
  };

  const handleDeleteMeal = async (mealId) => {
    if (window.confirm("Are you sure you want to delete this meal?")) {
      try {
        await dispatch(deleteMeal(mealId)).unwrap();
      } catch (err) {
        console.error("Failed to delete meal:", err);
      }
    }
  };

  if (loading && meals.length === 0) {
    return <Loader />;
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <UtensilsCrossed className="h-6 w-6" />
                Meal Management
              </CardTitle>
              <CardDescription>
                Manage your airline's meal catalog
              </CardDescription>
            </div>
            <Button onClick={() => navigate("/airline/meals/new")}>
              <Plus className="h-4 w-4 mr-2" />
              Add Meal
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search Bar */}
          <div className="flex gap-2 mb-6">
            <Input
              placeholder="Search meals by name or description..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              className="flex-1"
            />
            <Button onClick={handleSearch} variant="outline">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>

          {/* Meals Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Available</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {meals.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      No meals found. Create your first meal to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  meals.map((meal) => (
                    <TableRow key={meal.id}>
                      <TableCell className="font-medium">
                        {meal.code}
                      </TableCell>
                      <TableCell>{meal.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{meal.mealType || "N/A"}</Badge>
                      </TableCell>
                      <TableCell>
                        {meal.dietaryRestriction ? (
                          <Badge variant="secondary">
                            {meal.dietaryRestriction}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">
                            Regular
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        {meal.price
                          ? `${meal.currency || "USD"} ${meal.price.toFixed(2)}`
                          : "Free"}
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={meal.available}
                          onCheckedChange={() =>
                            handleToggleAvailability(meal.id, meal.available)
                          }
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate(`/airline/meals/${meal.id}/edit`)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteMeal(meal.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MealManagement;
