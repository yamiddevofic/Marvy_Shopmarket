import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { ArrowRight, Mail, MapPin, Phone } from 'lucide-react';

// Ficha de la tienda con los datos que devuelve /consultar-info.
const DatosTienda = ({ tienda }) => {
  const nombre = tienda?.nombre || 'Tu tienda';
  const filas = [
    { Icono: MapPin, etiqueta: 'Ubicación', valor: tienda?.ubicacion },
    { Icono: Mail, etiqueta: 'Correo', valor: tienda?.correo },
    { Icono: Phone, etiqueta: 'Celular', valor: tienda?.celular },
  ];

  return (
    <section className="tarjeta ficha" aria-labelledby="ficha-titulo">
      <header className="tarjeta__cabeza">
        <h2 id="ficha-titulo" className="tarjeta__titulo">Tu tienda</h2>
        <Link to="/perfil" className="tarjeta__enlace">
          Ver perfil <ArrowRight aria-hidden="true" />
        </Link>
      </header>
      <div className="ficha__identidad">
        <span className="ficha__logo" aria-hidden="true">
          {tienda?.imagen ? <img src={tienda.imagen} alt="" /> : nombre.charAt(0).toUpperCase()}
        </span>
        <span className="ficha__nombre">{nombre}</span>
      </div>
      <dl className="ficha__datos">
        {filas.map(({ Icono, etiqueta, valor }) => (
          <div key={etiqueta} className="ficha__fila">
            <dt><Icono aria-hidden="true" /> {etiqueta}</dt>
            <dd className={valor ? '' : 'ficha__vacio'}>{valor || 'Sin registrar'}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
};

DatosTienda.propTypes = {
  tienda: PropTypes.shape({
    nombre: PropTypes.string,
    ubicacion: PropTypes.string,
    correo: PropTypes.string,
    celular: PropTypes.string,
    imagen: PropTypes.string,
  }),
};

export default DatosTienda;
