import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Upload, FileText, CheckCircle, XCircle, Clock } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { kycAPI } from '../services/api';
import type { KYCDocument, KYCFormData } from '../types';

/**
 * KYC Verification page component
 * Handles document upload and verification process
 */
const KYCVerification: React.FC = () => {
  const [documents, setDocuments] = useState<KYCDocument[]>([]);
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const steps = [
    { title: 'Personal Information', description: 'Basic details verification' },
    { title: 'ID Proof', description: 'Government issued ID' },
    { title: 'Address Proof', description: 'Proof of residence' },
    { title: 'Profile Photo', description: 'Selfie verification' },
  ];

  // Fetch existing documents
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const data = await kycAPI.getDocuments();
        setDocuments(data);
      } catch (error) {
        console.error('Failed to fetch documents:', error);
      }
    };

    fetchDocuments();
  }, []);

  // Validation schema for document upload
  const validationSchema = Yup.object({
    documentType: Yup.string().required('Document type is required'),
    documentNumber: Yup.string().required('Document number is required'),
    expiryDate: Yup.date()
      .min(new Date(), 'Document must not be expired')
      .required('Expiry date is required'),
    file: Yup.mixed().required('Document file is required'),
  });

  // Form handling for document upload
  const formik = useFormik<KYCFormData>({
    initialValues: {
      documentType: 'passport',
      documentNumber: '',
      expiryDate: '',
      file: null,
      uploadDate: new Date().toISOString(),
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        await kycAPI.uploadDocument({
          userId: 1,
          documentType: values.documentType,
          documentNumber: values.documentNumber,
          expiryDate: values.expiryDate,
        });
        
        // Refresh documents list
        const updatedDocuments = await kycAPI.getDocuments();
        setDocuments(updatedDocuments);
        
        formik.resetForm();
        if (activeStep < steps.length - 1) {
          setActiveStep(activeStep + 1);
        }
      } catch (error) {
        console.error('Failed to upload document:', error);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  // Handle file upload
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      formik.setFieldValue('file', file);
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-600" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">KYC Verification</h1>
        <p className="text-gray-600">Complete your identity verification to access all features</p>
      </div>

      {/* Progress Steps */}
      <Card>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Verification Progress</h3>
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`flex flex-col items-center text-center flex-1 ${
                  index < steps.length - 1 ? 'border-r border-gray-200' : ''
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    index <= activeStep
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {index + 1}
                </div>
                <div className="mt-2">
                  <p className="text-sm font-medium text-gray-900">{step.title}</p>
                  <p className="text-xs text-gray-500">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Document Upload Form */}
        <Card title="Upload Documents" subtitle="Submit required documents for verification">
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            {/* Document Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Document Type <span className="text-red-500">*</span>
              </label>
              <select
                name="documentType"
                value={formik.values.documentType}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="passport">Passport</option>
                <option value="driving_license">Driving License</option>
                <option value="national_id">National ID</option>
              </select>
            </div>

            {/* Document Number */}
            <Input
              label="Document Number"
              type="text"
              name="documentNumber"
              placeholder="Enter document number"
              value={formik.values.documentNumber}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.documentNumber && formik.errors.documentNumber ? formik.errors.documentNumber : undefined}
              required
            />

            {/* Expiry Date */}
            <Input
              label="Expiry Date"
              type="date"
              name="expiryDate"
              value={formik.values.expiryDate}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.expiryDate && formik.errors.expiryDate ? formik.errors.expiryDate : undefined}
              required
            />

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Document File <span className="text-red-500">*</span>
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-2">Click to upload or drag and drop</p>
                <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
                <input
                  type="file"
                  accept=".png,.jpg,.jpeg,.pdf"
                  onChange={handleFileChange}
                  className="mt-2"
                />
              </div>
              {formik.values.file && (
                <p className="mt-2 text-sm text-green-600">
                  File selected: {formik.values.file.name}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting || !formik.isValid}
            >
              {isSubmitting ? 'Uploading...' : 'Upload Document'}
            </Button>
          </form>
        </Card>

        {/* Document Status */}
        <Card title="Document Status" subtitle="Track your verification progress">
          <div className="space-y-4">
            {documents.length > 0 ? (
              documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 capitalize">
                        {doc.documentType.replace('_', ' ')}
                      </p>
                      <p className="text-xs text-gray-500">
                        Uploaded: {new Date(doc.uploadDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    {getStatusIcon(doc.status)}
                    <span className={`ml-2 text-sm font-medium capitalize ${
                      doc.status === 'approved' ? 'text-green-600' :
                      doc.status === 'rejected' ? 'text-red-600' : 'text-yellow-600'
                    }`}>
                      {doc.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6">
                <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No documents uploaded yet</p>
              </div>
            )}
          </div>

          {/* Requirements */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Requirements:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Clear, high-quality images</li>
              <li>• All document corners visible</li>
              <li>• No glare or shadows</li>
              <li>• Valid and not expired documents</li>
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default KYCVerification;
