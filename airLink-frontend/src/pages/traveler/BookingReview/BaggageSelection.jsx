import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, Plus, Minus, Check, X, Package, Info, Weight, Ruler } from 'lucide-react';
import { useSelector } from 'react-redux';

const BaggageSelection = ({ selectedBaggage, onSelectBaggage }) => {
  const [expandedBaggage, setExpandedBaggage] = useState(null);

  // Get baggage ancillaries from Redux
  const { ancillariesByType, loadingByType } = useSelector((state) => state.flightCabinAncillary);

  // Extract baggage data
  const baggageOptions = ancillariesByType?.BAGGAGE || [];
  const loading = loadingByType?.BAGGAGE || false;

  // Transform data to include quantity
  const baggageData = baggageOptions.map(option => ({
    id: option.id,
    ancillaryId: option.ancillary?.id,
    name: option.ancillary?.name || 'Extra Baggage',
    description: option.ancillary?.description || '',
    price: option.price || 0,
    available: option.available,
    flightId: option.flightId,
    type: option.ancillary?.type,
    subType: option.ancillary?.subType,
    rfisc: option.ancillary?.rfisc,
    category: option.ancillary?.metadata?.baggage?.category || 'CHECKED',
    weight: option.ancillary?.metadata?.baggage?.weight || 0,
    unit: option.ancillary?.metadata?.baggage?.unit || 'KG',
    pieces: option.ancillary?.metadata?.baggage?.pieces || 1,
    dimensions: option.ancillary?.metadata?.baggage?.dimensions || '',
    notes: option.ancillary?.metadata?.baggage?.notes || '',
    iconUrl: option.ancillary?.iconUrl,
    displayOrder: option.ancillary?.displayOrder || 0,
  }));

  // Get quantity for a specific baggage option
  const getBaggageQuantity = (baggageId) => {
    const item = selectedBaggage.find(b => b.id === baggageId);
    return item ? item.quantity : 0;
  };

  // Handle quantity change
  const handleQuantityChange = (baggage, change) => {
    const currentQuantity = getBaggageQuantity(baggage.id);
    const newQuantity = Math.max(0, Math.min(5, currentQuantity + change)); // Max 5 bags

    if (newQuantity === 0) {
      // Remove from selection
      onSelectBaggage(selectedBaggage.filter(b => b.id !== baggage.id));
    } else {
      const existingIndex = selectedBaggage.findIndex(b => b.id === baggage.id);
      if (existingIndex >= 0) {
        // Update quantity
        const updated = [...selectedBaggage];
        updated[existingIndex] = { ...baggage, quantity: newQuantity };
        onSelectBaggage(updated);
      } else {
        // Add new
        onSelectBaggage([...selectedBaggage, { ...baggage, quantity: newQuantity }]);
      }
    }
  };

  // Calculate total
  const totalBaggageCost = selectedBaggage.reduce(
    (sum, item) => sum + (item.price * item.quantity),
    0
  );

  // Get category icon and color
  const getCategoryInfo = (category) => {
    if (category === 'CHECKED') {
      return { icon: Briefcase, color: 'blue', label: 'Checked Baggage' };
    } else if (category === 'CARRY_ON' || category === 'CABIN') {
      return { icon: Package, color: 'purple', label: 'Cabin Baggage' };
    }
    return { icon: Briefcase, color: 'gray', label: category };
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-md p-6">
        <div className="flex items-center justify-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!baggageData || baggageData.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
            <Briefcase className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Extra Baggage
            </h2>
            <p className="text-sm text-gray-600">Add extra baggage allowance</p>
          </div>
        </div>
        <div className="p-8 border-2 border-dashed border-gray-300 rounded-xl text-center">
          <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-sm text-gray-600">No extra baggage options available</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
            <Briefcase className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Extra Baggage
            </h2>
            <p className="text-sm text-gray-600">
              Add extra baggage to your booking
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500">Available Options</p>
          <p className="text-lg font-bold text-blue-600">{baggageData.length}</p>
        </div>
      </div>

      {/* Baggage Options */}
      <div className="space-y-4">
        {baggageData
          .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
          .map((baggage) => {
            const quantity = getBaggageQuantity(baggage.id);
            const categoryInfo = getCategoryInfo(baggage.category);
            const CategoryIcon = categoryInfo.icon;

            return (
              <motion.div
                key={baggage.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`border-2 rounded-xl overflow-hidden transition-all ${
                  quantity > 0
                    ? 'border-blue-500 bg-blue-50 shadow-md'
                    : baggage.available
                    ? 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm'
                    : 'border-gray-200 bg-gray-50 opacity-60'
                }`}
              >
                <div className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    {/* Left: Baggage Info */}
                    <div className="flex-1">
                      <div className="flex items-start gap-3 mb-3">
                        {/* Icon */}
                        <div
                          className={`w-12 h-12 rounded-lg bg-${categoryInfo.color}-100 flex items-center justify-center flex-shrink-0`}
                        >
                          <CategoryIcon className={`w-6 h-6 text-${categoryInfo.color}-600`} />
                        </div>

                        {/* Name and Description */}
                        <div className="flex-1">
                          <h3 className="text-base font-bold text-gray-900 mb-1">
                            {baggage.name}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">
                            {baggage.description}
                          </p>

                          {/* Tags */}
                          <div className="flex flex-wrap gap-2">
                            <span
                              className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 bg-${categoryInfo.color}-100 text-${categoryInfo.color}-700 rounded-full font-medium`}
                            >
                              {categoryInfo.label}
                            </span>
                            {baggage.rfisc && (
                              <span className="text-xs px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full font-medium">
                                RFISC: {baggage.rfisc}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Baggage Details Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-3">
                        {/* Weight */}
                        {baggage.weight > 0 && (
                          <div className="flex items-center gap-2 p-2 bg-white rounded-lg border border-gray-200">
                            <Weight className="w-4 h-4 text-gray-600" />
                            <div>
                              <p className="text-xs text-gray-500">Weight</p>
                              <p className="text-sm font-bold text-gray-900">
                                {baggage.weight} {baggage.unit}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Pieces */}
                        {baggage.pieces > 0 && (
                          <div className="flex items-center gap-2 p-2 bg-white rounded-lg border border-gray-200">
                            <Package className="w-4 h-4 text-gray-600" />
                            <div>
                              <p className="text-xs text-gray-500">Pieces</p>
                              <p className="text-sm font-bold text-gray-900">
                                {baggage.pieces}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Dimensions */}
                        {baggage.dimensions && (
                          <div className="flex items-center gap-2 p-2 bg-white rounded-lg border border-gray-200">
                            <Ruler className="w-4 h-4 text-gray-600" />
                            <div>
                              <p className="text-xs text-gray-500">Max Size</p>
                              <p className="text-sm font-bold text-gray-900">
                                {baggage.dimensions} cm
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Notes */}
                      {baggage.notes && (
                        <div className="p-2 bg-amber-50 rounded-lg border border-amber-200">
                          <div className="flex items-start gap-2">
                            <Info className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                            <p className="text-xs text-amber-800">{baggage.notes}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Right: Price and Quantity Control */}
                    <div className="flex flex-col items-end gap-3">
                      {/* Price */}
                      <div className="text-right">
                        <p className="text-xs text-gray-500 mb-0.5">Price per bag</p>
                        <p className="text-2xl font-bold text-blue-600">
                          ₹{baggage.price.toLocaleString()}
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      {baggage.available ? (
                        <div className="flex flex-col items-end gap-2">
                          <div className="flex items-center gap-2 bg-white border-2 border-gray-200 rounded-lg p-1">
                            <button
                              onClick={() => handleQuantityChange(baggage, -1)}
                              disabled={quantity === 0}
                              className={`w-8 h-8 rounded-md flex items-center justify-center transition-colors ${
                                quantity === 0
                                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="text-lg font-bold text-gray-900 w-8 text-center">
                              {quantity}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(baggage, 1)}
                              disabled={quantity >= 5}
                              className={`w-8 h-8 rounded-md flex items-center justify-center transition-colors ${
                                quantity >= 5
                                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                  : 'bg-blue-600 text-white hover:bg-blue-700'
                              }`}
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                          {quantity > 0 && (
                            <p className="text-sm font-semibold text-blue-600">
                              Total: ₹{(baggage.price * quantity).toLocaleString()}
                            </p>
                          )}
                        </div>
                      ) : (
                        <div className="px-3 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium">
                          Not Available
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
      </div>

      {/* Selected Baggage Summary */}
      {selectedBaggage.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl"
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-bold text-gray-900">
              Selected Extra Baggage ({selectedBaggage.reduce((sum, b) => sum + b.quantity, 0)} bags)
            </p>
            <p className="text-lg font-bold text-green-600">
              ₹{totalBaggageCost.toLocaleString()}
            </p>
          </div>
          <div className="space-y-2">
            {selectedBaggage.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between text-sm bg-white rounded-lg p-3 shadow-sm"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Briefcase className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {item.weight} {item.unit} × {item.quantity} bag{item.quantity > 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-gray-900">
                    ₹{(item.price * item.quantity).toLocaleString()}
                  </span>
                  <button
                    onClick={() => onSelectBaggage(selectedBaggage.filter(b => b.id !== item.id))}
                    className="p-1.5 hover:bg-red-100 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* No Baggage Selected */}
      {selectedBaggage.length === 0 && (
        <div className="mt-4 p-6 border-2 border-dashed border-gray-300 rounded-xl text-center bg-gray-50">
          <Briefcase className="w-10 h-10 text-gray-400 mx-auto mb-2" />
          <p className="text-sm font-medium text-gray-700 mb-1">
            No extra baggage selected
          </p>
          <p className="text-xs text-gray-500">
            Add extra baggage if you need more allowance
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default BaggageSelection;
