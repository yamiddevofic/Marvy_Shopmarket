import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StatsGrid from '../components/Stats/StatsGrid';
import OptionsGrid from '../components/Options/OptionsGrid';
import { MapPin, Box, Receipt } from 'lucide-react';
import FachadaTienda from '../components/Panel/FachadaTienda';
import CieloAnimado from '../components/Panel/CieloAnimado';
import Cookies from 'js-cookie';
import Layout from '../Layout/Layout';
import { useAppContext } from '../context/AppContext';
import { api } from '../services/api';

const Home = () => {
  const navigate = useNavigate();
  const { adminInfo, setAdminInfo, selectedOption, setSelectedOption, setStoreInfo, setUserName, storeInfo, userName, selectedIcon, setSelectedIcon } = useAppContext();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
  

  if (loading) {
    return (
      <div className="panel">
        <main className="panel-cargando" aria-busy="true" aria-label="Cargando el panel">
          <div className="panel-cargando__bloque panel-cargando__bloque--hero" />
          <div className="panel-cargando__fila">
            <div className="panel-cargando__bloque" />
            <div className="panel-cargando__bloque" />
            <div className="panel-cargando__bloque" />
          </div>
        </main>
      </div>
    );
  }

  const primerNombre = (userName || '').trim().split(/\s+/)[0];
  const hora = new Date().getHours();
  const saludo = hora < 12 ? 'Buenos días' : hora < 19 ? 'Buenas tardes' : 'Buenas noches';
  const fecha = new Date().toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <Layout adminInfo={adminInfo} storeInfo={storeInfo} userName={userName} selectedOption={selectedOption}>
      <main className="panel-principal">
        <section className="panel-hero" aria-labelledby="panel-titulo">
          <CieloAnimado />
          <div className="panel-hero__texto">
            <p className="panel-hero__fecha">{fecha}</p>
            <h1 id="panel-titulo" className="panel-hero__titulo">
              <span className="panel-hero__linea">{saludo}{primerNombre ? `, ${primerNombre}` : ''}</span>
              <em className="panel-hero__linea panel-hero__remate">tu tienda te espera</em>
            </h1>
            <div className="panel-hero__tienda">
              <span className="panel-hero__logo">
                {storeInfo?.imagen ? <img src={storeInfo.imagen} alt="" /> : (storeInfo?.nombre || 'T').charAt(0).toUpperCase()}
              </span>
              <span className="panel-hero__datos">
                <span className="panel-hero__nombre">{storeInfo?.nombre || 'Tu tienda'}</span>
                {storeInfo?.ubicacion && (
                  <span className="panel-hero__lugar"><MapPin aria-hidden="true" />{storeInfo.ubicacion}</span>
                )}
              </span>
            </div>
            <div className="panel-hero__acciones">
              <button type="button" className="panel-boton panel-boton--primario" onClick={() => handleSelectOption('ventas', 'Receipt')}>
                <Receipt aria-hidden="true" /> Ver ventas
              </button>
              <button type="button" className="panel-boton" onClick={() => handleSelectOption('productos', 'Box')}>
                <Box aria-hidden="true" /> Nuevo producto
              </button>
            </div>
          </div>
          <div className="panel-hero__escena">
            <FachadaTienda />
          </div>
        </section>

        <section className="panel-seccion" aria-labelledby="panel-resumen">
          <header className="panel-seccion__cabeza">
            <h2 id="panel-resumen" className="panel-seccion__titulo">Resumen del negocio</h2>
            <span className="panel-seccion__etiqueta">Cifras de ejemplo</span>
          </header>
          <StatsGrid />
        </section>

        <section className="panel-seccion" aria-labelledby="panel-modulos">
          <header className="panel-seccion__cabeza">
            <h2 id="panel-modulos" className="panel-seccion__titulo">¿Qué quieres hacer hoy?</h2>
          </header>
          <OptionsGrid setSelectedOption={setSelectedOption} setSelectedIcon={setSelectedIcon} />
        </section>
      </main>
    </Layout>
  );
};

export default Home;
