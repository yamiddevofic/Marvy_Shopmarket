import React from 'react';
import { TrendingUp, TrendingDown } from "lucide-react";

// `tono` (ventas | gastos | beneficio) elige el acento de la tarjeta.
// Si el gasto sube es mala noticia: `buenaSiSube` invierte el color de la tendencia.
const StatsCard = ({ title, value, icon: Icon, trend, tono = 'ventas', buenaSiSube = true }) => {
  const TrendIcon = trend > 0 ? TrendingUp : TrendingDown;
  const favorable = (trend > 0) === buenaSiSube;

  return (
    <article className={`panel-cifra panel-cifra--${tono}`}>
      <div className="panel-cifra__cabeza">
        <span className="panel-cifra__icono" aria-hidden="true">
          <Icon />
        </span>
        <p className="panel-cifra__titulo">{title}</p>
      </div>
      <p className="panel-cifra__valor">{value}</p>
      {trend !== undefined && (
        <p className={`panel-cifra__tendencia${favorable ? '' : ' panel-cifra__tendencia--mala'}`}>
          <TrendIcon aria-hidden="true" />
          <span>{Math.abs(trend)} %</span>
          <span className="panel-cifra__contexto">vs. periodo anterior</span>
        </p>
      )}
    </article>
  );
};

export default StatsCard;
