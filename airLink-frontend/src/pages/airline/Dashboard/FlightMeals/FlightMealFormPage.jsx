import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { bulkCreateFlightMeals, fetchFlightMealsByFlightId } from "../../../../Redux/flightMeal/flightMealThunk";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../components/ui/card";
import { ArrowLeft, UtensilsCrossed } from "lucide-react";
import { Button } from "../../../../components/ui/button";
import FlightMealForm from "./FlightMealForm";
import { Loader } from "@/components/common/Loader";
import { fetchMealsByAirlineId } from "@/Redux/meal/mealThunk";

const FlightMealFormPage = () => {
  const { flightId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { flightMeals, loading: flightMealsLoading } = useSelector((state) => state.flightMeal);
  const { meals: availableMeals, loading: mealsLoading } = useSelector((state) => state.meal);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    
    if (flightId) {
      dispatch(fetchFlightMealsByFlightId(flightId));
    }
    
      dispatch(fetchMealsByAirlineId());
    
  }, [dispatch, flightId, user]);

  const handleSubmit = async (flightMealsData) => {
    try {
      await dispatch(bulkCreateFlightMeals(flightMealsData)).unwrap();
      navigate(`/airline/flights/${flightId}`);
    } catch (err) {
      console.error("Failed to assign meals:", err);
    }
  };

  const handleCancel = () => {
    navigate(`/airline/flights/${flightId}/meals`);
  };

  if (flightMealsLoading || mealsLoading) {
    return <Loader />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(`/airline/flights/${flightId}/meals`)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <div className="bg-gradient-to-r from-orange-600 to-red-600 p-3 rounded-2xl">
              <UtensilsCrossed className="h-8 w-8 text-white" />
            </div>
            Assign Meals to Flight
          </h1>
          <p className="text-muted-foreground">
            Select meals from your catalog and configure flight-specific settings
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Meal Assignment</CardTitle>
          <CardDescription>
            Choose meals to assign and configure their availability, pricing, and display order for this flight
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FlightMealForm
            flightId={flightId}
            availableMeals={availableMeals}
            assignedMeals={flightMeals}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default FlightMealFormPage;
