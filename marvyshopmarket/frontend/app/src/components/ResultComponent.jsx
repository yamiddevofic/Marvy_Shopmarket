import React from 'react'; // No necesitas useEffect aquí
import { Wheat, Trash, User } from 'lucide-react';

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
    onItemAdded // Función para notificar al padre sobre una adición (si se hace aquí)
}) => {

    const formatPrice = (price) => {
        const priceFormatted = price.toLocaleString('es-CO', {
          style: 'currency',
          currency: 'COP',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        });
        return priceFormatted;
    };

    const handleDelete = async (itemId) => { // Cambiado 'id' a 'itemId' para mayor claridad
        console.log(`ID del ${id === "new-product" ? "producto" : "tendero"} a eliminar:`, itemId);
        try {
            const endpoint = id === "new-product" ? `eliminar-producto/${itemId}` : `eliminar-tendero/${itemId}`;
            const response = await fetch(`http://localhost:5000/api/${endpoint}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                credentials: 'include'
            });

            if (response.ok) {
                console.log(`${id === "new-product" ? "Producto" : "Tendero"} eliminado exitosamente`);
                // *** LLAMAR A onItemDeleted ***
                if (onItemDeleted) {
                    onItemDeleted(itemId); // Notifica al componente padre
                }
                // Si quieres, puedes resetear la página a la 1,
                // pero si el padre actualiza 'm', la paginación se ajustará automáticamente.
                // setCurrentPage(1);
            } else {
                const errorData = await response.json();
                console.error(`Error al eliminar ${id === "new-product" ? "producto" : "tendero"}:`, errorData.message);
                // Aquí podrías mostrar una notificación de error al usuario
            }
        } catch (error) {
            console.error(`Error de red al intentar eliminar ${id === "new-product" ? "producto" : "tendero"}:`, error);
            // Aquí podrías mostrar una notificación de error de red al usuario
        }
    };

    // Los console.log están bien para depuración, pero no en producción.

    return (
        <div className='text-black w-full px-2 rounded-lg dark:text-white'>
          <div className="flex items-center justify-between">
            {/* Pagination Controls */}

          </div>
          {isLoading ? (
            <LoadingSkeleton />
          ) : id === "register-shopkeeper" &&
              currentItems && currentItems.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold">
                            Total de {id === "register-shopkeeper" ? "tenderos" : "productos"}: {m.length}
                        </h3>
                        {m && m.length > itemsPerPage && (
                            <div className="flex justify-center items-center mb-2 space-x-2">
                            <button
                                onClick={goToPrevPage}
                                disabled={currentPage === 1}
                                className="px-3 py-1 bg-emerald-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Anterior
                            </button>
                            <span className="text-gray-700 dark:text-gray-300">
                                Página {currentPage} de {totalPages}
                            </span>
                            <button
                                onClick={goToNextPage}
                                disabled={currentPage === totalPages}
                                className="px-3 py-1 bg-emerald-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Siguiente
                            </button>
                        </div>
                    )}
                    </div>
                    <div className='hidden lg:block'>
                        <div className="grid grid-cols-[20%_18%_18%_18%_18%_8%] bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow  place-items-center">
                            <div className='flex gap-2 justify-center items-center w-full'>
                            <h4 className="rl-2 text-lg font-semibold text-gray-900 dark:text-white mb-2">Nombre</h4>
                            </div>
                            <p className="text-lg font-semibold text-gray-900 dark:text-white">ID</p>
                            <p className="text-lg font-semibold text-gray-900 dark:text-white flex">Correo</p>
                            <p className="text-lg font-semibold text-gray-900 dark:text-white flex">Celular</p>
                            <p className="text-lg font-semibold text-gray-900 dark:text-white flex">ID Tienda</p>
                        </div>
                    </div>
                  {currentItems.map((tendero) => (
                    <div key={tendero.tendero_Id} className="cursor-pointer grid grid-cols-1 lg:grid-cols-[20%_18%_18%_18%_18%_8%] bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 p-4 rounded-lg shadow hover:shadow-lg transition-shadow duration-200 lg:place-items-center">
                      <div className='flex gap-2 justify-left items-center w-full'>
                        <div className="mb-4º flex items-center justify-center w-12 h-12 bg-emerald-500 dark:bg-emerald-600 rounded-full px-2">
                          <User className="h-10 w-10 text-emerald-500 !text-white" />
                        </div>
                        <h4 className="rl-2 text-sm font-semibold text-gray-900 dark:text-white mb-2">{tendero.nombre}</h4>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300 flex">{tendero.id}</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300 flex">{tendero.correo}</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300 flex">{tendero.celular}</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300 flex">{tendero.tienda_Id}</p>
                      <button
                        onClick={() => handleDelete(tendero.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : id === "new-product" ? (
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold">
                        Total de productos: {m.length}
                    </h3>
                    {m && m.length > itemsPerPage && (
                        <div className="flex justify-center items-center mb-2 space-x-2">
                            <button
                                onClick={goToPrevPage}
                                disabled={currentPage === 1}
                                className="px-3 py-1 bg-emerald-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Anterior
                            </button>
                            <span className="text-gray-700 dark:text-gray-300">
                                Página {currentPage} de {totalPages}
                            </span>
                            <button
                                onClick={goToNextPage}
                                disabled={currentPage === totalPages}
                                className="px-3 py-1 bg-emerald-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Siguiente
                            </button>
                        </div>
                    )}
                  </div>
                  <div className="grid grid-cols-[18%_24%_20%_20%_10%_8%] bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow place-items-center">
                    <h4 className="rl-2 text-lg font-semibold text-gray-900 dark:text-white mb-2">ID</h4>
                    <div className='flex gap-2 justify-center items-center w-full'>
                    <h4 className="rl-2 text-lg font-semibold text-gray-900 dark:text-white mb-2">Nombre</h4>
                    </div>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white flex">Categoría</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white flex">Precio</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white flex">Stock</p>
                </div>
                  {currentItems.map((producto) => (
                    <div key={producto._id} className="cursor-pointer grid grid-cols-1 lg:grid-cols-[18%_24%_20%_20%_10%_8%] bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 p-4 rounded-lg shadow hover:shadow-lg transition-shadow duration-200 lg:place-items-center">
                      <p className="text-sm text-gray-700 dark:text-gray-300 flex">{producto._id}</p>
                      <div className='flex gap-2 justify-left items-center w-full'>
                        <div className="mb-4º flex items-center justify-center w-12 h-12 bg-emerald-500 dark:bg-emerald-600 rounded-full px-2">
                          <Wheat className="h-6 w-6 text-emerald-500 !text-white" />
                        </div>
                        <h4 className="rl-2 text-sm font-semibold text-gray-900 dark:text-white mb-2">{producto.nombre}</h4>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300 flex">{producto.categoria}</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300 flex">{formatPrice(producto.precio)}</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300 flex">{producto.stock}</p>
                      <button
                        onClick={() => handleDelete(producto._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
            ) : (
                <p className="text-gray-600 dark:text-gray-300">No hay {id === "register-shopkeeper" ? "tenderos" : "productos"} registrados.</p>
            )}
          </div>
    );
};

export default ResultComponent;