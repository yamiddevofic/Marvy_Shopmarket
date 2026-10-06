import PropTypes from 'prop-types';
import { Box, PackageX, UserPlus, Wallet } from 'lucide-react';
import { STOCK_BAJO, entero, pesos } from '../../utils/negocio';

// Cuatro indicadores calculados con datos reales de la tienda.
// Cada fuente llega como: undefined (cargando), false (falló) o un arreglo.
const Indicador = ({ Icono, etiqueta, valor, nota, tono, estado }) => (
  <div className={`indicador${tono ? ` indicador--${tono}` : ''}`}>
    <dt className="indicador__etiqueta">
      <span className="indicador__icono" aria-hidden="true"><Icono /></span>
      {etiqueta}
    </dt>
    <dd className="indicador__valor">
      {estado === 'cargando' ? <span className="esqueleto indicador__esqueleto" aria-label="Cargando" /> : estado === 'error' ? '—' : valor}
    </dd>
    <dd className="indicador__nota">
      {estado === 'cargando' ? '\u00a0' : estado === 'error' ? 'No se pudo cargar' : nota}
    </dd>
  </div>
);

Indicador.propTypes = {
  Icono: PropTypes.elementType.isRequired,
  etiqueta: PropTypes.string.isRequired,
  valor: PropTypes.node,
  nota: PropTypes.node,
  tono: PropTypes.oneOf(['alerta', 'ok']),
  estado: PropTypes.oneOf(['cargando', 'error', 'listo']).isRequired,
};

const estadoDe = (fuente) => (fuente === undefined ? 'cargando' : fuente === false ? 'error' : 'listo');

const Indicadores = ({ productos, tenderos }) => {
  const lista = Array.isArray(productos) ? productos : [];
  const categorias = new Set(lista.map((p) => p.categoria).filter(Boolean)).size;
  const porReponer = lista.filter((p) => Number(p.stock) <= STOCK_BAJO).length;
  const valor = lista.reduce((suma, p) => suma + (Number(p.precio) || 0) * (Number(p.stock) || 0), 0);
  const estadoProductos = estadoDe(productos);
  const equipo = Array.isArray(tenderos) ? tenderos.length : 0;

  return (
    <dl className="indicadores">
      <Indicador
        Icono={Box}
        etiqueta="Productos"
        estado={estadoProductos}
        valor={entero(lista.length)}
        nota={lista.length ? `en ${categorias} ${categorias === 1 ? 'categoría' : 'categorías'}` : 'Aún no registras productos'}
      />
      <Indicador
        Icono={PackageX}
        etiqueta="Por reponer"
        estado={estadoProductos}
        valor={entero(porReponer)}
        tono={porReponer ? 'alerta' : 'ok'}
        nota={porReponer ? `${STOCK_BAJO} unidades o menos` : 'Todo con buen stock'}
      />
      <Indicador
        Icono={Wallet}
        etiqueta="Valor del inventario"
        estado={estadoProductos}
        valor={pesos(valor)}
        nota="precio × unidades"
      />
      <Indicador
        Icono={UserPlus}
        etiqueta="Tenderos"
        estado={estadoDe(tenderos)}
        valor={entero(equipo)}
        nota={equipo ? 'en tu equipo' : 'Aún no registras tenderos'}
      />
    </dl>
  );
};

Indicadores.propTypes = {
  productos: PropTypes.oneOfType([PropTypes.array, PropTypes.oneOf([false])]),
  tenderos: PropTypes.oneOfType([PropTypes.array, PropTypes.oneOf([false])]),
};

export default Indicadores;
