import React from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import InputField from '../../components/InputField';
import PasswordField from '../../components/PasswordField';
import { login } from '../../Redux/auth/authThunk';
import {
  Loader2,
  Plane,
  Mail,
  Lock,
  ArrowRight,
  Shield,
  Globe,
  Users,
  CheckCircle,
  Star
} from 'lucide-react';
import LoginForm from './LoginForm';
import Register from './RegisterForm';

const Auth = ({isLogin}) => {
 

  const features = [
    { icon: Shield, title: 'Secure Platform', desc: 'End-to-end encryption' },
    { icon: Globe, title: 'Global Coverage', desc: '500+ destinations' },
    { icon: Users, title: 'Trusted by Millions', desc: '10M+ happy customers' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-72 h-72 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse particle-1"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-2000 particle-2"></div>
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-72 h-72 bg-pink-500/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-4000"></div>
        <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-cyan-500/10 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-float animation-delay-1000"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-indigo-500/10 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-float animation-delay-500"></div>
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='1.5'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      ></div>

      <div className="relative z-10 min-h-screen flex">
        {/* Left side - Branding and Features */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-12 xl:px-20 animate-slide-in-left">
          <div className="max-w-md">
            {/* Logo and brand */}
            <div className="flex items-center mb-8">
              <div className="bg-gradient-to-r from-blue-400 to-purple-400 p-3 rounded-2xl shadow-lg">
                <Plane className="h-8 w-8 text-white" />
              </div>
              <div className="ml-4">
                <h1 className="text-2xl font-bold text-white">SkyBooker</h1>
                <p className="text-blue-200 text-sm">Premium Flight Management</p>
              </div>
            </div>

            {/* Main heading */}
            <div className="mb-8">
              <h2 className="text-4xl xl:text-5xl font-bold text-white mb-4 leading-tight">
                Welcome to the
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> Future </span>
                of Flight Management
              </h2>
              <p className="text-blue-200 text-lg leading-relaxed">
                Experience seamless airline operations with our cutting-edge platform designed for modern aviation professionals.
              </p>
            </div>

            {/* Features */}
            <div className="space-y-4">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/15 transition-all duration-300 hover-lift animate-fade-in"
                  style={{ animationDelay: `${(index + 1) * 200}ms` }}
                >
                  <div className="bg-gradient-to-r from-blue-400 to-purple-400 p-2 rounded-lg">
                    <feature.icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-white font-semibold">{feature.title}</h3>
                    <p className="text-blue-200 text-sm">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Statistics */}
            <div className="mt-8 grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">99.9%</div>
                <div className="text-blue-200 text-sm">Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">24/7</div>
                <div className="text-blue-200 text-sm">Support</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">500+</div>
                <div className="text-blue-200 text-sm">Airlines</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 animate-slide-in-right">
          <div className="w-full max-w-md">
            <Card className="bg-white/95 backdrop-blur-xl border-0 shadow-2xl overflow-hidden animate-scale-in hover-lift">
              <CardContent className="p-8">
                {/* Mobile logo */}
                <div className="lg:hidden flex items-center justify-center mb-8">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-2xl">
                    <Plane className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-3">
                    <h1 className="text-xl font-bold text-gray-900">SkyBooker</h1>
                  </div>
                </div>

                {/* Form header */}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h3>
                  <p className="text-gray-600">{isLogin ? "Sign in to access your dashboard" : "Create an account to get started"}</p>

                  {/* Role badges */}
                  <div className="flex justify-center gap-2 mt-4">
                    {isLogin && <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700 border-blue-200">
                      <Users className="w-3 h-3 mr-1" />
                      Admin
                    </Badge>}
                    <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-700 border-purple-200">
                      <Shield className="w-3 h-3 mr-1" />
                      Secure
                    </Badge>
                  </div>
                </div>

        {/* render form */}

        {isLogin ? <LoginForm /> : <Register />}

              
              </CardContent>
            </Card>

            {/* Trust indicators */}
            <div className="mt-6 text-center">
              <div className="flex items-center justify-center space-x-6 text-white/70">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  <span className="text-sm">SSL Secured</span>
                </div>
                <div className="flex items-center">
                  <Shield className="w-4 h-4 mr-1" />
                  <span className="text-sm">GDPR Compliant</span>
                </div>
                <div className="flex items-center">
                  <Star className="w-4 h-4 mr-1 text-yellow-400" />
                  <span className="text-sm">4.9/5 Rating</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;