import React from "react";
import { motion } from "framer-motion";
import { Plane, Clock, Luggage, Calendar } from "lucide-react";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getFlightInstanceById } from "@/Redux/flightInstance/flightInstanceThunk";
import { useSelector } from "react-redux";

const FlightDetailsOverview = () => {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { flightInstance } = useSelector((state) => state.flightInstance);

  useEffect(() => {
    const cabinClass = searchParams.get("cabinClass");
    const flightInstanceId = searchParams.get("flightInstanceId");

    if (flightInstanceId && cabinClass) {
      dispatch(
        getFlightInstanceById(flightInstanceId)
      );
    }
  }, [searchParams]);

  if (!flightInstance) {
    return (
      <div className="p-6 bg-white rounded-2xl shadow-md">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading flight details...</p>
        </div>
      </div>
    );
  }

  // Helper function to format date and time
  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return { date: "N/A", time: "N/A" };
    const date = new Date(dateTimeString);
    const timeStr = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    const dateStr = date.toLocaleDateString("en-US", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
    return { date: dateStr, time: timeStr };
  };

  // Extract flight data
  const departure = formatDateTime(flightInstance.departureDateTime);
  const arrival = formatDateTime(flightInstance.arrivalDateTime);
  const duration = flightInstance.duration || "N/A";



  // Get airport info
  const departureAirport = flightInstance.departureAirport || flightInstance.flight?.departureAirport || {};
  const arrivalAirport = flightInstance.arrivalAirport || flightInstance.flight?.arrivalAirport || {};

  // Get cabin class info
  const cabinClass = flightInstance.cabin?.cabinClassType || searchParams.get("cabinClass") || "ECONOMY";

  // Get stops info
  const stops = flightInstance.stops || 0;


  // Get baggage info from cabin
  const cabinBaggage = flightInstance.cabin?.fare?.baggage?.cabin || "7 Kgs (1 piece only) / Adult";
  const checkedBaggage = flightInstance.cabin?.fare?.baggage?.checkIn || "15 Kgs (1 piece only) / Adult";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Flight Details</h2>
        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
          {stops === 0 ? "Non-stop" : `${stops} Stop(s)`}
        </span>
      </div>

      {/* Airline Info */}
      <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-200">
        <div className="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center">
          <img
            src={flightInstance?.airlineLogo}
            alt={flightInstance?.airlineName}
            className="w-8 h-8 object-contain"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.parentElement.innerHTML =
                '<span class="text-2xl">✈️</span>';
            }}
          />
        </div>
        <div>
          <p className="font-semibold text-gray-800">
            {flightInstance?.airlineName}
          </p>
          <p className="text-sm text-gray-600">
            {flightInstance?.flightNumber} • {flightInstance?.aircraftModal}
          </p>
        </div>
        <div className="ml-auto text-right">
          <p className="text-sm font-medium text-gray-700">
            {cabinClass}
          </p>
        </div>
      </div>

      {/* Flight Route */}
      <div className="grid grid-cols-[1fr_auto_1fr] gap-4 mb-6">
        {/* Departure */}
        <div className="text-left">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <p className="text-xs text-gray-500">
              {departure.date}
            </p>
          </div>
          <p className="text-2xl font-bold text-gray-800 mb-1">
            {departure.time}
          </p>
          <p className="text-sm font-semibold text-gray-700">
            {departureAirport.iataCode || "N/A"}
          </p>
          <p className="text-xs text-gray-600">{departureAirport.city?.name || departureAirport.name || "N/A"}</p>
          <p className="text-xs text-gray-500 mt-1">
            {departureAirport.terminal ? `Terminal ${departureAirport.terminal}` : ""}
          </p>
        </div>

        {/* Duration & Arrow */}
        <div className="flex flex-col items-center justify-center px-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <p className="text-xs font-medium text-gray-600">
              {duration}
            </p>
          </div>
          <div className="relative w-full">
            <div className="h-0.5 bg-gray-300 w-full"></div>
            <Plane className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-5 h-5 text-blue-600 rotate-90" />
          </div>
          {stops === 0 && (
            <p className="text-xs text-green-600 font-medium mt-2">Non-stop</p>
          )}
        </div>

        {/* Arrival */}
        <div className="text-right">
          <div className="flex items-center justify-end gap-2 mb-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <p className="text-xs text-gray-500">{arrival.date}</p>
          </div>
          <p className="text-2xl font-bold text-gray-800 mb-1">
            {arrival.time}
          </p>
          <p className="text-sm font-semibold text-gray-700">
            {arrivalAirport.iataCode || "N/A"}
          </p>
          <p className="text-xs text-gray-600">{arrivalAirport.city?.name || arrivalAirport.name || "N/A"}</p>
          <p className="text-xs text-gray-500 mt-1">
            {arrivalAirport.terminal ? `Terminal ${arrivalAirport.terminal}` : ""}
          </p>
        </div>
      </div>

      
    </motion.div>
  );
};

export default FlightDetailsOverview;
