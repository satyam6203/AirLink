import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Mail, Phone, Lock, Loader2, Eye, EyeOff, CheckCircle, AlertCircle, Shield, Sparkles, ArrowRight } from 'lucide-react';
import { signup } from '@/Redux/auth/authThunk';
import { getUserProfile } from '@/Redux/user/userThunks';

  const validationSchema = Yup.object({
    fullName: Yup.string()
      .required('Full name is required')
      .min(2, 'Full name must be at least 2 characters'),
    email: Yup.string()
      .email('Invalid email format')
      .required('Email is required'),
    phone: Yup.string()
      .required('Phone number is required')
      .matches(/^\+?[\d\s\-\(\)]+$/, 'Invalid phone number format'),
    password: Yup.string()
      .required('Password is required')
      .min(8, 'Password must be at least 8 characters')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
    confirmPassword: Yup.string()
      .required('Please confirm your password')
      .oneOf([Yup.ref('password')], 'Passwords must match')
  });
const OwnerDetailsStep = ({ data, onDataChange, onNext }) => {
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);



  const initialValues = {
    fullName: data?.fullName || '',
    email: data?.email || '',
    phone: data?.phone || '',
    password: data?.password || '',
    confirmPassword: data?.confirmPassword || ''
  };

  const handleSubmit = async (values, { setFieldError }) => {
    setIsSubmitting(true);
    setSubmitError('');

    try {
      // Dispatch signup thunk
      const signupResult = await dispatch(signup({
        fullName: values.fullName,
        email: values.email,
        phone: values.phone,
        password: values.password,
        role: 'ROLE_AIRLINE_OWNER'
      })).unwrap();

      if (signupResult.jwt) {
        // Fetch user profile using thunk
        const profileResult = await dispatch(getUserProfile(signupResult.jwt)).unwrap();
        localStorage.setItem("jwt",signupResult.jwt)
        // Update form data
        onDataChange({
          ...values,
          userId: profileResult.id,
          jwt: signupResult.jwt
        });

        // Proceed to next step
        onNext();
      }
    } catch (error) {
      setIsSubmitting(false);

      if (error.includes('already registered') || error.includes('email already exists')) {
        setFieldError('email', 'This email is already registered');
      } else {
        setSubmitError(error || 'An error occurred during registration. Please try again.');
      }
    }
  };

  const fetchUserProfile = async () => {  
    const jwt = localStorage.getItem('jwt');
    if (jwt) {
      const response = await dispatch(getUserProfile(jwt)).unwrap();
      if (response && response.id) {
        console.log("User profile fetched successfully", response);
        onNext();
      }
    }
  };

  
  useEffect( () => {
    const jwt = localStorage.getItem('jwt');
    if (jwt) {
      fetchUserProfile();
    }
  }, [data]);

  // Password strength calculator
  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/\d/.test(password)) strength += 1;
    if (/[^\w\s]/.test(password)) strength += 1;
    return strength;
  };

  const FormField = ({ name, label, type = 'text', icon: Icon, isPassword = false, ...props }) => (
    <div className="space-y-2">
      <Label htmlFor={name} className="text-gray-700 flex items-center gap-2 font-medium">
        {Icon && <Icon className="w-4 h-4 text-gray-500" />}
        {label}
        {name === 'password' && (
          <div className="ml-auto flex items-center space-x-2">
            {passwordStrength > 0 && (
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((level) => (
                  <div
                    key={level}
                    className={`h-1 w-4 rounded-full transition-colors ${
                      level <= passwordStrength
                        ? level <= 2
                          ? 'bg-red-400'
                          : level <= 3
                          ? 'bg-yellow-400'
                          : 'bg-green-400'
                        : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </Label>
      <Field name={name}>
        {({ field, meta, form }) => (
          <div className="relative">
            <Input
              {...field}
              {...props}
              id={name}
              type={isPassword ? (name === 'password' ? (showPassword ? 'text' : 'password') : (showConfirmPassword ? 'text' : 'password')) : type}
              className={`transition-all duration-300 hover:shadow-md focus:shadow-lg pr-10 ${
                meta.touched && meta.error
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                  : meta.touched && !meta.error
                  ? 'border-green-500 focus:border-green-500 focus:ring-green-500/20'
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500/20'
              }`}
              onChange={(e) => {
                field.onChange(e);
                if (name === 'password') {
                  setPasswordStrength(calculatePasswordStrength(e.target.value));
                }
              }}
            />
            {/* Password visibility toggle */}
            {isPassword && (
              <button
                type="button"
                onClick={() => name === 'password' ? setShowPassword(!showPassword) : setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {(name === 'password' ? showPassword : showConfirmPassword) ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            )}
            {/* Validation icons */}
            {meta.touched && !isPassword && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                {meta.error ? (
                  <AlertCircle className="w-4 h-4 text-red-500" />
                ) : (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                )}
              </div>
            )}
          </div>
        )}
      </Field>
      <ErrorMessage name={name} component="div" className="text-red-500 text-sm flex items-center gap-1" />
      {name === 'password' && passwordStrength > 0 && (
        <div className="text-xs text-gray-600">
          Password strength: {passwordStrength <= 2 ? 'Weak' : passwordStrength <= 3 ? 'Fair' : passwordStrength <= 4 ? 'Good' : 'Strong'}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
          <Shield className="w-8 h-8 text-white" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Create Your Admin Account
          </h3>
          <p className="text-gray-600 text-lg">
            Secure your airline's presence with administrator credentials
          </p>
        </div>
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values, isValid, dirty }) => {
          return (
            <Form className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <FormField
                  name="fullName"
                  label="Full Name"
                  placeholder="Enter your full name"
                  icon={User}
                />

                <FormField
                  name="email"
                  label="Email Address"
                  type="email"
                  placeholder="admin@yourairline.com"
                  icon={Mail}
                />
              </div>

              <FormField
                name="phone"
                label="Phone Number"
                type="tel"
                placeholder="Enter your phone number (e.g., +1 234 567 8900)"
                icon={Phone}
              />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <FormField
                  name="password"
                  label="Password"
                  placeholder="Create a secure password"
                  icon={Lock}
                  isPassword={true}
                />

                <FormField
                  name="confirmPassword"
                  label="Confirm Password"
                  placeholder="Confirm your password"
                  icon={Lock}
                  isPassword={true}
                />
              </div>

              {/* Security Requirements */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-semibold text-blue-900 mb-2">
                      Security Requirements
                    </h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${
                          passwordStrength >= 1 ? 'bg-green-500' : 'bg-gray-300'
                        }`}></div>
                        <span>At least 8 characters</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${
                          passwordStrength >= 2 ? 'bg-green-500' : 'bg-gray-300'
                        }`}></div>
                        <span>Contains lowercase letters</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${
                          passwordStrength >= 3 ? 'bg-green-500' : 'bg-gray-300'
                        }`}></div>
                        <span>Contains uppercase letters</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${
                          passwordStrength >= 4 ? 'bg-green-500' : 'bg-gray-300'
                        }`}></div>
                        <span>Contains numbers</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {submitError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-600 text-sm">{submitError}</p>
                </div>
              )}

              <div className="pt-6">
                <Button
                  type="submit"
                  disabled={!isValid || isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 rounded-xl shadow-2xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-3xl text-lg group"
                  size="lg"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                      Creating Your Account...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-3 group-hover:animate-pulse" />
                      Create Account & Continue
                    </>
                  )}
                </Button>
              </div>

              <div className="text-center pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <button
                    type="button"
                    className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-all duration-200 hover:scale-105 inline-flex items-center"
                    onClick={() => {
                      window.location.href = '/login';
                    }}
                  >
                    Login here
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </button>
                </p>
                <p className="text-xs text-gray-500 mt-3">
                  By creating an account, you agree to our Terms of Service and Privacy Policy
                </p>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default OwnerDetailsStep;