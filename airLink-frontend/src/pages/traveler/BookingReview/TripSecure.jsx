import React, { useState } from "react";
import {motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  Check,
  Star,
  ChevronDown,
  ChevronUp,
  Briefcase,
  Plane,
  Clock,
  Ban,
  AlertTriangle,
  Package,
  Heart,
  Info,
} from "lucide-react";
import { useSelector } from "react-redux";

// Coverage type icon mapping
const getCoverageIcon = (coverageType) => {
  const iconMap = {
    BAGGAGE_ASSISTANCE: Package,
    BAGGAGE_LOSS: Package,
    BAGGAGE_DELAY: Clock,
    PERSONAL_ACCIDENT: Heart,
    MISSED_CONNECTION: Plane,
    TRIP_CANCELLATION: Ban,
    DIVERTED_FLIGHT: AlertTriangle,
    TRIP_DELAY: Clock,
  };
  return iconMap[coverageType] || ShieldCheck;
};

const TripSecure = ({ selectedTravelProtection, onSelectTravelProtection }) => {
  const [showDetails, setShowDetails] = useState(false);

  const { ancillariesByType } = useSelector(
    (state) => state.flightCabinAncillary
  );

  console.log("ancillaries by types ------- ", ancillariesByType)

  const tripSecureData = ancillariesByType["TRAVEL_PROTECTION"] || null;

  // Extract data from API response or use mock data
  const insuranceName = tripSecureData?.ancillary?.name || "Trip Secure";

  const insuranceDescription =
    tripSecureData?.ancillary?.description ||
    "Protect your journey with comprehensive travel insurance";

  const insurancePrice = tripSecureData?.price;

  const coverages =  tripSecureData?.ancillary?.coverages || [];

  console.log("tripSecure data ", tripSecureData)

  
  const emergencyContact =
    coverages.length > 0
      ? coverages[0].emergencyContact
      : "1800-123-4567";

  const handleSelection = (value) => {
    // value: 'yes' or 'no'
    if (value === "yes") {
      onSelectTravelProtection(tripSecureData || "secure-trip");
    } else {
      onSelectTravelProtection(null);
    }
  };

  const isTravelProtectionSelected = selectedTravelProtection !== null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all overflow-hidden border border-gray-100"
    >
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h2 className="text-2xl font-bold mb-1">{insuranceName}</h2>
                <p className="text-blue-100 text-sm leading-relaxed">
                  {insuranceDescription}
                </p>
              </div>
              {tripSecureData && (
                <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full flex-shrink-0">
                  <Star className="w-4 h-4 text-yellow-300 fill-yellow-300" />
                  <span className="text-xs font-semibold">Recommended</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Price & Coverage Preview */}
        {tripSecureData && (
          <div className="mb-6 space-y-4">
            {/* Price Card */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    Special Offer Price
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-gray-900">
                      ₹{insurancePrice}
                    </span>
                    <span className="text-sm text-gray-600">per passenger</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Save up to</p>
                  <p className="text-xl font-bold text-green-600">40%</p>
                </div>
              </div>
            </div>

            {/* What You Get Card */}
            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-xl p-5 border-2 border-blue-200">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">
                  What You Get for ₹{insurancePrice}
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {coverages
                  // .sort((a, b) => a.displayOrder - b.displayOrder)
                  .map((coverage) => {
                    const IconComponent = getCoverageIcon(
                      coverage.coverageType
                    );

                    return (
                      <div
                        key={coverage.id}
                        className="flex items-start gap-3 bg-white/80 backdrop-blur-sm rounded-lg p-3 border border-blue-100 hover:border-blue-300 hover:shadow-md transition-all group"
                      >
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                          <IconComponent className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-semibold text-gray-900 text-sm leading-tight">
                              {coverage.name}
                            </h4>
                            {coverage.coverageAmount > 0 && (
                              <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full flex-shrink-0">
                                ₹{coverage.coverageAmount.toLocaleString()}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                            {coverage.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
              </div>

              {/* Total Coverage Summary */}
              <div className="mt-4 pt-4 border-t border-blue-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-semibold text-gray-900">
                      Total Coverage Benefits: {coverages.length} types
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-600">
                      Total Coverage Value
                    </p>
                    <p className="text-lg font-bold text-blue-600">
                      ₹
                      {coverages
                        .reduce((sum, c) => sum + (c.coverageAmount || 0), 0)
                        .toLocaleString()}
                      +
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Radio Button Options */}
        <div className="space-y-3 mb-6">
          {/* Yes Option */}
          {tripSecureData && <motion.div
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => handleSelection("yes")}
            className={`relative cursor-pointer rounded-xl border-2 p-5 transition-all ${
              isTravelProtectionSelected
                ? "border-blue-600 bg-blue-50 shadow-lg shadow-blue-100"
                : "border-gray-200 hover:border-blue-300 bg-white"
            }`}
          >
            <div className="flex items-center gap-4">
              {/* Radio Button */}
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                  isTravelProtectionSelected
                    ? "border-blue-600 bg-blue-600"
                    : "border-gray-300 bg-white"
                }`}
              >
                {isTravelProtectionSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-3 h-3 rounded-full bg-white"
                  />
                )}
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Yes, Secure My Trip
                  </h3>
                  <ShieldCheck
                    className={`w-5 h-5 ${
                      isTravelProtectionSelected ? "text-blue-600" : "text-gray-400"
                    }`}
                  />
                </div>
                <p className="text-sm text-gray-600">
                  Get comprehensive protection with {coverages.length || 8}{" "}
                  types of coverage
                </p>
              </div>

              {/* Price Badge */}
              {tripSecureData && (
                <div
                  className={`px-4 py-2 rounded-lg ${
                    isTravelProtectionSelected
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  <p className="text-xs font-medium">Only</p>
                  <p className="text-lg font-bold">₹{insurancePrice}</p>
                </div>
              )}
            </div>
          </motion.div>}

          {/* No Option */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => handleSelection("no")}
            className={`relative cursor-pointer rounded-xl border-2 p-5 transition-all ${
              !isTravelProtectionSelected
                ? "border-gray-400 bg-gray-50"
                : "border-gray-200 hover:border-gray-300 bg-white"
            }`}
          >
            <div className="flex items-center gap-4">
              {/* Radio Button */}
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                  !isTravelProtectionSelected
                    ? "border-gray-600 bg-gray-600"
                    : "border-gray-300 bg-white"
                }`}
              >
                {!isTravelProtectionSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-3 h-3 rounded-full bg-white"
                  />
                )}
              </div>

              {/* Content */}
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  No, I'll Skip This
                </h3>
                <p className="text-sm text-gray-600">
                  Proceed without travel insurance protection
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Detailed Coverage Information Toggle */}
        {tripSecureData && coverages.length > 0 && (
          <div className="border-t border-gray-200 pt-6">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="w-full flex items-center justify-between text-left p-3 hover:bg-gray-50 rounded-lg transition-colors group"
            >
              <div className="flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-600" />
                <h4 className="text-base font-semibold text-gray-800">
                  Detailed Coverage Information & Claim Conditions
                </h4>
              </div>
              {showDetails ? (
                <ChevronUp className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
              )}
            </button>

            <AnimatePresence>
              {showDetails && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-4 space-y-3"
                >
                  {coverages
                    .sort((a, b) => a.displayOrder - b.displayOrder)
                    .map((coverage, index) => {
                      const IconComponent = getCoverageIcon(
                        coverage.coverageType
                      );

                      return (
                        <motion.div
                          key={coverage.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.2, delay: index * 0.05 }}
                          className="bg-white rounded-xl p-4 border-2 border-gray-200 hover:border-blue-300 transition-all shadow-sm hover:shadow-md"
                        >
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center flex-shrink-0 shadow-md">
                              <IconComponent className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2 mb-2">
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded">
                                      #{index + 1}
                                    </span>
                                    <h5 className="font-bold text-gray-900 text-base">
                                      {coverage.name}
                                    </h5>
                                  </div>
                                  <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                                    {coverage.coverageType.replace(/_/g, " ")}
                                  </p>
                                </div>
                                {coverage.coverageAmount > 0 && (
                                  <div className="text-right flex-shrink-0">
                                    <p className="text-xs text-gray-500">
                                      Coverage
                                    </p>
                                    <span className="text-lg font-bold text-green-600">
                                      ₹
                                      {coverage.coverageAmount.toLocaleString()}
                                    </span>
                                  </div>
                                )}
                              </div>

                              <p className="text-sm text-gray-700 leading-relaxed mb-3 bg-gray-50 p-3 rounded-lg">
                                {coverage.description}
                              </p>

                              {coverage.claimCondition && (
                                <div className="bg-gradient-to-r from-orange-50 to-amber-50 border-l-4 border-orange-400 rounded-lg p-3">
                                  <div className="flex items-start gap-2">
                                    <AlertTriangle className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
                                    <div>
                                      <p className="text-xs font-semibold text-orange-900 mb-1">
                                        Claim Condition
                                      </p>
                                      <p className="text-xs text-orange-800 leading-relaxed">
                                        {coverage.claimCondition}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}

                  {/* Claim Process Information */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border-2 border-blue-200 mt-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
                        <Info className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h5 className="text-sm font-bold text-gray-900 mb-2">
                          How to Claim Your Insurance
                        </h5>
                        <ul className="space-y-1.5 text-xs text-gray-700">
                          <li className="flex items-start gap-2">
                            <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                            <span>
                              Contact emergency support immediately when
                              incident occurs
                            </span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                            <span>
                              Collect all necessary documents (receipts,
                              reports, confirmations)
                            </span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                            <span>
                              Submit claim within 30 days of incident via our
                              mobile app or website
                            </span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                            <span>
                              Claims processed within 7-10 business days
                            </span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Emergency Contact */}
        {tripSecureData && (
          <div className="mt-6 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-4 border border-orange-200">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h5 className="text-sm font-semibold text-gray-900 mb-1">
                  24/7 Emergency Assistance
                </h5>
                <p className="text-xs text-gray-600 mb-2">
                  Need help? Contact us anytime, anywhere
                </p>
                <a
                  href={`tel:${emergencyContact.split(" ")[0]}`}
                  className="text-sm font-semibold text-orange-600 hover:text-orange-700 underline"
                >
                  {emergencyContact}
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Success Message */}
        <AnimatePresence>
          {isTravelProtectionSelected && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2 }}
              className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <Check className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-green-900 mb-0.5">
                    Excellent Choice! Your Trip is Protected
                  </p>
                  <p className="text-xs text-green-700">
                    You're now covered with comprehensive travel insurance
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default TripSecure;
