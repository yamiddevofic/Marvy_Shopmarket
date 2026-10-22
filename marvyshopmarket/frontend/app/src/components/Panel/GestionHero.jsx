import PropTypes from 'prop-types';
import Ilustracion from './Ilustraciones';

// Cabecera de las pantallas de gestión: nombre, para qué sirve y su ilustración.
const GestionHero = ({ id, titulo, descripcion }) => (
  <section className="gestion-hero" aria-labelledby={`${id}-titulo`}>
    <div className="gestion-hero__texto">
      <h1 id={`${id}-titulo`} className="gestion-hero__titulo">{titulo}</h1>
      <p className="gestion-hero__bajada">{descripcion}</p>
    </div>
    <div className="gestion-hero__escena">
      <Ilustracion id={id} />
    </div>
  </section>
);

GestionHero.propTypes = {
  id: PropTypes.string.isRequired,
  titulo: PropTypes.string.isRequired,
  descripcion: PropTypes.string.isRequired,
};

export default GestionHero;
