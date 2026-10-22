import React from 'react';
import { Link } from 'react-router-dom';

const PlaceholderComponent = ({ Archive, id }) => {
    const esTenderos = id === "register-shopkeeper";
    const cosa = esTenderos ? "tenderos" : "productos";
    return (
        <div className="gestion-vacio">
            <span className="gestion-vacio__icono" aria-hidden="true">
              <Archive />
            </span>
            <h2 className="gestion-vacio__titulo">Aún no hay {cosa} registrados</h2>
            {esTenderos ? (
              <p className="gestion-vacio__texto">Cuando registres un tendero con el formulario, aparecerá aquí.</p>
            ) : (
              <>
                <p className="gestion-vacio__texto">Cuando agregues un producto, aparecerá aquí con sus existencias.</p>
                <Link to="/productos" className="boton boton--primario">Agregar producto</Link>
              </>
            )}
        </div>
    );
};

export default PlaceholderComponent;
