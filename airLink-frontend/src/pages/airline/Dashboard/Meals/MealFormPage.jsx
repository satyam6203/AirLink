import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { createMeal, fetchMealById, updateMeal } from "../../../../Redux/meal/mealThunk";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../components/ui/card";
import { ArrowLeft, UtensilsCrossed } from "lucide-react";
import { Button } from "@/components/ui/button";
import MealForm from "./MealForm";
import { Loader } from "@/components/common/Loader";

const MealFormPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {currentMeal, meals, loading } = useSelector((state) => state.meal);
  const { user } = useSelector((state) => state.auth);

  const isEditMode = !!id;
 

  const handleSubmit = async (mealData) => {
    try {
      if (isEditMode) {
        await dispatch(updateMeal({ mealId: parseInt(id), mealData })).unwrap();
      } else {
        await dispatch(createMeal({ ...mealData })).unwrap();
      }
      navigate("/airline/meals");
    } catch (err) {
      console.error("Failed to save meal:", err);
    }
  };

  const handleCancel = () => {
    navigate("/airline/meals");
  };

    useEffect(()=>{
  console.log("Meal ID from params:", id);
      if(id){
        dispatch(fetchMealById(id));
      }
  
    },[id])

    console.log("Meal data:", currentMeal);

  if (isEditMode && loading) {
    return <Loader />;
  }

  if (isEditMode && !createMeal) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-muted-foreground">Meal not found</p>
            <div className="flex justify-center mt-4">
              <Button onClick={() => navigate("/airline/meals")}>Back to Meals</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/airline/meals")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <UtensilsCrossed className="h-6 w-6" />
            {isEditMode ? "Edit Meal" : "Create New Meal"}
          </h1>
          <p className="text-muted-foreground">
            {isEditMode ? "Update meal details" : "Add a new meal to your catalog"}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Meal Details</CardTitle>
          <CardDescription>
            {isEditMode ? "Modify the meal information below" : "Fill in the meal information below"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <MealForm onSubmit={handleSubmit} onCancel={handleCancel} />
        </CardContent>
      </Card>
    </div>
  );
};

export default MealFormPage;
