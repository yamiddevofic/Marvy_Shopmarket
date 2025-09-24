'use client'
import { useState, useEffect } from 'react'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'


export default function Example({ open, id, setOpen, m, keyRow, item, onItemDeleted, onItemAdded, onItemUpdated}) {
    const [formData, setFormData] = useState({});

    useEffect(() => {
        if (item) {
          console.log("formData useEffect:", formData)
            setFormData({...item});
        }
    }, [item]);

    console.log("item example:", item)

    const campos = Object.keys(item || {})
    console.log("campos:", campos)

    const valores = Object.values(item || {})
    console.log("valores:", valores)
    
    const today = () => {
      // Obtener fecha de hoy
      const td = Date.now()
      const date = new Date(td)
      return date.toISOString().split('T')[0]
    }
    

    const handleSubmit = async (e) => {
      e.preventDefault()
      const formDataObj = new FormData(e.target)
      const data = Object.fromEntries(formDataObj)

      // Format data: parse numeric fields
      const formattedData = { ...data };
      campos.forEach(campo => {
        if (handleTypeInput(campo) === "number" && data[campo]) {
          formattedData[campo] = parseFloat(data[campo]) || 0;
        }
      });

      console.log("e.preventDefault", e.preventDefault)
      console.log("formDataObj:", formDataObj)
      console.log("data del formDataObj:", data)
      console.log("formattedData:", formattedData)

      let bodyHead;
      // Para ambos productos y tenderos, enviar los datos del formulario

      //estructurar cuerpo json para productos
      bodyHead = id === "new-product" ? {
         _id: item._id,
         nombre: formattedData.nombre,
         categoria: formattedData.categoria,
         stock: formattedData.stock,
         precios: [
          {
            fecha: today(),
            //pasarlo a entero
            precio: formattedData.precio
          }
         ]
      } : {
         id: item.id,
         ...formattedData
      }

      console.log("bodyHead:", bodyHead)
      try {
        const endpoint = id === "new-product" ? `actualizar-producto/${item._id}` : `actualizar-tendero/${item.id}`;
        const response = await fetch(`http://localhost:5000/api/${endpoint}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(bodyHead),
          credentials: 'include'
        });

        if (response.ok) {
          console.log(`${id === "new-product" ? "Producto" : "Tendero"} actualizado exitosamente`);
          // Notificar al componente padre
          if (onItemUpdated) {
            onItemUpdated(item._id || item.id, formattedData);
          }
          setOpen(false);
        } else {
          const errorData = await response.json();
          console.error(`Error al actualizar ${id === "new-product" ? "producto" : "tendero"}:`, errorData.message);
        }
      } catch (error) {
        console.error(`Error de red al intentar actualizar ${id === "new-product" ? "producto" : "tendero"}:`, error);
      }
    }

    

    const handleDelete = async (itemId) => { // Cambiado 'id' a 'itemId' para mayor claridad
      console.log("ItemID", itemId)
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
                  setOpen(false)
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

    const handleTypeInput = (campo) => {
      if (id==="new-product"){
        if (campo === "precio") {
          return "number"
        } else if (campo === "stock") {
          return "number"
        } else if (campo === "categoria") {
          return "text"
        } else {
          return "text"
        }
      } else {
        if (campo === "id") {
          return "number"
        } else if (campo === "nombre") {
          return "text"
        } else if (campo === "correo") {
          return "email"
        } else if (campo === "celular") {
          return "number"
        } else if (campo === "cedula") {
          return "number"
        } else {
          return "text"
        }
      }
    }

    const mapTypeInput = campos.map((campo, index) => {
      // Skip rendering _id, id, and tienda_Id fields
      if (campo === "_id" || campo === "id" || campo === "tienda_Id") {
        return null;
      }
      return (
        <div key={index} className="mb-6">
          <label htmlFor={campo} className="block text-sm font-semibold text-gray-200 mb-2 capitalize">{campo.replace(/_/g, ' ')}</label>
          <input
            type={handleTypeInput(campo)}
            id={campo}
            name={campo}
            value={formData[campo] || ''}
            onChange={(e) => setFormData({...formData, [campo]: e.target.value})}
            placeholder={`Enter ${campo.replace(/_/g, ' ')}`}
            className="bg-gray-700 hover:bg-gray-650 focus:bg-gray-650 block w-full rounded-lg border border-gray-500 text-white px-4 py-3 shadow-sm transition-colors duration-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400 focus:outline-none sm:text-sm"
          />
        </div>
      )
    })

    console.log(item._id || item.id)
  return (
    <div>
      <Dialog open={open} onClose={setOpen} className="relative z-10">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-900/70 backdrop-blur-sm transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
        />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className="relative transform overflow-hidden rounded-2xl bg-gray-800 text-left shadow-2xl outline outline-offset-1 outline-white/10 transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95"
            >
              <div className="bg-gray-800 px-6 pt-6 pb-4 sm:p-8 sm:pb-6">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 sm:mt-0 sm:text-left w-full bg-gradient-to-br from-gray-700 to-gray-800 p-6 rounded-xl shadow-lg border border-gray-600">
                    <DialogTitle as="h3" className="text-lg font-bold text-white mb-4 flex items-center">
                      <ExclamationTriangleIcon className="h-6 w-6 text-yellow-400 mr-2" />
                      Edit {item.nombre}
                    </DialogTitle>
                      <form onSubmit={handleSubmit} className="space-y-4 w-full" id="edit-form">
                          {mapTypeInput}
                      </form>
                  </div>
                </div>
              </div>
              
              <div className="px-6 py-4 sm:flex sm:flex-row-reverse sm:px-8 bg-gray-750 border-t border-gray-600 flex justify-end gap-3 pt-4 justify-center">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-gray-500 to-gray-600 px-6 py-3 text-sm font-semibold text-white shadow-md hover:from-gray-600 hover:to-gray-700 focus:ring-2 focus:ring-gray-500 focus:outline-none transition-all duration-200"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(item.id || item._id)}
                  className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-red-500 to-red-600 px-6 py-3 text-sm font-semibold text-white shadow-md hover:from-red-600 hover:to-red-700 focus:ring-2 focus:ring-red-500 focus:outline-none transition-all duration-200"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete
                </button>
                <button
                  type="submit"
                  form="edit-form"
                  data-autofocus
                  className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-md hover:from-green-600 hover:to-emerald-700 focus:ring-2 focus:ring-green-500 focus:outline-none transition-all duration-200"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Update
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </div>
  )
}

