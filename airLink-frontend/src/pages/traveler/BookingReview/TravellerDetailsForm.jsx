import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, ChevronDown, ChevronUp, Mail, Phone, AlertCircle, ChevronDownIcon } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { use } from 'react';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';

const TravellerDetailsForm = ({ passengerCount = 1, onTravellerDataChange }) => {
  const [expandedPassenger, setExpandedPassenger] = useState(0);
  const [dobPopoverOpen, setDobPopoverOpen] = useState({});
  const {userProfile}=useSelector(state=>state.user);
  const [travellerData, setTravellerData] = useState(
    Array.from({ length: passengerCount }, (_, i) => ({
      id: i,
      type: i === 0 ? 'Adult' : 'Adult',
      title: '',
      firstName: '',
      lastName: '',
      gender: '',
      dob: '',
      passportNumber: '',
      passportExpiry: '',
      nationality: 'Indian'
    }))
  );

  const [contactInfo, setContactInfo] = useState({
    email: '',
    phone: '',
    countryCode: '+91'
  });


  useEffect(()=>{
    if(userProfile){
      
      setContactInfo({
        email: userProfile.email||'',
        phone: userProfile.phone || '9870065904',
        countryCode: '+91'
      });
    }
    console.log("User info set in traveller details:", userProfile);

  },[userProfile])

  const handleInputChange = (passengerIndex, field, value) => {
    const updatedData = [...travellerData];
    updatedData[passengerIndex] = {
      ...updatedData[passengerIndex],
      [field]: value
    };
    setTravellerData(updatedData);
    onTravellerDataChange?.({ passengers: updatedData, contactInfo });
  };

  const handleContactInfoChange = (field, value) => {
    const updatedContactInfo = {
      ...contactInfo,
      [field]: value
    };
    setContactInfo(updatedContactInfo);
    onTravellerDataChange?.({ passengers: travellerData, contactInfo: updatedContactInfo });
  };

  const togglePassenger = (index) => {
    setExpandedPassenger(expandedPassenger === index ? -1 : index);
  };

  const isPassengerComplete = (passenger) => {
    const requiredFields = ['title', 'firstName', 'lastName', 'gender'];
    return requiredFields.every(field => passenger[field]);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
          <User className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Traveller Details</h2>
          <p className="text-sm text-gray-600">Enter passenger information as per ID proof</p>
        </div>
      </div>

      {/* Important Notice */}
      <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <div className="flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-amber-900 mb-1">Important</p>
            <ul className="text-xs text-amber-700 space-y-1">
              <li>• Enter name as per your govt. approved ID proof</li>
              <li>• Middle name is optional</li>
              <li>• Passport details are mandatory for international flights</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Traveller Forms */}
      <div className="space-y-4">
        {travellerData.map((passenger, index) => {
          const isExpanded = expandedPassenger === index;
          const isComplete = isPassengerComplete(passenger);

          return (
            <div
              key={passenger.id}
              className={`border-2 rounded-xl overflow-hidden transition-all ${
                isComplete ? 'border-green-200' : 'border-gray-200'
              }`}
            >
              {/* Passenger Header */}
              <button
                onClick={() => togglePassenger(index)}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    isComplete ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-gray-800">
                      {passenger.type} {index + 1}
                      {isComplete && passenger.firstName && (
                        <span className="text-gray-600 ml-2">
                          - {passenger.title} {passenger.firstName} {passenger.lastName}
                        </span>
                      )}
                    </p>
                    {!isComplete && (
                      <p className="text-xs text-red-600">Please fill required details</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {isComplete && (
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                      Completed
                    </span>
                  )}
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </div>
              </button>

              {/* Passenger Form */}
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-t border-gray-200 bg-gray-50 p-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Title */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Title <span className="text-red-500">*</span>
                      </label>
                      <Select
                        value={passenger.title}
                        onValueChange={(value) => handleInputChange(index, 'title', value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Mr">Mr</SelectItem>
                          <SelectItem value="Mrs">Mrs</SelectItem>
                          <SelectItem value="Ms">Ms</SelectItem>
                          <SelectItem value="Miss">Miss</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* First Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={passenger.firstName}
                        onChange={(e) => handleInputChange(index, 'firstName', e.target.value)}
                        placeholder="Enter first name"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                      />
                    </div>

                    {/* Last Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={passenger.lastName}
                        onChange={(e) => handleInputChange(index, 'lastName', e.target.value)}
                        placeholder="Enter last name"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                      />
                    </div>

                    {/* Gender */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Gender <span className="text-red-500">*</span>
                      </label>
                      <Select
                        value={passenger.gender}
                        onValueChange={(value) => handleInputChange(index, 'gender', value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Date of Birth */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date of Birth
                      </label>
                      <Popover
                        open={dobPopoverOpen[index]}
                        onOpenChange={(open) => setDobPopoverOpen(prev => ({ ...prev, [index]: open }))}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-between font-normal"
                          >
                            {passenger.dob ? new Date(passenger.dob).toLocaleDateString() : "Select date"}
                            <ChevronDownIcon className="h-4 w-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={passenger.dob ? new Date(passenger.dob) : undefined}
                            captionLayout="dropdown"
                            onSelect={(date) => {
                              if (date) {
                                handleInputChange(index, 'dob', date.toISOString().split('T')[0]);
                                setDobPopoverOpen(prev => ({ ...prev, [index]: false }));
                              }
                            }}
                            fromYear={1940}
                            toYear={new Date().getFullYear()}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    {/* Nationality */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nationality
                      </label>
                      <input
                        type="text"
                        value={passenger.nationality}
                        onChange={(e) => handleInputChange(index, 'nationality', e.target.value)}
                        placeholder="Enter nationality"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                      />
                    </div>
                  </div>

                </motion.div>
              )}
            </div>
          );
        })}
      </div>

      {/* Contact Information Section - Separate from passengers */}
      <div className="mt-6 p-6 border-2 border-gray-200 rounded-xl bg-white">
        <div className="flex items-center gap-2 mb-4">
          <Mail className="w-5 h-5 text-blue-600" />
          <h3 className="text-base font-semibold text-gray-800">Contact Information</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={contactInfo.email}
              onChange={(e) => handleContactInfoChange('email', e.target.value)}
              placeholder="Enter email address"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            />
            <p className="text-xs text-gray-500 mt-1">Booking confirmation will be sent here</p>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mobile Number <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <select
                value={contactInfo.countryCode}
                onChange={(e) => handleContactInfoChange('countryCode', e.target.value)}
                className="w-24 px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              >
                <option value="+91">+91</option>
                <option value="+1">+1</option>
                <option value="+44">+44</option>
                <option value="+971">+971</option>
              </select>
              <input
                type="tel"
                value={contactInfo.phone}
                onChange={(e) => handleContactInfoChange('phone', e.target.value)}
                placeholder="Enter mobile number"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Booking details will be sent via SMS</p>
          </div>
        </div>
      </div>

      {/* GST Details (Optional) */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Phone className="w-5 h-5 text-blue-600" />
            <p className="text-sm font-medium text-blue-900">Need GST Invoice?</p>
          </div>
          <button className="text-sm font-medium text-blue-600 hover:text-blue-700 transition">
            Add Details
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default TravellerDetailsForm;
