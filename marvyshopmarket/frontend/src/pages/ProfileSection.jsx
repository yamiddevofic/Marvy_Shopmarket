import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Store, MapPin, Camera } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import ToggleTheme from '../components/Toggle/ToggleTheme';
import Header from '../components/Header/Header';
import InfoCard from '../components/Card/InfoCard';

const LoadingSkeleton = () => (
  <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg h-full w-full"></div>
);


const ProfileSection = ({ userName, error }) => {
  const [imageError, setImageError] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const { adminInfo } = location.state || {};

  useEffect(() => {
    if (adminInfo?.tienda?.imagen) {
      setImageUrl(`${window.location.origin}/uploads/${adminInfo.tienda.imagen}`);
      setImageError(false);
    } else {
      setImageUrl(null);
    }
    // Simulamos un tiempo de carga mínimo para mostrar los estados de loading
    setTimeout(() => setIsLoading(false), 500);
  }, [adminInfo?.tienda?.imagen]);

  const ProfileImage = () => {
    if (isLoading) {
      return <div className="w-32 h-32 rounded-full overflow-hidden">
        <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-full w-full"></div>
      </div>;
    }

    if (!imageUrl || imageError || error) {
      return (
        <div className="relative group">
          <div className="w-32 h-32 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
            <User className="w-16 h-16 text-white" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
            <div className="w-32 h-32 rounded-full bg-black/50 flex items-center justify-center">
              <Camera className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="relative group">
        <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-emerald-500 ring-offset-2 ring-offset-white dark:ring-offset-gray-950 shadow-lg transition-transform duration-200 ease-in-out transform group-hover:scale-105">
          <img
            src={imageUrl}
            alt={`Logo de ${adminInfo?.tienda?.nombre || 'la tienda'}`}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        </div>
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
          <div className="w-32 h-32 rounded-full bg-black/50 flex items-center justify-center">
            <Camera className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>
    );
  };

  if (error) {
    return (
      <div className="max-w-2xl mx-auto mt-8 bg-red-50 dark:bg-red-900/50 border-l-4 border-red-500 p-4 rounded-r">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700 dark:text-red-200">
              Ha ocurrido un error al cargar la información del perfil. Por favor, intente nuevamente.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full m-0 p-0 bg-gradient-to-br from-gray-300 via-gray-200 to-gray-300 dark:from-[#06141b] dark:to-[#11212d] transition-colors duration-200 pb-5  ">
      <Header userName={adminInfo?.administrador?.nombre || "Administrador"} adminInfo={adminInfo}/>
      <ToggleTheme/>

      <div className="w-full flex flex-col justify-center items-center p-5 md:p-0">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full md:w-1/2 overflow-hidden">
          {/* Header con gradiente */}
          <div className="relative h-48 bg-gradient-to-r from-emerald-500 to-emerald-600 dark:from-emerald-600 dark:to-emerald-700">
            <div className="absolute -bottom-16 left-1/2 -translate-x-1/2">
              <ProfileImage />
            </div>
          </div>

          {/* Información del perfil */}
          <div className="pt-20 pb-8 px-6">
            {isLoading ? (
              <div className="h-8 w-64 mx-auto">
                <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-full w-full rounded-lg"></div>
              </div>
            ) : (
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {adminInfo?.tienda?.nombre || 'Tu tienda'}
                </h1>
                <div className="flex items-center justify-center mt-2 text-gray-600 dark:text-gray-400">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{adminInfo?.tienda?.ubicacion || 'Ubicación no disponible'}</span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6 mt-8 break-all ">
              <InfoCard
                icon={<User className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />}
                title="Administrador"
                value={adminInfo?.administrador?.nombre}
                isLoading={isLoading}
              />
              <InfoCard
                icon={<Mail className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />}
                title="Correo electrónico"
                value={adminInfo?.administrador?.correo}
                isLoading={isLoading}
              />
              <InfoCard
                icon={<Phone className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />}
                title="Teléfono"
                value={adminInfo?.administrador?.celular}
                isLoading={isLoading}
              />
              <InfoCard
                icon={<Store className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />}
                title="ID Tienda"
                value={adminInfo?.tienda?.id}
                isLoading={isLoading}
              />
            </div>

            <div className="mt-8 flex justify-center">
              <button
                className="px-4 py-2 border-2 border-emerald-600 dark:border-emerald-400 text-emerald-600 dark:text-emerald-400 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
              >
                Editar Perfil
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;