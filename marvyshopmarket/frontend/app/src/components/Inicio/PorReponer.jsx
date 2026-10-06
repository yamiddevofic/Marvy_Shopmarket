import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { ArrowRight, CircleCheck, RefreshCw } from 'lucide-react';
import { STOCK_BAJO, entero, estadoStock } from '../../utils/negocio';

const MAXIMO = 5;

// Productos con stock bajo, del más urgente al menos urgente.
const PorReponer = ({ productos, onReintentar }) => {
  const pendientes = Array.isArray(productos)
    ? productos
        .filter((p) => Number(p.stock) <= STOCK_BAJO)
        .sort((a, b) => Number(a.stock) - Number(b.stock) || String(a.nombre).localeCompare(String(b.nombre)))
    : [];

  let cuerpo;
  if (productos === undefined) {
    cuerpo = (
      <ul className="reponer__lista" aria-busy="true" aria-label="Cargando productos">
        {[0, 1, 2].map((i) => (
          <li key={i} className="reponer__fila"><span className="esqueleto reponer__esqueleto" /></li>
        ))}
      </ul>
    );
  } else if (productos === false) {
    cuerpo = (
      <div className="reponer__estado">
        <p>No pudimos cargar los productos.</p>
        <button type="button" className="boton" onClick={onReintentar}>
          <RefreshCw aria-hidden="true" /> Reintentar
        </button>
      </div>
    );
  } else if (!pendientes.length) {
    cuerpo = (
      <div className="reponer__estado reponer__estado--ok">
        <CircleCheck aria-hidden="true" />
        <p>
          <strong>Todo en orden.</strong> Ningún producto tiene {STOCK_BAJO} unidades o menos.
        </p>
      </div>
    );
  } else {
    cuerpo = (
      <ul className="reponer__lista">
        {pendientes.slice(0, MAXIMO).map((p) => {
          const estado = estadoStock(p.stock);
          return (
            <li key={p._id} className="reponer__fila">
              <span className="reponer__producto">
                <span className="reponer__nombre">{p.nombre}</span>
                {p.categoria && <span className="reponer__categoria">{p.categoria}</span>}
              </span>
              <span className="reponer__cantidad">
                <span className="reponer__unidades">{entero(Number(p.stock) || 0)} und.</span>
                {estado && <span className={`chip chip--${estado.tono}`}>{estado.texto}</span>}
              </span>
            </li>
          );
        })}
      </ul>
    );
  }

  const resto = pendientes.length - MAXIMO;

  return (
    <section className="tarjeta reponer" aria-labelledby="reponer-titulo">
      <header className="tarjeta__cabeza">
        <div className="tarjeta__titulos">
          <h2 id="reponer-titulo" className="tarjeta__titulo">
            Por reponer
            {pendientes.length > 0 && <span className="chip chip--alerta">{pendientes.length}</span>}
          </h2>
          <p className="tarjeta__ayuda">Productos con pocas unidades</p>
        </div>
        <Link to="/productos" className="tarjeta__enlace">
          Ver productos <ArrowRight aria-hidden="true" />
        </Link>
      </header>
      {cuerpo}
      {resto > 0 && <p className="reponer__resto">y {resto} {resto === 1 ? 'producto más' : 'productos más'}</p>}
    </section>
  );
};

PorReponer.propTypes = {
  productos: PropTypes.oneOfType([PropTypes.array, PropTypes.oneOf([false])]),
  onReintentar: PropTypes.func.isRequired,
};

export default PorReponer;
