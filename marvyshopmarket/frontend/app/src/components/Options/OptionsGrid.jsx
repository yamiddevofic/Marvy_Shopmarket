import React from 'react';
import OptionCard from './OptionCard';
import { Receipt, Truck, PackageSearch, Users, UserPlus, Box, ScrollText, Bolt } from "lucide-react";
import { useNavigate } from 'react-router-dom';

// Los módulos se agrupan por lo que hace el tendero en su día:
// vender y controlar, surtir la tienda, y atender el negocio.
const GRUPOS = [
  {
    id: 'dia',
    titulo: 'Día a día',
    ayuda: 'Lo que usas cada vez que abres la tienda',
    modulos: [
      { option: 'ventas', icon: 'Receipt', Icono: Receipt, titulo: 'Ventas', descripcion: 'Gestionar ventas y transacciones' },
      { option: 'inventario', icon: 'PackageSearch', Icono: PackageSearch, titulo: 'Inventario', descripcion: 'Gestión de productos en stock' },
      { option: 'productos', icon: 'Box', Icono: Box, titulo: 'Nuevo producto', descripcion: 'Agregar un producto al catálogo' },
      { option: 'reportes', icon: 'ScrollText', Icono: ScrollText, titulo: 'Reportes', descripcion: 'Generar el reporte de tu negocio' },
    ],
  },
  {
    id: 'surtido',
    titulo: 'Surtir la tienda',
    ayuda: 'De dónde llega la mercancía',
    modulos: [
      { option: 'proveedores', icon: 'Users', Icono: Users, titulo: 'Proveedores', descripcion: 'Administrar proveedores' },
      { option: 'suministros', icon: 'Truck', Icono: Truck, titulo: 'Suministros', descripcion: 'Control de entregas y pedidos' },
    ],
  },
  {
    id: 'equipo',
    titulo: 'Tu equipo y tu tienda',
    ayuda: 'Quién atiende y cómo está configurada',
    modulos: [
      { option: 'tenderos', icon: 'UserPlus', Icono: UserPlus, titulo: 'Tenderos', descripcion: 'Registrar tendero' },
      { option: 'configuracion', icon: 'Bolt', Icono: Bolt, titulo: 'Configuración', descripcion: 'Ajustes de tu tienda' },
    ],
  },
];

const OptionsGrid = ({ setSelectedOption, setSelectedIcon }) => {
  const navigate = useNavigate();

  const handleSelectOption = (option, iconName) => {
    setSelectedOption(option);
    setSelectedIcon(iconName);
    localStorage.setItem('selectedOption', option);
    localStorage.setItem('selectedIcon', iconName);
    navigate(`/${option}`);
  };

  return (
    <div className="panel-grupos">
      {GRUPOS.map((grupo) => (
        <section key={grupo.id} className={`panel-grupo panel-grupo--${grupo.id}`} aria-labelledby={`grupo-${grupo.id}`}>
          <header className="panel-grupo__cabeza">
            <h3 id={`grupo-${grupo.id}`} className="panel-grupo__titulo">{grupo.titulo}</h3>
            <p className="panel-grupo__ayuda">{grupo.ayuda}</p>
          </header>
          <div className="panel-grupo__modulos">
            {grupo.modulos.map((m) => (
              <OptionCard
                key={m.option}
                icon={m.Icono}
                title={m.titulo}
                description={m.descripcion}
                onClick={() => handleSelectOption(m.option, m.icon)}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};

export default OptionsGrid;
