import PropTypes from 'prop-types';
import { Bolt, Box, ChevronRight, PackageSearch, Receipt, ScrollText, Truck, UserPlus, Users } from 'lucide-react';

// Accesos a cada módulo, agrupados por la tarea del tendero.
// `icon` es el nombre que el resto de la app guarda en selectedIcon.
const GRUPOS = [
  {
    id: 'operacion',
    titulo: 'Operación diaria',
    modulos: [
      { option: 'ventas', icon: 'Receipt', Icono: Receipt, titulo: 'Ventas', descripcion: 'Registrar las ventas del día' },
      { option: 'inventario', icon: 'PackageSearch', Icono: PackageSearch, titulo: 'Inventario', descripcion: 'Actualizar existencias' },
      { option: 'productos', icon: 'Box', Icono: Box, titulo: 'Productos', descripcion: 'Catálogo, precios y stock' },
      { option: 'reportes', icon: 'ScrollText', Icono: ScrollText, titulo: 'Reportes', descripcion: 'Resultados por rango de fechas' },
    ],
  },
  {
    id: 'abastecimiento',
    titulo: 'Abastecimiento',
    modulos: [
      { option: 'proveedores', icon: 'Users', Icono: Users, titulo: 'Proveedores', descripcion: 'Quién te surte la mercancía' },
      { option: 'suministros', icon: 'Truck', Icono: Truck, titulo: 'Suministros', descripcion: 'Entregas y pedidos recibidos' },
    ],
  },
  {
    id: 'equipo',
    titulo: 'Equipo y ajustes',
    modulos: [
      { option: 'tenderos', icon: 'UserPlus', Icono: UserPlus, titulo: 'Tenderos', descripcion: 'Quienes atienden la tienda' },
      { option: 'configuracion', icon: 'Bolt', Icono: Bolt, titulo: 'Configuración', descripcion: 'Ajustes de la tienda' },
    ],
  },
];

const Modulos = ({ onSeleccionar }) => (
  <section className="tarjeta modulos" aria-labelledby="modulos-titulo">
    <header className="tarjeta__titulos">
      <h2 id="modulos-titulo" className="tarjeta__titulo">Módulos</h2>
      <p className="tarjeta__ayuda">Todo lo que puedes gestionar en tu tienda</p>
    </header>
    {GRUPOS.map((grupo) => (
      <div key={grupo.id} className="modulos__grupo" role="group" aria-labelledby={`grupo-${grupo.id}`}>
        <h3 id={`grupo-${grupo.id}`} className="modulos__titulo">{grupo.titulo}</h3>
        <ul className="modulos__lista">
          {grupo.modulos.map(({ option, icon, Icono, titulo, descripcion }) => (
            <li key={option}>
              <button type="button" className="modulo" onClick={() => onSeleccionar(option, icon)}>
                <span className="modulo__icono" aria-hidden="true"><Icono /></span>
                <span className="modulo__texto">
                  <span className="modulo__titulo">{titulo}</span>
                  <span className="modulo__descripcion">{descripcion}</span>
                </span>
                <ChevronRight className="modulo__flecha" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      </div>
    ))}
  </section>
);

Modulos.propTypes = {
  onSeleccionar: PropTypes.func.isRequired,
};

export default Modulos;
