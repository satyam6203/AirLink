import React, { useState } from 'react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Eye, EyeOff } from 'lucide-react';
import { useField } from 'formik';

const PasswordField = ({
  label,
  name,
  placeholder = '',
  disabled = false
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [field, meta] = useField(name);

  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </Label>
      <div className="relative">
        <Input
          id={name}
          type={showPassword ? 'text' : 'password'}
          placeholder={placeholder}
          className={`w-full pr-10 transition-all duration-200 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:bg-gray-800 dark:border-gray-700 ${meta.touched && meta.error ? 'border-red-500 focus:border-red-500 focus:ring-red-100' : ''}`}
          disabled={disabled}
          {...field}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1 h-8 w-8 rounded-full"
          onClick={() => setShowPassword(!showPassword)}
          disabled={disabled}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          ) : (
            <Eye className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          )}
        </Button>
      </div>
      {meta.touched && meta.error && (
        <p className="text-xs text-red-500 mt-1 animate-fade-in">
          {meta.error}
        </p>
      )}
    </div>
  );
};

export default PasswordField;