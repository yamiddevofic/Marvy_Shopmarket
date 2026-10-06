import React from 'react';
import { ArrowUpRight } from 'lucide-react';

const OptionCard = ({ icon: Icon, title, description, onClick }) => (
  <button type="button" className="panel-modulo" onClick={onClick}>
    <span className="panel-modulo__icono" aria-hidden="true">
      <Icon />
    </span>
    <span className="panel-modulo__texto">
      <span className="panel-modulo__titulo">{title}</span>
      {description && <span className="panel-modulo__descripcion">{description}</span>}
    </span>
    <ArrowUpRight className="panel-modulo__flecha" aria-hidden="true" />
  </button>
);

export default OptionCard;
