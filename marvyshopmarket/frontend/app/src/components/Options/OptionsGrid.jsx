import React from 'react';
import OptionCard from './OptionCard';
import { Receipt, Truck, PackageSearch, Users } from "lucide-react";
import { Link, useNavigate } from 'react-router-dom';

const OptionsGrid = ({ selectedOption, setSelectedOption }) => {
  const navigate = useNavigate()
  console.log(selectedOption)

  const handleSelectOption = (option) => {
    setSelectedOption(option);
    console.log('Option selected:', selectedOption);
    navigate(`/${option}`);
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      <OptionCard
        icon={Receipt}
        title="Ventas"
        description="Gestionar ventas y transacciones"
        onClick={() => handleSelectOption('ventas')}
        selectedOption="ventas"
      />
      <OptionCard
        icon={Truck}
        title="Suministros"
        description="Control de entregas y pedidos"
        onClick={() => handleSelectOption('suministros')}
        selectedOption="suministros"
      />
      <OptionCard
        icon={PackageSearch}
        title="Inventario"
        description="Gestión de productos y stock"
        onClick={() => handleSelectOption('inventario')}
        selectedOption="inventario"
      />
      <OptionCard
        icon={Users}
        title="Proveedores"
        description="Administrar proveedores"
        onClick={() => handleSelectOption('proveedores')}
        selectedOption="proveedores"
      />
      <OptionCard
        onClick={() => handleSelectOption('tenderos')}
        icon={Users}
        title="Tenderos"
        description="Registrar tenderos"
        selectedOption="tenderos"
      />
    </div>
  );
};

export default OptionsGrid;