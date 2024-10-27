import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const SignUp = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    // Admin data
    adm_Id: '',
    adm_Nombre: '',
    adm_Correo: '',
    adm_Celular: '',
    adm_Password: '',
    // Store data
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
      // Crear un objeto con todos los datos excepto la imagen
      const jsonData = { ...formData };
      
      // Si hay una imagen, convertirla a base64
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

  // Función para convertir imagen a base64
  const convertImageToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleChange = (e) => {
    const value = e.target.type === 'file' ? e.target.files[0] : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#5cd88b]/10 to-[#27cd60]/10 flex items-center justify-center px-4 py-8">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-4xl">
        {/* Logo and Header */}
        <div className="flex flex-col items-center mb-8">
          <Link to="/">
            <img 
              src="/marvyshopmarket.png" 
              alt="Marvy Shopmarket Logo" 
              className="h-16 mb-4 hover:opacity-90 transition-opacity"
            />
          </Link>
          <h1 className="text-2xl font-bold text-[#009a44]">Registro de Tienda y Administrador</h1>
          <p className="text-gray-600 mt-2">Complete la información requerida</p>
          {error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Admin Section */}
          <div className="bg-gradient-to-r from-[#5cd88b]/10 to-[#2fe96f]/10 p-6 rounded-xl border border-[#27cd60]/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-[#27cd60] rounded-full flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-[#009a44]">Información del Administrador</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#009a44]">ID Administrador</label>
                <input
                  type="text"
                  name="adm_Id"
                  value={formData.adm_Id}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-[#27cd60]/30 rounded-lg focus:ring-2 focus:ring-[#27cd60] focus:border-transparent outline-none transition-all"
                  placeholder="Ingresa el ID"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#009a44]">Nombre</label>
                <input
                  type="text"
                  name="adm_Nombre"
                  value={formData.adm_Nombre}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-[#27cd60]/30 rounded-lg focus:ring-2 focus:ring-[#27cd60] focus:border-transparent outline-none transition-all"
                  placeholder="Nombre completo"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#009a44]">Correo</label>
                <input
                  type="email"
                  name="adm_Correo"
                  value={formData.adm_Correo}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-[#27cd60]/30 rounded-lg focus:ring-2 focus:ring-[#27cd60] focus:border-transparent outline-none transition-all"
                  placeholder="correo@ejemplo.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#009a44]">Celular</label>
                <input
                  type="tel"
                  name="adm_Celular"
                  value={formData.adm_Celular}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-[#27cd60]/30 rounded-lg focus:ring-2 focus:ring-[#27cd60] focus:border-transparent outline-none transition-all"
                  placeholder="Número de celular"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#009a44]">Contraseña</label>
                <input
                  type="password"
                  name="adm_Password"
                  value={formData.adm_Password}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-[#27cd60]/30 rounded-lg focus:ring-2 focus:ring-[#27cd60] focus:border-transparent outline-none transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
          </div>

          {/* Store Section */}
          <div className="bg-gradient-to-r from-[#5cd88b]/10 to-[#2fe96f]/10 p-6 rounded-xl border border-[#27cd60]/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-[#27cd60] rounded-full flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-[#009a44]">Información de la Tienda</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#009a44]">ID Tienda</label>
                <input
                  type="text"
                  name="tienda_Id"
                  value={formData.tienda_Id}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-[#27cd60]/30 rounded-lg focus:ring-2 focus:ring-[#27cd60] focus:border-transparent outline-none transition-all"
                  placeholder="ID de la tienda"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#009a44]">Nombre de Tienda</label>
                <input
                  type="text"
                  name="tienda_Nombre"
                  value={formData.tienda_Nombre}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-[#27cd60]/30 rounded-lg focus:ring-2 focus:ring-[#27cd60] focus:border-transparent outline-none transition-all"
                  placeholder="Nombre de la tienda"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#009a44]">Correo de Tienda</label>
                <input
                  type="email"
                  name="tienda_Correo"
                  value={formData.tienda_Correo}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-[#27cd60]/30 rounded-lg focus:ring-2 focus:ring-[#27cd60] focus:border-transparent outline-none transition-all"
                  placeholder="correo@tienda.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#009a44]">Celular de Tienda</label>
                <input
                  type="tel"
                  name="tienda_Celular"
                  value={formData.tienda_Celular}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-[#27cd60]/30 rounded-lg focus:ring-2 focus:ring-[#27cd60] focus:border-transparent outline-none transition-all"
                  placeholder="Número de la tienda"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#009a44]">Ubicación</label>
                <input
                  type="text"
                  name="tienda_Ubicacion"
                  value={formData.tienda_Ubicacion}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-[#27cd60]/30 rounded-lg focus:ring-2 focus:ring-[#27cd60] focus:border-transparent outline-none transition-all"
                  placeholder="Dirección de la tienda"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#009a44]">Logo de Tienda</label>
                <input
                  type="file"
                  name="tienda_Img"
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-[#27cd60]/30 rounded-lg focus:ring-2 focus:ring-[#27cd60] focus:border-transparent outline-none transition-all"
                  accept="image/*"
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-[#27cd60] text-white py-3 px-4 rounded-lg hover:bg-[#2fe96f] transition-colors duration-200 font-medium text-lg shadow-lg shadow-[#27cd60]/20 
                ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Registrando...' : 'Completar Registro'}
            </button>

            <Link 
              to="/login" 
              className="block text-center text-[#009a44] hover:text-[#27cd60] transition-colors duration-200"
            >
              ¿Ya tienes una cuenta? Inicia sesión
            </Link>

            <Link to="/" className="block">
              <button
                type="button"
                className="w-full mt-4 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium text-lg"
              >
                Volver al inicio
              </button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;