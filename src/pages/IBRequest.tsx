import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Users, Building, Mail, Phone, MapPin, Briefcase } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { ibAPI } from '../services/api';
import type { IBRequest, IBFormData } from '../types/index';

/**
 * IB Request page component
 * Handles Introducing Broker applications
 */
const IBRequest: React.FC = () => {
  const [requests, setRequests] = useState<IBRequest[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Fetch existing IB requests
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const data = await ibAPI.getRequests();
        setRequests(data);
      } catch (error) {
        console.error('Failed to fetch IB requests:', error);
      }
    };

    fetchRequests();
  }, []);

  // Validation schema for IB request form
  const validationSchema = Yup.object({
    companyName: Yup.string().required('Company name is required'),
    contactPerson: Yup.string().required('Contact person is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    phone: Yup.string().required('Phone number is required'),
    address: Yup.string().required('Address is required'),
    experience: Yup.string().required('Trading experience is required'),
  });

  // Form handling with Formik
  const formik = useFormik<IBFormData>({
    initialValues: {
      companyName: '',
      contactPerson: '',
      email: '',
      phone: '',
      address: '',
      experience: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        await ibAPI.submitRequest({
          ...values,
          userId: 1,
        });
        
        // Refresh requests list
        const updatedRequests = await ibAPI.getRequests();
        setRequests(updatedRequests);
        
        setSuccess(true);
        formik.resetForm();
      } catch (error) {
        console.error('Failed to submit IB request:', error);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">IB Request Submitted!</h2>
            <p className="text-gray-600 mb-6">
              Your Introducing Broker application has been submitted for review. 
              We'll contact you within 2-3 business days.
            </p>
            <Button onClick={() => setSuccess(false)}>
              Back to IB Dashboard
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">IB Request</h1>
        <p className="text-gray-600">Apply to become an Introducing Broker and earn commissions</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* IB Application Form */}
        <div className="lg:col-span-2">
          <Card title="IB Application Form" subtitle="Provide your business details">
            <form onSubmit={formik.handleSubmit} className="space-y-6">
              {/* Company Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Company Name"
                    type="text"
                    name="companyName"
                    placeholder="Enter company name"
                    value={formik.values.companyName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.companyName && formik.errors.companyName ? formik.errors.companyName : undefined}
                    icon={<Building className="h-5 w-5 text-gray-400" />}
                    required
                  />

                  <Input
                    label="Contact Person"
                    type="text"
                    name="contactPerson"
                    placeholder="Full name"
                    value={formik.values.contactPerson}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.contactPerson && formik.errors.contactPerson ? formik.errors.contactPerson : undefined}
                    icon={<Users className="h-5 w-5 text-gray-400" />}
                    required
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Email Address"
                    type="email"
                    name="email"
                    placeholder="business@company.com"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.email && formik.errors.email ? formik.errors.email : undefined}
                    icon={<Mail className="h-5 w-5 text-gray-400" />}
                    required
                  />

                  <Input
                    label="Phone Number"
                    type="tel"
                    name="phone"
                    placeholder="+1 (555) 123-4567"
                    value={formik.values.phone}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.phone && formik.errors.phone ? formik.errors.phone : undefined}
                    icon={<Phone className="h-5 w-5 text-gray-400" />}
                    required
                  />
                </div>

                <div className="mt-4">
                  <Input
                    label="Business Address"
                    type="text"
                    name="address"
                    placeholder="Complete business address"
                    value={formik.values.address}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.address && formik.errors.address ? formik.errors.address : undefined}
                    icon={<MapPin className="h-5 w-5 text-gray-400" />}
                    required
                  />
                </div>
              </div>

              {/* Trading Experience */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trading Experience <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <textarea
                    name="experience"
                    rows={4}
                    placeholder="Describe your trading experience, client base, and business model..."
                    value={formik.values.experience}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="block w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                {formik.touched.experience && formik.errors.experience && (
                  <p className="mt-1 text-sm text-red-600">{formik.errors.experience}</p>
                )}
              </div>

              {/* Terms and Conditions */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">IB Program Terms:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Competitive commission structure up to $7 per lot</li>
                  <li>• Real-time reporting and analytics</li>
                  <li>• Dedicated account manager support</li>
                  <li>• Marketing materials and tools provided</li>
                  <li>• Monthly commission payments</li>
                </ul>
              </div>

              <div className="flex justify-end space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => formik.resetForm()}
                >
                  Reset Form
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || !formik.isValid}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* Sidebar Information */}
        <div className="space-y-6">
          {/* IB Benefits */}
          <Card title="IB Benefits" subtitle="Why become an IB?">
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-green-600 font-bold text-sm">$</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">High Commissions</h4>
                  <p className="text-sm text-gray-600">Up to $7 per lot traded</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <Users className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Dedicated Support</h4>
                  <p className="text-sm text-gray-600">Personal account manager</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                  <Briefcase className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Marketing Tools</h4>
                  <p className="text-sm text-gray-600">Professional materials provided</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Application Status */}
          <Card title="Application Status" subtitle="Track your IB requests">
            <div className="space-y-3">
              {requests.length > 0 ? (
                requests.map((request) => (
                  <div key={request.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-900">{request.companyName}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                        {request.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">Contact: {request.contactPerson}</p>
                    <p className="text-xs text-gray-500">
                      Submitted: {new Date(request.submissionDate).toLocaleDateString()}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  <Users className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No applications yet</p>
                </div>
              )}
            </div>
          </Card>

          {/* Requirements */}
          <Card title="Requirements" subtitle="What you need to apply">
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• Registered business entity</li>
              <li>• Minimum 2 years trading experience</li>
              <li>• Existing client base preferred</li>
              <li>• Compliance with local regulations</li>
              <li>• Business license documentation</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default IBRequest;
