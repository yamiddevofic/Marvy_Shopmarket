import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, LogOut, Settings, User } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import ToggleTheme from '../Toggle/ToggleTheme';
import EmblemaTienda from '../Login/EmblemaTienda';
import { api } from '../../services/api';

// Nombre de cada sección en la barra y en las migas de pan.
const SECCIONES = {
  home: 'Panel de administración',
  ventas: 'Ventas',
  inventario: 'Inventario',
  productos: 'Productos',
  suministros: 'Suministros',
  proveedores: 'Proveedores',
  tenderos: 'Tenderos',
  reportes: 'Reportes',
  configuracion: 'Configuración',
  perfil: 'Perfil',
};

const Header = ({ userName, storeInfo, selectedOption }) => {
  const navigate = useNavigate();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const menuRef = useRef(null);
  const displayName = userName || 'Usuario';
  const initial = (displayName.charAt(0) || '?').toUpperCase();
  const enInicio = !selectedOption || selectedOption === 'home';
  const nombreTienda = storeInfo?.nombre || 'Tu tienda';
  const seccion = SECCIONES[selectedOption] || (enInicio ? SECCIONES.home : selectedOption);

  // El menú se cierra al pulsar fuera de él o con Escape.
  useEffect(() => {
    if (!menuAbierto) return undefined;
    const alPulsar = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuAbierto(false);
    };
    const alTeclear = (e) => {
      if (e.key === 'Escape') setMenuAbierto(false);
    };
    document.addEventListener('pointerdown', alPulsar);
    document.addEventListener('keydown', alTeclear);
    return () => {
      document.removeEventListener('pointerdown', alPulsar);
      document.removeEventListener('keydown', alTeclear);
    };
  }, [menuAbierto]);

  const ir = (ruta) => {
    setMenuAbierto(false);
    navigate(ruta);
  };

  const handleLogout = async () => {
    try {
      await api.post('/cerrar-sesion');
      // Eliminar la información de sesión almacenada en localStorage
      localStorage.removeItem('loggedIn');
      localStorage.removeItem('userName');
      Cookies.remove('loggedIn');
      Cookies.remove('userName');

      // Redirigir a la página de inicio de sesión u otra página
      navigate('/');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <header className="panel-cabecera">
      <div className="panel-cabecera__barra">
        <NavLink to="/home" className="panel-cabecera__marca" aria-label="Ir al panel principal">
          <EmblemaTienda />
          <span className="panel-cabecera__titulos">
            <span className="panel-cabecera__tienda">{nombreTienda}</span>
            <span className="panel-cabecera__seccion">{seccion}</span>
          </span>
        </NavLink>

        <div className="panel-cabecera__acciones">
          <ToggleTheme floating={false} />

          <div className="panel-menu" ref={menuRef}>
            <button
              type="button"
              className="panel-menu__boton"
              aria-haspopup="menu"
              aria-expanded={menuAbierto}
              aria-controls="panel-menu-lista"
              onClick={() => setMenuAbierto(!menuAbierto)}
            >
              <span className="panel-menu__avatar" aria-hidden="true">{initial}</span>
              <span className="panel-menu__nombre">{displayName}</span>
              <ChevronDown className="panel-menu__flecha" aria-hidden="true" />
              <span className="sr-only">Menú de usuario</span>
            </button>

            {menuAbierto && (
              <div id="panel-menu-lista" className="panel-menu__lista" role="menu">
                <div className="panel-menu__quien">
                  <strong>{displayName}</strong>
                  <span>{nombreTienda}</span>
                </div>
                <button type="button" role="menuitem" className="panel-menu__opcion" onClick={() => ir('/perfil')}>
                  <User aria-hidden="true" /> Perfil
                </button>
                <button type="button" role="menuitem" className="panel-menu__opcion" onClick={() => ir('/configuracion')}>
                  <Settings aria-hidden="true" /> Configuración
                </button>
                <button type="button" role="menuitem" className="panel-menu__opcion panel-menu__opcion--salir" onClick={handleLogout}>
                  <LogOut aria-hidden="true" /> Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {!enInicio && (
        <nav className="panel-migas" aria-label="Ubicación">
          <ol>
            <li><NavLink to="/home">Panel</NavLink></li>
            <li aria-hidden="true" className="panel-migas__sep">/</li>
            <li aria-current="page">{seccion}</li>
          </ol>
        </nav>
      )}
    </header>
  );
};

export default Header;
