import React, { useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Mail,
  Phone,
  Clock,
  ArrowLeft,
  ArrowRight,
  HeadphonesIcon,
  Users,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Globe,
  MessageSquare
} from 'lucide-react';

const SupportContactStep = ({ data, onDataChange, onNext, onPrevious }) => {
  const validationSchema = Yup.object({
    supportEmail: Yup.string()
      .email('Invalid email format')
      .nullable(),
    supportPhone: Yup.string()
      .matches(/^\+?[\d\s\-\(\)]+$/, 'Invalid phone number format')
      .nullable(),
    supportHours: Yup.string()
      .nullable()
  });

  const initialValues = {
    supportEmail: data?.supportEmail || '',
    supportPhone: data?.supportPhone || '',
    supportHours: data?.supportHours || '',
    additionalNotes: data?.additionalNotes || ''
  };

  const handleSubmit = (values) => {
    onDataChange(values);
    onNext();
  };

  const supportHoursExamples = [
    '24/7 Support',
    'Monday - Friday: 9:00 AM - 6:00 PM (UTC)',
    'Business Hours: 8:00 AM - 8:00 PM EST',
    'Mon-Fri: 9-17, Sat-Sun: 10-14 (GMT)',
    'Available during flight operations only'
  ];

  const FormField = ({ name, label, children, helpText, ...props }) => (
    <div className="space-y-2">
      <Label htmlFor={name} className="text-gray-700 flex items-center gap-2 font-medium">
        {props.icon && <props.icon className="w-4 h-4 text-gray-500" />}
        {label}
        <span className="text-green-600 text-sm font-normal ml-1">(Optional)</span>
        {helpText && (
          <div className="ml-auto">
            <div className="group relative">
              <AlertCircle className="w-4 h-4 text-gray-400 cursor-help" />
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 text-xs text-white bg-gray-900 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                {helpText}
              </div>
            </div>
          </div>
        )}
      </Label>
      {children}
      <ErrorMessage name={name} component="div" className="text-red-500 text-sm flex items-center gap-1" />
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg">
          <Users className="w-8 h-8 text-white" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Customer Support Center
          </h3>
          <p className="text-gray-600 text-lg">
            Configure how customers can reach your support team
          </p>
        </div>
        <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
          <CheckCircle className="w-4 h-4" />
          <span>All fields are optional</span>
        </div>
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values, setFieldValue, isValid, dirty }) => {
          return (
            <Form className="space-y-8">
              {/* Contact Information Section */}
              <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-6 border border-blue-200">
                <div className="flex items-center space-x-3 mb-6">
                  <MessageSquare className="w-6 h-6 text-blue-600" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Contact Channels</h4>
                    <p className="text-sm text-gray-600">Primary ways customers can reach your support team</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Support Email */}
                  <FormField
                    name="supportEmail"
                    label="Support Email"
                    icon={Mail}
                    helpText="Primary email address for customer inquiries"
                  >
                    <Field name="supportEmail">
                      {({ field, meta }) => (
                        <div className="relative">
                          <Input
                            {...field}
                            id="supportEmail"
                            type="email"
                            placeholder="support@yourairline.com"
                            className={`transition-all duration-300 hover:shadow-md focus:shadow-lg pr-10 ${
                              meta.touched && meta.error
                                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                                : meta.touched && field.value
                                ? 'border-green-500 focus:border-green-500 focus:ring-green-500/20'
                                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500/20'
                            }`}
                          />
                          {meta.touched && field.value && (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                              {meta.error ? (
                                <AlertCircle className="w-4 h-4 text-red-500" />
                              ) : (
                                <CheckCircle className="w-4 h-4 text-green-500" />
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </Field>
                  </FormField>

                  {/* Support Phone */}
                  <FormField
                    name="supportPhone"
                    label="Support Phone"
                    icon={Phone}
                    helpText="Phone number for urgent customer support"
                  >
                    <Field name="supportPhone">
                      {({ field, meta }) => (
                        <div className="relative">
                          <Input
                            {...field}
                            id="supportPhone"
                            type="tel"
                            placeholder="+1 800 123 4567"
                            className={`transition-all duration-300 hover:shadow-md focus:shadow-lg pr-10 ${
                              meta.touched && meta.error
                                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                                : meta.touched && field.value
                                ? 'border-green-500 focus:border-green-500 focus:ring-green-500/20'
                                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500/20'
                            }`}
                          />
                          {meta.touched && field.value && (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                              {meta.error ? (
                                <AlertCircle className="w-4 h-4 text-red-500" />
                              ) : (
                                <CheckCircle className="w-4 h-4 text-green-500" />
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </Field>
                  </FormField>
                </div>
              </div>

              {/* Support Hours Section */}
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-200">
                <div className="flex items-center space-x-3 mb-6">
                  <Clock className="w-6 h-6 text-purple-600" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Availability Schedule</h4>
                    <p className="text-sm text-gray-600">When customers can expect support response</p>
                  </div>
                </div>

                <FormField
                  name="supportHours"
                  label="Support Hours"
                  icon={Clock}
                  helpText="Operating hours for customer support team"
                >
                  <Field name="supportHours">
                    {({ field }) => (
                      <div className="space-y-4">
                        <Input
                          {...field}
                          id="supportHours"
                          placeholder="e.g., Monday - Friday: 9:00 AM - 6:00 PM (UTC)"
                          className="transition-all duration-300 hover:shadow-md focus:shadow-lg"
                        />
                        <div className="bg-white rounded-lg border p-4">
                          <p className="text-sm font-medium text-gray-700 mb-3">Quick Templates:</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {supportHoursExamples.map((example, index) => (
                              <button
                                key={index}
                                type="button"
                                onClick={() => setFieldValue('supportHours', example)}
                                className="text-left text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 transition-all p-2 rounded-lg border border-transparent hover:border-blue-200"
                              >
                                {example}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </Field>
                </FormField>
              </div>

              {/* Additional Notes */}
              <FormField name="additionalNotes" label="Additional Notes" icon={HeadphonesIcon} optional>
                <Field name="additionalNotes">
                  {({ field }) => (
                    <Textarea
                      {...field}
                      id="additionalNotes"
                      placeholder="Any additional information about your support services, special procedures, or contact preferences..."
                      rows={4}
                      className="transition-all duration-200 hover:shadow-md focus:shadow-lg"
                    />
                  )}
                </Field>
              </FormField>

              {/* Info Box */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <HeadphonesIcon className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-blue-900">
                      Why provide support information?
                    </h4>
                    <div className="text-sm text-blue-700 space-y-1">
                      <p>• Help customers reach you directly for urgent matters</p>
                      <p>• Improve customer satisfaction and trust</p>
                      <p>• Enable better coordination with travel agents</p>
                      <p>• Provide transparency about service availability</p>
                    </div>
                    <p className="text-xs text-blue-600 mt-2">
                      You can update this information anytime from your dashboard.
                    </p>
                  </div>
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-8 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onPrevious}
                  className="flex items-center gap-2 px-6 py-3 hover:bg-gray-50 transition-all duration-200"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Previous Step
                </Button>

                <Button
                  type="submit"
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-3 px-8 rounded-xl shadow-2xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-3xl flex items-center gap-2 group"
                >
                  Review & Launch
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default SupportContactStep;