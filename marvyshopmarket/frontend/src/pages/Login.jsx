import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, ShoppingCart } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import ToggleDark from '../components/Toggle/ToggleTheme';

const Login = () => {
  const [cedula, setCedula] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  // Redirección automática si ya está autenticado
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('loggedIn');
    if (isLoggedIn) {
      navigate('/home');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!cedula || !password) {
      setError('Por favor completa todos los campos');
      return;
    }
  
    const cedulaRegex = /^\d{8,10}$/;
    if (!cedulaRegex.test(cedula)) {
      setError('Formato de cédula inválido');
      return;
    }
  
    try {
      setIsLoading(true);
      setError('');
  
      const response = await fetch('/api/verificar-usuario', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userid: cedula,
          password,
        }),
      });
  
      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (err) {
          errorData = { message: 'Error al iniciar sesión' };
        }
        throw new Error(errorData.message || 'Error al iniciar sesión');
      }
  
      const data = await response.json();
      
      // Guardar la sesión del usuario en localStorage
      if (data.name) {
        localStorage.setItem('userName', data.name);
      }
      localStorage.setItem('loggedIn', true);
  
      // Navegar a la página de inicio (dashboard)
      navigate('/home');
  
    } catch (err) {
      setError(err.message || 'Error al conectar con el servidor');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-400 to-green-300 dark:from-gray-900 dark:to-gray-800 flex flex-col items-center justify-center p-4 transition-colors duration-200">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 transition-all duration-200">
        <div className="absolute top-4 right-4">
          <ToggleDark />
        </div>

        {/* Logo Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="bg-emerald-500 dark:bg-emerald-600 p-4 rounded-full mb-4 shadow-lg">
            <ShoppingCart className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Marvy Shopmarket
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Inicia sesión en tu cuenta
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-3 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-500/50 text-red-700 dark:text-red-300 rounded-lg">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label 
              htmlFor="cedula" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              Cédula
            </label>
            <input
              id="cedula"
              type="text"
              inputMode="numeric"
              pattern="\d*"
              maxLength="10"
              value={cedula}
              onChange={(e) => setCedula(e.target.value.replace(/\D/g, ''))}
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:text-white dark:placeholder-gray-400"
              placeholder="Ingresa tu cédula"
            />
          </div>

          <div>
            <label 
              htmlFor="password" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              Contraseña
            </label>
            <div className="relative mt-1">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:text-white dark:placeholder-gray-400"
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

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 dark:border-gray-600 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Recordarme
              </label>
            </div>
            <button
              type="button"
              className="text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 dark:hover:text-emerald-300 transition-colors"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-md text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              'Iniciar sesión'
            )}
          </button>
        </form>

        {/* Sign Up Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            ¿No tienes una cuenta?{' '}
            <Link 
              to="/registrarse" 
              className="font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 dark:hover:text-emerald-300 transition-colors"
            >
              Regístrate aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
