'use client'
import { useState, useEffect } from 'react'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { AlertCircle, Check, Trash2, X } from 'lucide-react'
import { api } from '../../services/api'


export default function Example({ open, id, setOpen, m, keyRow, item, onItemDeleted, onItemAdded, onItemUpdated}) {
    const [formData, setFormData] = useState({});
    // Estado de la interfaz del diálogo (no cambia lo que se envía al backend)
    const [confirmando, setConfirmando] = useState(false);
    const [ocupado, setOcupado] = useState(null); // 'guardar' | 'borrar' | null
    const [errorDialogo, setErrorDialogo] = useState('');

    useEffect(() => {
        if (item) {
            setFormData({...item});
        }
        setConfirmando(false);
        setErrorDialogo('');
    }, [item, open]);

    const campos = Object.keys(item || {})

    const valores = Object.values(item || {})
    
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
      setOcupado('guardar');
      setErrorDialogo('');
      try {
        const endpoint = id === "new-product" ? `actualizar-producto/${item._id}` : `actualizar-tendero/${item.id}`;
        await api.patch(`/${endpoint}`, bodyHead);
        console.log(`${id === "new-product" ? "Producto" : "Tendero"} actualizado exitosamente`);
        // Notificar al componente padre
        if (onItemUpdated) {
          onItemUpdated(item._id || item.id, formattedData);
        }
        setOpen(false);
      } catch (error) {
        console.error(`Error al actualizar ${id === "new-product" ? "producto" : "tendero"}:`, error.message);
        setErrorDialogo(error.message || 'No se pudieron guardar los cambios.');
      } finally {
        setOcupado(null);
      }
    }

    

    const handleDelete = async (itemId) => { // Cambiado 'id' a 'itemId' para mayor claridad
      console.log(`ID del ${id === "new-product" ? "producto" : "tendero"} a eliminar:`, itemId);
      setOcupado('borrar');
      setErrorDialogo('');
      try {
          const endpoint = id === "new-product" ? `eliminar-producto/${itemId}` : `eliminar-tendero/${itemId}`;
          await api.delete(`/${endpoint}`);
          console.log(`${id === "new-product" ? "Producto" : "Tendero"} eliminado exitosamente`);
          // *** LLAMAR A onItemDeleted ***
          if (onItemDeleted) {
              onItemDeleted(itemId); // Notifica al componente padre
              setOpen(false)
          }
          // Si quieres, puedes resetear la página a la 1,
          // pero si el padre actualiza 'm', la paginación se ajustará automáticamente.
          // setCurrentPage(1);
      } catch (error) {
          console.error(`Error al eliminar ${id === "new-product" ? "producto" : "tendero"}:`, error.message);
          setErrorDialogo(error.message || 'No se pudo borrar.');
          setConfirmando(false);
      } finally {
          setOcupado(null);
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

    // Nombres legibles para los campos que llegan del backend
    const ETIQUETAS = {
      nombre: 'Nombre',
      categoria: 'Categoría',
      precio: 'Precio',
      stock: 'Stock',
      correo: 'Correo',
      celular: 'Celular',
      cedula: 'Cédula',
    }

    const mapTypeInput = campos.map((campo, index) => {
      // Skip rendering _id, id, and tienda_Id fields
      if (campo === "_id" || campo === "id" || campo === "tienda_Id") {
        return null;
      }
      const etiqueta = ETIQUETAS[campo] || campo.replace(/_/g, ' ')
      return (
        <div key={index} className="gestion-form__campo">
          <label htmlFor={`editar-${campo}`} className="gestion-form__etiqueta">{etiqueta}</label>
          <input
            type={handleTypeInput(campo)}
            id={`editar-${campo}`}
            name={campo}
            value={formData[campo] || ''}
            onChange={(e) => setFormData({...formData, [campo]: e.target.value})}
            placeholder={etiqueta}
            className="gestion-form__input"
          />
        </div>
      )
    })

  const esProducto = id === "new-product"
  const cosa = esProducto ? 'producto' : 'tendero'
  return (
    <Dialog open={open} onClose={() => !ocupado && setOpen(false)} className="gestion-dialogo">
      <DialogBackdrop transition className="gestion-dialogo__fondo" />
      <div className="gestion-dialogo__marco">
        <DialogPanel transition className="gestion-dialogo__panel">
          <header className="gestion-dialogo__cabeza">
            <div>
              <p className="gestion-dialogo__tipo">{esProducto ? 'Editar producto' : 'Editar tendero'}</p>
              <DialogTitle as="h2" className="gestion-dialogo__titulo">{item.nombre}</DialogTitle>
            </div>
            <button type="button" onClick={() => setOpen(false)} className="gestion-dialogo__cerrar" aria-label="Cerrar" disabled={Boolean(ocupado)}>
              <X aria-hidden="true" />
            </button>
          </header>

          {errorDialogo && (
            <p className="aviso aviso--error" role="alert">
              <AlertCircle aria-hidden="true" /> {errorDialogo}
            </p>
          )}

          <form onSubmit={handleSubmit} className="gestion-dialogo__form" id="edit-form">
            <fieldset disabled={Boolean(ocupado) || confirmando} className="gestion-dialogo__campos">
              {mapTypeInput}
            </fieldset>
          </form>

          {confirmando ? (
            <footer className="gestion-dialogo__confirmar" role="alertdialog" aria-labelledby="confirmar-texto">
              <p id="confirmar-texto">
                <strong>¿Borrar {esProducto ? 'este producto' : 'a este tendero'}?</strong> Esta acción no se puede deshacer.
              </p>
              <div className="gestion-dialogo__derecha">
                <button type="button" onClick={() => setConfirmando(false)} className="boton" disabled={ocupado === 'borrar'}>
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(item.id || item._id)}
                  className="boton boton--peligro-lleno"
                  aria-busy={ocupado === 'borrar'}
                  disabled={ocupado === 'borrar'}
                  data-autofocus
                >
                  {ocupado === 'borrar' ? <span className="boton__girando" aria-hidden="true" /> : <Trash2 aria-hidden="true" />}
                  Sí, borrar {cosa}
                </button>
              </div>
            </footer>
          ) : (
            <footer className="gestion-dialogo__pie">
              <button type="button" onClick={() => setConfirmando(true)} className="boton boton--peligro" disabled={Boolean(ocupado)}>
                <Trash2 aria-hidden="true" /> Borrar
              </button>
              <div className="gestion-dialogo__derecha">
                <button type="button" onClick={() => setOpen(false)} className="boton" disabled={Boolean(ocupado)}>
                  Cancelar
                </button>
                <button type="submit" form="edit-form" className="boton boton--primario" aria-busy={ocupado === 'guardar'} disabled={Boolean(ocupado)}>
                  {ocupado === 'guardar' ? <span className="boton__girando" aria-hidden="true" /> : <Check aria-hidden="true" />}
                  {ocupado === 'guardar' ? 'Guardando…' : 'Guardar cambios'}
                </button>
              </div>
            </footer>
          )}
        </DialogPanel>
      </div>
    </Dialog>
  )
}
