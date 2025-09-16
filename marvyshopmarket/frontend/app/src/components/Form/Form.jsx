import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import ToggleDark from '../Toggle/ToggleTheme';
import { Receipt, Truck, PackageSearch, Users, UserPlus, Bolt, ScrollText, Box } from "lucide-react";

const LoadingSkeleton = () => (
  <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg h-full w-full"></div>
);

const Form = ({
  title,
  initialData = {},
  fields = [],
  selectedIcon,
  apiEndpoint,
  submitButtonText = 'Completar Registro',
  onSubmitSuccess,
  onSubmitError
}) => {
  // Mapeo de iconos por nombre
  const iconMap = {
    Receipt: Receipt,
    Truck: Truck,
    PackageSearch: PackageSearch,
    Users: Users,
    UserPlus: UserPlus,
    Bolt: Bolt,
    ScrollText: ScrollText,
    Box: Box,
  };
  
  const IconComponent = selectedIcon && iconMap[selectedIcon];
  
  const [formData, setFormData] = useState(initialData);
  const [showPasswordFields, setShowPasswordFields] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const togglePasswordVisibility = (fieldName) => {
    setShowPasswordFields(prev => ({
      ...prev,
      [fieldName]: !prev[fieldName]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}${apiEndpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('¡Registro completado con éxito!');
        setFormData(initialData);
        if (onSubmitSuccess) {
          onSubmitSuccess(data);
        }
      } else {
        const errorMessage = data.message || 'Error al registrar';
        setError(errorMessage);
        if (onSubmitError) {
          onSubmitError(errorMessage);
        }
      }
    } catch (error) {
      const errorMessage = 'Error de conexión. Por favor, intenta nuevamente.';
      setError(errorMessage);
      if (onSubmitError) {
        onSubmitError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const renderField = (field) => {
    const {
      name,
      type = 'text',
      label,
      placeholder = '',
      required = false,
      options = []
    } = field;

    const value = formData[name] || '';
    const isPassword = type === 'password';
    const showPassword = showPasswordFields[name];

    if (type === 'select') {
      return (
        <div key={name}>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
            {label}
            {required && <span className="text-red-500">*</span>}
          </label>
          <select
            name={name}
            value={value}
            onChange={handleChange}
            required={required}
            className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:text-white"
          >
            <option value="">Seleccionar...</option>
            {options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      );
    }

    return (
      <div key={name}>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
        <div className={isPassword ? 'relative' : ''}>
          <input
            type={isPassword ? (showPassword ? 'text' : 'password') : type}
            name={name}
            value={value}
            onChange={handleChange}
            required={required}
            className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:text-white dark:placeholder-gray-400"
            placeholder={placeholder}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => togglePasswordVisibility(name)}
              className="absolute inset-y-0 right-0 px-3 flex items-center"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-gray-400 dark:text-gray-500" />
              ) : (
                <Eye className="h-4 w-4 text-gray-400 dark:text-gray-500" />
              )}
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-400 to-green-300 dark:from-gray-900 dark:to-gray-800 flex flex-col items-center justify-center p-4 transition-colors duration-200">
      <div className="relative w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 transition-all duration-200">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-emerald-500 dark:bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            {IconComponent ? <IconComponent className="h-8 w-8 text-white" /> : <PackageSearch className="h-8 w-8 text-white" />}
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
          <p className="text-gray-600 dark:text-gray-300 mt-2">Complete la información requerida</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-500/50 text-red-700 dark:text-red-300 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-3 bg-green-100 dark:bg-green-900/30 border border-green-400 dark:border-green-500/50 text-green-700 dark:text-green-300 rounded-lg">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <div className='flex justify-end mb-4'>
              <ToggleDark />
            </div>
            {fields.map(renderField)}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-md text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              submitButtonText
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Form;