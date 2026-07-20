import React, { useEffect } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import AuthCard from '../../components/AuthCard';
import PasswordField from '../../components/PasswordField';
import { resetPassword } from '../../Redux/auth/authThunk';
import { clearResetPasswordState } from '../../Redux/auth/authSlice';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

const ResetPassword: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useParams();
  const { resetPasswordLoading, resetPasswordError, resetPasswordSuccess } = 
    useSelector((state: any) => state.auth);

  // Validation schema using Yup
  const validationSchema = Yup.object().shape({
    newPassword: Yup.string()
      .required('New password is required')
      .min(6, 'Password must be at least 6 characters')
      .matches(/^(?=.*[A-Za-z])(?=.*\d)/, 'Password must contain both letters and numbers'),
    confirmPassword: Yup.string()
      .required('Please confirm your password')
      .oneOf([Yup.ref('newPassword')], 'Passwords must match'),
  });

  const initialValues = {
    newPassword: '',
    confirmPassword: '',
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      dispatch(clearResetPasswordState());
    };
  }, [dispatch]);

  // Redirect to login page after successful password reset
  useEffect(() => {
    if (resetPasswordSuccess) {
      const timer = setTimeout(() => {
        navigate('/login', { state: { success: 'Your password has been reset successfully!' } });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [resetPasswordSuccess, navigate]);

  const handleSubmit = async (values: typeof initialValues, { setSubmitting }: any) => {
    try {
      setSubmitting(true);
      if (!token) {
        console.error('No reset token provided');
        return;
      }

      await dispatch(resetPassword({ token, password: values.newPassword }));
    } catch (err) {
      console.error('Failed to reset password:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthCard 
      title="Reset Your Password"
      description="Set a new password for your account."
    >
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-4">
            {/* Success message */}
            {resetPasswordSuccess && (
              <div className="p-3 bg-green-50 text-green-700 rounded-md text-sm border border-green-100 animate-fade-in">
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-600 mt-0.5" />
                  <p>Your password has been reset successfully! Redirecting to login...</p>
                </div>
              </div>
            )}

            {/* Error message */}
            {resetPasswordError && !resetPasswordSuccess && (
              <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm border border-red-100 animate-fade-in">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 mr-2 text-red-600 mt-0.5" />
                  <p>{resetPasswordError}</p>
                </div>
              </div>
            )}

            {/* New Password */}
            <PasswordField
              label="New Password"
              name="newPassword"
              placeholder="Enter your new password"
              disabled={isSubmitting || resetPasswordLoading}
            />

            {/* Confirm Password */}
            <PasswordField
              label="Confirm Password"
              name="confirmPassword"
              placeholder="Confirm your new password"
              disabled={isSubmitting || resetPasswordLoading}
            />

            {/* Reset Password Button */}
            <Button
              type="submit"
              className="w-full h-10 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-300 transform hover:translate-y-[-2px] hover:shadow-xl"
              disabled={isSubmitting || resetPasswordLoading || resetPasswordSuccess}
            >
              {(isSubmitting || resetPasswordLoading) ? (
                <div className="flex items-center">
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Resetting...
                </div>
              ) : (
                'Reset Password'
              )}
            </Button>
          </Form>
        )}
      </Formik>
    </AuthCard>
  );
};

export default ResetPassword;