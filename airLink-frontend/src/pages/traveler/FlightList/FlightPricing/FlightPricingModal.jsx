import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Check,
  X,
  Info,
  Star,
  ArrowRight,
  CreditCard,
  Sparkles,
  Crown,
  Plane,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { getFlightFares } from "@/Redux/fare/fareThunk";
import { useSelector } from "react-redux";

import { useNavigate, useSearchParams } from "react-router-dom";
import FareCard from "./FareCard";
import { getCabinClassesByAircraft } from "@/Redux/cabinClass/cabinClassThunk";
import { buildBookingPayload } from "@/services/Booking/bookingService";

const FlightPricingModal = ({ isOpen, onClose, flight, onSelectFare }) => {
  const [selectedCabinClass, setSelectedCabinClass] = useState(null);
  const [selectedFare, setSelectedFare] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const { fares } = useSelector((store) => store.fare);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { cabinClasses } = useSelector((store) => store.cabinClass);

  const ITEMS_PER_PAGE = 3;

  useEffect(() => {
    console.log("Flight data in Pricing Modal:", flight);
    // Set initial cabin class based on flight's cabin class
    if (flight?.cabinClass) {
      setSelectedCabinClass(flight.cabinClass);
    }
  }, [flight]);

  // Reset page when cabin class changes
  useEffect(() => {
    setCurrentPage(0);
  }, [selectedCabinClass]);

  // Cabin class definitions (static UI data)
  // const cabinClasses = [
  //   {
  //     code: "ECONOMY",
  //     name: "Economy",
  //     icon: Plane,
  //     color: "from-gray-500 to-gray-600",
  //     description: "Best value for your journey",
  //   },
  //   {
  //     code: "PREMIUM_ECONOMY",
  //     name: "Premium Economy",
  //     icon: Sparkles,
  //     color: "from-orange-500 to-amber-600",
  //     description: "Extra comfort and amenities",
  //   },
  //   {
  //     code: "BUSINESS",
  //     name: "Business",
  //     icon: Star,
  //     color: "from-blue-500 to-indigo-600",
  //     description: "Premium experience",
  //   },
  //   {
  //     code: "FIRST",
  //     name: "First Class",
  //     icon: Crown,
  //     color: "from-purple-500 to-pink-600",
  //     description: "Ultimate luxury",
  //   },
  // ];

  // Get available cabin classes (only those with fares)
  // const availableCabinClasses = Object.keys(availableFares);

  const handleFareSelect = (fare) => {
    setSelectedFare(fare);
  };

  const handleContinueBooking = () => {
    if (!selectedFare) return;

    try {
      const numberOfTravellers =
        parseInt(searchParams.get("numberOfTravellers")) || 1;

      const { bookingData, queryParams } = buildBookingPayload({
        flight,
        selectedFare,
        selectedCabinClass,
        numberOfTravellers,
      });

      // store data
      sessionStorage.setItem("bookingData", JSON.stringify(bookingData));

      // navigate
      const params = new URLSearchParams(queryParams);
      navigate(`/booking-review?${params.toString()}`);

      onSelectFare?.({ ...flight, selectedFare, selectedCabinClass });
      onClose?.();
    } catch (error) {
      console.error("Booking error:", error);
    }
  };

  const startIndex = currentPage * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentPageFares = fares.slice(startIndex, endIndex);

  console.log("current page fares", currentPageFares);

  useEffect(() => {
    // Fetch fares for direct flight only

    console.log("selected Cabin class ----- ", selectedCabinClass);
    if (selectedCabinClass) {
      dispatch(
        getFlightFares({
          cabinId: selectedCabinClass?.id,
          flightId: flight?.flightId,
        }),
      );
    }
  }, [selectedCabinClass]);

  useEffect(() => {
    if (flight?.aircraftId) {
      dispatch(getCabinClassesByAircraft(flight?.aircraftId));
    }
  }, [flight]);

  useEffect(() => {
    if (cabinClasses.length) {
      setSelectedCabinClass(cabinClasses[0]);
    }
  }, cabinClasses);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-3">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
              <CreditCard className="h-6 w-6 text-white" />
            </div>
            Select Your Fare
          </DialogTitle>
          <DialogDescription className="text-base">
            Choose the fare that best suits your travel needs
          </DialogDescription>
        </DialogHeader>

        {/* Flight Summary Bar */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl border border-blue-200 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {flight?.departureAirportCode || "DEL"}
                </div>
                <div className="text-xs text-muted-foreground">
                  {new Date(flight?.departureTime).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
              <div className="flex flex-col items-center">
                <Plane className="h-5 w-5 text-blue-600 mb-1" />
                <div className="text-xs text-muted-foreground">
                  {flight?.totalStops === 0
                    ? "Non-stop"
                    : `${flight?.totalStops} stop(s)`}
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {flight?.arrivalAirportCode || "BOM"}
                </div>
                <div className="text-xs text-muted-foreground">
                  {new Date(flight?.arrivalTime).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-muted-foreground mb-1">
                {flight?.airlineName}
              </div>
              <Badge variant="outline">{flight?.flightNumber}</Badge>
            </div>
          </div>
        </div>

        {/* Cabin Class Tabs */}
        <Tabs value={selectedCabinClass} onValueChange={setSelectedCabinClass}>
          <TabsList
            className="grid grid-cols-4 h-auto p-1 bg-muted/50
          w-full"
          >
            {cabinClasses.map((cabin) => {
              const Icon = cabin.icon;

              return (
                <TabsTrigger
                  key={cabin.code}
                  value={cabin}
                  className="flex flex-col items-center gap-1 py-3 data-[state=active]:bg-white data-[state=active]:shadow-md"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        "p-2 rounded-lg bg-gradient-to-br",
                        cabin.color,
                      )}
                    >
                      {/* <Icon className="h-4 w-4 text-white" /> */}
                    </div>
                    <div>
                      <p className="text-xs font-semibold">{cabin.name}</p>
                    </div>
                  </div>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {/* Fare Cards Grid - 3 items per row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-6 gap-y-8">
            {currentPageFares.map((fare, index) => (
              <FareCard
                key={fare?.id || index}
                fare={fare}
                isSelected={selectedFare?.id === fare?.id}
                onSelect={() => handleFareSelect(fare)}
                passengerCount={1}
                flightType={flight?.flightType}
              />
            ))}
          </div>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex items-center justify-between gap-4 mt-6 pt-6 border-t">
          <Button variant="outline" onClick={onClose} className="px-8">
            Cancel
          </Button>
          <Button
            onClick={handleContinueBooking}
            disabled={!selectedFare}
            className="px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            Continue to Booking
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FlightPricingModal;
