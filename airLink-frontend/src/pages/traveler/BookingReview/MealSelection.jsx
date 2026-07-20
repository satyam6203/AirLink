import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UtensilsCrossed,
  Check,
  X,
  ChevronDown,
  ChevronUp,
  Leaf,
  AlertCircle,
  Clock,
  Info,
} from "lucide-react";
import { useSelector } from "react-redux";

const MealSelection = ({ selectedMeals, onSelectMeal }) => {
  const [expandedCategory, setExpandedCategory] = useState("all");
  const [showAllMeals, setShowAllMeals] = useState(false);

  // Get meals from Redux
  const { flightMeals, loading } = useSelector((state) => state.flightMeal);
  

  // Transform flight meal data to match the expected format
  const mealsData = (flightMeals || []).map((fm) => ({
    id: fm.id,
    flightMealId: fm.id,
    mealId: fm.meal?.id,
    name: fm.meal?.name || "Unknown Meal",
    description: fm.meal?.description || fm.meal?.ingredients || "Delicious meal",
    price: fm.price || 0,
    available: fm.available,
    complimentary: fm.complimentary,
    category: fm.meal?.mealType || "MEAL",
    dietaryRestriction: fm.meal?.dietaryRestriction,
    imageUrl: fm.meal?.imageUrl,
    allergens: fm.meal?.allergens,
    ingredients: fm.meal?.ingredients,
    code: fm.meal?.code,
    requiresAdvanceBooking: fm.meal?.requiresAdvanceBooking,
    advanceBookingHours: fm.meal?.advanceBookingHours,
  }));


  const categories = [
    "all",
    ...new Set(mealsData.map((meal) => meal.category)),
  ];

  const filteredMeals =
    expandedCategory === "all"
      ? mealsData
      : mealsData.filter((meal) => meal.category === expandedCategory);

  const displayedMeals = showAllMeals
    ? filteredMeals
    : filteredMeals.slice(0, 4);

  const isMealSelected = (mealId) => {
    return selectedMeals.some((meal) => meal.id === mealId);
  };

  const handleMealToggle = (meal) => {
    if (isMealSelected(meal.id)) {
      onSelectMeal(selectedMeals.filter((m) => m.id !== meal.id));
    } else {
      onSelectMeal([...selectedMeals, meal]);
    }
  };

  const totalMealCost = selectedMeals.reduce((sum, meal) => sum + meal.price, 0);

  // Get dietary restriction icon and color
  const getDietaryInfo = (restriction) => {
    const info = {
      VEGETARIAN: { icon: Leaf, color: "green", label: "Vegetarian" },
      VEGAN: { icon: Leaf, color: "emerald", label: "Vegan" },
      HALAL: { color: "blue", label: "Halal" },
      KOSHER: { color: "purple", label: "Kosher" },
      GLUTEN_FREE: { color: "amber", label: "Gluten Free" },
    };
    return info[restriction] || { color: "gray", label: restriction };
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-md p-6">
        <div className="flex items-center justify-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
        </div>
      </div>
    );
  }

  if (!mealsData || mealsData.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
        className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
            <UtensilsCrossed className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Meal Selection
            </h2>
            <p className="text-sm text-gray-600">Pre-book your meals</p>
          </div>
        </div>
        <div className="p-8 border-2 border-dashed border-gray-300 rounded-xl text-center">
          <UtensilsCrossed className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-sm text-gray-600">No meals available for this flight</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.5 }}
      className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
            <UtensilsCrossed className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Meal Selection
            </h2>
            <p className="text-sm text-gray-600">
              Pre-book your meals at great prices
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500">Available Meals</p>
          <p className="text-lg font-bold text-orange-600">{mealsData.length}</p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setExpandedCategory(category)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              expandedCategory === category
                ? "bg-orange-600 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {category === "all"
              ? "All Meals"
              : category.charAt(0) + category.slice(1).toLowerCase().replace("_", " ")}
          </button>
        ))}
      </div>

      {/* Meals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <AnimatePresence mode="popLayout">
          {displayedMeals.map((meal) => {
            const isSelected = isMealSelected(meal.id);
            const dietaryInfo = getDietaryInfo(meal.dietaryRestriction);

            return (
              <motion.div
                key={meal.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ scale: meal.available ? 1.02 : 1 }}
                whileTap={{ scale: meal.available ? 0.98 : 1 }}
                onClick={() => meal.available && handleMealToggle(meal)}
                className={`relative cursor-pointer rounded-xl border-2 overflow-hidden transition-all ${
                  isSelected
                    ? "border-orange-600 bg-orange-50 shadow-lg"
                    : meal.available
                    ? "border-gray-200 hover:border-orange-300 bg-white shadow-sm hover:shadow-md"
                    : "border-gray-200 bg-gray-50 cursor-not-allowed opacity-60"
                }`}
              >
                {/* Meal Image */}
                {meal.imageUrl && (
                  <div className="relative h-32 overflow-hidden">
                    <img
                      src={meal.imageUrl}
                      alt={meal.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>

                    {/* Complimentary Badge */}
                    {meal.complimentary && (
                      <div className="absolute top-2 left-2">
                        <span className="px-2 py-1 bg-green-500 text-white text-xs font-bold rounded-full shadow-md">
                          Free
                        </span>
                      </div>
                    )}

                    {/* Checkbox */}
                    <div className="absolute top-2 right-2">
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                          isSelected
                            ? "border-orange-600 bg-orange-600"
                            : "border-white bg-white/80"
                        }`}
                      >
                        {isSelected && <Check className="w-4 h-4 text-white" />}
                      </div>
                    </div>
                  </div>
                )}

                {/* Meal Info */}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1">
                      <h3 className="text-sm font-bold text-gray-900 line-clamp-1 mb-1">
                        {meal.name}
                      </h3>
                      <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                        {meal.description}
                      </p>
                    </div>
                    {!meal.imageUrl && (
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                          isSelected
                            ? "border-orange-600 bg-orange-600"
                            : "border-gray-300 bg-white"
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 text-white" />}
                      </div>
                    )}
                  </div>

                  {/* Ingredients */}
                  {meal.ingredients && (
                    <p className="text-xs text-gray-500 mb-2 line-clamp-1">
                      <span className="font-medium">Ingredients:</span> {meal.ingredients}
                    </p>
                  )}

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {meal.dietaryRestriction && (
                      <span
                        className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 bg-${dietaryInfo.color}-100 text-${dietaryInfo.color}-700 rounded-full font-medium`}
                      >
                        {dietaryInfo.icon && (
                          <dietaryInfo.icon className="w-3 h-3" />
                        )}
                        {dietaryInfo.label}
                      </span>
                    )}
                    {meal.code && (
                      <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full font-mono">
                        {meal.code}
                      </span>
                    )}
                  </div>

                  {/* Allergen Warning */}
                  {meal.allergens && (
                    <div className="mb-2 p-2 bg-amber-50 rounded-lg border border-amber-200">
                      <div className="flex items-start gap-1.5">
                        <AlertCircle className="w-3 h-3 text-amber-600 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-amber-800">
                          <span className="font-semibold">Allergens:</span>{" "}
                          {meal.allergens}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Advance Booking Notice */}
                  {meal.requiresAdvanceBooking && meal.advanceBookingHours && (
                    <div className="mb-2 p-2 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-start gap-1.5">
                        <Clock className="w-3 h-3 text-blue-600 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-blue-800">
                          Book {meal.advanceBookingHours}h before departure
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Price and Category */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                    <div>
                      {meal.complimentary ? (
                        <span className="text-sm font-bold text-green-600">
                          Complimentary
                        </span>
                      ) : (
                        <span className="text-base font-bold text-gray-900">
                          ₹{meal.price || 0}
                        </span>
                      )}
                    </div>
                    <span className="text-xs px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full font-medium">
                      {meal.category.replace("_", " ")}
                    </span>
                  </div>
                </div>

                {/* Not Available Overlay */}
                {!meal.available && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 rounded-xl backdrop-blur-sm">
                    <div className="text-center">
                      <X className="w-8 h-8 text-red-600 mx-auto mb-1" />
                      <span className="text-sm font-semibold text-red-600">
                        Not Available
                      </span>
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Show More/Less Button */}
      {filteredMeals.length > 4 && (
        <button
          onClick={() => setShowAllMeals(!showAllMeals)}
          className="w-full py-3 text-sm font-medium text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 rounded-lg flex items-center justify-center gap-2 transition-colors"
        >
          {showAllMeals ? (
            <>
              Show Less <ChevronUp className="w-4 h-4" />
            </>
          ) : (
            <>
              Show More ({filteredMeals.length - 4} more meals){" "}
              <ChevronDown className="w-4 h-4" />
            </>
          )}
        </button>
      )}

      {/* Selected Meals Summary */}
      {selectedMeals.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl"
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-bold text-gray-900">
              Selected Meals ({selectedMeals.length})
            </p>
            <p className="text-lg font-bold text-green-600">
              ₹{totalMealCost.toLocaleString()}
            </p>
          </div>
          <div className="space-y-2">
            {selectedMeals.map((meal) => (
              <div
                key={meal.id}
                className="flex items-center justify-between text-sm bg-white rounded-lg p-3 shadow-sm"
              >
                <div className="flex items-center gap-3 flex-1">
                  {meal.imageUrl && (
                    <img
                      src={meal.imageUrl}
                      alt={meal.name}
                      className="w-10 h-10 rounded-lg object-cover"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {meal.name}
                    </p>
                    {meal.dietaryRestriction && (
                      <p className="text-xs text-gray-500">
                        {getDietaryInfo(meal.dietaryRestriction).label}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-gray-900">
                    ₹{meal.price || 0}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMealToggle(meal);
                    }}
                    className="p-1.5 hover:bg-red-100 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* No Meals Selected */}
      {selectedMeals.length === 0 && (
        <div className="mt-4 p-6 border-2 border-dashed border-gray-300 rounded-xl text-center bg-gray-50">
          <UtensilsCrossed className="w-10 h-10 text-gray-400 mx-auto mb-2" />
          <p className="text-sm font-medium text-gray-700 mb-1">
            No meals selected
          </p>
          <p className="text-xs text-gray-500">
            Add meals to your booking for a better journey
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default MealSelection;
