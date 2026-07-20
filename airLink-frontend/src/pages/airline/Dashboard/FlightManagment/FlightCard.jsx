import { Button } from "@/components/ui/button";
import { MapPin, TrendingUp, Eye, Trash2, Edit, Users, Clock, Plane, Building2 } from "lucide-react";
import React from "react";

const FlightCard = ({ flight, onEdit, onDelete, onView }) => {
  // Calculate available seats
  const totalSeats = flight.aircraft?.totalSeats || 0;
  const availableSeats = flight.totalAvailableSeats ?? totalSeats;
  const bookedSeats = totalSeats - availableSeats;
  const occupancyPercentage = totalSeats > 0 ? Math.round((bookedSeats / totalSeats) * 100) : 0;

  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="bg-muted p-3 rounded-lg">
            <Plane className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              {flight.flightNumber}
            </h3>
            <p className="text-sm text-muted-foreground">
              {flight.aircraft?.manufacturer} {flight.aircraft?.model}
            </p>
            <p className="text-xs text-muted-foreground">
              {flight.aircraft?.code} • {flight.aircraft?.totalSeats} seats
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`px-2 py-1 text-xs rounded font-medium ${
              flight.status === "SCHEDULED"
                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                : flight.status === "ACTIVE"
                ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {flight.status}
          </span>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {/* Route */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Route</span>
          </div>
          <div className="text-sm">
            <div className="font-medium text-foreground">
              {flight.departureAirport?.iataCode} → {flight.arrivalAirport?.iataCode}
            </div>
            <div className="text-muted-foreground text-xs">
              {flight.departureAirport?.city?.name} → {flight.arrivalAirport?.city?.name}
            </div>
          </div>
        </div>

        {/* Airline */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Airline</span>
          </div>
          <div className="text-sm">
            <div className="font-medium text-foreground">{flight.airline?.name}</div>
            <div className="text-muted-foreground text-xs">
              {flight.airline?.iataCode} • {flight.airline?.alliance}
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Pricing</span>
          </div>
          <div className="text-sm">
            {flight.lowestPrice ? (
              <>
                <div className="font-medium text-foreground">₹{flight.lowestPrice.toLocaleString()}</div>
                <div className="text-muted-foreground text-xs">Starting fare</div>
              </>
            ) : (
              <>
                <div className="font-medium text-muted-foreground">Not set</div>
                <div className="text-muted-foreground text-xs">Configure pricing</div>
              </>
            )}
          </div>
        </div>

        {/* Capacity */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Capacity</span>
          </div>
          <div className="text-sm">
            <div className="font-medium text-foreground">
              {bookedSeats} / {totalSeats} booked
            </div>
            <div className="text-muted-foreground text-xs">
              {occupancyPercentage}% occupancy
            </div>
          </div>
        </div>
      </div>

      {/* Aircraft Details */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4 p-3 bg-muted/50 rounded-lg">
        <div className="text-xs">
          <div className="text-muted-foreground">First Class</div>
          <div className="font-medium text-foreground">{flight.aircraft?.firstClassSeats || 0}</div>
        </div>
        <div className="text-xs">
          <div className="text-muted-foreground">Business</div>
          <div className="font-medium text-foreground">{flight.aircraft?.businessSeats || 0}</div>
        </div>
        <div className="text-xs">
          <div className="text-muted-foreground">Premium Economy</div>
          <div className="font-medium text-foreground">{flight.aircraft?.premiumEconomySeats || 0}</div>
        </div>
        <div className="text-xs">
          <div className="text-muted-foreground">Economy</div>
          <div className="font-medium text-foreground">{flight.aircraft?.economySeats || 0}</div>
        </div>
      </div>

      {/* Schedule Info */}
      {(flight.departureTime || flight.arrivalTime || flight.gate || flight.terminal) && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4 text-xs">
          {flight.departureTime && (
            <div>
              <div className="text-muted-foreground">Departure</div>
              <div className="font-medium text-foreground">
                {new Date(flight.departureTime).toLocaleString()}
              </div>
            </div>
          )}
          {flight.arrivalTime && (
            <div>
              <div className="text-muted-foreground">Arrival</div>
              <div className="font-medium text-foreground">
                {new Date(flight.arrivalTime).toLocaleString()}
              </div>
            </div>
          )}
          {flight.terminal && (
            <div>
              <div className="text-muted-foreground">Terminal</div>
              <div className="font-medium text-foreground">{flight.terminal}</div>
            </div>
          )}
          {flight.gate && (
            <div>
              <div className="text-muted-foreground">Gate</div>
              <div className="font-medium text-foreground">{flight.gate}</div>
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div className="text-sm text-muted-foreground">
          Last modified: {new Date(flight.updatedAt).toLocaleDateString()}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => onEdit(flight)}>
            <Edit className="h-3 w-3 mr-1" />
            Edit
          </Button>
          <Button variant="outline" size="sm" onClick={() => onView?.(flight)}>
            <Eye className="h-3 w-3 mr-1" />
            View
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(flight.id)}
            className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
          >
            <Trash2 className="h-3 w-3 mr-1" />
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FlightCard;
