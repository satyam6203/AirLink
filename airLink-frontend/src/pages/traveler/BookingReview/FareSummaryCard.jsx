import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Receipt, ChevronDown, ChevronUp, CreditCard, Tag, Info } from 'lucide-react';
import { useSelector } from 'react-redux';

const FareSummaryCard = ({
  fareData,
  selectedSeats = [], // Changed from selectedSeat to selectedSeats array
  selectedMeals,
  selectedBaggage = [],
  
  travelProtection,
  onProceedToPayment,
  isLoading = false,
  totalPassengers
}) => {

  const [showBreakdown, setShowBreakdown] = useState(true);


  

  // Calculate additional charges - sum up all seats for multiple passengers
  const seatCharges = selectedSeats.reduce((sum, seat) => sum + (seat?.price || 0), 0);
  const mealCharges = selectedMeals.reduce((sum, meal) => sum + (meal.price || 0), 0);
  const baggageCharges = selectedBaggage.reduce((sum, bag) => sum + ((bag.price || 0) * (bag.quantity || 0)), 0);

  // Get insurance price from Redux data
  const travelProtectionCharge = travelProtection && travelProtection.price;

  console.log("travel protection",travelProtection,selectedMeals)

  

  // Base fare calculations
  const baseFare = fareData?.baseFare || 0;
  const taxes = fareData?.taxes || 0;
  const subtotal = baseFare + taxes;
  const addOnsTotal = seatCharges + mealCharges + baggageCharges + travelProtectionCharge;
  const grandTotal = subtotal + addOnsTotal;

  // Calculate savings if any
  const savings = 0; // Can be calculated based on business logic

  const FareItem = ({ label, amount, highlight = false, info = null }) => (
    <div className={`flex items-start justify-between py-2 ${highlight ? 'font-semibold' : ''}`}>
      <div className="flex items-center gap-1">
        <span className={`text-sm ${highlight ? 'text-gray-900' : 'text-gray-700'}`}>
          {label}
        </span>
        {info && (
          <div className="group relative">
            <Info className="w-3 h-3 text-gray-400 cursor-help" />
            <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-48 p-2 bg-gray-900 text-white text-xs rounded-lg z-10">
              {info}
            </div>
          </div>
        )}
      </div>
      <span className={`text-sm ${highlight ? 'text-gray-900' : 'text-gray-700'}`}>
        ₹{amount?.toLocaleString() || '0'}
      </span>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-2xl shadow-lg sticky top-20"
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
            <Receipt className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Fare Summary</h2>
            <p className="text-xs text-gray-600">{totalPassengers} Passenger(s)</p>
          </div>
        </div>

        {/* Quick Total */}
        <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
          <div className="flex items-baseline justify-between">
            <span className="text-sm text-gray-600">Total Amount</span>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900">
                ₹{grandTotal.toLocaleString()}
              </p>
              {savings > 0 && (
                <p className="text-xs text-green-600 font-medium">You save ₹{savings.toLocaleString()}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Fare Breakdown */}
      <div className="p-6">
        <button
          onClick={() => setShowBreakdown(!showBreakdown)}
          className="w-full flex items-center justify-between mb-4 text-sm font-semibold text-gray-800 hover:text-blue-600 transition-colors"
        >
          <span>Fare Breakdown</span>
          {showBreakdown ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </button>

        <AnimatePresence>
          {showBreakdown && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-1 overflow-hidden"
            >
              {/* Base Fare & Taxes */}
              <div className="pb-3 border-b border-gray-200">
                <FareItem
                  label="Base Fare"
                  amount={fareData?.baseFare}
                  info="Basic ticket price before taxes and fees"
                />
                <FareItem
                  label="Taxes & Fees"
                  amount={fareData?.taxes}
                  info="Government taxes and airline fees"
                />
              </div>

              {/* Add-ons */}
              {(seatCharges > 0 || mealCharges > 0 || baggageCharges > 0 || travelProtectionCharge > 0) && (
                <div className="py-3 border-b border-gray-200">
                  <p className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                    Add-ons
                  </p>
                  {seatCharges > 0 && (
                    <FareItem label="Seat Selection" amount={seatCharges} />
                  )}
                  {mealCharges > 0 && (
                    <FareItem label={`Meals (${selectedMeals.length})`} amount={mealCharges} />
                  )}
                  {baggageCharges > 0 && (
                    <FareItem
                      label={`Extra Baggage (${selectedBaggage.reduce((sum, b) => sum + b.quantity, 0)} bags)`}
                      amount={baggageCharges}
                    />
                  )}
                  
                  {travelProtectionCharge > 0 && (
                    <FareItem label="Travel Insurance" amount={travelProtectionCharge} />
                  )}
                </div>
              )}

              {/* Total */}
              <div className="pt-3">
                <FareItem
                  label="Grand Total"
                  amount={grandTotal}
                  highlight={true}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Promo Code Section */}
      <div className="px-6 pb-4">
        <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <Tag className="w-5 h-5 text-yellow-600 flex-shrink-0" />
          <input
            type="text"
            placeholder="Enter promo code"
            className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-500 outline-none"
          />
          <button className="text-sm font-medium text-yellow-700 hover:text-yellow-800 transition-colors">
            Apply
          </button>
        </div>
      </div>

      {/* CTA Button */}
      <div className="p-6 pt-0">
        <motion.button
          whileHover={{ scale: isLoading ? 1 : 1.02 }}
          whileTap={{ scale: isLoading ? 1 : 0.98 }}
          onClick={onProceedToPayment}
          disabled={isLoading}
          className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Processing...
            </>
          ) : (
            <>
              <CreditCard className="w-5 h-5" />
              Proceed to Payment
            </>
          )}
        </motion.button>
      </div>

      {/* Trust Indicators */}
      <div className="px-6 pb-6">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600">🔒 Secure</p>
          </div>
          <div className="p-2 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600">⚡ Instant</p>
          </div>
          <div className="p-2 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600">✓ Verified</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FareSummaryCard;
