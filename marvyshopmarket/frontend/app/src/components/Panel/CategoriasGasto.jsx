import PropTypes from 'prop-types';
import { pesos } from '../../utils/negocio';

// Barras horizontales por categoría (un solo color: magnitud), con su valor escrito.
const CategoriasGasto = ({ filas, total }) => {
  const maximo = Math.max(...filas.map(([, monto]) => monto), 1);
  return (
    <ul className="categorias-gasto" aria-label="Gastos por categoría">
      {filas.map(([categoria, monto]) => (
        <li key={categoria} className="categorias-gasto__fila" title={`${categoria}: ${pesos(monto)} (${Math.round((monto / total) * 100)} %)`}>
          <span className="categorias-gasto__nombre">{categoria}</span>
          <span className="categorias-gasto__pista" aria-hidden="true">
            <span className="categorias-gasto__barra" style={{ width: `${(monto / maximo) * 100}%` }} />
          </span>
          <span className="categorias-gasto__valor">{pesos(monto)}</span>
        </li>
      ))}
    </ul>
  );
};

CategoriasGasto.propTypes = {
  filas: PropTypes.arrayOf(PropTypes.array).isRequired,
  total: PropTypes.number.isRequired,
};

export default CategoriasGasto;
