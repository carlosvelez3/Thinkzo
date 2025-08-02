/**
 * Accessible Input Component
 * Enhanced input with proper accessibility features
 */
import React from 'react';
import { useAccessibility } from '../../hooks/useAccessibility';

interface AccessibleInputProps {
  label: string;
  type?: 'text' | 'email' | 'tel' | 'url' | 'password';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  helpText?: string;
  className?: string;
  icon?: React.ReactNode;
}

const AccessibleInput: React.FC<AccessibleInputProps> = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  error,
  helpText,
  className = '',
  icon
}) => {
  const { useUniqueId } = useAccessibility();
  const inputId = useUniqueId('input');
  const errorId = useUniqueId('error');
  const helpId = useUniqueId('help');

  return (
    <div className={className}>
      <label 
        htmlFor={inputId} 
        className="block text-slate-300 text-sm font-medium mb-2"
      >
        {label}
        {required && <span className="text-red-400 ml-1" aria-label="required">*</span>}
      </label>
      
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">
            {icon}
          </div>
        )}
        
        <input
          id={inputId}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          aria-describedby={`${error ? errorId : ''} ${helpText ? helpId : ''}`.trim() || undefined}
          aria-invalid={!!error}
          className={`w-full bg-slate-700/50 border rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
            icon ? 'pl-12' : ''
          } ${
            error ? 'border-red-500' : 'border-slate-600'
          }`}
        />
      </div>
      
      {error && (
        <div id={errorId} className="text-red-400 text-sm mt-1" role="alert">
          {error}
        </div>
      )}
      
      {helpText && !error && (
        <div id={helpId} className="text-slate-400 text-sm mt-1">
          {helpText}
        </div>
      )}
    </div>
  );
};

export default AccessibleInput;