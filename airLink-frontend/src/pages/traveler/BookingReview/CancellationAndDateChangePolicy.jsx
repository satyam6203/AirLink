import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Calendar,
  XCircle,
  Check,
  X,
  Clock,
  DollarSign,
  Briefcase,
  Package,
  Info,
  RefreshCw,
  Star,
} from "lucide-react";
import { useSelector } from "react-redux";

const CancellationAndDateChangePolicy = () => {
  const [expandedSection, setExpandedSection] = useState(null);

  // Get fare rules and baggage policy from Redux
  const { fareRule } = useSelector((state) => state.fareRules);
  const { policy: baggagePolicy } = useSelector((state) => state.baggagePolicy);

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  // Fare Rules Section
  const FareRulesSection = () => {
    if (!fareRule) return null;

    const isExpanded = expandedSection === "fareRules";

    return (
      <div className="border-2 border-gray-200 rounded-xl overflow-hidden hover:border-blue-300 transition-all">
        <button
          onClick={() => toggleSection("fareRules")}
          className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <h3 className="font-bold text-gray-900 text-lg">
                {fareRule.ruleName || "Fare Rules"}
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                {fareRule.airlineName}
              </p>
            </div>
          </div>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          )}
        </button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="p-5 pt-0 bg-gradient-to-br from-gray-50 to-blue-50/30">
                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
                  {/* Refundability Status */}
                  <div className="mb-6">
                    <div
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${
                        fareRule.isRefundable
                          ? "bg-green-100 border-2 border-green-300"
                          : "bg-red-100 border-2 border-red-300"
                      }`}
                    >
                      {fareRule.isRefundable ? (
                        <Check className="w-5 h-5 text-green-700" />
                      ) : (
                        <X className="w-5 h-5 text-red-700" />
                      )}
                      <span
                        className={`font-bold text-sm ${
                          fareRule.isRefundable
                            ? "text-green-900"
                            : "text-red-900"
                        }`}
                      >
                        {fareRule.isRefundable
                          ? "Refundable Fare"
                          : "Non-Refundable Fare"}
                      </span>
                    </div>
                  </div>

                  {/* Cancellation Policy */}
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <XCircle className="w-5 h-5 text-red-600" />
                      <h4 className="font-bold text-gray-900">
                        Cancellation Policy
                      </h4>
                    </div>

                    {fareRule.isRefundable ? (
                      <div className="space-y-3">
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border-l-4 border-blue-500">
                          <div className="flex items-start gap-3">
                            <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-gray-900 mb-1">
                                Refund Deadline
                              </p>
                              <p className="text-sm text-gray-700">
                                Cancel up to{" "}
                                <span className="font-bold text-blue-700">
                                  {fareRule.refundDeadlineDays} days
                                </span>{" "}
                                before departure for refund
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg p-4 border-l-4 border-orange-500">
                          <div className="flex items-start gap-3">
                            <DollarSign className="w-5 h-5 text-orange-600 mt-0.5" />
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-gray-900 mb-1">
                                Cancellation Fee
                              </p>
                              <p className="text-sm text-gray-700">
                                Fee:{" "}
                                <span className="font-bold text-orange-700">
                                  ₹{fareRule.cancellationFee.toLocaleString()}
                                </span>{" "}
                                per passenger
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-red-50 rounded-lg p-4 border-l-4 border-red-500">
                        <div className="flex items-start gap-3">
                          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                          <div>
                            <p className="text-sm font-semibold text-red-900 mb-1">
                              No Refund Available
                            </p>
                            <p className="text-sm text-red-700">
                              This fare is non-refundable. Cancellation will
                              result in complete loss of ticket value.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Date Change Policy */}
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Calendar className="w-5 h-5 text-blue-600" />
                      <h4 className="font-bold text-gray-900">
                        Date Change Policy
                      </h4>
                    </div>

                    {fareRule.isChangeable !== false ? (
                      <div className="space-y-3">
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border-l-4 border-green-500">
                          <div className="flex items-start gap-3">
                            <Check className="w-5 h-5 text-green-600 mt-0.5" />
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-gray-900 mb-1">
                                Changes Allowed
                              </p>
                              <p className="text-sm text-gray-700">
                                You can change your travel dates
                              </p>
                            </div>
                          </div>
                        </div>

                        {fareRule.changeDeadlineHours && (
                          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border-l-4 border-blue-500">
                            <div className="flex items-start gap-3">
                              <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
                              <div className="flex-1">
                                <p className="text-sm font-semibold text-gray-900 mb-1">
                                  Change Deadline
                                </p>
                                <p className="text-sm text-gray-700">
                                  Request changes at least{" "}
                                  <span className="font-bold text-blue-700">
                                    {fareRule.changeDeadlineHours} hours
                                  </span>{" "}
                                  before departure
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {fareRule.changeFee > 0 && (
                          <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg p-4 border-l-4 border-orange-500">
                            <div className="flex items-start gap-3">
                              <DollarSign className="w-5 h-5 text-orange-600 mt-0.5" />
                              <div className="flex-1">
                                <p className="text-sm font-semibold text-gray-900 mb-1">
                                  Change Fee
                                </p>
                                <p className="text-sm text-gray-700">
                                  Fee:{" "}
                                  <span className="font-bold text-orange-700">
                                    ₹{fareRule.changeFee.toLocaleString()}
                                  </span>{" "}
                                  per passenger
                                </p>
                                <p className="text-xs text-gray-600 mt-1">
                                  Plus any fare difference
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="bg-red-50 rounded-lg p-4 border-l-4 border-red-500">
                        <div className="flex items-start gap-3">
                          <X className="w-5 h-5 text-red-600 mt-0.5" />
                          <div>
                            <p className="text-sm font-semibold text-red-900 mb-1">
                              Changes Not Allowed
                            </p>
                            <p className="text-sm text-red-700">
                              Date changes are not permitted for this fare type.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Important Notes */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-start gap-2">
                      <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-gray-600">
                        All fees are per passenger and subject to airline terms.
                        Processing may take 7-14 business days for refunds.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  // Baggage Policy Section
  const BaggagePolicySection = () => {
    if (!baggagePolicy) return null;

    const isExpanded = expandedSection === "baggage";

    return (
      <div className="border-2 border-gray-200 rounded-xl overflow-hidden hover:border-purple-300 transition-all">
        <button
          onClick={() => toggleSection("baggage")}
          className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-md">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <h3 className="font-bold text-gray-900 text-lg">
                {baggagePolicy.name || "Baggage Allowance"}
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                {baggagePolicy.description || "Check-in & Cabin Baggage"}
              </p>
            </div>
          </div>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          )}
        </button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="p-5 pt-0 bg-gradient-to-br from-gray-50 to-purple-50/30">
                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
                  {/* Special Features Badges */}
                  {(baggagePolicy.priorityBaggage || baggagePolicy.extraBaggageAllowance) && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {baggagePolicy.priorityBaggage && (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-yellow-100 to-amber-100 border-2 border-yellow-300 rounded-lg">
                          <Star className="w-4 h-4 text-yellow-600 fill-yellow-600" />
                          <span className="text-xs font-bold text-yellow-900">
                            Priority Baggage
                          </span>
                        </div>
                      )}
                      {baggagePolicy.extraBaggageAllowance && (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-green-100 to-emerald-100 border-2 border-green-300 rounded-lg">
                          <Package className="w-4 h-4 text-green-600" />
                          <span className="text-xs font-bold text-green-900">
                            Extra Allowance
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Check-in Baggage */}
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Package className="w-5 h-5 text-purple-600" />
                      <h4 className="font-bold text-gray-900">
                        Check-in Baggage
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {/* Total Weight Allowance */}
                      {baggagePolicy.checkInBaggageMaxWeight && (
                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center flex-shrink-0">
                              <Briefcase className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-600 mb-1">
                                Total Weight
                              </p>
                              <p className="text-2xl font-bold text-purple-700">
                                {baggagePolicy.checkInBaggageMaxWeight} kg
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Pieces Allowed */}
                      {baggagePolicy.checkInBaggagePieces && (
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
                              <Package className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-600 mb-1">
                                Pieces Allowed
                              </p>
                              <p className="text-2xl font-bold text-blue-700">
                                {baggagePolicy.checkInBaggagePieces}{" "}
                                {baggagePolicy.checkInBaggagePieces === 1
                                  ? "piece"
                                  : "pieces"}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Weight Per Piece */}
                      {baggagePolicy.checkInBaggageWeightPerPiece && (
                        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-4 border border-indigo-200">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center flex-shrink-0">
                              <Briefcase className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-600 mb-1">
                                Per Piece
                              </p>
                              <p className="text-2xl font-bold text-indigo-700">
                                {baggagePolicy.checkInBaggageWeightPerPiece} kg
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Free Checked Bags */}
                    {baggagePolicy.freeCheckedBagsAllowance > 0 && (
                      <div className="mt-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-3 border-l-4 border-green-500">
                        <div className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-600" />
                          <p className="text-sm font-semibold text-green-900">
                            {baggagePolicy.freeCheckedBagsAllowance} free checked{" "}
                            {baggagePolicy.freeCheckedBagsAllowance === 1
                              ? "bag"
                              : "bags"}{" "}
                            included
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Cabin Baggage */}
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Briefcase className="w-5 h-5 text-indigo-600" />
                      <h4 className="font-bold text-gray-900">Cabin Baggage</h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {/* Total Weight Allowance */}
                      {baggagePolicy.cabinBaggageMaxWeight && (
                        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg p-4 border border-indigo-200">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center flex-shrink-0">
                              <Briefcase className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-600 mb-1">
                                Total Weight
                              </p>
                              <p className="text-2xl font-bold text-indigo-700">
                                {baggagePolicy.cabinBaggageMaxWeight} kg
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Pieces Allowed */}
                      {baggagePolicy.cabinBaggagePieces && (
                        <div className="bg-gradient-to-br from-cyan-50 to-teal-50 rounded-lg p-4 border border-cyan-200">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-lg bg-cyan-600 flex items-center justify-center flex-shrink-0">
                              <Package className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-600 mb-1">
                                Pieces Allowed
                              </p>
                              <p className="text-2xl font-bold text-cyan-700">
                                {baggagePolicy.cabinBaggagePieces}{" "}
                                {baggagePolicy.cabinBaggagePieces === 1
                                  ? "piece"
                                  : "pieces"}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Weight Per Piece */}
                      {baggagePolicy.cabinBaggageWeightPerPiece && (
                        <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-lg p-4 border border-teal-200">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-lg bg-teal-600 flex items-center justify-center flex-shrink-0">
                              <Briefcase className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-600 mb-1">
                                Per Piece
                              </p>
                              <p className="text-2xl font-bold text-teal-700">
                                {baggagePolicy.cabinBaggageWeightPerPiece} kg
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Cabin Dimension Info */}
                    {baggagePolicy.cabinBaggageMaxDimension && (
                      <div className="mt-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 border-l-4 border-blue-500">
                        <div className="flex items-start gap-2">
                          <Info className="w-4 h-4 text-blue-600 mt-0.5" />
                          <div>
                            <p className="text-sm font-semibold text-blue-900 mb-1">
                              Maximum Dimensions
                            </p>
                            <p className="text-sm text-blue-700">
                              Total linear dimensions (L+W+H) must not exceed{" "}
                              <span className="font-bold">
                                {baggagePolicy.cabinBaggageMaxDimension} cm
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* General Notes */}
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-start gap-2 mb-3">
                      <AlertCircle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-600 mb-1">
                          <span className="font-semibold">Important:</span>{" "}
                          Excess baggage charges apply for additional or
                          overweight luggage
                        </p>
                        <p className="text-xs text-gray-500">
                          Baggage restrictions may vary by route and aircraft
                          type. Please verify with airline before travel.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all p-6 border border-gray-100"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center shadow-md">
          <AlertCircle className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Important Policies
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Cancellation, Date Change & Baggage Rules
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <FareRulesSection />
        <BaggagePolicySection />
      </div>

      {/* General Important Note */}
      <div className="mt-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border-2 border-amber-200">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-amber-900 mb-1">
              Important Notice
            </p>
            <p className="text-xs text-amber-800 leading-relaxed">
              Airlines may modify their policies without prior notice. Please
              verify all terms and conditions before making any changes to your
              booking. Contact customer support for assistance.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CancellationAndDateChangePolicy;
