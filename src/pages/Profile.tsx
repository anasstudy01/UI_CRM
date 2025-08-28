import React, { useState, useRef, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Camera, User, Upload } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import type { ProfileFormData } from '../types/index';


// Validation schemas
const profileValidationSchema = Yup.object({
  firstName: Yup.string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters')
    .required('First name is required'),
  lastName: Yup.string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters')
    .required('Last name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  phone: Yup.string()
    .matches(/^[+]?[\d\s\-()]+$/, 'Invalid phone number')
    .min(10, 'Phone number must be at least 10 digits')
    .required('Phone number is required'),
  dateOfBirth: Yup.date()
    .max(new Date(), 'Date of birth cannot be in the future')
    .required('Date of birth is required'),
  address: Yup.string()
    .min(5, 'Address must be at least 5 characters')
    .required('Address is required'),
  city: Yup.string()
    .min(2, 'City must be at least 2 characters')
    .required('City is required'),
  country: Yup.string()
    .min(2, 'Country must be at least 2 characters')
    .required('Country is required'),
  postalCode: Yup.string()
    .min(3, 'Postal code must be at least 3 characters')
    .required('Postal code is required'),
});

const Profile: React.FC = () => {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initial form values - will be updated when profile data is loaded
  const [initialProfileValues, setInitialProfileValues] = useState<ProfileFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    address: '',
    city: '',
    country: '',
    postalCode: '',
  });

  // Load profile data on component mount
  useEffect(() => {
    const loadProfileData = async () => {
      setIsLoadingProfile(true);
      try {
        // Mock profile data loading
        const mockProfileData: ProfileFormData = {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          phone: '+1234567890',
          dateOfBirth: '1990-01-15',
          address: '123 Main St',
          city: 'New York',
          country: 'United States',
          postalCode: '10001',
        };
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setInitialProfileValues(mockProfileData);
      } catch (error) {
        console.error('Error loading profile data:', error);
      } finally {
        setIsLoadingProfile(false);
      }
    };

    loadProfileData();
  }, []);

  const handleProfileSubmit = async (values: ProfileFormData) => {
    setIsLoading(true);
    try {
      // Mock profile update
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Profile updated:', values);
      alert('Profile updated successfully!');
      // Update the initial values to reflect the changes
      setInitialProfileValues(values);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
        <p className="text-gray-600">Manage your personal information and profile picture</p>
      </div>

      {isLoadingProfile ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          <span className="ml-2 text-gray-600">Loading profile data...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">{/* Profile Picture Section */}
        <div className="lg:col-span-1">
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile Picture</h2>
            
            <div className="flex flex-col items-center space-y-4">
              {/* Profile Image Display */}
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-16 h-16 text-gray-400" />
                  )}
                </div>
                
                {/* Camera Icon Overlay */}
                <button
                  type="button"
                  onClick={triggerFileInput}
                  className="absolute bottom-0 right-0 bg-green-600 text-white p-2 rounded-full shadow-lg hover:bg-green-700 transition-colors"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>

              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />

              {/* Upload Button */}
              <Button
                onClick={triggerFileInput}
                variant="outline"
                className="w-full"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload New Picture
              </Button>

              <div className="text-sm text-gray-500 text-center">
                <p>Recommended: Square image, at least 200x200px</p>
                <p>Max file size: 5MB</p>
                <p>Supported formats: JPG, PNG, GIF</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Personal Details Section */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Personal Details</h2>
            
            <Formik
              initialValues={initialProfileValues}
              validationSchema={profileValidationSchema}
              onSubmit={handleProfileSubmit}
              enableReinitialize
            >
              {({ isSubmitting }) => (
                <Form className="space-y-6">
                  {/* Name Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                        First Name *
                      </label>
                      <Field
                        name="firstName"
                        type="text"
                        as={Input}
                        placeholder="Enter your first name"
                      />
                      <ErrorMessage name="firstName" component="div" className="text-red-500 text-sm mt-1" />
                    </div>

                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name *
                      </label>
                      <Field
                        name="lastName"
                        type="text"
                        as={Input}
                        placeholder="Enter your last name"
                      />
                      <ErrorMessage name="lastName" component="div" className="text-red-500 text-sm mt-1" />
                    </div>
                  </div>

                  {/* Email and Phone */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address *
                      </label>
                      <Field
                        name="email"
                        type="email"
                        as={Input}
                        placeholder="Enter your email"
                      />
                      <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number *
                      </label>
                      <Field
                        name="phone"
                        type="tel"
                        as={Input}
                        placeholder="Enter your phone number"
                      />
                      <ErrorMessage name="phone" component="div" className="text-red-500 text-sm mt-1" />
                    </div>
                  </div>

                  {/* Date of Birth */}
                  <div>
                    <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
                      Date of Birth *
                    </label>
                    <Field
                      name="dateOfBirth"
                      type="date"
                      as={Input}
                    />
                    <ErrorMessage name="dateOfBirth" component="div" className="text-red-500 text-sm mt-1" />
                  </div>

                  {/* Address */}
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                      Address *
                    </label>
                    <Field
                      name="address"
                      type="text"
                      as={Input}
                      placeholder="Enter your full address"
                    />
                    <ErrorMessage name="address" component="div" className="text-red-500 text-sm mt-1" />
                  </div>

                  {/* City, Country, Postal Code */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                        City *
                      </label>
                      <Field
                        name="city"
                        type="text"
                        as={Input}
                        placeholder="Enter your city"
                      />
                      <ErrorMessage name="city" component="div" className="text-red-500 text-sm mt-1" />
                    </div>

                    <div>
                      <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                        Country *
                      </label>
                      <Field
                        name="country"
                        type="text"
                        as={Input}
                        placeholder="Enter your country"
                      />
                      <ErrorMessage name="country" component="div" className="text-red-500 text-sm mt-1" />
                    </div>

                    <div>
                      <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">
                        Postal Code *
                      </label>
                      <Field
                        name="postalCode"
                        type="text"
                        as={Input}
                        placeholder="Enter postal code"
                      />
                      <ErrorMessage name="postalCode" component="div" className="text-red-500 text-sm mt-1" />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      disabled={isSubmitting || isLoading}
                      className="bg-green-600 hover:bg-green-700 px-8"
                    >
                      {isSubmitting || isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Updating...
                        </>
                      ) : (
                        <>
                          <User className="w-4 h-4 mr-2" />
                          Update Profile
                        </>
                      )}
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          </Card>
        </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
