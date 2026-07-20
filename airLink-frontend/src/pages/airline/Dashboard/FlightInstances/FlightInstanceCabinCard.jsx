import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader,
    CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/utils/formateCurrency";
import { getCabinClassIcon } from "@/utils/getCabinClassIcon";
import { getOccupancyColor } from "@/utils/occupancy";
import {
  Plus,
  Settings,
  LayoutGrid,
  Grid3X3,
  Utensils,
  Wifi,
  Crown,
  ChevronUp,
  Users,
  DollarSign,
  CheckCircle,
  XCircle,
  Calendar,
  Plane
} from "lucide-react";
import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CabinQuickActions from "@/components/navigation/CabinQuickActions";

const FlightInstanceCabinCard = ({ cabin, occupancyPercentage }) => {
  const navigate = useNavigate();
  const { flightInstance } = useSelector((store) => store.flightInstance);

  // Calculate occupancy percentage if not provided
  const calculatedOccupancy = occupancyPercentage ||
    (cabin.totalSeats > 0 ? Math.round((cabin.bookedSeats / cabin.totalSeats) * 100) : 0);

  // Get fare details (use first fare if multiple)
  const primaryFare = cabin.fare || (cabin.fares && cabin.fares[0]);

  return (
    <Card
      key={cabin.id}
      className="hover:shadow-lg transition-all duration-300 cursor-pointer hover-lift border-l-4 border-l-blue-500"
    >
      <CardHeader className="pb-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <span className="text-xl">
                {getCabinClassIcon(cabin?.cabinClassType || cabin?.cabinClass?.type)}
              </span>
            </div>
            <div>
              <div className="font-semibold text-lg">
                {cabin?.cabinClass?.name || cabin?.cabinClassType || 'Economy'}
              </div>
              <div className="text-sm text-muted-foreground font-normal">
                Cabin ID: {cabin.id}
              </div>
            </div>
          </CardTitle>
          <div className="flex flex-col items-end gap-2">
            <Badge variant={cabin?.isActive !== false ? "default" : "secondary"}>
              {cabin?.isActive !== false ? "Active" : "Inactive"}
            </Badge>
            {cabin.canBook !== null && (
              <Badge variant={cabin.canBook ? "outline" : "destructive"} className="text-xs">
                {cabin.canBook ? "Bookable" : "Not Bookable"}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Occupancy Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-blue-600" />
            <span className="font-medium text-sm">Seat Occupancy</span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Occupancy Rate</span>
              <span className={cn("font-semibold", getOccupancyColor(calculatedOccupancy))}>
                {calculatedOccupancy}%
              </span>
            </div>
            <Progress value={calculatedOccupancy} className="h-3" />
            <div className="grid grid-cols-3 gap-4 text-xs">
              <div className="text-center">
                <div className="font-medium text-green-600">{cabin.availableSeats}</div>
                <div className="text-muted-foreground">Available</div>
              </div>
              <div className="text-center">
                <div className="font-medium text-orange-600">{cabin.bookedSeats}</div>
                <div className="text-muted-foreground">Booked</div>
              </div>
              <div className="text-center">
                <div className="font-medium text-blue-600">{cabin.totalSeats}</div>
                <div className="text-muted-foreground">Total</div>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Section */}
        {primaryFare && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-green-600" />
              <span className="font-medium text-sm">Pricing Details</span>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-green-600">
                  {formatCurrency(primaryFare.currentPrice || primaryFare.totalPrice)}
                </span>
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  Current Price
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Base Fare:</span>
                    <span className="font-medium">{formatCurrency(primaryFare.baseFare)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Taxes & Fees:</span>
                    <span className="font-medium">{formatCurrency(primaryFare.taxesAndFees)}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Airline Fees:</span>
                    <span className="font-medium">{formatCurrency(primaryFare.airlineFees)}</span>
                  </div>
                  <div className="flex justify-between font-semibold border-t pt-1">
                    <span>Total:</span>
                    <span>{formatCurrency(primaryFare.totalPrice)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Amenities Section */}
        {primaryFare && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Crown className="h-4 w-4 text-purple-600" />
              <span className="font-medium text-sm">Cabin Amenities</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 text-sm">
                <Utensils className={cn("h-4 w-4", primaryFare.complimentaryMeals ? "text-green-500" : "text-gray-400")} />
                <span className={primaryFare.complimentaryMeals ? "text-green-700" : "text-gray-500"}>
                  Complimentary Meals
                </span>
                {primaryFare.complimentaryMeals ? <CheckCircle className="h-3 w-3 text-green-500" /> : <XCircle className="h-3 w-3 text-gray-400" />}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Wifi className={cn("h-4 w-4", primaryFare.inFlightInternet ? "text-green-500" : "text-gray-400")} />
                <span className={primaryFare.inFlightInternet ? "text-green-700" : "text-gray-500"}>
                  In-Flight WiFi
                </span>
                {primaryFare.inFlightInternet ? <CheckCircle className="h-3 w-3 text-green-500" /> : <XCircle className="h-3 w-3 text-gray-400" />}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Crown className={cn("h-4 w-4", primaryFare.loungeAccess ? "text-green-500" : "text-gray-400")} />
                <span className={primaryFare.loungeAccess ? "text-green-700" : "text-gray-500"}>
                  Lounge Access
                </span>
                {primaryFare.loungeAccess ? <CheckCircle className="h-3 w-3 text-green-500" /> : <XCircle className="h-3 w-3 text-gray-400" />}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <ChevronUp className={cn("h-4 w-4", primaryFare.extraSeatSpace ? "text-green-500" : "text-gray-400")} />
                <span className={primaryFare.extraSeatSpace ? "text-green-700" : "text-gray-500"}>
                  Extra Seat Space
                </span>
                {primaryFare.extraSeatSpace ? <CheckCircle className="h-3 w-3 text-green-500" /> : <XCircle className="h-3 w-3 text-gray-400" />}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Plane className={cn("h-4 w-4", primaryFare.priorityBoarding ? "text-green-500" : "text-gray-400")} />
                <span className={primaryFare.priorityBoarding ? "text-green-700" : "text-gray-500"}>
                  Priority Boarding
                </span>
                {primaryFare.priorityBoarding ? <CheckCircle className="h-3 w-3 text-green-500" /> : <XCircle className="h-3 w-3 text-gray-400" />}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Users className={cn("h-4 w-4", primaryFare.preferredSeatChoice ? "text-green-500" : "text-gray-400")} />
                <span className={primaryFare.preferredSeatChoice ? "text-green-700" : "text-gray-500"}>
                  Preferred Seating
                </span>
                {primaryFare.preferredSeatChoice ? <CheckCircle className="h-3 w-3 text-green-500" /> : <XCircle className="h-3 w-3 text-gray-400" />}
              </div>
            </div>
          </div>
        )}

        {/* Seat Map Information */}
        {cabin.seatMap && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <LayoutGrid className="h-4 w-4 text-blue-600" />
              <span className="font-medium text-sm">Seat Configuration</span>
            </div>
            <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Total Rows:</span>
                  <span className="font-medium ml-2">{cabin.seatMap.totalRows}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Seats per Row:</span>
                  <span className="font-medium ml-2">{cabin.seatMap.seatsPerRow || 'Variable'}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Multiple Fares Available */}
        {cabin.fares && cabin.fares.length > 1 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-amber-600" />
              <span className="font-medium text-sm">Additional Fare Options</span>
            </div>
            <Badge variant="outline" className="bg-amber-50 text-amber-700">
              {cabin.fares.length - 1} more fare option{cabin.fares.length > 2 ? 's' : ''} available
            </Badge>
          </div>
        )}

        {/* Booking Information */}
        {(cabin.minAdvanceBookingDays || cabin.maxAdvanceBookingDays) && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-indigo-600" />
              <span className="font-medium text-sm">Booking Window</span>
            </div>
            <div className="text-xs text-muted-foreground bg-indigo-50 dark:bg-indigo-950/20 p-2 rounded">
              {cabin.minAdvanceBookingDays && `Min: ${cabin.minAdvanceBookingDays} days advance`}
              {cabin.minAdvanceBookingDays && cabin.maxAdvanceBookingDays && ' | '}
              {cabin.maxAdvanceBookingDays && `Max: ${cabin.maxAdvanceBookingDays} days advance`}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-4 border-t">
          <CabinQuickActions
            flightInstanceId={flightInstance.id}
            cabinId={cabin.id}
            cabin={cabin}
            variant="default"
            showSeats={true}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default FlightInstanceCabinCard;
