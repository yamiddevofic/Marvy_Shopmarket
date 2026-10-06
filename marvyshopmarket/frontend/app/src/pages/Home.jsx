import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Receipt } from 'lucide-react';
import Cookies from 'js-cookie';
import Layout from '../Layout/Layout';
import FachadaTienda from '../components/Panel/FachadaTienda';
import CieloAnimado from '../components/Panel/CieloAnimado';
import Indicadores from '../components/Inicio/Indicadores';
import PorReponer from '../components/Inicio/PorReponer';
import DatosTienda from '../components/Inicio/DatosTienda';
import Modulos from '../components/Inicio/Modulos';
import { useAppContext } from '../context/AppContext';
import { api } from '../services/api';

const saludoSegunHora = (hora) => (hora < 12 ? 'Buenos días' : hora < 19 ? 'Buenas tardes' : 'Buenas noches');

const Home = () => {
  const navigate = useNavigate();
  const { adminInfo, setAdminInfo, selectedOption, setSelectedOption, setStoreInfo, setUserName, storeInfo, userName, setSelectedIcon } = useAppContext();
  const [loading, setLoading] = useState(true);
  // Datos de los indicadores: undefined = cargando, false = falló, arreglo = listo
  const [productos, setProductos] = useState(undefined);
  const [tenderos, setTenderos] = useState(undefined);
  const isLoggedIn = Cookies.get('loggedIn');

  useEffect(() => {
    setSelectedOption('home');
  }, []); // El array vacío asegura que solo se ejecute una vez al montar el componente

  const handleSelectOption = (option, iconName) => {
    setSelectedOption(option);
    setSelectedIcon(iconName);
    localStorage.setItem('selectedOption', option);
    localStorage.setItem('selectedIcon', iconName);
    navigate(`/${option}`);
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const data = await api.get('/consultar-info');
        setAdminInfo(data.datos.administrador);       // ✅ Guardar la info
        setStoreInfo(data.datos.tienda);            // ✅ Mantener objeto de tienda completo
        setUserName(data.datos.administrador?.nombre || null); // ✅ Guardar nombre de usuario
        
        // Persistir en localStorage para accesos directos/recargas en /perfil
        try {
          localStorage.setItem('adminInfo', JSON.stringify(data.datos.administrador || null));
          localStorage.setItem('storeInfo', JSON.stringify(data.datos.tienda || null));
          localStorage.setItem('userName', data.datos.administrador.nombre);
          localStorage.setItem('selectedOption', 'home');
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

  // Indicadores con datos reales: los mismos listados que usan Productos y Tenderos.
  const cargarProductos = useCallback(() => {
    setProductos(undefined);
    api.get('/listar-productos')
      .then((data) => setProductos(Array.isArray(data) ? data : []))
      .catch(() => setProductos(false));
  }, []);

  useEffect(() => {
    if (loading) return;
    cargarProductos();
    api.get('/consultar-tenderos')
      .then((data) => setTenderos(Array.isArray(data?.tenderos) ? data.tenderos : []))
      .catch(() => setTenderos(false));
  }, [loading, cargarProductos]);

  if (loading) {
    return (
      <div className="panel">
        <main className="inicio" aria-busy="true" aria-label="Cargando el panel">
          <div className="esqueleto inicio-cargando inicio-cargando--hero" />
          <div className="esqueleto inicio-cargando" />
          <div className="esqueleto inicio-cargando inicio-cargando--alto" />
        </main>
      </div>
    );
  }

  const primerNombre = (userName || '').trim().split(/\s+/)[0];
  const ahora = new Date();
  const fecha = ahora.toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <Layout adminInfo={adminInfo} storeInfo={storeInfo} userName={userName} selectedOption={selectedOption}>
      <main className="inicio">
        <section className="inicio-hero" aria-labelledby="inicio-titulo">
          <CieloAnimado />
          <div className="inicio-hero__texto">
            <p className="inicio-hero__fecha">{fecha}</p>
            <h1 id="inicio-titulo" className="inicio-hero__titulo">
              {saludoSegunHora(ahora.getHours())}{primerNombre ? `, ${primerNombre}` : ''}
            </h1>
            <p className="inicio-hero__remate">así va tu tienda hoy</p>
          </div>
          <div className="inicio-hero__acciones">
            <button type="button" className="boton boton--primario" onClick={() => handleSelectOption('ventas', 'Receipt')}>
              <Receipt aria-hidden="true" /> Registrar venta
            </button>
            <button type="button" className="boton" onClick={() => handleSelectOption('productos', 'Box')}>
              <Box aria-hidden="true" /> Nuevo producto
            </button>
          </div>
          <div className="inicio-hero__escena">
            <FachadaTienda />
          </div>
        </section>

        <section className="tarjeta inicio-resumen" aria-labelledby="resumen-titulo">
          <h2 id="resumen-titulo" className="sr-only">Resumen de la tienda</h2>
          <Indicadores productos={productos} tenderos={tenderos} />
        </section>

        <div className="inicio__columnas">
          <Modulos onSeleccionar={handleSelectOption} />
          <aside className="inicio__lateral" aria-label="Estado de la tienda">
            <PorReponer productos={productos} onReintentar={cargarProductos} />
            <DatosTienda tienda={storeInfo && typeof storeInfo === 'object' ? storeInfo : null} />
          </aside>
        </div>
      </main>
    </Layout>
  );
};

export default Home;
