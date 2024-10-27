import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Eye, EyeOff, User, Store, Upload } from 'lucide-react';
import ToggleDark from '../components/Toggle/ToggleTheme';
import Input from '../components/Input/Input';

const SignUp = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  
  const [formData, setFormData] = useState({
    adm_Id: '',
    adm_Nombre: '',
    adm_Correo: '',
    adm_Celular: '',
    adm_Password: '',
    tienda_Id: '',
    tienda_Nombre: '',
    tienda_Correo: '',
    tienda_Celular: '',
    tienda_Ubicacion: '',
    tienda_Img: null
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const jsonData = { ...formData };
      
      if (formData.tienda_Img) {
        const base64Image = await convertImageToBase64(formData.tienda_Img);
        jsonData.tienda_Img = base64Image;
      }

      const response = await axios.post('/api/registrar-admin-tienda', jsonData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 201) {
        navigate('/');
      }
    } catch (error) {
      setError(
        error.response?.data?.message || 
        'Error al registrar. Por favor, intente nuevamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  const convertImageToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleChange = (e) => {
    if (e.target.type === 'file') {
      const file = e.target.files[0];
      setFormData({
        ...formData,
        [e.target.name]: file
      });
      
      // Crear preview de la imagen
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => setPreviewImage(e.target.result);
        reader.readAsDataURL(file);
      }
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-400 to-green-300 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4 transition-colors duration-200">
      <div className="relative w-full max-w-4xl bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 transition-all duration-200">
        <div className="absolute top-4 right-4">
          <ToggleDark />
        </div>

        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-emerald-500 dark:bg-emerald-600 rounded-full flex items-center justify-center mb-4">
            <Store className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Registro de Tienda y Administrador
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Complete la información requerida
          </p>
          {error && (
            <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-500/50 text-red-700 dark:text-red-300 rounded-lg w-full">
              {error}
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Admin Section */}
          <div className="bg-emerald-50 dark:bg-gray-700/50 p-6 rounded-xl border border-emerald-100 dark:border-gray-600">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-emerald-500 dark:bg-emerald-600 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Información del Administrador
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="ID Administrador"
                name="adm_Id"
                value={formData.adm_Id}
                onChange={handleChange}
                placeholder="Ingresa el ID"
                required
              />
              <Input
                label="Nombre"
                name="adm_Nombre"
                value={formData.adm_Nombre}
                onChange={handleChange}
                placeholder="Nombre completo"
                required
              />
              <Input
                label="Correo"
                type="email"
                name="adm_Correo"
                value={formData.adm_Correo}
                onChange={handleChange}
                placeholder="correo@ejemplo.com"
                required
              />
              <Input
                label="Celular"
                type="tel"
                name="adm_Celular"
                value={formData.adm_Celular}
                onChange={handleChange}
                placeholder="Número de celular"
                required
              />
              <div className="relative">
                <Input
                  label="Contraseña"
                  type={showPassword ? 'text' : 'password'}
                  name="adm_Password"
                  value={formData.adm_Password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 bottom-2 p-2"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                  ) : (
                    <Eye className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Store Section */}
          <div className="bg-emerald-50 dark:bg-gray-700/50 p-6 rounded-xl border border-emerald-100 dark:border-gray-600">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-emerald-500 dark:bg-emerald-600 rounded-full flex items-center justify-center">
                <Store className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Información de la Tienda
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="ID Tienda"
                name="tienda_Id"
                value={formData.tienda_Id}
                onChange={handleChange}
                placeholder="ID de la tienda"
                required
              />
              <Input
                label="Nombre de Tienda"
                name="tienda_Nombre"
                value={formData.tienda_Nombre}
                onChange={handleChange}
                placeholder="Nombre de la tienda"
                required
              />
              <Input
                label="Correo de Tienda"
                type="email"
                name="tienda_Correo"
                value={formData.tienda_Correo}
                onChange={handleChange}
                placeholder="correo@tienda.com"
                required
              />
              <Input
                label="Celular de Tienda"
                type="tel"
                name="tienda_Celular"
                value={formData.tienda_Celular}
                onChange={handleChange}
                placeholder="Número de la tienda"
                required
              />
              <Input
                label="Ubicación"
                name="tienda_Ubicacion"
                value={formData.tienda_Ubicacion}
                onChange={handleChange}
                placeholder="Dirección de la tienda"
                required
              />
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Logo de Tienda
                </label>
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <div className="relative">
                      <input
                        type="file"
                        name="tienda_Img"
                        onChange={handleChange}
                        className="hidden"
                        id="tienda_Img"
                        accept="image/*"
                        required
                      />
                      <label
                        htmlFor="tienda_Img"
                        className="flex items-center justify-center w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                      >
                        <Upload className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
                        <span className="text-gray-500 dark:text-gray-400">
                          Seleccionar imagen
                        </span>
                      </label>
                    </div>
                  </div>
                  {previewImage && (
                    <div className="w-12 h-12 rounded-lg overflow-hidden">
                      <img
                        src={previewImage}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 rounded-lg font-medium text-white bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                'Completar Registro'
              )}
            </button>
            
            <p className="text-center text-gray-600 dark:text-gray-300">
              ¿Ya tienes una cuenta?{' '}
              <Link 
                to="/" 
                className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 dark:hover:text-emerald-300 font-medium transition-colors"
              >
                Inicia sesión
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;