import React, { useState } from 'react';
import { Eye, EyeOff, User, Box, Archive, AlertCircle, CheckCircle2 } from 'lucide-react';
import Ilustracion from "../Panel/Ilustraciones";
import ParentComponent from '../ParentComponent';
import PlaceholderComponent from '../PlaceholderComponent';
import { api } from '../../services/api';

const LoadingSkeleton = () => (
  <div className="gestion-esqueleto" aria-hidden="true" />
);

const today = new Date().toLocaleDateString(); // Get today's date in YYYY-MM-DD format
const formatDate = today.split('/').reverse().join('-');

const Form = ({
  id,
  data,
  title,
  initialData = {},
  fields = [],
  selectedIcon, // eslint-disable-line no-unused-vars -- la ilustración se elige por `id`
  apiEndpoint,
  submitButtonText = 'Completar Registro',
  onSubmitSuccess,
  onSubmitError,
  storeInfo
}) => {
  // obtener datos obtenidos del endpoint
  const m =  data;

  console.log('initialData estado en Form: ', initialData)

  const formDataInfo = initialData;

  

  const [formData, setFormData] = useState(initialData);
  const [showPasswordFields, setShowPasswordFields] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = id === 'register-shopkeeper' ? 7 : 5;

  // Pagination calculations
  const totalPages = Math.ceil((m?.length || 0) / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  // Si es el formulario de nuevo producto, recorrer el array de objetos sin slice
  const currentItems = m?.slice(startIndex, startIndex + itemsPerPage) || [];

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const togglePasswordVisibility = (fieldName) => {
    setShowPasswordFields(prev => ({
      ...prev,
      [fieldName]: !prev[fieldName]
    }));
  };

  // Efecto para ocultar el mensaje de éxito después de 5 segundos
  React.useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  // Función para scroll al inicio de la página
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');
    
    try {
      let dataToSend = { ...formData };
      
      // Special handling for new product form
      // (el backend genera el _id y toma la tienda de la sesión)
      if (id === 'new-product') {
        dataToSend = {
          nombre: formData.nombre || '',
          categoria: formData.categoria || '',
          stock: parseInt(formData.stock) || 0,
          precios: [
            {
              fecha: formatDate,
              precio: parseFloat(formData.precio) || 0
            }
          ]
        };
      }
      
      console.log('Datos a enviar:', dataToSend);
      
      const data = await api.post(apiEndpoint, dataToSend);
      setSuccess('¡Registro completado con éxito!');
      setFormData(initialData);
      scrollToTop(); // Scroll to top after success
      if (onSubmitSuccess) {
        onSubmitSuccess(data);
      }
    } catch (error) {
      const errorMessage = error.message || 'Error al registrar';
      setError(errorMessage);
      if (onSubmitError) {
        onSubmitError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const DESCRIPCIONES = {
    'new-product': 'Agrega productos al catálogo de tu tienda y revisa los que ya tienes.',
    stock: 'Actualiza las existencias para que nunca se agote lo que más se vende.',
    'register-sales': 'Anota cada venta del día con su monto y su estado.',
    report: 'Elige el tipo de reporte y el rango de fechas que quieres revisar.',
    'register-vendors': 'Guarda los datos de quienes te surten la mercancía.',
    'register-supplies': 'Registra lo que llega: cantidades, precios y proveedor.',
    'register-shopkeeper': 'Da de alta a quienes atienden la tienda contigo.',
    configuration: 'Ajusta los datos de tu tienda.',
  };
  const esLista = id === 'register-shopkeeper' || id === 'new-product';

  const renderField = (field) => {
    const {
      name,
      type = 'text',
      label,
      placeholder = '',
      required = false,
      options = []
    } = field;

    const value = formData[name] || '';
    const isPassword = type === 'password';
    const showPassword = showPasswordFields[name];
    const campoId = `${id}-${name}`;

    const etiqueta = (
      <label htmlFor={campoId} className="gestion-form__etiqueta">
        {label}
        {required && <span className="gestion-form__requerido" aria-hidden="true"> *</span>}
      </label>
    );

    if (type === 'select') {
      return (
        <div key={name} className="gestion-form__campo">
          {etiqueta}
          <select
            id={campoId}
            name={name}
            value={value}
            onChange={handleChange}
            required={required}
            className="gestion-form__input"
          >
            <option value="">Seleccionar...</option>
            {options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      );
    }

    return (
      <div key={name} className="gestion-form__campo">
        {etiqueta}
        <div className={isPassword ? 'gestion-form__con-boton' : ''}>
          <input
            id={campoId}
            type={isPassword ? (showPassword ? 'text' : 'password') : type}
            name={name}
            value={value}
            onChange={handleChange}
            required={required}
            className="gestion-form__input"
            placeholder={placeholder}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => togglePasswordVisibility(name)}
              className="gestion-form__ojo"
              aria-label="Mostrar contraseña"
              aria-pressed={Boolean(showPassword)}
            >
              {showPassword ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
            </button>
          )}
        </div>
      </div>
    );
  };

  const lista = m && m.length > 0 ? (
    <ParentComponent typeId={id} storeInfo={storeInfo} m={m} currentPage={currentPage} setCurrentPage={setCurrentPage} goToNextPage={goToNextPage} goToPage={goToPage} goToPrevPage={goToPrevPage} isLoading={isLoading} itemsPerPage={itemsPerPage} totalPages={totalPages} currentItems={currentItems} LoadingSkeleton={LoadingSkeleton} User={User} Box={Box} error={error} />
  ) : (
    <PlaceholderComponent id={id} Archive={Archive} />
  );

  return (
    <main className={`gestion${esLista ? ' gestion--lista' : ''}`}>
      <section className="gestion-hero" aria-labelledby={`${id}-titulo`}>
        <div className="gestion-hero__texto">
          <h1 id={`${id}-titulo`} className="gestion-hero__titulo">{title}</h1>
          <p className="gestion-hero__bajada">{DESCRIPCIONES[id] || 'Complete la información requerida.'}</p>
        </div>
        <div className="gestion-hero__escena">
          <Ilustracion id={id} />
        </div>
      </section>

      <div className="gestion__cuerpo">
        <section className="gestion-tarjeta" aria-label="Formulario">
          <div role="alert">
            {error && (
              <p className="gestion-aviso gestion-aviso--error">
                <AlertCircle aria-hidden="true" /> {error}
              </p>
            )}
          </div>
          <div role="status">
            {success && (
              <p className="gestion-aviso gestion-aviso--ok">
                <CheckCircle2 aria-hidden="true" /> {success}
              </p>
            )}
          </div>

          <form onSubmit={handleSubmit} className="gestion-form">
            <div className="gestion-form__campos">
              {fields.map(renderField)}
            </div>

            <button type="submit" disabled={isLoading} aria-busy={isLoading} className="gestion-boton gestion-boton--primario gestion-form__enviar">
              {isLoading ? (
                <>
                  <span className="gestion-girando" aria-hidden="true" />
                  Guardando…
                </>
              ) : (
                submitButtonText
              )}
            </button>
          </form>
        </section>

        {esLista && (
          <section className="gestion-tarjeta gestion-tarjeta--lista" aria-label={id === 'new-product' ? 'Productos registrados' : 'Tenderos registrados'}>
            {lista}
          </section>
        )}
      </div>
    </main>
  );
};

export default Form;
