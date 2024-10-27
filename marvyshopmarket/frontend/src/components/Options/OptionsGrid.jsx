import React from 'react';
import {Link} from 'react-router-dom'
import OptionCard from './OptionCard';
import { Receipt, Truck, PackageSearch, Users } from "lucide-react";

const OptionsGrid = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      <OptionCard
        icon={Receipt}
        title="Ventas"
        description="Gestionar ventas y transacciones"
      />
      <OptionCard
        icon={Truck}
        title="Suministros"
        description="Control de entregas y pedidos"
      />
      <OptionCard
        icon={PackageSearch}
        title="Inventario"
        description="Gestión de productos y stock"
      />
      <OptionCard
        icon={Users}
        title="Proveedores"
        description="Administrar proveedores"
      />
      <Link to='/tenderos'>
        <OptionCard
          icon={Users}
          title="Tenderos"
          description="Registrar tenderos"
        />
      </Link>
    </div>
  );
};

export default OptionsGrid;