import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Users,
  Settings,
  Eye,
  Edit,
  Wifi,
  Coffee,
  Monitor,
  Utensils,
  Plus,
} from "lucide-react";

const CabinCard = ({ cabin, onViewSeatmap, onEdit, onCreateSeatMap }) => {
  
  const getStatusColor = (isActive) => {
    return isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  };
     
  

  const getCabinClassColor = (cabinClass) => {
    switch (cabinClass?.toLowerCase()) {
      case "first":
      case "first_class":
        return "bg-purple-100 text-purple-800";
      case "business":
        return "bg-blue-100 text-blue-800";
      case "premium_economy":
        return "bg-orange-100 text-orange-800";
      case "economy":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatCabinClassName = (name) => {
    if (!name) return "Unknown";
    return name.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const getAmenityIcon = (amenity) => {
    const amenityLower = amenity.toLowerCase();
    if (amenityLower.includes("wifi") || amenityLower.includes("internet"))
      return Wifi;
    if (amenityLower.includes("meal") || amenityLower.includes("food"))
      return Utensils;
    if (
      amenityLower.includes("entertainment") ||
      amenityLower.includes("screen")
    )
      return Monitor;
    if (amenityLower.includes("beverage") || amenityLower.includes("drink"))
      return Coffee;
    return Settings;
  };

  const renderAmenities = (amenities) => {
    if (!amenities || amenities.length === 0) return null;

    return (
      <div className="flex flex-wrap gap-1 mt-2">
        {amenities.slice(0, 4).map((amenity, index) => {
          const IconComponent = getAmenityIcon(amenity);
          return (
            <div
              key={index}
              className="flex items-center text-xs bg-gray-100 px-2 py-1 rounded"
            >
              <IconComponent className="h-3 w-3 mr-1" />
              {amenity}
            </div>
          );
        })}
        {amenities.length > 4 && (
          <div className="text-xs text-gray-500 px-2 py-1">
            +{amenities.length - 4} more
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className="h-full hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg flex items-center">
              {cabin.name ||
                `${formatCabinClassName(
                  cabin.name?.toLowerCase()
                )} Cabin`}
            </CardTitle>
            <div className="flex items-center space-x-2 mt-1">
              <Badge
                className={getCabinClassColor(cabin.name?.toLowerCase())}
              >
                {formatCabinClassName(cabin.name?.toLowerCase())}
              </Badge>
              <Badge className={getStatusColor(cabin.isActive)} variant="outline">
                {cabin.isActive? "Active":" Inactive"}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Seat Information */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500 flex items-center">
              <Users className="h-4 w-4 mr-1" />
              Total Seats
            </p>
            <p className="font-semibold text-lg">
              {cabin?.seatMap?.totalSeats || cabin.seatCount || 0}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              Available Seats
            </p>
            <p className="font-semibold text-lg">
              {cabin?.seatMap?.availableSeats || cabin?.seatMap?.totalSeats || cabin.seatCount || 0}
            </p>
          </div>
        </div>

        {/* Seat Map Information */}
        {cabin?.seatMap && (
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Total Rows</p>
                <p className="font-medium">{cabin.seatMap.totalRows || 'N/A'}</p>
              </div>
              <div>
                <p className="text-gray-500">Seats/Row</p>
                <p className="font-medium">{cabin.seatMap.seatsPerRow || 'Varies'}</p>
              </div>
            </div>
            {cabin.seatMap.name && (
              <div className="mt-2">
                <p className="text-gray-500 text-xs">Layout: {cabin.seatMap.name}</p>
              </div>
            )}
          </div>
        )}

        {/* Cabin Configuration */}
        {(cabin.seatsPerRow || cabin.seatConfiguration) && (
          <div>
            <p className="text-sm text-gray-500">Configuration</p>
            <p className="font-medium">
              {cabin.seatConfiguration || `${cabin.seatsPerRow} seats per row`}
            </p>
          </div>
        )}

        {/* Seat Pitch & Width */}
        {(cabin.seatPitch || cabin.seatWidth) && (
          <div className="grid grid-cols-2 gap-4">
            {cabin.seatPitch && (
              <div>
                <p className="text-sm text-gray-500">Seat Pitch</p>
                <p className="font-medium">{cabin.seatPitch}"</p>
              </div>
            )}
            {cabin.seatWidth && (
              <div>
                <p className="text-sm text-gray-500">Seat Width</p>
                <p className="font-medium">{cabin.seatWidth}"</p>
              </div>
            )}
          </div>
        )}

        {/* Amenities */}
        {cabin.amenities && cabin.amenities.length > 0 && (
          <div>
            <p className="text-sm text-gray-500">Amenities</p>
            {renderAmenities(cabin.amenities)}
          </div>
        )}

        {/* Status Flags */}
        <div className="flex flex-wrap gap-2">
          {cabin.isBookable !== undefined && (
            <Badge variant={cabin.isBookable ? "default" : "secondary"}>
              {cabin.isBookable ? "Bookable" : "Not Bookable"}
            </Badge>
          )}
          {cabin.isActive !== undefined && (
            <Badge variant={cabin.isActive ? "default" : "secondary"}>
              {cabin.isActive ? "Active" : "Inactive"}
            </Badge>
          )}
          {!cabin?.seatMap && (
            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
              No Seat Map
            </Badge>
          )}
          {cabin?.seatMap && (!cabin.seatMap.seats || cabin.seatMap.seats.length === 0) && (
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              Empty Seat Map
            </Badge>
          )}
        </div>

        {/* Actions */}
        <div className="flex space-x-2 pt-2">
          {cabin?.seatMap ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewSeatmap(cabin)}
                className="flex-1"
              >
                <Eye className="h-4 w-4 mr-2" />
                View Seatmap
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(cabin)}
                className="flex-1"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="default"
                size="sm"
                onClick={() => onCreateSeatMap(cabin)}
                className="flex-1"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Seat Map
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(cabin)}
                className="flex-1"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CabinCard;
