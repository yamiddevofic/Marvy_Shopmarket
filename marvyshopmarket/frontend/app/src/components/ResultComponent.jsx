import React from 'react'; // No necesitas useEffect aquí
import { Wheat, Archive, ChevronLeft, ChevronRight, PencilLine, Search } from 'lucide-react';
import { estadoStock } from '../utils/negocio';
import Example from './modal/Example';
import { useState } from 'react'
import PlaceholderComponent from './PlaceholderComponent';

const ResultComponent = ({
    id,
    m, // Lista total de ítems (productos/tenderos)
    currentPage,
    setCurrentPage,
    goToPage,
    goToNextPage,
    goToPrevPage,
    isLoading,
    itemsPerPage,
    totalPages,
    currentItems, // Ítems de la página actual, derivados de 'm'
    LoadingSkeleton,
    User,
    Box,
    error,
    // *** NUEVOS PROPS ***
    onItemDeleted, // Función para notificar al padre sobre una eliminación
    onItemAdded, // Función para notificar al padre sobre una adición (si se hace aquí)
    onItemUpdated, // Función para notificar al padre sobre una actualización
    formatPrice,
    visibles = m,
    consulta = '',
    onBuscar,
    startIndex = 0
}) => {

    const [open, setOpen] = useState(false)
    const [keyRow, setKeyRow] = useState("")
    const [item, setItem] = useState({})
    

    // Los console.log están bien para depuración, pero no en producción.

    const esTenderos = id === "register-shopkeeper";
    const nombrePlural = esTenderos ? 'tenderos' : 'productos';
    const abrir = (registro, index) => {
        setOpen(true);
        setItem(registro);
        setKeyRow(index);
    };

    const desde = visibles.length ? startIndex + 1 : 0;
    const hasta = Math.min(startIndex + itemsPerPage, visibles.length);

    const cabecera = (
        <header className="gestion-lista__cabeza">
            <div className="tarjeta__titulos">
                <h2 className="tarjeta__titulo">
                    {esTenderos ? 'Tenderos registrados' : 'Productos registrados'}
                    <span className="chip chip--neutro">{m.length}</span>
                </h2>
                <p className="tarjeta__ayuda">Toca {esTenderos ? 'un tendero' : 'un producto'} para editarlo o borrarlo.</p>
            </div>
            <label className="gestion-buscar">
                <Search aria-hidden="true" />
                <span className="sr-only">Buscar {nombrePlural}</span>
                <input
                    type="search"
                    value={consulta}
                    onChange={(e) => onBuscar?.(e.target.value)}
                    placeholder={esTenderos ? 'Buscar tendero' : 'Buscar producto'}
                    className="gestion-buscar__input"
                />
            </label>
        </header>
    );

    const pie = visibles.length > 0 && (
        <footer className="gestion-lista__pie">
            <p className="gestion-lista__rango" aria-live="polite">
                {desde}–{hasta} de {visibles.length}
            </p>
            {totalPages > 1 && (
                <nav className="gestion-paginas" aria-label="Páginas">
                    <button type="button" onClick={goToPrevPage} disabled={currentPage === 1} className="gestion-paginas__boton" aria-label="Página anterior">
                        <ChevronLeft aria-hidden="true" />
                    </button>
                    <span className="gestion-paginas__texto">{currentPage} / {totalPages}</span>
                    <button type="button" onClick={goToNextPage} disabled={currentPage === totalPages} className="gestion-paginas__boton" aria-label="Página siguiente">
                        <ChevronRight aria-hidden="true" />
                    </button>
                </nav>
            )}
        </footer>
    );

    const sinResultados = (
        <div className="gestion-sin-resultados">
            <p>Ningún {esTenderos ? 'tendero' : 'producto'} coincide con «{consulta}».</p>
            <button type="button" className="tarjeta__enlace" onClick={() => onBuscar?.('')}>Limpiar búsqueda</button>
        </div>
    );

    let filas;
    if (esTenderos) {
        filas = (
            <>
              <div className="gestion-fila gestion-fila--cabeza gestion-fila--tenderos" aria-hidden="true">
                <span>Nombre</span><span>Cédula</span><span>Correo</span><span>Celular</span>
              </div>
              <ul className="gestion-lista__filas">
                {currentItems.map((tendero, index) => (
                  <li key={tendero.id}>
                    <button type="button" onClick={() => abrir(tendero, index)} className="gestion-fila gestion-fila--tenderos" aria-label={`Editar a ${tendero.nombre}`}>
                      <span className="gestion-fila__principal">
                        <span className="gestion-fila__avatar" aria-hidden="true">
                          {(tendero.nombre || '?').charAt(0).toUpperCase()}
                        </span>
                        <span className="gestion-fila__nombre">{tendero.nombre}</span>
                      </span>
                      <span className="gestion-fila__dato gestion-fila__dato--cifra" data-etiqueta="Cédula">{tendero.id}</span>
                      <span className="gestion-fila__dato" data-etiqueta="Correo">{tendero.correo}</span>
                      <span className="gestion-fila__dato gestion-fila__dato--cifra" data-etiqueta="Celular">{tendero.celular || '—'}</span>
                      <PencilLine className="gestion-fila__editar" aria-hidden="true" />
                    </button>
                  </li>
                ))}
              </ul>
            </>
        );
    } else {
        filas = (
            <>
              <div className="gestion-fila gestion-fila--cabeza gestion-fila--productos" aria-hidden="true">
                <span>Producto</span><span>Categoría</span><span className="gestion-fila__num">Precio</span><span className="gestion-fila__num">Stock</span>
              </div>
              <ul className="gestion-lista__filas">
                {currentItems.map((producto, index) => {
                  const estado = estadoStock(producto.stock);
                  return (
                    <li key={producto._id}>
                      <button type="button" onClick={() => abrir(producto, index)} className="gestion-fila gestion-fila--productos" aria-label={`Editar ${producto.nombre}`}>
                        <span className="gestion-fila__principal">
                          <span className="gestion-fila__avatar gestion-fila__avatar--producto" aria-hidden="true">
                            <Wheat />
                          </span>
                          <span className="gestion-fila__textos">
                            <span className="gestion-fila__nombre">{producto.nombre}</span>
                            <span className="gestion-fila__id">{producto._id}</span>
                          </span>
                        </span>
                        <span className="gestion-fila__dato" data-etiqueta="Categoría">{producto.categoria || '—'}</span>
                        <span className="gestion-fila__dato gestion-fila__dato--cifra gestion-fila__num" data-etiqueta="Precio">{formatPrice(producto.precio)}</span>
                        <span className="gestion-fila__dato gestion-fila__dato--cifra gestion-fila__num" data-etiqueta="Stock">
                          <span className="gestion-fila__stock">
                            {producto.stock ?? '—'}
                            {estado && <span className={`chip chip--${estado.tono}`}>{estado.texto}</span>}
                          </span>
                        </span>
                        <PencilLine className="gestion-fila__editar" aria-hidden="true" />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </>
        );
    }

    return (
        <div className="gestion-lista">
          <Example open={open} setOpen={setOpen} keyRow={keyRow} m={m} id={id} item={item} onItemDeleted={onItemDeleted} onItemAdded={onItemAdded} onItemUpdated={onItemUpdated}/>
          {!m || m.length === 0 ? (
            <PlaceholderComponent Archive={Archive} id={id} />
          ) : (
            <>
              {cabecera}
              {visibles.length ? filas : sinResultados}
              {pie}
            </>
          )}
        </div>
    );
};

export default ResultComponent;
