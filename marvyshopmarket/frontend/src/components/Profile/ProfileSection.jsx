import React, { useState, useEffect } from 'react';
import { User } from 'lucide-react';

const ProfileSection = ({ userName, adminInfo, error }) => {
  const [imageError, setImageError] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    // Si tenemos información de la tienda y una imagen asociada
    if (adminInfo?.tienda?.imagen) {
      // Construimos la URL completa para la imagen
      setImageUrl(`${window.location.origin}/uploads/${adminInfo.tienda.imagen}`);
      setImageError(false); // Resetear el error al cambiar la imagen
    } else {
      setImageUrl(null);
    }
  }, [adminInfo?.tienda?.imagen]);

  const renderImage = () => {
    // Si no hay información o hay error, mostrar el ícono por defecto
    if (!imageUrl || imageError || error) {
      return (
        <div className="w-32 h-32 bg-emerald-500 dark:bg-emerald-600 rounded-full flex items-center justify-center shadow-xl mb-4">
          <User className="w-16 h-16 text-white" />
        </div>
      );
    }

    return (
      <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-emerald-500 shadow-xl mb-4 hover:scale-105 transition-transform duration-200">
        <img
          src={imageUrl}
          alt={`Logo de ${adminInfo?.tienda?.nombre || 'la tienda'}`}
          className="w-full h-full object-cover"
          onError={(e) => {
            console.error('Error al cargar la imagen:', e);
            setImageError(true);
          }}
        />
      </div>
    );
  };

  // Función para mostrar información de depuración
  const debugInfo = () => {
    console.log('Admin Info:', adminInfo);
    console.log('Image URL:', imageUrl);
    console.log('Image Error:', imageError);
  };

  // Llamar a debugInfo para ayudar en el desarrollo
  useEffect(() => {
    debugInfo();
  }, [adminInfo, imageUrl, imageError]);

  return (
    <div className="mb-8">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6 transition-all duration-200">
        <div className="flex flex-col items-center text-center mb-6">
          {renderImage()}
          
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Bienvenido, {userName}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              {error ? "Error al cargar información" : 
                `${adminInfo?.tienda?.nombre || 'Tu tienda'} - ${adminInfo?.tienda?.ubicacion || 'Ubicación'}`}
            </p>
          </div>
        </div>

        {adminInfo && !error && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <InfoCard
              title="Correo"
              value={adminInfo.administrador?.correo}
              icon="📧"
            />
            <InfoCard
              title="Contacto"
              value={adminInfo.administrador?.celular}
              icon="📱"
            />
            <InfoCard
              title="ID Tienda"
              value={adminInfo.tienda?.id}
              icon="🏪"
            />
          </div>
        )}
      </div>
    </div>
  );
};

const InfoCard = ({ title, value, icon }) => (
  <div className="bg-emerald-50 dark:bg-gray-700/50 rounded-lg p-4">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
        <p className="text-lg font-semibold text-gray-900 dark:text-white mt-1">
          {value || 'No disponible'}
        </p>
      </div>
      <span className="text-2xl">{icon}</span>
    </div>
  </div>
);

export default ProfileSection;