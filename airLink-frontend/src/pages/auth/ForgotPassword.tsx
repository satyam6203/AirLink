import React from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import AuthCard from '../../components/AuthCard';
import InputField from '../../components/InputField';
import { forgotPassword } from '../../Redux/auth/authThunk';
import { clearForgotPasswordState } from '../../Redux/auth/authSlice';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

// Validation schema using Yup
const validationSchema = Yup.object().shape({
  email: Yup.string()
    .required('Email is required')
    .email('Please enter a valid email address'),
});

const ForgotPassword: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { forgotPasswordLoading, forgotPasswordError, forgotPasswordSuccess } = 
    useSelector((state: any) => state.auth);

  const initialValues = {
    email: ''
  };

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      dispatch(clearForgotPasswordState());
    };
  }, [dispatch]);

  const handleSubmit = async (values: typeof initialValues, { setSubmitting }: any) => {
    try {
      setSubmitting(true);
      await dispatch(forgotPassword(values.email));
    } catch (err) {
      console.error('Failed to send reset link:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthCard 
      title="Forgot Your Password?"
      description="Enter your email and we'll send you a link to reset your password."
    >
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-4">
            {/* Success message */}
            {forgotPasswordSuccess && (
              <div className="p-3 bg-green-50 text-green-700 rounded-md text-sm border border-green-100 animate-fade-in">
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-600 mt-0.5" />
                  <p>We've sent you a reset link to your email address.</p>
                </div>
              </div>
            )}

            {/* Error message */}
            {forgotPasswordError && !forgotPasswordSuccess && (
              <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm border border-red-100 animate-fade-in">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 mr-2 text-red-600 mt-0.5" />
                  <p>{forgotPasswordError}</p>
                </div>
              </div>
            )}

            {/* Email */}
            <InputField
              label="Email Address"
              name="email"
              placeholder="Enter your email"
              type="email"
            />

            {/* Send Reset Link Button */}
            <Button
              type="submit"
              className="w-full h-10 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-300 transform hover:translate-y-[-2px] hover:shadow-xl"
              disabled={forgotPasswordLoading || isSubmitting}
            >
              {(forgotPasswordLoading || isSubmitting) ? (
                <div className="flex items-center">
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Sending...
                </div>
              ) : (
                'Send Reset Link'
              )}
            </Button>

            {/* Back to Login Link */}
            <div className="text-center mt-4">
              <Button
                variant="ghost"
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                asChild
              >
                <Link to="/login">
                  Back to Login
                </Link>
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </AuthCard>
  );
};

export default ForgotPassword;