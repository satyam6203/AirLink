import InputField from '@/components/InputField';
import PasswordField from '@/components/PasswordField';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { login } from '@/Redux/auth/authThunk';
import { Separator } from '@radix-ui/react-dropdown-menu';
import { Form, Formik } from 'formik'
import { ArrowRight } from 'lucide-react';
import { Loader2 } from 'lucide-react';
import { Lock } from 'lucide-react';
import { Mail } from 'lucide-react';
import React from 'react'
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';

const LoginForm = () => {
     const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  // Validation schema using Yup
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .required('Email is required')
      .email('Invalid email format'),
    password: Yup.string()
      .required('Password is required')
      .min(6, 'Password must be at least 6 characters'),
  });

  const initialValues = {
    email: '',
    password: ''
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setSubmitting(true);
      const result = await dispatch(login(values));

      if (login.fulfilled.match(result)) {
        // Login successful, redirect to appropriate dashboard based on role
        const role = result.payload?.user?.role || 'ROLE_USER';

        if (role === 'ROLE_AIRLINE_OWNER') {
          navigate('/airline/dashboard');
        } else if (role === 'ROLE_SYSTEM_ADMIN') {
          navigate('/super-admin/dashboard');
        } else {
          navigate('/traveler');
        }
      }
    } catch (err) {
      console.error('Login failed:', err);
    } finally {
      setSubmitting(false);
    }
  };
  return (
      <Formik
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  onSubmit={handleSubmit}
                >
                  {({ isSubmitting }) => (
                    <Form className="space-y-6">
                      {/* Error alert */}
                      {error && (
                        <Alert className="border-red-200 bg-red-50 text-red-800">
                          <AlertDescription className="flex items-center">
                            <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                            {error}
                          </AlertDescription>
                        </Alert>
                      )}

                      {/* Email Field */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center">
                          <Mail className="w-4 h-4 mr-2 text-gray-400" />
                          Email Address
                        </label>
                        <InputField
                          name="email"
                          placeholder="Enter your email"
                          type="email"
                          className="h-12 px-4 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl"
                        />
                      </div>

                      {/* Password Field */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center">
                          <Lock className="w-4 h-4 mr-2 text-gray-400" />
                          Password
                        </label>
                        <PasswordField
                          name="password"
                          placeholder="Enter your password"
                          className="h-12 px-4 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl"
                        />
                      </div>

                      {/* Remember me and forgot password */}
                      <div className="flex items-center justify-between">
                        <label className="flex items-center">
                          <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                          <span className="ml-2 text-sm text-gray-600">Remember me</span>
                        </label>
                        <Link
                          to="/forgot-password"
                          className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors"
                        >
                          Forgot Password?
                        </Link>
                      </div>

                      {/* Login Button */}
                      <Button
                        type="submit"
                        className="w-full  text-white font-semibold  shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] group"
                        disabled={isSubmitting || loading}
                      >
                        <div className="flex items-center justify-center">
                          {(isSubmitting || loading) ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Signing in...
                            </>
                          ) : (
                            <>
                              Sign In
                              <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </>
                          )}
                        </div>
                      </Button>

                      <Separator className="my-6" />

                      {/* Social login options */}
                      <div className="space-y-3">
                        <p className="text-center text-sm text-gray-500">Or continue with</p>
                        <div className="grid grid-cols-2 gap-3">
                          <Button variant="outline" className="h-11 border-gray-200 hover:bg-gray-50 rounded-xl">
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                            </svg>
                            <span className="ml-2 text-sm">Google</span>
                          </Button>
                          <Button variant="outline" className="h-11 border-gray-200 hover:bg-gray-50 rounded-xl">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                            </svg>
                            <span className="ml-2 text-sm">Twitter</span>
                          </Button>
                        </div>
                      </div>

                      {/* Register Link */}
                      <div className="text-center pt-4">
                        <p className="text-sm text-gray-600">
                          Don't have an account? {' '}
                          <Link
                            to="/register"
                            className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors"
                          >
                            Create Account
                          </Link>
                        </p>
                      </div>
                    </Form>
                  )}
                </Formik>
  )
}

export default LoginForm