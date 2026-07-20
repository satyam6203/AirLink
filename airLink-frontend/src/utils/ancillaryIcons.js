import {
  Luggage,
  Shield,
  UtensilsCrossed,
  Armchair,
  Wifi,
  Headphones,
  Car,
  MapPin,
  Package,
  Weight,
} from "lucide-react";

/**
 * Get the appropriate icon component for an ancillary
 * @param {string} type - The ancillary type (BAGGAGE, TRAVEL_PROTECTION, etc.)
 * @param {string} subType - The ancillary subType (optional, for more specific icons)
 * @returns {Component} Lucide icon component
 */
export const getAncillaryIcon = (type, subType) => {
  // Type-based icons
  const typeIcons = {
    BAGGAGE: Luggage,
    TRAVEL_PROTECTION: Shield,
    MEALS: UtensilsCrossed,
    SEAT: Armchair,
    SEATS: Armchair,
    ONBOARD_SERVICES: Wifi,
    GROUND_SERVICES: Car,
  };

  // SubType-based icons (more specific)
  const subTypeIcons = {
    'carry-on': Package,
    'Extra Baggage': Weight,
    'cancellation': Shield,
    'baggage': Luggage,
    'wifi': Wifi,
    'entertainment': Headphones,
    'lounge': MapPin,
  };

  // Check subType first for more specific icon
  if (subType && subTypeIcons[subType]) {
    return subTypeIcons[subType];
  }

  // Fallback to type-based icon
  return typeIcons[type] || Package;
};

/**
 * Get background color classes for ancillary icon
 * @param {string} type - The ancillary type
 * @returns {string} Tailwind CSS classes for background and text color
 */
export const getAncillaryIconBgColor = (type) => {
  const colors = {
    BAGGAGE: "bg-purple-100 text-purple-600",
    TRAVEL_PROTECTION: "bg-blue-100 text-blue-600",
    MEALS: "bg-orange-100 text-orange-600",
    SEAT: "bg-green-100 text-green-600",
    SEATS: "bg-green-100 text-green-600",
    ONBOARD_SERVICES: "bg-cyan-100 text-cyan-600",
    GROUND_SERVICES: "bg-pink-100 text-pink-600",
  };
  return colors[type] || "bg-gray-100 text-gray-600";
};

/**
 * Get badge color classes for ancillary type
 * @param {string} type - The ancillary type
 * @returns {string} Tailwind CSS classes for badge
 */
export const getAncillaryBadgeColor = (type) => {
  const colors = {
    TRIP_PROTECTION: "bg-blue-100 text-blue-800",
    TRAVEL_PROTECTION: "bg-blue-100 text-blue-800",
    BAGGAGE: "bg-purple-100 text-purple-800",
    MEALS: "bg-orange-100 text-orange-800",
    SEAT: "bg-green-100 text-green-800",
    SEATS: "bg-green-100 text-green-800",
    ONBOARD_SERVICES: "bg-cyan-100 text-cyan-800",
    GROUND_SERVICES: "bg-pink-100 text-pink-800",
  };
  return colors[type] || "bg-gray-100 text-gray-800";
};
