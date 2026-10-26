import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  TrendingUp, 
  Eye, 
  Trash2, 
  Edit, 
  Users, 
  Clock, 
  Plane, 
  Building2, 
  ArrowRight,
  Calendar
} from "lucide-react";
import React from "react";

const FlightCard = ({ flight, onEdit, onDelete, onView }) => {
  // Calculate total and available seats safely
  const totalSeats = Number(flight.aircraft?.seatingCapacity || flight.aircraft?.totalSeats || 0);
  const availableSeats = Number(flight.totalAvailableSeats ?? totalSeats);
  const bookedSeats = Math.max(0, totalSeats - availableSeats);
  const occupancyPercentage = totalSeats > 0 ? Math.round((bookedSeats / totalSeats) * 100) : 0;

  const rawStatus = flight.status === 0 || flight.status === '0' ? 'SCHEDULED' : (flight.status || 'SCHEDULED');
  const statusStr = String(rawStatus).toUpperCase();

  const getStatusBadge = () => {
    switch (statusStr) {
      case 'SCHEDULED':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-950/60 dark:text-green-300 border-none">SCHEDULED</Badge>;
      case 'ACTIVE':
      case 'IN_AIR':
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-none">{statusStr}</Badge>;
      case 'BOARDING':
        return <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-none">BOARDING</Badge>;
      case 'DELAYED':
        return <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-950/60 dark:text-orange-300 border-none">DELAYED</Badge>;
      case 'CANCELLED':
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300 border-none">CANCELLED</Badge>;
      default:
        return <Badge variant="outline">{statusStr}</Badge>;
    }
  };

  const handleDeleteClick = () => {
    if (window.confirm(`Are you sure you want to delete flight ${flight.flightNumber}?`)) {
      onDelete?.(flight.id);
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl p-5 hover:shadow-md transition-all shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3.5">
          <div className="bg-primary/10 text-primary p-3 rounded-xl flex items-center justify-center">
            <Plane className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-foreground tracking-tight">
                {flight.flightNumber}
              </h3>
              {flight.airline?.name && (
                <span className="text-xs text-muted-foreground font-medium">
                  ({flight.airline.name})
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {flight.aircraft?.manufacturer} {flight.aircraft?.model} • <span className="font-semibold text-foreground">{flight.aircraft?.code}</span> • {totalSeats} seats
            </p>
          </div>
        </div>

        <div>
          {getStatusBadge()}
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4 p-3.5 bg-muted/30 rounded-xl border border-border/50">
        {/* Route */}
        <div>
          <div className="flex items-center gap-1.5 mb-1.5 text-xs font-semibold text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 text-blue-500" />
            <span>Route</span>
          </div>
          <div className="text-sm">
            <div className="font-bold text-foreground flex items-center gap-1.5">
              <span>{flight.departureAirport?.iataCode || 'DEP'}</span>
              <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
              <span>{flight.arrivalAirport?.iataCode || 'ARR'}</span>
            </div>
            <div className="text-muted-foreground text-xs truncate mt-0.5">
              {flight.departureAirport?.city?.name || 'Origin'} → {flight.arrivalAirport?.city?.name || 'Destination'}
            </div>
          </div>
        </div>

        {/* Airline / Operator */}
        <div>
          <div className="flex items-center gap-1.5 mb-1.5 text-xs font-semibold text-muted-foreground">
            <Building2 className="h-3.5 w-3.5 text-purple-500" />
            <span>Airline</span>
          </div>
          <div className="text-sm">
            <div className="font-semibold text-foreground truncate">
              {flight.airline?.name || 'AirLink'}
            </div>
            <div className="text-muted-foreground text-xs mt-0.5">
              Code: {flight.airline?.iataCode || 'AL'} {flight.airline?.alliance ? `• ${flight.airline.alliance}` : ''}
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div>
          <div className="flex items-center gap-1.5 mb-1.5 text-xs font-semibold text-muted-foreground">
            <TrendingUp className="h-3.5 w-3.5 text-green-500" />
            <span>Pricing</span>
          </div>
          <div className="text-sm">
            {flight.lowestPrice ? (
              <>
                <div className="font-bold text-foreground">₹{Number(flight.lowestPrice).toLocaleString('en-IN')}</div>
                <div className="text-muted-foreground text-xs mt-0.5">Starting fare</div>
              </>
            ) : (
              <>
                <div className="font-medium text-amber-600 dark:text-amber-400">Not set</div>
                <div className="text-muted-foreground text-xs mt-0.5">Standard dynamic fare</div>
              </>
            )}
          </div>
        </div>

        {/* Capacity */}
        <div>
          <div className="flex items-center gap-1.5 mb-1.5 text-xs font-semibold text-muted-foreground">
            <Users className="h-3.5 w-3.5 text-indigo-500" />
            <span>Capacity</span>
          </div>
          <div className="text-sm">
            <div className="font-bold text-foreground">
              {availableSeats} available / {totalSeats} seats
            </div>
            <div className="text-muted-foreground text-xs mt-0.5">
              {bookedSeats} booked ({occupancyPercentage}% occupancy)
            </div>
          </div>
        </div>
      </div>

      {/* Aircraft Cabin Breakdown */}
      {flight.aircraft && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4 p-2.5 bg-muted/20 rounded-lg text-xs">
          <div>
            <span className="text-muted-foreground block text-[11px]">First Class</span>
            <span className="font-semibold text-foreground">{flight.aircraft.firstClassSeats || flight.aircraft.firstClassSeat || 0} seats</span>
          </div>
          <div>
            <span className="text-muted-foreground block text-[11px]">Business</span>
            <span className="font-semibold text-foreground">{flight.aircraft.businessSeats || 0} seats</span>
          </div>
          <div>
            <span className="text-muted-foreground block text-[11px]">Prem. Economy</span>
            <span className="font-semibold text-foreground">{flight.aircraft.premiumEconomySeats || 0} seats</span>
          </div>
          <div>
            <span className="text-muted-foreground block text-[11px]">Economy</span>
            <span className="font-semibold text-foreground">{flight.aircraft.economySeats || 0} seats</span>
          </div>
        </div>
      )}

      {/* Schedule Info */}
      {(flight.departureTime || flight.arrivalTime || flight.gate || flight.terminal) && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4 text-xs bg-muted/20 p-2.5 rounded-lg">
          {flight.departureTime && (
            <div>
              <div className="text-muted-foreground">Departure</div>
              <div className="font-semibold text-foreground mt-0.5">
                {new Date(flight.departureTime).toLocaleString()}
              </div>
            </div>
          )}
          {flight.arrivalTime && (
            <div>
              <div className="text-muted-foreground">Arrival</div>
              <div className="font-semibold text-foreground mt-0.5">
                {new Date(flight.arrivalTime).toLocaleString()}
              </div>
            </div>
          )}
          {flight.terminal && (
            <div>
              <div className="text-muted-foreground">Terminal</div>
              <div className="font-semibold text-foreground mt-0.5">{flight.terminal}</div>
            </div>
          )}
          {flight.gate && (
            <div>
              <div className="text-muted-foreground">Gate</div>
              <div className="font-semibold text-foreground mt-0.5">{flight.gate}</div>
            </div>
          )}
        </div>
      )}

      {/* Footer Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-3.5 border-t border-border gap-2">
        <div className="text-xs text-muted-foreground">
          {flight.updatedAt ? `Last modified: ${new Date(flight.updatedAt).toLocaleDateString()}` : 'Scheduled flight'}
        </div>
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <Button variant="outline" size="sm" onClick={() => onView?.(flight)} className="h-8 text-xs">
            <Eye className="h-3.5 w-3.5 mr-1" />
            View
          </Button>
          <Button variant="outline" size="sm" onClick={() => onEdit?.(flight)} className="h-8 text-xs">
            <Edit className="h-3.5 w-3.5 mr-1" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDeleteClick}
            className="h-8 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-3.5 w-3.5 mr-1" />
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FlightCard;
