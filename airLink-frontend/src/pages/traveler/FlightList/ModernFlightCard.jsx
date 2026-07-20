import * as React from "react";
import {
  Clock,
  Plane,
  ChevronDown,
  ChevronUp,
  MapPin,
  Luggage,
  Utensils,
  Shield,
  Star,
  Wifi,
  Zap,
  Info,
  Bookmark,
  BookmarkCheck,
  DollarSign,
  Check,
  X,
  Coffee,
  Tv,
  Users,
  CreditCard,
  Calendar,
  AlertCircle,
  PackageCheck,
  Armchair,
  BadgeCheck,
  FastForward,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import FlightPricingModal from "./FlightPricing/FlightPricingModal";

const ModernFlightCard = ({
  flight,
  cabinClass,
  onViewDetails,
  onBookmark,
  isBookmarked = false,
  className,
  viewMode = "list",
}) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [isPricingModalOpen, setIsPricingModalOpen] = React.useState(false);

 



  const formatTime = (timeString) => {
    return new Date(timeString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const formatDate = (timeString) => {
    return new Date(timeString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

 

  const getBadges = () => {
    const badges = [];

  
      const fare = flight.fare;

      if (fare?.baseFare < 5000 || fare?.currentPrice < 5000)
        badges.push({ text: "Best Price", color: "bg-emerald-500", icon: DollarSign });

      if (fare?.fareRules?.isRefundable)
        badges.push({ text: "Refundable", color: "bg-blue-500", icon: Shield });

      if (flight.stops === 0 || !flight.stops)
        badges.push({ text: "Non-stop", color: "bg-violet-500", icon: Zap });

      if (flight.availableSeats && flight.availableSeats < 10) {
        badges.push({
          text: `${flight.availableSeats} seats left`,
          color: "bg-rose-500",
          icon: AlertCircle,
        });
      }

      if (fare?.fareLabel) {
        badges.push({
          text: fare.fareLabel,
          color: "bg-indigo-500",
          icon: Star,
        });
      }
    

    return badges;
  };


  const badges = getBadges();
  const fare = flight.fare;

  const amenities = [
    {
      id: "baggage",
      label: "Baggage",
      value: fare?.baggagePolicy,
      icon: Luggage,
      color: "text-blue-600",
      
    },
    {
      id: "meals",
      label: "Complimentary Meals",
      value: fare?.complimentaryMeals,
      icon: Utensils,
      color: "text-orange-600",
    },
    {
      id: "beverages",
      label: "Beverages",
      value: fare?.complimentaryBeverages,
      icon: Coffee,
      color: "text-amber-600",
    },
    {
      id: "wifi",
      label: "In-flight WiFi",
      value: fare?.inFlightInternet,
      icon: Wifi,
      color: "text-cyan-600",
    },
    {
      id: "entertainment",
      label: "Entertainment",
      value: fare?.inFlightEntertainment,
      icon: Tv,
      color: "text-purple-600",
    },
    {
      id: "lounge",
      label: "Lounge Access",
      value: fare?.loungeAccess,
      icon: Star,
      color: "text-yellow-600",
    },
    {
      id: "priority-boarding",
      label: "Priority Boarding",
      value: fare?.priorityBoarding,
      icon: FastForward,
      color: "text-indigo-600",
    },
    {
      id: "priority-checkin",
      label: "Priority Check-in",
      value: fare?.priorityCheckin,
      icon: BadgeCheck,
      color: "text-green-600",
    },
    {
      id: "extra-space",
      label: "Extra Seat Space",
      value: fare?.extraSeatSpace,
      icon: Armchair,
      color: "text-emerald-600",
    },
    {
      id: "seat-selection",
      label: "Advance Seat Selection",
      value: fare?.advanceSeatSelection,
      icon: Users,
      color: "text-slate-600",
    },
    {
      id: "preferred-seat",
      label: "Preferred Seat Choice",
      value: fare?.preferredSeatChoice,
      icon: Sparkles,
      color: "text-pink-600",
    },
    {
      id: "seat-together",
      label: "Guaranteed Seats Together",
      value: fare?.guaranteedSeatTogether,
      icon: Users,
      color: "text-blue-600",
    },
    {
      id: "premium-meal",
      label: "Premium Meal Choice",
      value: fare?.premiumMealChoice,
      icon: Utensils,
      color: "text-red-600",
    },
    {
      id: "fast-track",
      label: "Fast Track Security",
      value: fare?.fastTrackSecurity,
      icon: Zap,
      color: "text-yellow-600",
    },
    {
      id: "date-change",
      label: "Free Date Change",
      value: fare?.freeDateChange,
      icon: Calendar,
      color: "text-blue-600",
    },
    {
      id: "airport-transfer",
      label: "Airport Transfer",
      value: fare?.airportTransfer,
      icon: MapPin,
      color: "text-green-600",
    },
  ];

  const enabledAmenities = amenities.filter((a) => a.value === true);

  return (
    <Card
      className={cn(
        "group transition-all duration-300 hover:shadow-xl hover:border-primary/30 bg-card border-border overflow-hidden",
        viewMode === "grid" && "max-w-md",
        className
      )}
    >
      <CardContent className="p-0">
        {/* Header Section with Gradient */}
        <div className="relative bg-gradient-to-r from-primary/5 via-primary/3 to-transparent border-b border-border">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-4">
              {/* Airline Logo */}
              <div className="relative">
                <div className="ring-2 ring-primary/20 rounded-full p-1 bg-background">
                  <Avatar className="h-14 w-14">
                    <AvatarImage
                      src={flight?.airlineLogo || flight?.airlineLogoUrl}
                      alt={flight.airlineName}
                    />
                    <AvatarFallback className="text-lg font-semibold bg-primary/10 text-primary">
                      {flight.airlineName?.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>

              {/* Airline Details */}
              <div>
                <h3 className="font-bold text-foreground text-xl group-hover:text-primary transition-colors">
                  {flight.airlineName}
                </h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-0.5">
                  <span className="font-medium">{flight.flightNumber}</span>
                  <span>•</span>
                  <span className="capitalize">
                    {fare?.cabinClass?.replace("_", " ") || cabinClass || "Economy"}
                  </span>
                  {fare?.rbdCode && (
                    <>
                      <span>•</span>
                      <span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">
                        {fare.rbdCode}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Badges & Bookmark */}
            <div className="flex items-center gap-2 flex-wrap justify-end">
              {badges.slice(0, 3).map((badge, index) => {
                const IconComponent = badge.icon;
                return (
                  <Badge
                    key={index}
                    className={cn(
                      "px-3 py-1 text-xs font-semibold text-white gap-1.5",
                      badge.color
                    )}
                  >
                    {IconComponent && <IconComponent className="h-3 w-3" />}
                    {badge.text}
                  </Badge>
                );
              })}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onBookmark?.(flight)}
                className="p-2 hover:bg-primary/10"
              >
                {isBookmarked ? (
                  <BookmarkCheck className="h-5 w-5 text-primary fill-primary" />
                ) : (
                  <Bookmark className="h-5 w-5 text-muted-foreground hover:text-primary" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Flight Route Section */}
        <div className="p-6">
          <div className="grid grid-cols-[1fr_auto_1fr] gap-6 items-center">
            {/* Departure Info */}
            <div className="text-left space-y-2">
              <div className="text-4xl font-bold text-foreground tracking-tight">
                {formatTime(flight.departureDateTime)}
              </div>
              <div className="flex items-center gap-2 text-base font-semibold text-foreground">
                <MapPin className="h-4 w-4 text-primary" />
                <span>{flight.departureAirport?.iataCode}</span>
              </div>
              <div className="text-sm text-muted-foreground font-medium">
                {flight.departureAirport?.name}
              </div>
              <div className="text-sm text-muted-foreground">
                {formatDate(flight.departureDateTime)}
              </div>
            </div>

            {/* Duration & Stops */}
            <div className="flex flex-col items-center min-w-[200px] px-4">
              <div className="text-sm font-semibold text-muted-foreground mb-3">
                {flight.formattedDuration}
              </div>

              {/* Flight Path Visualization */}
              <div className="relative w-full flex items-center">
                <div className="w-3 h-3 rounded-full bg-primary ring-4 ring-primary/20"></div>
                <div className="flex-1 relative">
                  <div className="h-1 bg-gradient-to-r from-primary via-primary/60 to-primary w-full rounded-full"></div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background rounded-full p-1.5 shadow-lg ring-2 ring-primary/30">
                    <Plane className="h-5 w-5 text-primary" />
                  </div>
                  {(flight.totalStops || flight.stops || 0) > 0 && (
                    <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-2.5 h-2.5 bg-amber-500 rounded-full ring-2 ring-amber-100"></div>
                  )}
                </div>
                <div className="w-3 h-3 rounded-full bg-primary ring-4 ring-primary/20"></div>
              </div>

             
            </div>

            {/* Arrival Info */}
            <div className="text-right space-y-2">
              <div className="text-4xl font-bold text-foreground tracking-tight">
                {formatTime(flight.arrivalDateTime)}
              </div>
              <div className="flex items-center justify-end gap-2 text-base font-semibold text-foreground">
                <span>{flight.arrivalAirport?.iataCode}</span>
                <MapPin className="h-4 w-4 text-primary" />
              </div>
              <div className="text-sm text-muted-foreground font-medium">
                {flight.arrivalAirport?.name}
              </div>
              <div className="text-sm text-muted-foreground">
                {formatDate(flight.arrivalDateTime)}
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Pricing & CTA Section */}
        <div className="p-6 bg-muted/30">
          <div className="flex items-center justify-between gap-6">
            {/* Price & Fare Info */}
            <div className="space-y-1">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-primary">
                  ₹{fare?.currentPrice?.toLocaleString() || fare?.totalPrice?.toLocaleString()}
                </span>
                {fare?.baseFare !== fare?.currentPrice && (
                  <span className="text-lg text-muted-foreground line-through">
                    ₹{fare?.baseFare?.toLocaleString()}
                  </span>
                )}
              </div>
              <div className="text-sm text-muted-foreground">per person</div>
              {fare?.name && (
                <Badge variant="outline" className="text-xs font-medium mt-1">
                  {fare.name}
                </Badge>
              )}
            </div>

            {/* Available Seats Info */}
            <div className="text-center px-4 py-2 bg-background rounded-lg border border-border">
              <div className="text-2xl font-bold text-primary">{flight.availableSeats}</div>
              <div className="text-xs text-muted-foreground font-medium">seats available</div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="lg"
                onClick={() => {
                  setIsExpanded(!isExpanded);
                  onViewDetails?.(flight);
                }}
                className="gap-2"
              >
                Details
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="default"
                size="lg"
                onClick={() => setIsPricingModalOpen(true)}
                className="gap-2 min-w-[140px]"
              >
                <DollarSign className="h-5 w-5" />
                Select Flight
              </Button>
            </div>
          </div>
        </div>

        {/* Expandable Details Section */}
        {isExpanded && (
          <div className="border-t border-border bg-muted/20 animate-in slide-in-from-top-2 fade-in duration-300">
            <Tabs defaultValue="amenities" className="p-6">
              <TabsList className="grid w-full grid-cols-4 mb-6">
                <TabsTrigger value="amenities">Amenities</TabsTrigger>
                <TabsTrigger value="fare">Fare Details</TabsTrigger>
                <TabsTrigger value="baggage">Baggage</TabsTrigger>
                <TabsTrigger value="rules">Fare Rules</TabsTrigger>
              </TabsList>

              {/* Amenities Tab */}
              <TabsContent value="amenities" className="space-y-4">
                <div>
                  <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    Included Amenities & Services
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {enabledAmenities.map((amenity) => {
                      const IconComponent = amenity.icon;
                      return (
                        <div
                          key={amenity.id}
                          className="flex items-center gap-3 p-3 bg-background rounded-lg border border-border hover:border-primary/30 transition-colors"
                        >
                          <div
                            className={cn(
                              "p-2 rounded-lg bg-muted/50",
                              amenity.value ? amenity.color : "text-muted-foreground"
                            )}
                          >
                            <IconComponent className="h-5 w-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div
                              className={cn(
                                "text-sm font-medium leading-tight",
                                amenity.value ? "text-foreground" : "text-muted-foreground"
                              )}
                            >
                              {amenity.label}
                            </div>
                          </div>
                          {amenity.value ? (
                            <Check className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                          ) : (
                            <X className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Additional Flight Info */}
                <Separator className="my-6" />
                <div>
                  <h4 className="font-semibold text-foreground mb-4">Flight Information</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                    <div className="p-3 bg-background rounded-lg border border-border">
                      <div className="text-muted-foreground mb-1">Aircraft</div>
                      <div className="font-semibold text-foreground">Boeing 737-800</div>
                    </div>
                    <div className="p-3 bg-background rounded-lg border border-border">
                      <div className="text-muted-foreground mb-1">On-time Performance</div>
                      <div className="font-semibold text-emerald-600">94%</div>
                    </div>
                    <div className="p-3 bg-background rounded-lg border border-border">
                      <div className="text-muted-foreground mb-1">Carbon Footprint</div>
                      <div className="font-semibold text-foreground">285 kg CO₂</div>
                      <div className="text-xs text-emerald-600 mt-0.5">22% below average</div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Fare Details Tab */}
              <TabsContent value="fare" className="space-y-4">
                <div>
                  <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-primary" />
                    Fare Breakdown
                  </h4>
                  <div className="bg-background rounded-lg border border-border p-4 space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Base Fare</span>
                      <span className="font-semibold text-foreground">
                        ₹{fare?.baseFare?.toLocaleString()}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Taxes & Fees</span>
                      <span className="font-semibold text-foreground">
                        ₹{fare?.taxesAndFees?.toLocaleString()}
                      </span>
                    </div>
                    {fare?.airlineFees > 0 && (
                      <>
                        <Separator />
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-muted-foreground">Airline Fees</span>
                          <span className="font-semibold text-foreground">
                            ₹{fare?.airlineFees?.toLocaleString()}
                          </span>
                        </div>
                      </>
                    )}
                    <Separator className="my-3" />
                    <div className="flex justify-between items-center pt-2">
                      <span className="font-bold text-foreground text-lg">Total Price</span>
                      <span className="font-bold text-primary text-2xl">
                        ₹{fare?.totalPrice?.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Price Breakdown Info */}
                  <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="flex items-start gap-3">
                      <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-blue-900 dark:text-blue-100">
                        <p className="font-medium mb-1">About this fare</p>
                        <p className="text-blue-700 dark:text-blue-300">
                          This is a {fare?.fareLabel || "standard"} fare. The final price includes all
                          mandatory taxes and fees. Additional services can be added during checkout.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Baggage Tab */}
              <TabsContent value="baggage" className="space-y-4">
                <div>
                  <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Luggage className="h-5 w-5 text-primary" />
                    Baggage Policy
                  </h4>
                  {fare?.baggagePolicy ? (
                    <div className="space-y-4">
                      {/* Policy Name */}
                      <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                        <h5 className="font-semibold text-foreground mb-1">
                          {fare.baggagePolicy.name}
                        </h5>
                        <p className="text-sm text-muted-foreground">
                          {fare.baggagePolicy.description}
                        </p>
                      </div>

                      {/* Cabin Baggage */}
                      <div className="bg-background rounded-lg border border-border p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <PackageCheck className="h-5 w-5 text-blue-600" />
                          <h5 className="font-semibold text-foreground">Cabin Baggage</h5>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="text-muted-foreground mb-1">Number of Pieces</div>
                            <div className="font-semibold text-foreground text-lg">
                              {fare.baggagePolicy.cabinBaggagePieces}
                            </div>
                          </div>
                          <div>
                            <div className="text-muted-foreground mb-1">Max Weight</div>
                            <div className="font-semibold text-foreground text-lg">
                              {fare.baggagePolicy.cabinBaggageMaxWeight} kg
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Checked Baggage */}
                      <div className="bg-background rounded-lg border border-border p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Luggage className="h-5 w-5 text-purple-600" />
                          <h5 className="font-semibold text-foreground">Checked Baggage</h5>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="text-muted-foreground mb-1">Number of Pieces</div>
                            <div className="font-semibold text-foreground text-lg">
                              {fare.baggagePolicy.checkedBaggagePieces}
                            </div>
                          </div>
                          <div>
                            <div className="text-muted-foreground mb-1">Max Weight per Piece</div>
                            <div className="font-semibold text-foreground text-lg">
                              {fare.baggagePolicy.checkedBaggageMaxWeight} kg
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Additional Info */}
                      {fare.baggagePolicy.additionalBaggageFee && (
                        <div className="p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
                          <div className="flex items-start gap-3">
                            <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                            <div className="text-sm">
                              <p className="font-medium text-amber-900 dark:text-amber-100 mb-1">
                                Additional Baggage
                              </p>
                              <p className="text-amber-700 dark:text-amber-300">
                                Extra baggage can be added for ₹
                                {fare.baggagePolicy.additionalBaggageFee} per piece (subject to
                                availability).
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-8 text-center text-muted-foreground">
                      <Luggage className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>Baggage policy information not available</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Fare Rules Tab */}
              <TabsContent value="rules" className="space-y-4">
                <div>
                  <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    Fare Rules & Policies
                  </h4>
                  {fare?.fareRules ? (
                    <div className="space-y-4">
                      {/* Rule Name */}
                      <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                        <h5 className="font-semibold text-foreground">
                          {fare.fareRules.ruleName}
                        </h5>
                      </div>

                      {/* Refund Policy */}
                      <div className="bg-background rounded-lg border border-border overflow-hidden">
                        <div className="p-4 bg-muted/50 border-b border-border">
                          <h5 className="font-semibold text-foreground flex items-center gap-2">
                            <CreditCard className="h-4 w-4" />
                            Refund Policy
                          </h5>
                        </div>
                        <div className="p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Refundable</span>
                            <div className="flex items-center gap-2">
                              {fare.fareRules.isRefundable ? (
                                <>
                                  <Check className="h-4 w-4 text-emerald-600" />
                                  <span className="text-sm font-semibold text-emerald-600">
                                    Yes
                                  </span>
                                </>
                              ) : (
                                <>
                                  <X className="h-4 w-4 text-rose-600" />
                                  <span className="text-sm font-semibold text-rose-600">No</span>
                                </>
                              )}
                            </div>
                          </div>

                          {fare.fareRules.cancellationFee !== null && (
                            <>
                              <Separator />
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">
                                  Cancellation Fee
                                </span>
                                <span className="text-sm font-semibold text-foreground">
                                  ₹{fare.fareRules.cancellationFee}
                                </span>
                              </div>
                            </>
                          )}

                          {fare.fareRules.refundProcessingTime && (
                            <>
                              <Separator />
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">
                                  Refund Processing Time
                                </span>
                                <span className="text-sm font-semibold text-foreground">
                                  {fare.fareRules.refundProcessingTime}
                                </span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Change Policy */}
                      <div className="bg-background rounded-lg border border-border overflow-hidden">
                        <div className="p-4 bg-muted/50 border-b border-border">
                          <h5 className="font-semibold text-foreground flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            Change Policy
                          </h5>
                        </div>
                        <div className="p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">
                              Changes Permitted
                            </span>
                            <div className="flex items-center gap-2">
                              {fare.fareRules.isChangeable ? (
                                <>
                                  <Check className="h-4 w-4 text-emerald-600" />
                                  <span className="text-sm font-semibold text-emerald-600">
                                    Yes
                                  </span>
                                </>
                              ) : (
                                <>
                                  <X className="h-4 w-4 text-rose-600" />
                                  <span className="text-sm font-semibold text-rose-600">No</span>
                                </>
                              )}
                            </div>
                          </div>

                          {fare.fareRules.changeFee !== null && (
                            <>
                              <Separator />
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Change Fee</span>
                                <span className="text-sm font-semibold text-foreground">
                                  ₹{fare.fareRules.changeFee}
                                </span>
                              </div>
                            </>
                          )}

                          {fare.fareRules.deadlineBeforeDeparture && (
                            <>
                              <Separator />
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">
                                  Change Deadline
                                </span>
                                <span className="text-sm font-semibold text-foreground">
                                  {fare.fareRules.deadlineBeforeDeparture} before departure
                                </span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Additional Notes */}
                      {fare.fareRules.additionalNotes && (
                        <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                          <div className="flex items-start gap-3">
                            <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                            <div className="text-sm">
                              <p className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                                Important Information
                              </p>
                              <p className="text-blue-700 dark:text-blue-300">
                                {fare.fareRules.additionalNotes}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-8 text-center text-muted-foreground">
                      <Shield className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>Fare rules information not available</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </CardContent>

      {/* Pricing Modal */}
      {isPricingModalOpen && (
        <FlightPricingModal
          isOpen={isPricingModalOpen}
          onClose={() => setIsPricingModalOpen(false)}
          flight={flight}
          
        />
      )}
    </Card>
  );
};

export default ModernFlightCard;
