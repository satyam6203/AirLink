import React from 'react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useField } from 'formik';

const InputField = ({
  label,
  name,
  placeholder = '',
  type = 'text',
  disabled = false,
}) => {
  const [field, meta] = useField(name);

  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </Label>
      <Input
        id={name}
        type={type}
        placeholder={placeholder}
        className={`w-full transition-all duration-200 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:bg-gray-800 dark:border-gray-700 ${meta.touched && meta.error ? 'border-red-500 focus:border-red-500 focus:ring-red-100' : ''}`}
        disabled={disabled}
        {...field}
      />
      {meta.touched && meta.error && (
        <p className="text-xs text-red-500 mt-1 animate-fade-in">
          {meta.error}
        </p>
      )}
    </div>
  );
};

export default InputField;