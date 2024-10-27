import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header/Header';
import StatsGrid from '../components/Stats/StatsGrid';
import OptionsGrid from '../components/Options/OptionsGrid';
import QuickActionButton from '../components/Button/QuickActionButton';
import ProfileSection from './ProfileSection';

const Home = () => {
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName') || 'Administrador';
  const [adminInfo, setAdminInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Redireccionar si el usuario no está autenticado
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('loggedIn');
    if (!isLoggedIn) {
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    const fetchAdminInfo = async () => {
      try {
        console.log('Iniciando petición...');

        const response = await fetch('/api/consultar-info', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        console.log('Estado de la respuesta:', response.status);

        if (!response.ok) {
          throw new Error(`Error en la petición: ${response.status}`);
        }

        const data = await response.json();
        console.log('Datos recibidos:', data);

        if (data?.datos) {
          console.log('Datos de la tienda:', data.datos.tienda);
          console.log('¿Tiene imagen?:', Boolean(data.datos.tienda.imagen));

          setAdminInfo(data.datos);
        } else {
          console.error('Estructura de datos inesperada:', data);
          throw new Error('La respuesta no tiene el formato esperado');
        }

      } catch (err) {
        console.error('Error detallado:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminInfo();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-400 to-green-300 dark:from-gray-900 dark:to-gray-800">
        <Header userName={userName} />
        <main className="container mx-auto px-4 py-6">
          <div className="animate-pulse space-y-4">
            <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
          </div>
        </main>
      </div>
    );
  }

  // Construir la URL de la imagen
  const imageUrl = adminInfo?.tienda?.imagen ? `/uploads/${adminInfo.tienda.imagen}` : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-400 to-green-300 dark:from-[#06141b] dark:to-[#11212d] transition-colors duration-200">
      <Header
        userName={userName}
        adminInfo={adminInfo}
      />

      <main className="container mx-auto px-4 py-6 lg:px-8">
        {/* Sección de acciones rápidas */}
        <div className="mt-8 bg-white dark:bg-[#12212D] rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Acciones Rápidas
            </h3>
            <button className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors">
              Personalizar
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <QuickActionButton text="Nuevo Producto" />
            <QuickActionButton text="Generar Reporte" />
            <QuickActionButton text="Ver Ventas" />
            <QuickActionButton text="Configuración" />
          </div>
        </div>

        {/* Sección de estadísticas */}
        <div className="space-y-8">
          <section className="bg-white dark:bg-[#12212D] rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Estadísticas Generales
              </h2>
              <button className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors">
                Ver todo
              </button>
            </div>
            <StatsGrid />
          </section>

          {/* Sección de opciones */}
          <section className="bg-white dark:bg-[#12212D] rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Opciones Disponibles
              </h2>
              <button className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors">
                Ver más
              </button>
            </div>
            <OptionsGrid />
          </section>
        </div>
      </main>
    </div>
  );
};

export default Home;
