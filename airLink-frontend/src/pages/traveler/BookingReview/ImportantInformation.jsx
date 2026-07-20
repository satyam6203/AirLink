import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, ChevronDown, ChevronUp, Clock, Shield, FileText } from 'lucide-react';

const ImportantInformation = () => {
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const importantPoints = [
    {
      id: 'checkin',
      title: 'Check-in Information',
      icon: Clock,
      color: 'blue',
      points: [
        'Web check-in opens 48 hours before departure',
        'Counter check-in closes 60 minutes before departure',
        'Carry a printed or soft copy of boarding pass',
        'Reach airport at least 2 hours before domestic flights'
      ]
    },
    {
      id: 'baggage',
      title: 'Baggage Rules',
      icon: FileText,
      color: 'purple',
      points: [
        'Check-in baggage must not exceed the specified weight limit',
        'Cabin baggage size should not exceed 55cm x 35cm x 25cm',
        'Liquids in cabin baggage should not exceed 100ml per container',
        'Prohibited items: Sharp objects, flammable materials, weapons'
      ]
    },
    {
      id: 'covid',
      title: 'Travel Guidelines',
      icon: Shield,
      color: 'green',
      points: [
        'Carry a valid government-issued photo ID',
        'Follow airline COVID-19 safety protocols',
        'Masks may be mandatory during travel',
        'Check destination entry requirements before travel'
      ]
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: {
        bg: 'bg-blue-100',
        text: 'text-blue-600',
        border: 'border-blue-200'
      },
      purple: {
        bg: 'bg-purple-100',
        text: 'text-purple-600',
        border: 'border-purple-200'
      },
      green: {
        bg: 'bg-green-100',
        text: 'text-green-600',
        border: 'border-green-200'
      }
    };
    return colors[color];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.6 }}
      className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
          <AlertCircle className="w-6 h-6 text-red-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Important Information</h2>
          <p className="text-sm text-gray-600">Please read before proceeding</p>
        </div>
      </div>

      <div className="space-y-3">
        {importantPoints.map((section) => {
          const isExpanded = expandedSection === section.id;
          const colorClasses = getColorClasses(section.color);
          const Icon = section.icon;

          return (
            <div
              key={section.id}
              className={`border-2 rounded-xl overflow-hidden ${colorClasses.border}`}
            >
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg ${colorClasses.bg} flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${colorClasses.text}`} />
                  </div>
                  <span className="font-semibold text-gray-800">{section.title}</span>
                </div>
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </button>

              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="border-t border-gray-200 bg-gray-50 p-4"
                >
                  <ul className="space-y-2">
                    {section.points.map((point, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className={`mt-1.5 w-1.5 h-1.5 rounded-full ${colorClasses.bg} flex-shrink-0`}></span>
                        <span className="text-sm text-gray-700">{point}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default ImportantInformation;
