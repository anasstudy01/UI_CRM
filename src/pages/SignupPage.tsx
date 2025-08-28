import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Eye, EyeOff, Mail, Lock, User, CheckSquare, Square } from 'lucide-react';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import laptop from '../assets/lapi.png';
import logo from '../assets/company-logo 1.png';
import type { SignupFormData } from '../types';
import { useNavigate } from 'react-router-dom';
import { RiSecurePaymentLine } from "react-icons/ri";
import { IoMdTime } from "react-icons/io";

interface SignupPageProps {
  onSwitchToLogin?: () => void;
}

/**
 * Signup page component - Pure UI version without API calls
 * Handles user registration with mock validation
 */
const SignupPage: React.FC<SignupPageProps> = ({ onSwitchToLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Validation schema using Yup
  const validationSchema = Yup.object({
    name: Yup.string()
      .min(2, 'Name must be at least 2 characters')
      .max(50, 'Name must be less than 50 characters')
      .required('Full name is required'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must contain at least one uppercase letter, one lowercase letter, and one number'
      )
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords must match')
      .required('Please confirm your password'),
    agreeToTerms: Yup.boolean()
      .oneOf([true], 'You must agree to the terms and conditions')
      .required('You must agree to the terms and conditions'),
  });

  // Formik form handling
  const formik = useFormik<SignupFormData>({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      agreeToTerms: false,
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        // Mock signup process
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Mock successful signup
        localStorage.setItem('mockUser', JSON.stringify({ 
          email: values.email, 
          name: values.name 
        }));
        
        console.log('Account created successfully:', values);
        alert('Account created successfully! You can now login.');
        navigate('/login');
     
      } catch (error) {
        console.error('Signup failed:', error);
        if (error instanceof Error) {
          formik.setFieldError('email', error.message);
        } else {
          formik.setFieldError('email', 'Signup failed. Please try again.');
        }
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

      {/* Right side - Signup form */}
      <div className="flex-1 flex items-center justify-center p-12 bg-gray-50">
        <div className="w-full max-w-md border border-gray-200 bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Billion Infotech</h2>
            <h4 className="text-2xl font-bold text-green-600 mb-2">Create Account</h4>
            <p className="text-gray-600 text-sm">Join us and start trading today</p>
          </div>

          <form onSubmit={formik.handleSubmit} className="space-y-6">
            {/* Full Name Input */}
            <Input
              label="Full Name"
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.name && formik.errors.name ? formik.errors.name : undefined}
              icon={<User className="h-5 w-5 text-gray-400" />}
              required
            />

            {/* Email Input */}
            <Input
              label="Email"
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && formik.errors.email ? formik.errors.email : undefined}
              icon={<Mail className="h-5 w-5 text-gray-400" />}
              required
            />

            {/* Password Input */}
            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Create a strong password"
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

            {/* Confirm Password Input */}
            <div className="relative">
              <Input
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.confirmPassword && formik.errors.confirmPassword ? formik.errors.confirmPassword : undefined}
                icon={<Lock className="h-5 w-5 text-gray-400" />}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            {/* Terms and Conditions Checkbox */}
            <div className="flex items-start space-x-3">
              <button
                type="button"
                className="flex-shrink-0 mt-1"
                onClick={() => formik.setFieldValue('agreeToTerms', !formik.values.agreeToTerms)}
              >
                {formik.values.agreeToTerms ? (
                  <CheckSquare className="h-5 w-5 text-green-600" />
                ) : (
                  <Square className="h-5 w-5 text-gray-400" />
                )}
              </button>
              <div className="text-sm">
                <label className="text-gray-700">
                  I agree to the{' '}
                  <a href="#" className="text-green-600 hover:text-green-500 underline">
                    Terms and Conditions
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-green-600 hover:text-green-500 underline">
                    Privacy Policy
                  </a>
                </label>
                {formik.touched.agreeToTerms && formik.errors.agreeToTerms && (
                  <p className="text-red-500 text-xs mt-1">{formik.errors.agreeToTerms}</p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || !formik.isValid}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>

            {/* Switch to Login */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    if (onSwitchToLogin) {
                      onSwitchToLogin();
                    }
                    navigate('/login');
                  }}
                  className="font-medium text-green-600 hover:text-green-500 underline"
                >
                  Sign In
                </button>
              </p>
            </div>
          </form>

         
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
