import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  CheckCircle,
  Plane,
  ArrowRight,
  Sparkles,
  Globe,
  TrendingUp,
  Zap,
  Shield,
  Users,
  Star,
  Trophy,
  Rocket
} from 'lucide-react';

const SuccessScreen = ({ airlineData }) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clean up any onboarding data from localStorage
    localStorage.removeItem('airline_onboarding_progress');
  }, []);

  const handleGoToDashboard = () => {
    // Redirect to airline dashboard
    navigate('/airline');
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Enhanced animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-green-900 to-emerald-900">
        <div className="absolute inset-0 bg-gradient-to-br from-green-600/30 via-emerald-600/20 to-teal-600/30 animate-pulse"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23059669%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-40"></div>
      </div>

      {/* Floating celebration elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-green-400/30 to-emerald-600/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-teal-400/30 to-green-600/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-emerald-400/20 to-green-600/20 rounded-full blur-3xl animate-pulse delay-500"></div>

        {/* Floating stars */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          >
            <Star className="w-4 h-4 text-yellow-400 opacity-60" fill="currentColor" />
          </div>
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="backdrop-blur-xl bg-white/95 shadow-2xl border-0 overflow-hidden rounded-3xl">
            <CardContent className="p-0">
              {/* Enhanced Success Header */}
              <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white p-12 text-center relative overflow-hidden">
                {/* Animated background pattern */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%220%200%2040%2040%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Cpath%20d%3D%22M20%2020c0%2011.046-8.954%2020-20%2020v-40c11.046%200%2020%208.954%2020%2020z%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E')] animate-pulse"></div>
                </div>

                <div className="relative z-10">
                  <div className="flex justify-center mb-6">
                    <div className="relative">
                      <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                        <CheckCircle className="w-16 h-16 text-white animate-pulse" />
                      </div>
                      <div className="absolute -top-3 -right-3 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-yellow-800 animate-spin" />
                      </div>
                      <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-blue-400 rounded-full flex items-center justify-center">
                        <Zap className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h1 className="text-4xl font-extrabold mb-3 animate-pulse">
                      🎉 Registration Complete!
                    </h1>
                    <div className="inline-flex items-center space-x-2 bg-white/20 rounded-full px-6 py-2 backdrop-blur-sm">
                      <Trophy className="w-5 h-5 text-yellow-300" />
                      <span className="text-lg font-semibold">Welcome to the Global Aviation Network</span>
                    </div>
                    <p className="text-green-100 text-lg max-w-md mx-auto">
                      Your airline is now connected to millions of travelers worldwide
                    </p>
                  </div>
                </div>
              </div>

              {/* Airline Info Display */}
              <div className="p-8 space-y-6">
                <div className="text-center space-y-4">
                  {airlineData?.logoUrl && (
                    <div className="flex justify-center">
                      <img
                        src={airlineData.logoUrl}
                        alt={`${airlineData.airlineName} logo`}
                        className="w-24 h-24 object-contain border-2 border-gray-200 rounded-lg shadow-lg"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}

                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {airlineData?.airlineName}
                    </h2>
                    <div className="flex justify-center items-center space-x-4 text-gray-600">
                      {airlineData?.iataCode && (
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-mono">
                          {airlineData.iataCode}
                        </span>
                      )}
                      {airlineData?.icaoCode && (
                        <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-mono">
                          {airlineData.icaoCode}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Enhanced Success Message */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-8 shadow-lg">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                      <Rocket className="w-6 h-6 text-white" />
                    </div>
                    <div className="space-y-4 flex-1">
                      <h3 className="text-xl font-bold text-green-900">
                        🚀 Your Airline is Live!
                      </h3>
                      <div className="grid grid-cols-2 gap-4 text-green-700">
                        <div className="flex items-center space-x-3">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <span className="font-medium">Account Activated</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <span className="font-medium">Profile Configured</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <span className="font-medium">GDS Access Granted</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <span className="font-medium">Ready for Operations</span>
                        </div>
                      </div>
                      <div className="bg-white rounded-lg p-4 border border-green-200">
                        <div className="flex items-center space-x-3">
                          <Shield className="w-5 h-5 text-blue-600" />
                          <div>
                            <p className="font-medium text-gray-900">Secure & Protected</p>
                            <p className="text-sm text-gray-600">Your data is encrypted and GDPR compliant</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Next Steps */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    What's Next?
                  </h3>
                  <div className="space-y-3 text-blue-700">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-200 text-blue-800 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">
                        1
                      </div>
                      <div>
                        <p className="font-medium">Set up your flight inventory</p>
                        <p className="text-sm text-blue-600">Add aircraft, routes, and schedule flights</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-200 text-blue-800 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">
                        2
                      </div>
                      <div>
                        <p className="font-medium">Configure pricing and policies</p>
                        <p className="text-sm text-blue-600">Set up fare classes, baggage rules, and booking policies</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-200 text-blue-800 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">
                        3
                      </div>
                      <div>
                        <p className="font-medium">Start receiving bookings</p>
                        <p className="text-sm text-blue-600">Your flights will be available to travelers worldwide</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Global Reach Highlight */}
                <div className="text-center bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6">
                  <Globe className="w-12 h-12 text-purple-600 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Global Reach Activated
                  </h3>
                  <p className="text-gray-600">
                    Your airline is now part of a global network connecting you with
                    millions of travelers and thousands of travel agents worldwide.
                  </p>
                </div>

                {/* Enhanced Action Button */}
                <div className="pt-8">
                  <Button
                    onClick={handleGoToDashboard}
                    className="w-full bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 hover:from-emerald-700 hover:via-green-700 hover:to-teal-700 text-white font-bold py-4 rounded-2xl shadow-2xl transition-all duration-500 transform hover:scale-[1.02] hover:shadow-3xl group relative overflow-hidden"
                    size="lg"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative flex items-center justify-center space-x-3">
                      <Rocket className="w-6 h-6 group-hover:animate-bounce" />
                      <span className="text-xl">Launch Your Dashboard</span>
                      <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
                    </div>
                  </Button>

                  <p className="text-center text-gray-500 text-sm mt-4">
                    Start managing flights, bookings, and growing your business
                  </p>
                </div>

                {/* Support Contact */}
                <div className="text-center pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    Need help getting started?{' '}
                    <button className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors">
                      Contact our support team
                    </button>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Floating elements animation */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-float-delay {
          animation: float 6s ease-in-out infinite;
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
};

export default SuccessScreen;