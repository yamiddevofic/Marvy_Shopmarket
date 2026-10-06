import PropTypes from 'prop-types';
import { MapPin } from 'lucide-react';

// Vista previa en vivo de la tienda que se está registrando: nombre, ubicación,
// logo y cuánto del formulario va completo. Es solo gráfica (aria-hidden): el
// formulario es la fuente de verdad.
const TarjetaTienda = ({ nombre, ubicacion, logo, avance }) => {
  const inicial = nombre.trim().charAt(0).toUpperCase();

  return (
    <div className="tarjeta-tienda" aria-hidden="true">
      <div className="tarjeta-tienda__cabeza">
        <div className="tarjeta-tienda__logo">
          {logo ? <img src={logo} alt="" /> : inicial || <span className="tarjeta-tienda__logo-vacio" />}
        </div>
        <div className="tarjeta-tienda__datos">
          <p className={`tarjeta-tienda__nombre${nombre ? '' : ' tarjeta-tienda__nombre--vacio'}`}>
            {nombre || 'Nombre de tu tienda'}
          </p>
          <p className="tarjeta-tienda__lugar">
            <MapPin />
            <span>{ubicacion || 'Tu barrio'}</span>
          </p>
        </div>
      </div>
      <div className="tarjeta-tienda__avance">
        <div className="tarjeta-tienda__pista">
          <div className="tarjeta-tienda__relleno" style={{ width: `${avance}%` }} />
        </div>
        <span className="tarjeta-tienda__texto">
          {avance >= 100 ? '¡Lista para abrir!' : `Perfil al ${avance}%`}
        </span>
      </div>
    </div>
  );
};

TarjetaTienda.propTypes = {
  nombre: PropTypes.string.isRequired,
  ubicacion: PropTypes.string.isRequired,
  logo: PropTypes.string,
  avance: PropTypes.number.isRequired,
};

export default TarjetaTienda;
