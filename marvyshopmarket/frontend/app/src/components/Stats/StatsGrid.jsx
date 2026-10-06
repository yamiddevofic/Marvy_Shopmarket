import React from 'react';
import StatsCard from './StatsCard';
import { DollarSign, TrendingDown, TrendingUp } from "lucide-react";

const StatsGrid = () => (
  <div className="panel-cifras">
    <StatsCard title="Ventas totales" value="$45,231" icon={DollarSign} trend={12} tono="ventas" />
    <StatsCard title="Gastos" value="$12,345" icon={TrendingDown} trend={-8} tono="gastos" buenaSiSube={false} />
    <StatsCard title="Beneficio neto" value="$32,886" icon={TrendingUp} trend={15} tono="beneficio" />
  </div>
);

export default StatsGrid;
