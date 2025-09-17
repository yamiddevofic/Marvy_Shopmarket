import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import ToggleDark from '../Toggle/ToggleTheme';
import { Receipt, Truck, PackageSearch, Users, User, UserPlus, Bolt, ScrollText, Box, Archive } from "lucide-react";

const LoadingSkeleton = () => (
  <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg h-full w-full"></div>
);

const Form = ({
  id,
  data,
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

  // obtener datos obtenidos del endpoint
  const m = data;
  
  const IconComponent = selectedIcon && iconMap[selectedIcon];
  
  const [formData, setFormData] = useState(initialData);
  const [showPasswordFields, setShowPasswordFields] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Pagination calculations
  const totalPages = Math.ceil((m?.length || 0) / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = m?.slice(startIndex, startIndex + itemsPerPage) || [];

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

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

  // Efecto para ocultar el mensaje de éxito después de 5 segundos
  React.useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  // Función para scroll al inicio de la página
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
        scrollToTop(); // Scroll to top after success
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
    <div className={`min-h-screen bg-gradient-to-br from-emerald-400 to-green-300 dark:from-gray-900 dark:to-gray-800 grid grid-cols-1 ${id==='register-shopkeeper' ? 'lg:grid-cols-[35%_65%]': 'place-items-center'} transition-colors duration-200 max-w-7xl mx-auto w-full py-8 px-3`}>
      <div className={`relative ${id==='register-shopkeeper' ? 'w-full max-w-full' : 'w-[45%]'} bg-white dark:bg-gray-800 rounded-tl-2xl rounded-bl-2xl rounded-tr-0 rounded-br-0 shadow-r-xl p-8 transition-all duration-200`}>
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
        <div className="absolute top-4 right-4">
          <ToggleDark />
        </div>
      </div>
      {id==="register-shopkeeper" ? (
        <div className="w-full bg-white dark:bg-gray-800 rounded-tl-0 rounded-tr-2xl rounded-bl-0 rounded-br-2xl shadow-xl transition-all duration-200 flex flex-col justify-center items-center pr-5 border-l border-gray-300 dark:border-gray-600 pl-8">
          {m && m.length > 0 ? (
          <div className='text-black w-full h-auto px-8 py-10 rounded-lg dark:text-white'>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 text-center">Cuaderno de registro de tenderos</h3>
            {/* Aquí puedes agregar la lógica para listar los tenderos registrados */}
            {isLoading ? (
              <LoadingSkeleton />
            ) : (
              <div>
                <div className='hidden lg:block'>
                  <div className="grid grid-cols-[24%_19%_19%_19%_19%] bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow mb-4 place-items-center">
                    <div className='flex gap-2 justify-center items-center w-full'>
                      <h4 className="rl-2 text-lg font-semibold text-gray-900 dark:text-white mb-2">Nombre</h4>
                    </div>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">ID</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white flex">Correo</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white flex">Celular</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white flex">ID Tienda</p>
                  </div>
                </div>
                {// Cartas de tenderos
                currentItems && currentItems.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4">
                    {currentItems.map((tendero) => (
                      <div key={tendero.tendero_Id} className="grid grid-cols-1 lg:grid-cols-[24%_19%_19%_19%_19%] bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow hover:shadow-lg transition-shadow duration-200 lg:place-items-center">
                        <div className='flex gap-2 justify-left items-center w-full'>
                          <div className="mb-4 flex items-center justify-center w-12 h-12 bg-emerald-500 dark:bg-emerald-600 rounded-full px-2">
                            <User className="h-10 w-10 text-emerald-500 !text-white" />
                          </div>
                          <h4 className="rl-2 text-sm font-semibold text-gray-900 dark:text-white mb-2">{tendero.nombre}</h4>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300 flex">{tendero.id}</p>
                        <p className="text-sm text-gray-700 dark:text-gray-300 flex">{tendero.correo}</p>
                        <p className="text-sm text-gray-700 dark:text-gray-300 flex">{tendero.celular}</p>
                        <p className="text-sm text-gray-700 dark:text-gray-300 flex">{tendero.tienda_Id}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600 dark:text-gray-300">No hay tenderos registrados.</p>
                )}

                {/* Pagination Controls */}
                {m && m.length > itemsPerPage && (
                  <div className="flex justify-center items-center mt-6 space-x-2">
                    <button
                      onClick={goToPrevPage}
                      disabled={currentPage === 1}
                      className="px-3 py-1 bg-emerald-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Anterior
                    </button>
                    <span className="text-gray-700 dark:text-gray-300">
                      Página {currentPage} de {totalPages}
                    </span>
                    <button
                      onClick={goToNextPage}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 bg-emerald-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Siguiente
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>) : (
            <div className='text-black w-full h-auto px-8 py-10 rounded-lg dark:text-white flex flex-col justify-center items-center'>
              <div>
                <Archive className="h-16 w-16 text-emerald-500 mb-4" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 text-center">¡Oh, oh!, parece que ocurrió algo</h3>
              <p className="text-gray-600 dark:text-gray-300">No hay tenderos registrados.</p>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default Form;