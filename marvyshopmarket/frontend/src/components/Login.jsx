// Login.js
import React, { useState } from 'react';
import { Eye, EyeOff, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [cedula, setCedula] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validación básica
    if (!cedula || !password) {
      setError('Por favor completa todos los campos');
      return;
    }
  
    // Validación de formato de cédula
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
      console.log('Login exitoso:', data);
  
      // Guardar el token y nombre en localStorage si están disponibles
      if (data.token) {
        localStorage.setItem('authToken', data.token);
      }
      if (data.name) {
        localStorage.setItem('userName', data.name); // Guardar el nombre del usuario
      }
  
      // Redirigir al componente Home después del login exitoso
      navigate('/home');
  
    } catch (err) {
      setError(err.message || 'Error al conectar con el servidor');
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <div className="min-h-screen bg-green-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="bg-green-500 p-4 rounded-full mb-4">
            <ShoppingCart className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Marvy Shopmarket</h1>
          <p className="text-gray-500 mt-2">Inicia sesión en tu cuenta</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label 
              htmlFor="cedula" 
              className="block text-sm font-medium text-gray-700"
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
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              placeholder="Ingresa tu cédula"
            />
          </div>

          <div>
            <label 
              htmlFor="password" 
              className="block text-sm font-medium text-gray-700"
            >
              Contraseña
            </label>
            <div className="relative mt-1">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 px-3 flex items-center"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Recordarme
              </label>
            </div>
            <button
              type="button"
              className="text-sm font-medium text-green-600 hover:text-green-500"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
          <p className="text-sm text-gray-600">
            ¿No tienes una cuenta?{' '}
            <button className="font-medium text-green-600 hover:text-green-500">
              Regístrate aquí
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
