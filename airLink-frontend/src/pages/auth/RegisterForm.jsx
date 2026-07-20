import React from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

import InputField from '../../components/InputField';
import PasswordField from '../../components/PasswordField';
import { signup } from '../../Redux/auth/authThunk';
import { Loader2 } from 'lucide-react';

// Validation schema using Yup
const validationSchema = Yup.object().shape({
  fullName: Yup.string()
    .required('Full name is required')
    .min(3, 'Full name must be at least 3 characters'),
  email: Yup.string()
    .required('Email is required')
    .email('Please enter a valid email address'),
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters')
    .matches(/^(?=.*[A-Za-z])(?=.*\d)/, 'Password must contain both letters and numbers'),
  mobile: Yup.string()
    .required('Mobile number is required')
    .matches(/^\d{10,15}$/, 'Mobile number must be between 10 and 15 digits'),
});

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const initialValues = {
    fullName: '',
    email: '',
    password: '',
    mobile: ''
  };

  const handleSubmit = async (values,  setSubmitting ) => {
    try {

      values.role="ROLE_CUSTOMER"
      
      const result = await dispatch(signup(values)).unwrap();
      
      if (signup.fulfilled.match(result)) {
        // Registration successful, redirect to appropriate dashboard based on role
        const user = result.payload.user;
        if (user && user.role === 'ROLE_USER') {
          navigate('/traveler/dashboard');
        } else if (user && user.role === 'ROLE_AIRLINE_OWNER') {
          navigate('/airline/dashboard');
        } else if (user && user.role === 'ROLE_SYSTEM_ADMIN') {
          navigate('/super-admin/dashboard');
        } else {
          navigate('/');
        }
      }
    } catch (err) {
      console.error('Registration failed:', err);
    } finally {
      // setSubmitting(false);
    }
  };

  return (
    
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-4">
            {/* Error alert */}
            {error && (
              <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm border border-red-100 animate-fade-in">
                {error}
              </div>
            )}

            {/* Full Name */}
            <InputField
              label="Full Name"
              name="fullName"
              placeholder="Enter your full name"
            />

            {/* Email */}
            <InputField
              label="Email Address"
              name="email"
              placeholder="Enter your email"
              type="email"
            />

            {/* Password */}
            <PasswordField
              label="Password"
              name="password"
              placeholder="Create a password"
            />

            {/* Mobile Number */}
            <InputField
              label="Mobile Number"
              name="mobile"
              placeholder="Enter your mobile number"
              type="tel"
            />

            {/* Register Button */}
            <Button
              type="submit"
              className="w-full  font-semibold rounded-lg shadow-lg transition-all duration-300 transform hover:translate-y-[-2px] hover:shadow-xl"
              disabled={isSubmitting || loading}
            >
              {(isSubmitting || loading) ? (
                <div className="flex items-center">
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating account...
                </div>
              ) : (
                'Register'
              )}
            </Button>

            {/* Login Link */}
            <div className="text-center mt-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Already have an account? {' '}
                <Link 
                  to="/login" 
                  className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors"
                >
                  Login
                </Link>
              </p>
            </div>
          </Form>
        )}
      </Formik>
    
  );
};

export default Register;