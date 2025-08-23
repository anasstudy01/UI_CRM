import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, X } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const CreateTicketSchema = Yup.object().shape({
  department: Yup.string().required('Department is required'),
  subject: Yup.string()
    .required('Subject is required')
    .min(5, 'Subject must be at least 5 characters'),
  priority: Yup.string().required('Priority is required'),
  description: Yup.string()
    .required('Description is required')
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description cannot exceed 1000 characters'),
});

const departments = [
  { value: '', label: 'Select department' },
  { value: 'technical', label: 'Technical Support' },
  { value: 'billing', label: 'Billing & Accounts' },
  { value: 'trading', label: 'Trading Support' },
  { value: 'kyc', label: 'KYC & Verification' },
  { value: 'general', label: 'General Inquiry' },
];

const priorities = [
  { value: 'low', label: 'Low - General inquiry' },
  { value: 'medium', label: 'Medium - Issue affecting usage' },
  { value: 'high', label: 'High - Critical issue' },
  { value: 'urgent', label: 'Urgent - System down' },
];

const CreateTicket: React.FC = () => {
  const navigate = useNavigate();
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = (files: File[]) => {
    const validFiles = files.filter(file => {
      const validTypes = ['image/', 'video/', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      const isValidType = validTypes.some(type => file.type.startsWith(type));
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB
      return isValidType && isValidSize;
    });

    if (uploadedFiles.length + validFiles.length <= 5) {
      setUploadedFiles(prev => [...prev, ...validFiles]);
    } else {
      alert('Maximum 5 files allowed');
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={() => navigate('/dashboard/support')}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Create Support Ticket</h1>
            <p className="text-gray-600">Submit a new support request</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Ticket Information</h2>
            
            <Formik
              initialValues={{
                department: '',
                subject: '',
                priority: 'medium',
                description: '',
              }}
              validationSchema={CreateTicketSchema}
              onSubmit={async (values, { setSubmitting }) => {
                try {
                  // Here you would typically send the data to your API
                  console.log('Form values:', values);
                  console.log('Uploaded files:', uploadedFiles);
                  
                  // Simulate API call
                  await new Promise(resolve => setTimeout(resolve, 1000));
                  
                  alert('Ticket created successfully!');
                  navigate('/dashboard/support');
                } catch (error) {
                  console.error('Error creating ticket:', error);
                  alert('Error creating ticket. Please try again.');
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              {({ values, isSubmitting }) => (
                <Form className="space-y-6">
                  {/* Department */}
                  <div>
                    <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
                      Department *
                    </label>
                    <Field
                      as="select"
                      name="department"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      {departments.map((dept) => (
                        <option key={dept.value} value={dept.value}>
                          {dept.label}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage name="department" component="div" className="text-red-500 text-sm mt-1" />
                  </div>

                  {/* Subject */}
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                      Subject *
                    </label>
                    <Field
                      name="subject"
                      type="text"
                      placeholder="Brief description of your issue"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    <ErrorMessage name="subject" component="div" className="text-red-500 text-sm mt-1" />
                  </div>

                  {/* Priority */}
                  <div>
                    <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                      Priority *
                    </label>
                    <Field
                      as="select"
                      name="priority"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      {priorities.map((priority) => (
                        <option key={priority.value} value={priority.value}>
                          {priority.label}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage name="priority" component="div" className="text-red-500 text-sm mt-1" />
                  </div>

                  {/* Description */}
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                      Description *
                    </label>
                    <Field
                      as="textarea"
                      name="description"
                      rows={6}
                      placeholder="Please provide a detailed description of your issue..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                    />
                    <div className="flex justify-between items-center mt-1">
                      <ErrorMessage name="description" component="div" className="text-red-500 text-sm" />
                      <span className="text-xs text-gray-500">
                        {values.description.length}/1000
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate('/dashboard/support')}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {isSubmitting ? 'Creating...' : 'Create Ticket'}
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* File Upload */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Attachments</h3>
            
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                dragActive
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-3" />
              <p className="text-sm text-gray-600 mb-2">
                Drop files here or click to upload
              </p>
              <p className="text-xs text-gray-500 mb-4">
                Images, Videos, PDF, DOC (Max 10MB each, 5 files max)
              </p>
              <input
                type="file"
                multiple
                accept="image/*,video/*,.pdf,.doc,.docx"
                onChange={handleFileInput}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer transition-colors"
              >
                Choose Files
              </label>
            </div>

            {/* Uploaded Files List */}
            {uploadedFiles.length > 0 && (
              <div className="mt-4 space-y-2">
                <h4 className="text-sm font-medium text-gray-700">Uploaded Files:</h4>
                {uploadedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded border"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                    <button
                      onClick={() => removeFile(index)}
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Help Info */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Need Help?</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <p>
                <strong>Response Times:</strong>
              </p>
              <ul className="space-y-1 ml-4">
                <li>• Low Priority: 24-48 hours</li>
                <li>• Medium Priority: 12-24 hours</li>
                <li>• High Priority: 4-8 hours</li>
                <li>• Urgent: 1-2 hours</li>
              </ul>
              <p className="mt-3">
                For immediate assistance with critical issues, please contact our emergency support line.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreateTicket;
