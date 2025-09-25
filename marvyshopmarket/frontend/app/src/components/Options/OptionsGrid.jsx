import React from 'react';
import OptionCard from './OptionCard';
import { Receipt, Truck, PackageSearch, Users, UserPlus } from "lucide-react";
import { Link, useNavigate } from 'react-router-dom';

const OptionsGrid = ({ selectedOption, setSelectedOption, 
  setSelectedIcon, selectedIcon }) => {

  
  const navigate = useNavigate()
  console.log(selectedOption)

  const handleSelectOption = (option, iconName) => {
    setSelectedOption(option);
    setSelectedIcon(iconName);
    localStorage.setItem('selectedOption', option);
    localStorage.setItem('selectedIcon', iconName);
    console.log('Option selected:', option);
    console.log('Icon selected:', iconName);
    navigate(`/${option}`);
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      <OptionCard
        icon={Receipt}
        title="Ventas"
        description="Gestionar ventas y transacciones"
        onClick={() => handleSelectOption('ventas', 'Receipt')}
        selectedOption="ventas"
      />
      <OptionCard
        icon={Truck}
        title="Suministros"
        description="Control de entregas y pedidos"
        onClick={() => handleSelectOption('suministros', 'Truck')}
        selectedOption="suministros"
      />
      <OptionCard
        icon={PackageSearch}
        title="Inventario"
        description="Gestión de productos en stock"
        onClick={() => handleSelectOption('inventario', 'PackageSearch')}
        selectedOption="inventario"
      />
      <OptionCard
        icon={Users}
        title="Proveedores"
        description="Administrar proveedores"
        onClick={() => handleSelectOption('proveedores', 'Users')}
        selectedOption="proveedores"
      />
      <OptionCard
        onClick={() => handleSelectOption('tenderos', 'UserPlus')}
        icon={UserPlus}
        title="Tenderos"
        description="Registrar tendero"
        selectedOption="tenderos"
      />
    </div>
  );
};

export default OptionsGrid;