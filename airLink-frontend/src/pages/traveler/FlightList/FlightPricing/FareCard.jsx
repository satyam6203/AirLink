import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Check,
  X,
  Info,
  Luggage,
  UtensilsCrossed,
  Wifi,
  Tv,
  Armchair,
  Shield,
  Calendar,
  Clock,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Ban,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  CalendarClock,
  Plane,
  Award,
  Coffee,
  Soup,
  Wine,
  Briefcase,
  Zap,
  Crown,
  Star,
  TrendingUp,
  RefreshCw,
  DollarSign,
  Package,
  Headphones,
  Music,
  Radio,
  Users,
  MapPin,
  Navigation,
} from "lucide-react";
import React, { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

const FareCard = ({ fare, isSelected, onSelect, passengerCount = 1 }) => {


  const calculateTotalPrice = (farePrice) => {
    return farePrice * (passengerCount || 1);
  };

  // Organize benefits by category with rich details
  const getBenefitCategories = (fare) => {
    const categories = {
      flexibility: {
        title: "Flexibility & Changes",
        icon: RefreshCw,
        color: "text-emerald-600",
        bgColor: "bg-emerald-50",
        borderColor: "border-emerald-200",
        items: [],
      },
      baggage: {
        title: "Baggage Allowance",
        icon: Luggage,
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
        items: [],
      },
      meals: {
        title: "Food & Beverages",
        icon: UtensilsCrossed,
        color: "text-orange-600",
        bgColor: "bg-orange-50",
        borderColor: "border-orange-200",
        items: [],
      },
      seating: {
        title: "Seat Comfort",
        icon: Armchair,
        color: "text-purple-600",
        bgColor: "bg-purple-50",
        borderColor: "border-purple-200",
        items: [],
      },
      priority: {
        title: "Priority Services",
        icon: Crown,
        color: "text-amber-600",
        bgColor: "bg-amber-50",
        borderColor: "border-amber-200",
        items: [],
      },
      entertainment: {
        title: "Entertainment & Extras",
        icon: Tv,
        color: "text-pink-600",
        bgColor: "bg-pink-50",
        borderColor: "border-pink-200",
        items: [],
      },
    };

    // Flexibility & Changes
    if (fare.fullRefund) {
      categories.flexibility.items.push({
        icon: ShieldCheck,
        text: "Full Refund",
        subtext: "Get 100% money back",
        value: true,
      });
    }
    if (fare.partialRefund) {
      categories.flexibility.items.push({
        icon: Shield,
        text: "Partial Refund",
        subtext: "Refundable with fees",
        value: true,
      });
    }
    if (fare.freeDateChange) {
      categories.flexibility.items.push({
        icon: CalendarClock,
        text: "Free Date Change",
        subtext: "Change dates anytime",
        value: true,
      });
    }
    if (fare.fareRules?.isRefundable) {
      categories.flexibility.items.push({
        icon: RefreshCw,
        text: "Refundable Fare",
        subtext: fare.fareRules.refundDeadlineDays
          ? `Within ${fare.fareRules.refundDeadlineDays} days`
          : "According to policy",
        value: true,
      });
    } else {
      categories.flexibility.items.push({
        icon: Ban,
        text: "Non-Refundable",
        subtext: "Cannot be refunded",
        value: false,
      });
    }

    if (fare.fareRules?.changeFee !== undefined) {
      categories.flexibility.items.push({
        icon: DollarSign,
        text: `Date Change: ₹${fare.fareRules.changeFee}`,
        subtext: fare.fareRules.changeDeadlineHours
          ? `${fare.fareRules.changeDeadlineHours}h before departure`
          : "Per change request",
        value: fare.fareRules.changeFee === 0,
      });
    }

    // Baggage
    if (fare.baggagePolicy?.freeCheckedBagsAllowance) {
      categories.baggage.items.push({
        icon: Briefcase,
        text: `${fare.baggagePolicy.freeCheckedBagsAllowance} Check-in Bag${
          fare.baggagePolicy.freeCheckedBagsAllowance > 1 ? "s" : ""
        }`,
        subtext: `${fare.baggagePolicy.checkInBaggageWeightPerPiece}kg per bag`,
        value: true,
      });
    }
    if (fare.baggagePolicy?.cabinBaggagePieces) {
      categories.baggage.items.push({
        icon: Package,
        text: `${fare.baggagePolicy.cabinBaggagePieces} Cabin Bag${
          fare.baggagePolicy.cabinBaggagePieces > 1 ? "s" : ""
        }`,
        subtext: `${fare.baggagePolicy.cabinBaggageMaxWeight}kg, ${fare.baggagePolicy.cabinBaggageMaxDimension}cm`,
        value: true,
      });
    }
    if (fare.baggagePolicy?.priorityBaggage) {
      categories.baggage.items.push({
        icon: Zap,
        text: "Priority Baggage",
        subtext: "First on carousel",
        value: true,
      });
    }
    if (fare.baggagePolicy?.extraBaggageAllowance) {
      categories.baggage.items.push({
        icon: TrendingUp,
        text: "Extra Baggage",
        subtext: "Additional allowance",
        value: true,
      });
    }

    // Meals & Beverages
    if (fare.complimentaryMeals) {
      categories.meals.items.push({
        icon: Soup,
        text: "Complimentary Meals",
        subtext: "Full meals included",
        value: true,
      });
    }
    if (fare.complimentaryBeverages) {
      categories.meals.items.push({
        icon: Coffee,
        text: "Free Beverages",
        subtext: "Drinks on house",
        value: true,
      });
    }
    if (fare.premiumMealChoice) {
      categories.meals.items.push({
        icon: Wine,
        text: "Premium Meal Choice",
        subtext: "Select from menu",
        value: true,
      });
    }
    if (
      !fare.complimentaryMeals &&
      !fare.complimentaryBeverages &&
      !fare.premiumMealChoice
    ) {
      categories.meals.items.push({
        icon: XCircle,
        text: "Meals Not Included",
        subtext: "Available for purchase",
        value: false,
      });
    }

    // Seating
    if (fare.extraSeatSpace) {
      categories.seating.items.push({
        icon: Armchair,
        text: "Extra Legroom",
        subtext: "More space to stretch",
        value: true,
      });
    }
    if (fare.preferredSeatChoice) {
      categories.seating.items.push({
        icon: MapPin,
        text: "Preferred Seat",
        subtext: "Choose your seat",
        value: true,
      });
    }
    if (fare.guaranteedSeatTogether) {
      categories.seating.items.push({
        icon: Users,
        text: "Seats Together",
        subtext: "Group seating guaranteed",
        value: true,
      });
    }
    if (fare.advanceSeatSelection) {
      categories.seating.items.push({
        icon: Navigation,
        text: "Advance Selection",
        subtext: "Book seats early",
        value: true,
      });
    }
    if (
      !fare.extraSeatSpace &&
      !fare.preferredSeatChoice &&
      !fare.advanceSeatSelection
    ) {
      categories.seating.items.push({
        icon: XCircle,
        text: "Standard Seating",
        subtext: "Random assignment",
        value: false,
      });
    }

    // Priority Services
    if (fare.priorityBoarding) {
      categories.priority.items.push({
        icon: Plane,
        text: "Priority Boarding",
        subtext: "Board first",
        value: true,
      });
    }
    if (fare.priorityCheckin) {
      categories.priority.items.push({
        icon: CheckCircle2,
        text: "Priority Check-in",
        subtext: "Dedicated counters",
        value: true,
      });
    }
    if (fare.fastTrackSecurity) {
      categories.priority.items.push({
        icon: Zap,
        text: "Fast Track Security",
        subtext: "Skip long queues",
        value: true,
      });
    }
    if (fare.loungeAccess) {
      categories.priority.items.push({
        icon: Crown,
        text: "Lounge Access",
        subtext: "Premium airport lounge",
        value: true,
      });
    }

    // Entertainment & Extras
    if (fare.inFlightInternet) {
      categories.entertainment.items.push({
        icon: Wifi,
        text: "In-Flight WiFi",
        subtext: "Stay connected",
        value: true,
      });
    }
    if (fare.inFlightEntertainment) {
      categories.entertainment.items.push({
        icon: Headphones,
        text: "Entertainment System",
        subtext: "Movies, music & more",
        value: true,
      });
    }
    if (fare.airportTransfer) {
      categories.entertainment.items.push({
        icon: Navigation,
        text: "Airport Transfer",
        subtext: "Complimentary transport",
        value: true,
      });
    }

    // Filter out empty categories
    return Object.entries(categories).reduce((acc, [key, category]) => {
      if (category.items.length > 0) {
        acc[key] = category;
      }
      return acc;
    }, {});
  };

  const benefitCategories = getBenefitCategories(fare);

  // Get fare label with premium styling
  const getFareStyle = () => {
    const styles = {
      Basic: {
        gradient: "from-gray-500 to-gray-600",
        badge: "bg-gray-100 text-gray-800 border-gray-300",
        ring: "ring-gray-200",
        glow: "shadow-gray-200",
      },
      Saver: {
        gradient: "from-blue-500 to-blue-600",
        badge: "bg-blue-100 text-blue-800 border-blue-300",
        ring: "ring-blue-200",
        glow: "shadow-blue-200",
        popular: true,
      },
      Flexi: {
        gradient: "from-purple-500 to-purple-600",
        badge: "bg-purple-100 text-purple-800 border-purple-300",
        ring: "ring-purple-200",
        glow: "shadow-purple-200",
        premium: true,
      },
      Business: {
        gradient: "from-amber-500 to-amber-600",
        badge: "bg-amber-100 text-amber-800 border-amber-300",
        ring: "ring-amber-200",
        glow: "shadow-amber-200",
        luxury: true,
      },
    };

    return styles[fare?.fareLabel] || styles["Basic"];
  };

  const fareStyle = getFareStyle();

  return (
    <div
      className={cn(
        "relative rounded-2xl overflow-hidden transition-all duration-500 group ]",
        isSelected
          ? `border-3 shadow-2xl scale-[1.03] ${fareStyle.glow} ring-4 ${fareStyle.ring}`
          : "border-2 border-gray-200 hover:border-gray-300 hover:shadow-xl bg-white"
      )}
      onClick={() => onSelect?.()}
    >
      {/* Gradient Top Bar */}
      <div
        className={cn(
          "h-2 bg-gradient-to-r",
          isSelected ? fareStyle.gradient : "from-gray-300 to-gray-400"
        )}
      />

      {/* Popular/Premium Badge Ribbon */}
      {(fareStyle.popular || fareStyle.premium || fareStyle.luxury) && (
        <div className="absolute top-3 right-3 z-20">
          <div
            className={cn(
              "bg-gradient-to-r text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5",
              fareStyle.gradient
            )}
          >
            {fareStyle.popular && (
              <>
                <Star className="w-3 h-3 fill-white" />
                POPULAR
              </>
            )}
            {fareStyle.premium && (
              <>
                <Sparkles className="w-3 h-3" />
                FLEXIBLE
              </>
            )}
            {fareStyle.luxury && (
              <>
                <Crown className="w-3 h-3 fill-white" />
                PREMIUM
              </>
            )}
          </div>
        </div>
      )}

      <div className="p-5 cursor-pointer bg-gradient-to-br from-white via-gray-50/30 to-white">
        {/* Header Section */}
        <div className="flex items-start justify-between mb-5 gap-4">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            {/* Premium Selection Radio */}
            <div
              className={cn(
                "mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300 shadow-sm flex-shrink-0",
                isSelected
                  ? `bg-gradient-to-br ${fareStyle.gradient} border-transparent shadow-lg`
                  : "border-gray-300 bg-white hover:border-gray-400 group-hover:scale-110"
              )}
            >
              {isSelected && (
                <Check
                  className="w-3 h-3 text-white drop-shadow-sm"
                  strokeWidth={3.5}
                />
              )}
            </div>

            {/* Fare Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <h3
                  className={cn(
                    "text-2xl font-black tracking-tight",
                    isSelected
                      ? `bg-gradient-to-r ${fareStyle.gradient} bg-clip-text text-transparent`
                      : "text-gray-900"
                  )}
                >
                  {fare?.fareLabel || fare?.name || "Economy Basic"}
                </h3>
               
              </div>
              
            </div>
          </div>

          {/* Premium Price Section */}
          <div className="text-right flex-shrink-0">
            <div className="flex items-start justify-end gap-0.5 mb-0.5">
              <span className="text-sm font-semibold text-gray-600 mt-1">
                ₹
              </span>
              <span
                className={cn(
                  "text-3xl font-black tracking-tight leading-tight",
                  isSelected
                    ? `bg-gradient-to-r ${fareStyle.gradient} bg-clip-text text-transparent`
                    : "text-gray-900"
                )}
              >
                {calculateTotalPrice(fare.currentPrice || 0).toLocaleString(
                  "en-IN"
                )}
              </span>
            </div>
            {passengerCount && passengerCount > 1 && (
              <p className="text-[10px] text-gray-500 font-medium mb-1.5">
                for {passengerCount} passenger{passengerCount > 1 ? "s" : ""}
              </p>
            )}
            <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 rounded-full">
              <DollarSign className="w-2.5 h-2.5 text-gray-600" />
              <span className="text-[10px] font-semibold text-gray-700">
                ₹{fare.currentPrice?.toLocaleString("en-IN")}/person
              </span>
            </div>
          </div>
        </div>

        <Separator className="mb-4" />

        <ScrollArea className={"h-[45vh]"}>
          {/* Price Breakdown Collapsible */}
          <Collapsible className="mb-4">
            <CollapsibleTrigger
              className={cn(
                "flex items-center gap-2.5 text-xs font-bold w-full justify-between p-3 rounded-lg transition-all duration-300 border-2",
                "bg-gradient-to-r from-gray-50 to-white hover:from-gray-100 hover:to-gray-50",
                "border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md group"
              )}
            >
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md">
                  <Info className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-gray-700">View Price Breakdown</span>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-500 group-hover:text-gray-700 transition-transform" />
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-3">
              <div className="p-5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200 shadow-inner">
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
                    <span className="text-sm font-medium text-gray-600">
                      Base Fare
                    </span>
                    <span className="text-base font-bold text-gray-900">
                      ₹
                      {(
                        (fare.baseFare || 0) * (passengerCount || 1)
                      ).toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
                    <span className="text-sm font-medium text-gray-600">
                      Airline Fees
                    </span>
                    <span className="text-base font-bold text-gray-900">
                      ₹
                      {(
                        (fare.airlineFees || 0) * (passengerCount || 1)
                      ).toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
                    <span className="text-sm font-medium text-gray-600">
                      Taxes & Fees
                    </span>
                    <span className="text-base font-bold text-gray-900">
                      ₹
                      {(
                        (fare.taxesAndFees || 0) * (passengerCount || 1)
                      ).toLocaleString("en-IN")}
                    </span>
                  </div>
                  <Separator className="my-1" />
                  <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-lg">
                    <span className="text-sm font-bold text-white">
                      Total Amount
                    </span>
                    <span className="text-xl font-black text-white">
                      ₹
                      {(
                        (fare.totalPrice || 0) * (passengerCount || 1)
                      ).toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Benefits Categories Grid */}
          <div className="space-y-3 mb-4">
            <h4 className="text-base font-black text-gray-900 flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-md">
                <CheckCircle2 className="w-3.5 h-3.5 text-white" />
              </div>
              What's Included
            </h4>

            <div className="grid grid-cols-1 gap-3">
              {Object.entries(benefitCategories).map(([key, category]) => {
                const CategoryIcon = category.icon;
                return (
                  <div
                    key={key}
                    className={cn(
                      "p-3 rounded-lg border-2 transition-all duration-300 hover:shadow-lg",
                      category.bgColor,
                      category.borderColor
                    )}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className={cn(
                          "w-7 h-7 rounded-lg flex items-center justify-center shadow-md bg-white",
                          category.color
                        )}
                      >
                        <CategoryIcon className="w-4 h-4" strokeWidth={2.5} />
                      </div>
                      <h5 className="text-xs font-black text-gray-900 uppercase tracking-wide">
                        {category.title}
                      </h5>
                    </div>

                    <div className="grid grid-cols-1 gap-1.5">
                      {category.items.map((item, index) => {
                        const ItemIcon = item.icon;
                        return (
                          <div
                            key={index}
                            className={cn(
                              "flex items-start gap-2 p-2 rounded-md transition-all duration-200",
                              item.value
                                ? "bg-white shadow-sm hover:shadow-md"
                                : "bg-white/50"
                            )}
                          >
                            <div
                              className={cn(
                                "mt-0.5 w-4 h-4 rounded flex items-center justify-center flex-shrink-0",
                                item.value ? "bg-green-100" : "bg-gray-100"
                              )}
                            >
                              {item.value ? (
                                <Check
                                  className="w-3 h-3 text-green-600"
                                  strokeWidth={3}
                                />
                              ) : (
                                <X
                                  className="w-3 h-3 text-gray-400"
                                  strokeWidth={3}
                                />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start gap-1.5">
                                <ItemIcon
                                  className={cn(
                                    "w-3.5 h-3.5 mt-0.5 flex-shrink-0",
                                    item.value
                                      ? category.color
                                      : "text-gray-400"
                                  )}
                                />
                                <div className="flex-1">
                                  <p
                                    className={cn(
                                      "text-xs font-bold leading-tight",
                                      item.value
                                        ? "text-gray-900"
                                        : "text-gray-500"
                                    )}
                                  >
                                    {item.text}
                                  </p>
                                  <p
                                    className={cn(
                                      "text-[10px] leading-tight mt-0.5",
                                      item.value
                                        ? "text-gray-600"
                                        : "text-gray-400"
                                    )}
                                  >
                                    {item.subtext}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </ScrollArea>

        {/* Validity Period Banner */}
        {fare.validFrom && fare.validTo && (
          <div className="mb-3 p-2.5 bg-gradient-to-r from-purple-100 via-pink-100 to-purple-100 rounded-lg border border-purple-300 shadow-sm">
            <div className="flex items-center justify-center gap-2">
              <Clock className="w-4 h-4 text-purple-700" />
              <span className="text-[10px] font-bold text-purple-900">
                Valid from <span className="font-black">{fare.validFrom}</span>{" "}
                to <span className="font-black">{fare.validTo}</span>
              </span>
            </div>
          </div>
        )}

        {/* Premium Action Button */}
        <div className="relative">
          {!isSelected ? (
            <Button
              variant="default"
              className={cn(
                "w-full h-11 text-sm font-black shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]",
                `bg-gradient-to-r ${fareStyle.gradient} hover:opacity-90`
              )}
              onClick={(e) => {
                e.stopPropagation();
                onSelect?.();
              }}
            >
              <div className="flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>Select This Fare</span>
              </div>
            </Button>
          ) : (
            <div
              className={cn(
                "flex items-center justify-center gap-2 h-11 rounded-lg shadow-lg",
                `bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 animate-pulse`
              )}
            >
              <CheckCircle2
                className="w-5 h-5 text-white drop-shadow-lg"
                strokeWidth={3}
              />
              <span className="text-base font-black text-white drop-shadow-lg">
                SELECTED
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Premium Selected Glow Effect */}
      {isSelected && (
        <>
          <div
            className={cn(
              "absolute inset-0 rounded-2xl pointer-events-none animate-pulse",
              `ring-4 ${fareStyle.ring}`
            )}
          />
          <div className="absolute -inset-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 blur-xl pointer-events-none" />
        </>
      )}
    </div>
  );
};

export default FareCard;
