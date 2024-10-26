import React from 'react';
import StatsCard from './StatsCard';
import { DollarSign, TrendingDown, TrendingUp } from "lucide-react";

const StatsGrid = () => {
  return (
    <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-3">
      <StatsCard
        title="Ventas Totales"
        value="$45,231"
        icon={DollarSign}
        trend={12}
        color="bg-blue-500"
      />
      <StatsCard
        title="Gastos"
        value="$12,345"
        icon={TrendingDown}
        trend={-8}
        color="bg-red-500"
      />
      <StatsCard
        title="Beneficio Neto"
        value="$32,886"
        icon={TrendingUp}
        trend={15}
        color="bg-green-500"
      />
    </div>
  );
};

export default StatsGrid;