import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import ToggleDark from '../components/Toggle/ToggleTheme';

const RegisterShopForm = () => {
  const [formData, setFormData] = useState({
    tenderoId: '',
    tenderoNombre: '',
    tenderoCorreo: '',
    tenderoCelular: '',
    tenderoPassword: '',
    tiendaId: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    const dataToSend = {
      tendero_Id: formData.tenderoId,
      tendero_Nombre: formData.tenderoNombre,
      tendero_Correo: formData.tenderoCorreo,
      tendero_Celular: formData.tenderoCelular,
      tendero_Password: formData.tenderoPassword,
      tienda_Id: formData.tiendaId,
    };

    try {
      const response = await fetch('/api/registrar-tendero', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      const data = await response.json();

      if (data.message === 'Registro de tendero exitoso') {
        setSuccess('¡Registro completado con éxito!');
        setFormData({
          tenderoId: '',
          tenderoNombre: '',
          tenderoCorreo: '',
          tenderoCelular: '',
          tenderoPassword: '',
          tiendaId: '',
        });
      } else {
        setError(data.message || 'Error al registrar');
      }
    } catch (error) {
      setError('Error de conexión. Por favor, intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-400 to-green-300 dark:from-gray-900 dark:to-gray-800 flex flex-col items-center justify-center p-4 transition-colors duration-200">
      <div className="relative w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 transition-all duration-200">
        <div className="absolute top-4 right-4">
          <ToggleDark />
        </div>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-emerald-500 dark:bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Registro de Tendero</h2>
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
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                ID Tendero
              </label>
              <input
                type="text"
                name="tenderoId"
                value={formData.tenderoId}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:text-white dark:placeholder-gray-400"
                placeholder="Ingrese el ID"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Nombre Completo
              </label>
              <input
                type="text"
                name="tenderoNombre"
                value={formData.tenderoNombre}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:text-white dark:placeholder-gray-400"
                placeholder="Nombre completo"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Correo Electrónico
              </label>
              <input
                type="email"
                name="tenderoCorreo"
                value={formData.tenderoCorreo}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:text-white dark:placeholder-gray-400"
                placeholder="correo@ejemplo.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Celular
              </label>
              <input
                type="text"
                name="tenderoCelular"
                value={formData.tenderoCelular}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:text-white dark:placeholder-gray-400"
                placeholder="Número de celular"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="tenderoPassword"
                  value={formData.tenderoPassword}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:text-white dark:placeholder-gray-400"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 px-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                ID Tienda
              </label>
              <input
                type="text"
                name="tiendaId"
                value={formData.tiendaId}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:text-white dark:placeholder-gray-400"
                placeholder="ID de la tienda asociada"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-md text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              'Completar Registro'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterShopForm;