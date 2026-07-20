import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  UtensilsCrossed,
  DollarSign,
  Trash2,
  Info,
  AlertCircle,
} from 'lucide-react';
import {
  updateFlightMealAvailability,
  deleteFlightMeal,
} from '@/Redux/flightMeal/flightMealThunk';

const FlightMealCard = ({ flightMeal }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { flightId } = useParams();

  const handleToggleAvailability = async () => {
    try {
      await dispatch(
        updateFlightMealAvailability({
          flightMealId: flightMeal.id,
          available: !flightMeal.available,
        })
      ).unwrap();
    } catch (err) {
      console.error('Failed to update availability:', err);
    }
  };

  const handleDelete = async () => {
    if (
      window.confirm(
        `Are you sure you want to remove "${flightMeal.meal?.name}" from this flight?`
      )
    ) {
      try {
        await dispatch(deleteFlightMeal(flightMeal.id)).unwrap();
      } catch (err) {
        console.error('Failed to delete flight meal:', err);
      }
    }
  };

  const meal = flightMeal.meal;
  const displayPrice = flightMeal.price || meal?.price;
  const currency = flightMeal.currency || meal?.currency || 'USD';

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 p-2 rounded-lg">
              <UtensilsCrossed className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <CardTitle className="text-lg">{meal?.name}</CardTitle>
                <Badge variant="outline" className="font-mono text-xs">
                  {meal?.code}
                </Badge>
                {meal?.mealType && (
                  <Badge variant="secondary">{meal.mealType}</Badge>
                )}
              </div>
              <CardDescription className="mt-1">
                {meal?.description || 'No description available'}
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              checked={flightMeal.available}
              onCheckedChange={handleToggleAvailability}
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDelete}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Price */}
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
              <DollarSign className="h-3.5 w-3.5" />
              <span>Price</span>
            </div>
            <div className="font-semibold">
              {displayPrice ? (
                <>
                  {currency} {displayPrice.toFixed(2)}
                  {flightMeal.price && (
                    <Badge variant="outline" className="ml-2 text-xs">
                      Override
                    </Badge>
                  )}
                </>
              ) : (
                <span className="text-muted-foreground">Not set</span>
              )}
            </div>
          </div>

          {/* Dietary Restriction */}
          {meal?.dietaryRestriction && (
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                <Info className="h-3.5 w-3.5" />
                <span>Dietary</span>
              </div>
              <div className="font-semibold">
                <Badge variant="outline">{meal.dietaryRestriction}</Badge>
              </div>
            </div>
          )}

          {/* Advance Booking */}
          {meal?.requiresAdvanceBooking && (
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                <AlertCircle className="h-3.5 w-3.5" />
                <span>Advance Booking</span>
              </div>
              <div className="font-semibold">
                {meal.advanceBookingHours
                  ? `${meal.advanceBookingHours}h`
                  : 'Required'}
              </div>
            </div>
          )}

          {/* Display Order */}
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
              <span>Display Order</span>
            </div>
            <div className="font-semibold">
              {flightMeal.displayOrder ?? 'Not set'}
            </div>
          </div>
        </div>

        {/* Ingredients */}
        {meal?.ingredients && (
          <div className="mt-4 pt-4 border-t">
            <div className="text-sm text-muted-foreground mb-1">
              Ingredients
            </div>
            <div className="text-sm">{meal.ingredients}</div>
          </div>
        )}

        {/* Status Badge */}
        <div className="mt-4 flex gap-2">
          <Badge variant={flightMeal.available ? 'default' : 'secondary'}>
            {flightMeal.available ? 'Available' : 'Unavailable'}
          </Badge>
          {meal?.available === false && (
            <Badge variant="destructive">Meal Not Available</Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FlightMealCard;
