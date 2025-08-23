import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import Input from '../components/ui/Input';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import { authAPI } from '../services/api';

import type { LoginFormData } from '../types';
import { IoMdTime } from 'react-icons/io';
import { RiSecurePaymentLine } from 'react-icons/ri';
import laptop from '../assets/lapi.png';
import logo from '../assets/company-logo 1.png';

interface LoginPageProps {
  onLogin: (token: string) => void;
  onSwitchToSignup?: () => void;
}

/**
 * Login page component based on the Billion InfoTech Design
 * Handles user authentication with email and password
 */
const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onSwitchToSignup }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Validation schema using Yup
  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
  });

  // Formik form handling
  const formik = useFormik<LoginFormData>({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        const response = await authAPI.login(values.email, values.password);
        onLogin(response.token);
      } catch (error) {
        console.error('Login failed:', error);
        formik.setFieldError('password', 'Invalid email or password');
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
     <div className="max-w-[35%] hidden md:block items-center justify-center">
        <div className=' bg-gradient-to-t from-green-500 to-white w-full h-screen flex justify-center flex-col items-center p-10'>

          
          <img src={logo} alt="Billion Infotech" className="w-40 " />
          <img src={laptop} alt="Billion Infotech" className="" />
          <div className=''>
            <h1 className='text-white text-4xl font-bold'>Manage. <span className='text-gray-900'>Monitor.</span> Grow.</h1>
         <div className='flex gap-4 px-4 my-5'>

         <p className='text-xl font-extrabold'>
          <RiSecurePaymentLine className="inline-block" /> SSL Secure Login</p>
            <p className='text-xl font-extrabold'>  
               <IoMdTime className="inline-block" /> 
                99% Uptime </p>
         </div>

          </div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="flex-1 flex items-center justify-center p-12  bg-gray-50">
        <div className="w-full max-w-md border border-gray-200 bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Billion Infotech</h2>
            <h4 className="text-2xl font-bold text-green-600 mb-2">Login</h4>
          </div>

          <form onSubmit={formik.handleSubmit} className="space-y-6">
            <Input
            
              label="Email"
              type="email"
              name="email"
              placeholder="Email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && formik.errors.email ? formik.errors.email : undefined}
              icon={<Mail className="h-5 w-5 text-gray-400" />}
              required
            />

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.password && formik.errors.password ? formik.errors.password : undefined}
                icon={<Lock className="h-5 w-5 text-gray-400" />}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            <div className="text-right">
              <a href="#" className="text-sm text-gray-600 hover:text-gray-900 underline">
                Forgot password?
              </a>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Verifying...' : 'Verify'}
            </Button>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    if (onSwitchToSignup) {
                      onSwitchToSignup();
                    }
                    navigate('/signup');
                  }}
                  className="font-medium text-green-600 hover:text-green-500 underline"
                >
                  Sign up now
                </button>
              </p>
            </div>
          </form>

          {/* Demo credentials info */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800 font-medium mb-2">Demo Credentials:</p>
            <p className="text-sm text-blue-700">Email: demo@ambitious.com</p>
            <p className="text-sm text-blue-700">Password: password123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
