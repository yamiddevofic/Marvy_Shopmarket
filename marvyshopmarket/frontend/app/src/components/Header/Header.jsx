import React from 'react';
import { Menu } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import EmblemaTienda from '../Login/EmblemaTienda';
import { SECCIONES } from './MenuLateral';

// Cabecera de móvil y tablet: botón ☰ que abre la barra lateral, y la marca.
// En escritorio la barra lateral está siempre visible y esta cabecera se oculta.
const Header = ({ storeInfo, menuAbierto, onAbrirMenu, botonRef }) => {
  const { pathname } = useLocation();
  const nombreTienda = storeInfo?.nombre || 'Tu tienda';
  const seccionActual = SECCIONES.find((s) => s.ruta === pathname)?.nombre;

  return (
    <header className="panel-cabecera">
      <div className="panel-cabecera__barra">
        <button
          ref={botonRef}
          type="button"
          className="panel-cabecera__menu"
          aria-label="Abrir menú"
          aria-haspopup="dialog"
          aria-expanded={menuAbierto}
          aria-controls="menu-lateral"
          onClick={onAbrirMenu}
        >
          <Menu aria-hidden="true" />
        </button>

        <NavLink to="/home" className="panel-cabecera__marca" aria-label={`${nombreTienda}, ir al inicio`}>
          <EmblemaTienda />
          <span className="panel-cabecera__titulos">
            <span className="panel-cabecera__tienda">{nombreTienda}</span>
            <span className="panel-cabecera__rol">{seccionActual || 'Panel de administración'}</span>
          </span>
        </NavLink>
      </div>
    </header>
  );
};

export default Header;
