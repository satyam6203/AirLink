import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Check, TrendingUp } from 'lucide-react';

const FlexibilityAddOn = ({ flexibilityData, selectedPlan, onSelectPlan }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
          <Shield className="w-6 h-6 text-purple-600" />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-gray-800">Flexibility Add-Ons</h2>
          <p className="text-sm text-gray-600 mt-1">{flexibilityData.title}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {flexibilityData.options.map((option) => {
          const isSelected = selectedPlan === option.id;

          return (
            <motion.div
              key={option.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`relative cursor-pointer rounded-xl border-2 p-5 transition-all ${
                isSelected
                  ? 'border-purple-600 bg-purple-50'
                  : 'border-gray-200 hover:border-purple-300 bg-white'
              }`}
              onClick={() => onSelectPlan(isSelected ? null : option.id)}
            >
              {option.popular && (
                <div className="absolute -top-3 right-4">
                  <span className="px-3 py-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-semibold rounded-full shadow-lg flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    Most Popular
                  </span>
                </div>
              )}

              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{option.name}</h3>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-2xl font-bold text-gray-900">₹{option.price}</span>
                    <span className="text-sm text-gray-600">/passenger</span>
                  </div>
                </div>
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    isSelected
                      ? 'border-purple-600 bg-purple-600'
                      : 'border-gray-300 bg-white'
                  }`}
                >
                  {isSelected && <Check className="w-4 h-4 text-white" />}
                </div>
              </div>

              <div className="space-y-2">
                {option.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-700">{feature}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>

      {selectedPlan && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg"
        >
          <div className="flex items-center gap-2">
            <Check className="w-5 h-5 text-green-600" />
            <p className="text-sm font-medium text-green-800">
              Flexibility add-on selected! Travel with peace of mind.
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default FlexibilityAddOn;
