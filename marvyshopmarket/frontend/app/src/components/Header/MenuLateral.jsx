import React, { useEffect, useRef, useState } from 'react';
import {
  Box, House, LogOut, PackageSearch, PanelLeftClose, PanelLeftOpen, Receipt, ScrollText,
  Settings, Truck, User, UserPlus, Users, X,
} from 'lucide-react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import ToggleTheme from '../Toggle/ToggleTheme';
import EmblemaTienda from '../Login/EmblemaTienda';
import { api } from '../../services/api';

// Pestañas de la navegación principal, en el orden del día a día de la tienda.
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

const CUENTA = [
  { ruta: '/perfil', nombre: 'Perfil', Icono: User },
  { ruta: '/configuracion', nombre: 'Configuración', Icono: Settings },
];

const ENFOCABLES = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
const CONSULTA_ESCRITORIO = '(min-width: 1024px)';

const useEsEscritorio = () => {
  const [es, setEs] = useState(() => window.matchMedia(CONSULTA_ESCRITORIO).matches);
  useEffect(() => {
    const mq = window.matchMedia(CONSULTA_ESCRITORIO);
    const alCambiar = (e) => setEs(e.matches);
    mq.addEventListener('change', alCambiar);
    return () => mq.removeEventListener('change', alCambiar);
  }, []);
  return es;
};

// Barra lateral izquierda. En escritorio está siempre visible; en móvil es un
// cajón modal que se abre con el botón ☰ de la cabecera (botonRef).
// En escritorio se puede colapsar a una franja de íconos (`colapsado`).
const MenuLateral = ({ abierto, onCerrar, botonRef, colapsado, onColapsar, userName, storeInfo }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const escritorio = useEsEscritorio();
  const cajonRef = useRef(null);
  const modal = !escritorio;
  const compacto = escritorio && colapsado;
  const displayName = userName || 'Usuario';
  const initial = (displayName.charAt(0) || '?').toUpperCase();
  const nombreTienda = storeInfo?.nombre || 'Tu tienda';

  // Al cambiar de ruta o pasar a escritorio, el cajón se cierra.
  useEffect(() => onCerrar(), [pathname, escritorio]); // eslint-disable-line react-hooks/exhaustive-deps

  // Cajón abierto en móvil: bloquea el scroll, atrapa el foco y cierra con Escape.
  useEffect(() => {
    if (!modal || !abierto) return undefined;
    const cajon = cajonRef.current;
    const boton = botonRef.current;
    const overflowPrevio = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    (cajon.querySelector('[aria-current="page"]') || cajon.querySelector(ENFOCABLES))?.focus();

    const alTeclear = (e) => {
      if (e.key === 'Escape') {
        onCerrar();
        return;
      }
      if (e.key !== 'Tab') return;
      const nodos = [...cajon.querySelectorAll(ENFOCABLES)];
      const primero = nodos[0];
      const ultimo = nodos[nodos.length - 1];
      if (e.shiftKey && document.activeElement === primero) {
        e.preventDefault();
        ultimo.focus();
      } else if (!e.shiftKey && document.activeElement === ultimo) {
        e.preventDefault();
        primero.focus();
      }
    };
    document.addEventListener('keydown', alTeclear);
    return () => {
      document.removeEventListener('keydown', alTeclear);
      document.body.style.overflow = overflowPrevio;
      boton?.focus();
    };
  }, [modal, abierto]); // eslint-disable-line react-hooks/exhaustive-deps

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

  const enlace = ({ ruta, nombre, Icono }) => (
    <li key={ruta}>
      <NavLink to={ruta} className="menu-lateral__enlace" title={compacto ? nombre : undefined}>
        <Icono aria-hidden="true" />
        <span className="menu-lateral__texto">{nombre}</span>
      </NavLink>
    </li>
  );

  const propsCajon = modal
    ? { role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Menú principal' }
    : { 'aria-label': 'Menú principal' };

  return (
    <div
      className="menu-lateral"
      data-abierto={abierto}
      data-colapsado={compacto}
      inert={modal && !abierto ? '' : undefined}
    >
      <div className="menu-lateral__velo" onClick={onCerrar} aria-hidden="true" />
      <aside ref={cajonRef} id="menu-lateral" className="menu-lateral__cajon" {...propsCajon}>
        <div className="menu-lateral__cabeza">
          <NavLink to="/home" className="menu-lateral__marca" aria-label={`${nombreTienda}, ir al inicio`}>
            <EmblemaTienda />
            <span className="menu-lateral__titulos">
              <strong>{nombreTienda}</strong>
              <span>Panel de administración</span>
            </span>
          </NavLink>
          <button
            type="button"
            className="menu-lateral__colapsar"
            onClick={onColapsar}
            aria-expanded={!colapsado}
            aria-controls="menu-lateral"
            title={colapsado ? 'Mostrar menú' : 'Ocultar menú'}
          >
            {colapsado ? <PanelLeftOpen aria-hidden="true" /> : <PanelLeftClose aria-hidden="true" />}
            <span className="sr-only">{colapsado ? 'Mostrar menú' : 'Ocultar menú'}</span>
          </button>
          <button type="button" className="menu-lateral__cerrar" onClick={onCerrar}>
            <X aria-hidden="true" />
            <span className="sr-only">Cerrar menú</span>
          </button>
        </div>

        <nav className="menu-lateral__cuerpo" aria-label="Secciones">
          <p className="menu-lateral__grupo">Tienda</p>
          <ul>{SECCIONES.map(enlace)}</ul>
          <p className="menu-lateral__grupo">Cuenta</p>
          <ul>{CUENTA.map(enlace)}</ul>
        </nav>

        <div className="menu-lateral__pie">
          <div className="menu-lateral__usuario">
            <span className="menu-lateral__avatar" aria-hidden="true">{initial}</span>
            <span className="menu-lateral__quien">
              <strong>{displayName}</strong>
              <span>Administrador</span>
            </span>
            <ToggleTheme floating={false} />
          </div>
          <button type="button" className="menu-lateral__salir" onClick={handleLogout} title={compacto ? 'Cerrar sesión' : undefined}>
            <LogOut aria-hidden="true" />
            <span className="menu-lateral__texto">Cerrar sesión</span>
          </button>
        </div>
      </aside>
    </div>
  );
};

export default MenuLateral;
