import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stepper } from '@/components/ui/stepper';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Shield, Sparkles, Zap, Users } from 'lucide-react';
import {
  OwnerDetailsStep,
  AirlineDetailsStep,
  SupportContactStep,
  ReviewConfirmationStep,
  SuccessScreen
} from './steps';

const AirlineOnboardingWizard = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isCompleted, setIsCompleted] = useState(false);
  const [formData, setFormData] = useState({
    owner: {},
    airline: {},
    support: {}
  });

  const steps = [
    {
      id: 'owner',
      title: 'Account Setup',
      description: 'Create your admin account',
      icon: Shield,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'airline',
      title: 'Airline Profile',
      description: 'Configure airline details',
      icon: Sparkles,
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'support',
      title: 'Support Center',
      description: 'Setup customer support',
      icon: Users,
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'review',
      title: 'Launch Ready',
      description: 'Review and activate',
      icon: Zap,
      color: 'from-orange-500 to-red-500'
    }
  ];

  // JWT persistence logic
  useEffect(() => {
    const savedProgress = localStorage.getItem('airline_onboarding_progress');
    const jwt = localStorage.getItem('jwt');

    if (jwt && savedProgress) {
      const progress = JSON.parse(savedProgress);
      setCurrentStep(progress.currentStep);
      setFormData(progress.formData);
    }
  }, []);

  const saveProgress = (step, data) => {
    const progress = {
      currentStep: step,
      formData: data
    };
    localStorage.setItem('airline_onboarding_progress', JSON.stringify(progress));
  };

  const handleStepData = (stepKey, data) => {
    const newFormData = {
      ...formData,
      [stepKey]: data
    };
    setFormData(newFormData);
    saveProgress(currentStep, newFormData);
  };

  const handleNext = () => {
    
    if (currentStep < steps.length) {

      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      saveProgress(nextStep, formData);
      
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      saveProgress(prevStep, formData);
    }
  };

  const handleEditStep = (stepNumber) => {
    setCurrentStep(stepNumber);
    saveProgress(stepNumber, formData);
  };

  const handleComplete = () => {
    setIsCompleted(true);
    localStorage.removeItem('airline_onboarding_progress');
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <OwnerDetailsStep
            data={formData.owner}
            onDataChange={(data) => handleStepData('owner', data)}
            onNext={handleNext}
          />
        );
      case 2:
        return (
          <AirlineDetailsStep
            data={formData.airline}
            onDataChange={(data) => handleStepData('airline', data)}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case 3:
        return (
          <SupportContactStep
            data={formData.support}
            onDataChange={(data) => handleStepData('support', data)}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case 4:
        return (
          <ReviewConfirmationStep
            formData={formData}
            onEdit={handleEditStep}
            onPrevious={handlePrevious}
            onComplete={handleComplete}
          />
        );
      default:
        return null;
    }
  };

  if (isCompleted) {
    return <SuccessScreen airlineData={formData.airline} />;
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Enhanced background with animated gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20 animate-pulse"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-30"></div>
      </div>

      {/* Floating decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/30 to-purple-600/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-cyan-400/30 to-blue-600/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-pink-600/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Enhanced Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-6 shadow-2xl">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl font-extrabold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent mb-4">
              Join Our Global Network
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Connect your airline to millions of travelers worldwide through our advanced GDS platform
            </p>
            <div className="flex items-center justify-center space-x-8 mt-8 text-gray-400">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm">Step {currentStep} of {steps.length}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4" />
                <span className="text-sm">Secure Registration</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span className="text-sm">24/7 Support</span>
              </div>
            </div>
          </div>

          {/* Enhanced Progress Stepper */}
          <div className="mb-12">
            <div className="flex justify-between items-center max-w-4xl mx-auto">
              {steps.map((step, index) => {
                const isCompleted = index + 1 < currentStep;
                const isCurrent = index + 1 === currentStep;
                const IconComponent = step.icon;

                return (
                  <div key={step.id} className="flex flex-col items-center space-y-3 flex-1">
                    <div className={`relative flex items-center justify-center w-16 h-16 rounded-2xl transition-all duration-500 ${
                      isCompleted
                        ? 'bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg shadow-green-500/25'
                        : isCurrent
                        ? `bg-gradient-to-br ${step.color} shadow-2xl shadow-purple-500/25 scale-110`
                        : 'bg-gray-700 border-2 border-gray-600'
                    }`}>
                      <IconComponent className={`w-7 h-7 ${
                        isCompleted || isCurrent ? 'text-white' : 'text-gray-400'
                      }`} />
                      {isCompleted && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-400 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      )}
                    </div>
                    <div className="text-center">
                      <h3 className={`font-semibold text-sm transition-colors ${
                        isCompleted || isCurrent ? 'text-white' : 'text-gray-400'
                      }`}>
                        {step.title}
                      </h3>
                      <p className={`text-xs transition-colors ${
                        isCompleted || isCurrent ? 'text-gray-300' : 'text-gray-500'
                      }`}>
                        {step.description}
                      </p>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`absolute top-8 left-16 w-full h-0.5 transition-colors ${
                        isCompleted ? 'bg-green-500' : 'bg-gray-700'
                      }`} style={{ transform: 'translateX(50%)' }}></div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Enhanced Step Content */}
          <Card className="backdrop-blur-xl bg-white/95 shadow-2xl border-0 rounded-3xl overflow-hidden">
            <div className={`h-2 bg-gradient-to-r ${steps[currentStep - 1]?.color}`}></div>
            <CardHeader className="pb-6 pt-8 px-8">
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${steps[currentStep - 1]?.color} flex items-center justify-center shadow-lg`}>
                  {React.createElement(steps[currentStep - 1]?.icon, { className: "w-6 h-6 text-white" })}
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold text-gray-900">
                    {steps[currentStep - 1]?.title}
                  </CardTitle>
                  <p className="text-gray-600 mt-1">
                    {steps[currentStep - 1]?.description}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              <div className="transition-all duration-300 ease-in-out">
                {renderCurrentStep()}
              </div>
            </CardContent>
          </Card>

          {/* Progress indicator */}
          <div className="mt-8 max-w-4xl mx-auto">
            <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${steps[currentStep - 1]?.color} transition-all duration-500 ease-out`}
                style={{ width: `${(currentStep / steps.length) * 100}%` }}
              ></div>
            </div>
            <p className="text-center text-gray-400 text-sm mt-2">
              {Math.round((currentStep / steps.length) * 100)}% Complete
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AirlineOnboardingWizard;