import React, { useState, useEffect, useCallback } from 'react';
import ResultComponent from './ResultComponent'; // Ajusta la ruta si es necesario
import { pesos } from '../utils/negocio';

const ParentComponent = ({ typeId, storeInfo, m, currentPage, setCurrentPage, goToNextPage, goToPage, goToPrevPage, isLoading, itemsPerPage, totalPages: propTotalPages, currentItems: propCurrentItems, LoadingSkeleton, User, Box, error }) => { // typeId podría ser "new-product" o "register-shopkeeper"
    const [items, setItems] = useState(m || []); // El estado de TODOS los ítems (productos o tenderos), inicializado con m

    // Búsqueda local sobre los ítems ya cargados (no llama al backend)
    const [consulta, setConsulta] = useState('');

    // Un producto puede no tener precio vigente: se muestra "—" en vez de fallar
    const formatPrice = pesos;

    // Ordenar items alfabéticamente por nombre para tenderos y productos
    const sortedItems = (typeId === "register-shopkeeper" || typeId === "new-product") ? [...items].sort((a, b) => a.nombre.localeCompare(b.nombre)) : items;

    const normalizar = (texto) => String(texto ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    const termino = normalizar(consulta.trim());
    const visibles = termino
        ? sortedItems.filter((item) => [item.nombre, item.categoria, item.correo, item.id, item._id].some((campo) => normalizar(campo).includes(termino)))
        : sortedItems;

    // Calcular totalPages y currentItems desde los ítems visibles
    const totalPages = Math.ceil(visibles.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = visibles.slice(startIndex, startIndex + itemsPerPage);

    const buscar = (valor) => {
        setConsulta(valor);
        setCurrentPage(1);
    };

    // Actualizar items cuando m cambia
    useEffect(() => {
        if (m) {
            setItems(m);
        }
    }, [m]);

    // Ajustar currentPage si totalPages cambia
    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(totalPages);
        } else if (totalPages === 0 && currentPage !== 1) {
            setCurrentPage(1);
        }
    }, [totalPages, currentPage, setCurrentPage]);

    // *** MANEJO DE ELIMINACIÓN ***
    const handleItemDeleted = useCallback((deletedItemId) => {
        // Filtra el ítem eliminado de la lista actual
        const updatedItems = items.filter(item => !(item._id === deletedItemId || item.id === deletedItemId));
        setItems(updatedItems); // Actualiza el estado
        // La paginación se ajusta automáticamente en el useEffect
    }, [items]);

    // *** MANEJO DE ADICIÓN ***
    // Si tu componente padre también maneja el formulario para agregar un producto/tendero,
    // puedes tener una función similar para actualizar el estado:
    const handleItemAdded = useCallback((newItem) => {
        setItems(prevItems => [...prevItems, newItem]);
        // Opcional: ajustar la paginación para mostrar el nuevo ítem si fuera necesario
    }, []);

    // *** MANEJO DE ACTUALIZACIÓN ***
    const handleItemUpdated = useCallback((updatedItemId, updatedData) => {
        setItems(prevItems =>
            prevItems.map(item =>
                (item._id === updatedItemId || item.id === updatedItemId)
                    ? { ...item, ...updatedData }
                    : item
            )
        );
    }, []);

    return (
        <div className="w-full h-full">
            {/* Aquí podría ir tu formulario para agregar productos/tenderos */}
            {/* Si el formulario está aquí, pasarías handleItemAdded */}

            <ResultComponent
                id={typeId}
                m={sortedItems} // La lista completa ordenada de ítems
                visibles={visibles} // Los que pasan la búsqueda
                consulta={consulta}
                onBuscar={buscar}
                startIndex={startIndex}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                goToPage={goToPage}
                goToNextPage={goToNextPage}
                goToPrevPage={goToPrevPage}
                isLoading={isLoading}
                itemsPerPage={itemsPerPage}
                totalPages={totalPages}
                currentItems={currentItems}
                LoadingSkeleton={LoadingSkeleton}
                User={User} // Pasa el icono si no está en ResultComponent
                // Box={Box} // Pasa Box si lo necesitas
                error={error}
                onItemDeleted={handleItemDeleted} // Pasa la función para eliminar
                onItemAdded={handleItemAdded} // Pasa la función para añadir
                onItemUpdated={handleItemUpdated} // Pasa la función para actualizar
                formatPrice={formatPrice}
            />
        </div>
    );
};

export default ParentComponent;