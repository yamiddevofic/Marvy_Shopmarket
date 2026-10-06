import React, { useEffect, useRef, useState } from 'react';
import {
  Box, ChevronDown, House, LogOut, PackageSearch, Receipt, ScrollText,
  Settings, Truck, User, UserPlus, Users,
} from 'lucide-react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import ToggleTheme from '../Toggle/ToggleTheme';
import EmblemaTienda from '../Login/EmblemaTienda';
import { api } from '../../services/api';

// Pestañas de la navegación principal, en el orden del día a día de la tienda.
// Configuración y perfil viven en el menú de usuario.
export const SECCIONES = [
  { ruta: '/home', nombre: 'Inicio', Icono: House },
  { ruta: '/ventas', nombre: 'Ventas', Icono: Receipt },
  { ruta: '/inventario', nombre: 'Inventario', Icono: PackageSearch },
  { ruta: '/productos', nombre: 'Productos', Icono: Box },
  { ruta: '/reportes', nombre: 'Reportes', Icono: ScrollText },
  { ruta: '/proveedores', nombre: 'Proveedores', Icono: Users },
  { ruta: '/suministros', nombre: 'Suministros', Icono: Truck },
  { ruta: '/tenderos', nombre: 'Tenderos', Icono: UserPlus },
];

const Header = ({ userName, storeInfo }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const menuRef = useRef(null);
  const navRef = useRef(null);
  const displayName = userName || 'Usuario';
  const initial = (displayName.charAt(0) || '?').toUpperCase();
  const nombreTienda = storeInfo?.nombre || 'Tu tienda';

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

  // En móvil la pestaña activa puede quedar fuera de vista: se centra al cambiar de ruta.
  useEffect(() => {
    const nav = navRef.current;
    const activa = nav?.querySelector('[aria-current="page"]');
    if (nav && activa && nav.scrollWidth > nav.clientWidth) {
      nav.scrollLeft = activa.offsetLeft - (nav.clientWidth - activa.offsetWidth) / 2;
    }
  }, [pathname]);

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
        <NavLink to="/home" className="panel-cabecera__marca" aria-label={`${nombreTienda}, ir al inicio`}>
          <EmblemaTienda />
          <span className="panel-cabecera__titulos">
            <span className="panel-cabecera__tienda">{nombreTienda}</span>
            <span className="panel-cabecera__rol">Panel de administración</span>
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
                <div className="panel-menu__separador" role="separator" />
                <button type="button" role="menuitem" className="panel-menu__opcion panel-menu__opcion--salir" onClick={handleLogout}>
                  <LogOut aria-hidden="true" /> Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <nav className="panel-nav" aria-label="Secciones" ref={navRef}>
        <ul>
          {SECCIONES.map(({ ruta, nombre, Icono }) => (
            <li key={ruta}>
              <NavLink to={ruta} className="panel-nav__enlace">
                <Icono aria-hidden="true" />
                {nombre}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
