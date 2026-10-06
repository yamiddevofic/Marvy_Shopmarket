import React from 'react'; // No necesitas useEffect aquí
import { Wheat, Archive, ChevronLeft, ChevronRight, PencilLine } from 'lucide-react';
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
    formatPrice
}) => {

    const [open, setOpen] = useState(false)
    const [keyRow, setKeyRow] = useState("")
    const [item, setItem] = useState({})
    

    // Los console.log están bien para depuración, pero no en producción.

    const esTenderos = id === "register-shopkeeper";
    const abrir = (registro, index) => {
        setOpen(true);
        setItem(registro);
        setKeyRow(index);
    };

    const paginacion = m && m.length > itemsPerPage && (
        <nav className="gestion-paginas" aria-label="Páginas">
            <button type="button" onClick={goToPrevPage} disabled={currentPage === 1} className="gestion-paginas__boton" aria-label="Página anterior">
                <ChevronLeft aria-hidden="true" />
            </button>
            <span className="gestion-paginas__texto">Página {currentPage} de {totalPages}</span>
            <button type="button" onClick={goToNextPage} disabled={currentPage === totalPages} className="gestion-paginas__boton" aria-label="Página siguiente">
                <ChevronRight aria-hidden="true" />
            </button>
        </nav>
    );

    const cabecera = (titulo) => (
        <header className="gestion-lista__cabeza">
            <h2 className="gestion-lista__titulo">
                {titulo} <span className="gestion-lista__total">{m.length}</span>
            </h2>
            {paginacion}
        </header>
    );

    return (
        <div className="gestion-lista">
          <Example open={open} setOpen={setOpen} keyRow={keyRow} m={m} id={id} item={item} onItemDeleted={onItemDeleted} onItemAdded={onItemAdded} onItemUpdated={onItemUpdated}/>
          {isLoading ? (
            <LoadingSkeleton />
          ) : m && m.length === 0 ? (
            <PlaceholderComponent Archive={Archive} id={id} />
          ) : esTenderos ? (
            <>
              {cabecera('Tenderos')}
              <p className="gestion-lista__ayuda">Toca un tendero para editar o borrar sus datos.</p>
              <div className="gestion-fila gestion-fila--cabeza gestion-fila--tenderos" aria-hidden="true">
                <span>Nombre</span><span>ID</span><span>Correo</span><span>Celular</span><span>Tienda</span>
              </div>
              <ul className="gestion-lista__filas">
                {currentItems.map((tendero, index) => (
                  <li key={tendero.id}>
                    <button type="button" onClick={() => abrir(tendero, index)} className="gestion-fila gestion-fila--tenderos">
                      <span className="gestion-fila__principal">
                        <span className="gestion-fila__avatar" aria-hidden="true">
                          {(tendero.nombre || '?').charAt(0).toUpperCase()}
                        </span>
                        <span className="gestion-fila__nombre">{tendero.nombre}</span>
                      </span>
                      <span className="gestion-fila__dato" data-etiqueta="ID">{tendero.id}</span>
                      <span className="gestion-fila__dato" data-etiqueta="Correo">{tendero.correo}</span>
                      <span className="gestion-fila__dato" data-etiqueta="Celular">{tendero.celular}</span>
                      <span className="gestion-fila__dato" data-etiqueta="Tienda">{tendero.tienda_Id}</span>
                      <PencilLine className="gestion-fila__editar" aria-hidden="true" />
                    </button>
                  </li>
                ))}
              </ul>
            </>
          ) : id === "new-product" ? (
            <>
              {cabecera('Productos')}
              <p className="gestion-lista__ayuda">Toca un producto para editar o borrar sus datos.</p>
              <div className="gestion-fila gestion-fila--cabeza gestion-fila--productos" aria-hidden="true">
                <span>Producto</span><span>Categoría</span><span>Precio</span><span>Stock</span>
              </div>
              <ul className="gestion-lista__filas">
                {currentItems.map((producto, index) => (
                  <li key={producto._id}>
                    <button type="button" onClick={() => abrir(producto, index)} className="gestion-fila gestion-fila--productos">
                      <span className="gestion-fila__principal">
                        <span className="gestion-fila__avatar gestion-fila__avatar--producto" aria-hidden="true">
                          <Wheat />
                        </span>
                        <span className="gestion-fila__textos">
                          <span className="gestion-fila__nombre">{producto.nombre}</span>
                          <span className="gestion-fila__id">ID {producto._id}</span>
                        </span>
                      </span>
                      <span className="gestion-fila__dato" data-etiqueta="Categoría">{producto.categoria}</span>
                      <span className="gestion-fila__dato gestion-fila__dato--cifra" data-etiqueta="Precio">{formatPrice(producto.precio)}</span>
                      <span className={`gestion-fila__dato gestion-fila__dato--cifra${Number(producto.stock) <= 5 ? ' gestion-fila__dato--bajo' : ''}`} data-etiqueta="Stock">{producto.stock}</span>
                      <PencilLine className="gestion-fila__editar" aria-hidden="true" />
                    </button>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <PlaceholderComponent Archive={Archive} id={id} />
          )}
        </div>
    );
};

export default ResultComponent;
