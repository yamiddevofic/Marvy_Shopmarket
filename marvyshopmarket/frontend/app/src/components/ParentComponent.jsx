import React, { useState, useEffect, useCallback } from 'react';
import ResultComponent from './ResultComponent'; // Ajusta la ruta si es necesario
import { User } from 'lucide-react'; // Si User es un icono, importalo aquí

const ParentComponent = ({ typeId, storeInfo, m, currentPage, setCurrentPage, goToNextPage, goToPage, goToPrevPage, isLoading, itemsPerPage, totalPages: propTotalPages, currentItems: propCurrentItems, LoadingSkeleton, User, Box, error }) => { // typeId podría ser "new-product" o "register-shopkeeper"
    const [items, setItems] = useState(m || []); // El estado de TODOS los ítems (productos o tenderos), inicializado con m

    // Calcular totalPages y currentItems desde items
    const totalPages = Math.ceil(items.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = items.slice(startIndex, startIndex + itemsPerPage);

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


    return (
        <div className="w-full h-full">
            {/* Aquí podría ir tu formulario para agregar productos/tenderos */}
            {/* Si el formulario está aquí, pasarías handleItemAdded */}

            <ResultComponent
                id={typeId}
                m={items} // La lista completa de ítems ahora viene del estado local
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
            />
        </div>
    );
};

export default ParentComponent;