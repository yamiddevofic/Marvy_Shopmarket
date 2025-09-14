import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header/Header';
import StatsGrid from '../components/Stats/StatsGrid';
import OptionsGrid from '../components/Options/OptionsGrid';
import QuickActionButton from '../components/Button/QuickActionButton';
import Cookies from 'js-cookie';
import Layout from '../Layout/Layout';
import { useAppContext } from '../context/AppContext';

const Home = () => {
  const navigate = useNavigate();
  const [adminInfo, setAdminInfo] = useState(null);
  const [storeInfo, setStoreInfo] = useState(null);
  const [userName, setUserName] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { selectedOption, setSelectedOption } = useAppContext();
  const isLoggedIn = Cookies.get('loggedIn');

  setSelectedOption('home');
  console.log('selectedOption estado en Home: ', selectedOption)

  const handleSelectOption = (option) => {
    setSelectedOption(option);
    console.log('Option selected:', selectedOption);
    navigate(`/${option}`);
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/consultar-info`, {
          method: 'GET',
          credentials: 'include',
        });
  
        console.log('Estado de la respuesta:', res.status);
  
        if (!res.ok) {
          console.log('No autenticado');
          navigate('/', { replace: true });
          return;
        }
  
        const data = await res.json();
        setAdminInfo(data.datos.administrador);       // ✅ Guardar la info
        setStoreInfo(data.datos.tienda);              // ✅ Mantener objeto de tienda completo
        setUserName(data.datos.administrador?.nombre || null); // ✅ Guardar nombre de usuario
        
        // Persistir en localStorage para accesos directos/recargas en /perfil
        try {
          localStorage.setItem('adminInfo', JSON.stringify(data.datos.administrador || null));
          localStorage.setItem('storeInfo', JSON.stringify(data.datos.tienda || null));
          if (data.datos.administrador?.nombre) {
            localStorage.setItem('userName', data.datos.administrador.nombre);
          } else {
            localStorage.removeItem('userName');
          }
        } catch (e) {
          console.warn('No se pudo escribir en localStorage:', e);
        }
        setLoading(false);        // ✅ Quitar el loading
      } catch (err) {
        console.log('Error al verificar autenticación', err);
        navigate('/', { replace: true });
      }

    };
    checkAuth();
  }, [navigate, isLoggedIn]);
  

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-400 to-green-300 dark:from-gray-900 dark:to-gray-800">
        <main className="container mx-auto px-4 py-6">
          <div className="animate-pulse space-y-4">
            <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
          </div>
        </main>
      </div>
    );
  }
  console.log("Nombre del usuario en Home:", userName);
  console.log("Información del administrador en Home:", adminInfo);
  console.log("Información de la tienda en Home:", storeInfo);
  const imageUrl = storeInfo?.imagen ? `/uploads/${storeInfo.imagen}` : null;
  console.log("selectedOption estado en Home: ", selectedOption)

  

  return (
    <Layout adminInfo={adminInfo} storeInfo={storeInfo} userName={userName} selectedOption={selectedOption}>
    <div className="min-h-screen bg-gradient-to-br from-emerald-400 to-green-300 dark:from-[#06141b] dark:to-[#11212d] transition-colors duration-200">

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
            <QuickActionButton text="Nuevo Producto" onClick={() => handleSelectOption('agregar-producto')} />
            <QuickActionButton text="Generar Reporte" onClick={() => handleSelectOption('reporte')} />
            <QuickActionButton text="Ver Ventas" onClick={() => handleSelectOption('ventas')} />
            <QuickActionButton text="Configuración" onClick={() => handleSelectOption('configuracion')} />
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
            <OptionsGrid selectedOption={selectedOption} setSelectedOption={setSelectedOption}/>
          </section>
        </div>
      </main>
    </div>
    </Layout>
  );
};

export default Home;
