import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  User,
  Mail,
  Phone,
  Building2,
  Plane,
  Globe,
  MapPin,
  HeadphonesIcon,
  Edit,
  ArrowLeft,
  Check,
  Loader2,
  AlertCircle,
  Zap,
  Shield,
  CheckCircle,
  Sparkles,
  Trophy,
  Rocket
} from 'lucide-react';
import { createAirline } from '@/Redux/airline/airlineThunks';

const ReviewConfirmationStep = ({ formData, onEdit, onPrevious, onComplete }) => {
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError('');

    try {
      const jwt = localStorage.getItem('jwt');

      if (!jwt) {
        throw new Error('Authentication token not found. Please start over.');
      }

      const airlineData={
        iataCode: formData.airline.iataCode,
        icaoCode: formData.airline.icaoCode,
        name: formData.airline.airlineName,
        alias: formData.airline.alias || null,
        country: formData.airline.country,
        logoUrl: formData.airline.logoUrl || null,
        website: formData.airline.website || null,
        status: formData.airline.status,
        alliance: formData.airline.alliance || null,
        baggagePolicy: formData.airline.baggagePolicy || null,
        headquartersCityId: formData.airline.headquartersCity,
        supportEmail: formData.support.supportEmail || null,
        supportPhone: formData.support.supportPhone || null,
        supportHours: formData.support.supportHours || null,
        additionalNotes: formData.support.additionalNotes || null
      }

      console.log('Submitting airline data:', airlineData);

      // Dispatch createAirline thunk
      const airlineResult = await dispatch(createAirline(airlineData)).unwrap();

      // Success - trigger completion
      onComplete();
    } catch (error) {
      setIsSubmitting(false);

      if (error.includes('session has expired') || error.includes('Unauthorized')) {
        setSubmitError('Your session has expired. Please refresh the page and try again.');
      } else if (error.includes('already exists') || error.includes('IATA') || error.includes('ICAO')) {
        setSubmitError('An airline with this IATA or ICAO code already exists.');
      } else {
        setSubmitError(error || 'An error occurred while creating your airline. Please try again.');
      }
    }
  };

  const DataCard = ({ title, icon: Icon, children, onEdit, editLabel = "Edit", gradient = "from-blue-500 to-purple-600" }) => (
    <Card className="relative border-0 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl overflow-hidden">
      <div className={`h-1 bg-gradient-to-r ${gradient}`}></div>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900">{title}</h4>
              <div className="flex items-center space-x-1 mt-1">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm text-green-600 font-medium">Verified</span>
              </div>
            </div>
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={onEdit}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200 hover:border-blue-300 transition-all duration-200"
          >
            <Edit className="w-4 h-4" />
            {editLabel}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {children}
      </CardContent>
    </Card>
  );

  const DataRow = ({ label, value, className = "" }) => (
    <div className={`flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors duration-200 rounded-lg px-2 ${className}`}>
      <span className="text-gray-700 font-semibold">{label}:</span>
      <span className="text-gray-900 font-medium">{value || <span className="text-gray-400 italic">Not provided</span>}</span>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl shadow-lg">
          <Zap className="w-8 h-8 text-white" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Final Review & Launch
          </h3>
          <p className="text-gray-600 text-lg">
            Verify your information and activate your airline on our global platform
          </p>
        </div>
        <div className="inline-flex items-center space-x-2 bg-orange-100 text-orange-800 px-4 py-2 rounded-full text-sm font-medium">
          <Trophy className="w-4 h-4" />
          <span>Almost there! One final step</span>
        </div>
      </div>

      <div className="space-y-4">
        {/* Owner Details */}
        <DataCard
          title="Administrator Account"
          icon={User}
          onEdit={() => onEdit(1)}
          gradient="from-blue-500 to-cyan-600"
        >
          <div className="space-y-0 bg-blue-50/50 rounded-xl p-4">
            <DataRow label="Full Name" value={formData.owner.fullName} />
            <DataRow label="Email" value={formData.owner.email} />
            <DataRow label="Phone" value={formData.owner.phone} />
          </div>
        </DataCard>

        {/* Airline Details */}
        <DataCard
          title="Airline Profile"
          icon={Plane}
          onEdit={() => onEdit(2)}
          gradient="from-purple-500 to-pink-600"
        >
          <div className="space-y-0 bg-purple-50/50 rounded-xl p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-white rounded-lg p-3 border border-purple-200">
                <div className="text-sm text-gray-600 mb-1">IATA Code</div>
                {formData.airline.iataCode ? (
                  <Badge variant="outline" className="font-mono text-lg px-3 py-1 bg-blue-100 text-blue-800 border-blue-300">
                    {formData.airline.iataCode}
                  </Badge>
                ) : (
                  <span className="text-gray-400 italic">Not provided</span>
                )}
              </div>
              <div className="bg-white rounded-lg p-3 border border-purple-200">
                <div className="text-sm text-gray-600 mb-1">ICAO Code</div>
                {formData.airline.icaoCode ? (
                  <Badge variant="outline" className="font-mono text-lg px-3 py-1 bg-purple-100 text-purple-800 border-purple-300">
                    {formData.airline.icaoCode}
                  </Badge>
                ) : (
                  <span className="text-gray-400 italic">Not provided</span>
                )}
              </div>
            </div>

            <DataRow label="Airline Name" value={formData.airline.airlineName} />
            <DataRow label="Alias" value={formData.airline.alias} />
            <DataRow label="Country" value={formData.airline.country} />
            <DataRow label="Headquarters" value={formData.airline.headquartersCity} />
            <DataRow
              label="Status"
              value={formData.airline.status && (
                <Badge
                  variant={formData.airline.status === 'ACTIVE' ? 'default' : 'secondary'}
                  className={formData.airline.status === 'ACTIVE' ? 'bg-green-100 text-green-800 border-green-300' : ''}
                >
                  {formData.airline.status}
                </Badge>
              )}
            />
            <DataRow label="Website" value={formData.airline.website} />
            <DataRow label="Alliance" value={formData.airline.alliance} />

            {formData.airline.logoUrl && (
              <div className="bg-white rounded-lg p-4 border border-purple-200 mt-4">
                <div className="flex items-center space-x-4">
                  <img
                    src={formData.airline.logoUrl}
                    alt="Airline logo"
                    className="w-20 h-20 object-contain border-2 border-gray-200 rounded-lg shadow-sm"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  <div>
                    <div className="font-semibold text-gray-900">Brand Logo</div>
                    <div className="text-sm text-gray-600">Ready for display</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </DataCard>

        {/* Support & Contact */}
        <DataCard
          title="Customer Support"
          icon={HeadphonesIcon}
          onEdit={() => onEdit(3)}
          gradient="from-green-500 to-emerald-600"
        >
          <div className="space-y-0 bg-green-50/50 rounded-xl p-4">
            <DataRow label="Support Email" value={formData.support.supportEmail} />
            <DataRow label="Support Phone" value={formData.support.supportPhone} />
            <DataRow label="Support Hours" value={formData.support.supportHours} />
            {formData.support.additionalNotes && (
              <div className="bg-white rounded-lg p-4 border border-green-200 mt-4">
                <div className="font-semibold text-gray-900 mb-2">Additional Notes:</div>
                <p className="text-gray-700 text-sm leading-relaxed">{formData.support.additionalNotes}</p>
              </div>
            )}
          </div>
        </DataCard>
      </div>

      {/* Enhanced Terms and Conditions */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6 shadow-lg">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div className="space-y-3 flex-1">
            <h4 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              Terms & Conditions
              <Sparkles className="w-5 h-5 text-amber-600" />
            </h4>
            <div className="text-sm text-gray-700 space-y-3">
              <p className="font-medium">By submitting this registration, you agree to:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Provide accurate and up-to-date information</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Comply with all GDS platform policies</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Maintain valid operating certificates</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Pay applicable platform service fees</span>
                </div>
              </div>
              <div className="bg-white rounded-lg p-3 border border-amber-200">
                <div className="flex items-center space-x-2">
                  <Globe className="w-4 h-4 text-blue-600" />
                  <span className="font-medium text-gray-900">Global Compliance:</span>
                </div>
                <p className="text-xs text-gray-600 mt-1">Your registration will be processed according to international aviation standards and GDPR requirements.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Error */}
      {submitError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600 text-sm">{submitError}</p>
        </div>
      )}

      {/* Enhanced Navigation Buttons */}
      <div className="flex justify-between pt-8 border-t border-gray-200">
        <Button
          type="button"
          variant="outline"
          onClick={onPrevious}
          disabled={isSubmitting}
          className="flex items-center gap-2 px-6 py-3 hover:bg-gray-50 transition-all duration-200"
        >
          <ArrowLeft className="w-4 h-4" />
          Previous Step
        </Button>

        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 hover:from-orange-700 hover:via-red-700 hover:to-pink-700 text-white font-bold py-4 px-10 rounded-2xl shadow-2xl transition-all duration-500 transform hover:scale-[1.02] hover:shadow-3xl flex items-center gap-3 group relative overflow-hidden"
          size="lg"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative flex items-center gap-3">
            {isSubmitting ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                <span className="text-lg">Launching Your Airline...</span>
              </>
            ) : (
              <>
                <Rocket className="w-6 h-6 group-hover:animate-bounce" />
                <span className="text-xl">Launch My Airline</span>
                <Sparkles className="w-5 h-5 group-hover:animate-pulse" />
              </>
            )}
          </div>
        </Button>
      </div>
    </div>
  );
};

export default ReviewConfirmationStep;