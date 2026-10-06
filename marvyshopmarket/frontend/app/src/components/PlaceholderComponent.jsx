import React from 'react';

const PlaceholderComponent = ({ Archive, id }) => {
    const cosa = id === "register-shopkeeper" ? "tenderos" : "productos";
    return (
        <div className="gestion-vacio">
            <span className="gestion-vacio__icono" aria-hidden="true">
              <Archive />
            </span>
            <h2 className="gestion-vacio__titulo">Aún no hay {cosa} registrados</h2>
            <p className="gestion-vacio__texto">
              Cuando registres {id === "register-shopkeeper" ? "un tendero" : "un producto"} con el formulario, aparecerá aquí.
            </p>
        </div>
    );
};

export default PlaceholderComponent;
