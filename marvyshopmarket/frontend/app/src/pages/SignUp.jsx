import { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, Eye, EyeOff, ImagePlus, Store, UserRound } from 'lucide-react';
import ToggleTheme from '../components/Toggle/ToggleTheme';
import EmblemaTienda from '../components/Login/EmblemaTienda';
import EscenaApertura from '../components/Registro/EscenaApertura';
import TarjetaTienda from '../components/Registro/TarjetaTienda';
import { api } from '../services/api';

const TITULAR_LINEA_1 = ['Abre', 'tu', 'tienda'];
const TITULAR_REMATE = ['en', 'minutos'];

const PASOS = [
  { titulo: 'Tus datos', ayuda: 'Serás el administrador de la tienda.', icono: UserRound },
  { titulo: 'Tu tienda', ayuda: 'Así te van a conocer tus clientes.', icono: Store },
];

const CAMPOS_ADMIN = ['adm_Id', 'adm_Nombre', 'adm_Correo', 'adm_Celular', 'adm_Password'];
const CAMPOS_TIENDA = ['tienda_Id', 'tienda_Nombre', 'tienda_Correo', 'tienda_Celular', 'tienda_Ubicacion', 'tienda_Img'];

const NIVELES_CLAVE = ['Muy corta', 'Débil', 'Aceptable', 'Buena', 'Fuerte'];

// 0–4: largo, mayúsculas y minúsculas, números y símbolos
const fuerzaClave = (clave) => {
  if (!clave) return 0;
  if (clave.length < 6) return 1;
  const puntos = [
    clave.length >= 10,
    /[a-z]/.test(clave) && /[A-Z]/.test(clave),
    /\d/.test(clave),
    /[^A-Za-z0-9]/.test(clave),
  ].filter(Boolean).length;
  return Math.max(1, Math.min(4, puntos + 1));
};

const leerComoBase64 = (archivo) =>
  new Promise((resolve, reject) => {
    const lector = new FileReader();
    lector.onload = () => resolve(lector.result);
    lector.onerror = reject;
    lector.readAsDataURL(archivo);
  });

const Campo = ({ id, etiqueta, ayuda, children }) => (
  <div className="registro-form__campo">
    <label htmlFor={id} className="registro-form__etiqueta">{etiqueta}</label>
    {children}
    {ayuda && <p className="registro-form__ayuda">{ayuda}</p>}
  </div>
);

Campo.propTypes = {
  id: PropTypes.string.isRequired,
  etiqueta: PropTypes.string.isRequired,
  ayuda: PropTypes.string,
  children: PropTypes.node.isRequired,
};

const SignUp = () => {
  const navigate = useNavigate();
  const formRef = useRef(null);
  const [paso, setPaso] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [formData, setFormData] = useState({
    adm_Id: '',
    adm_Nombre: '',
    adm_Correo: '',
    adm_Celular: '',
    adm_Password: '',
    tienda_Id: '',
    tienda_Nombre: '',
    tienda_Correo: '',
    tienda_Celular: '',
    tienda_Ubicacion: '',
    tienda_Img: null,
  });

  const fuerza = fuerzaClave(formData.adm_Password);

  const todos = [...CAMPOS_ADMIN, ...CAMPOS_TIENDA];
  const llenos = todos.filter((campo) => Boolean(formData[campo])).length;
  const avance = Math.round((llenos / todos.length) * 100);

  const handleChange = (e) => {
    const { name, type, value, files } = e.target;
    if (type === 'file') {
      const file = files[0] || null;
      setFormData((previo) => ({ ...previo, [name]: file }));
      if (file) {
        leerComoBase64(file).then(setPreviewImage).catch(() => setPreviewImage(null));
      } else {
        setPreviewImage(null);
      }
      return;
    }
    setFormData((previo) => ({ ...previo, [name]: value }));
  };

  // Solo dígitos (cédula y celulares)
  const handleNumero = (e) => {
    const { name, value } = e.target;
    setFormData((previo) => ({ ...previo, [name]: value.replace(/\D/g, '') }));
  };

  // Valida los campos del paso visible con la validación nativa del navegador
  const pasoValido = () => {
    const visibles = formRef.current.querySelectorAll('[data-paso]:not([hidden]) input');
    for (const input of visibles) {
      if (!input.checkValidity()) {
        input.reportValidity();
        return false;
      }
    }
    return true;
  };

  const irAlPaso = (destino) => {
    setError('');
    setPaso(destino);
    formRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pasoValido()) return;
    // Enter en el primer paso avanza en vez de enviar
    if (paso < PASOS.length - 1) {
      irAlPaso(paso + 1);
      return;
    }

    setLoading(true);
    setError('');
    try {
      const jsonData = { ...formData };
      if (formData.tienda_Img) {
        jsonData.tienda_Img = await leerComoBase64(formData.tienda_Img);
      }
      await api.post('/registrar-admin-tienda', jsonData);
      navigate('/');
    } catch (err) {
      setError(err.message || 'No pudimos crear tu cuenta. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  let indicePalabra = 0;
  const palabra = (texto) => (
    <span key={texto} className="registro-hero__palabra" style={{ '--i': indicePalabra++ }}>
      {texto}
    </span>
  );

  const ultimo = paso === PASOS.length - 1;

  return (
    <div className="registro">
      <a className="registro__saltar" href="#registro-formulario">Saltar al formulario</a>

      <header className="registro-hero">
        <div className="registro-hero__tema">
          <ToggleTheme floating={false} />
        </div>

        <div className="registro-hero__cabecera">
          <div className="registro-hero__texto">
            <div className="registro-hero__marca">
              <EmblemaTienda />
              <span className="registro-hero__nombre">Marvy Shopmarket</span>
            </div>
            <h1 className="registro-hero__titulo">
              <span className="registro-hero__linea">{TITULAR_LINEA_1.map(palabra)}</span>
              <em className="registro-hero__linea registro-hero__remate">{TITULAR_REMATE.map(palabra)}</em>
            </h1>
            <p className="registro-hero__bajada">Crea tu cuenta y empieza a vender hoy mismo.</p>
          </div>
          <TarjetaTienda
            nombre={formData.tienda_Nombre}
            ubicacion={formData.tienda_Ubicacion}
            logo={previewImage}
            avance={avance}
          />
        </div>

        <div className="registro-hero__escena">
          <div className="registro-hero__marco">
            <EscenaApertura />
          </div>
        </div>
      </header>

      <main className="registro-panel">
        <div className="registro-panel__tarjeta">
          <ol className="registro-pasos" aria-label="Progreso del registro">
            {PASOS.map(({ titulo, icono: Icono }, i) => (
              <li
                key={titulo}
                className="registro-pasos__item"
                data-estado={i < paso ? 'hecho' : i === paso ? 'actual' : 'pendiente'}
                aria-current={i === paso ? 'step' : undefined}
              >
                <span className="registro-pasos__marca">
                  {i < paso ? <Check aria-hidden="true" /> : <Icono aria-hidden="true" />}
                </span>
                <span className="registro-pasos__texto">
                  <span className="registro-pasos__numero">Paso {i + 1} de {PASOS.length}</span>
                  <span className="registro-pasos__titulo">{titulo}</span>
                </span>
              </li>
            ))}
          </ol>

          <div className="registro-panel__cabeza">
            <h2 className="registro-panel__titulo" id="registro-formulario" tabIndex={-1}>
              {PASOS[paso].titulo}
            </h2>
            <p className="registro-panel__ayuda">{PASOS[paso].ayuda}</p>
          </div>

          <div className="registro-panel__error" role="alert" aria-live="assertive">
            {error && <p>{error}</p>}
          </div>

          <form ref={formRef} onSubmit={handleSubmit} className="registro-form" noValidate>
            <fieldset className="registro-form__grupo" data-paso="0" hidden={paso !== 0}>
              <legend className="registro-form__leyenda">Datos del administrador</legend>

              <Campo id="adm_Id" etiqueta="Cédula">
                <input
                  id="adm_Id" name="adm_Id" type="text" inputMode="numeric" autoComplete="username"
                  required pattern="\d{8,10}" maxLength="10" title="Entre 8 y 10 números"
                  value={formData.adm_Id} onChange={handleNumero}
                  className="registro-form__input" placeholder="Ej. 1012345678"
                />
              </Campo>
              <Campo id="adm_Nombre" etiqueta="Nombre completo">
                <input
                  id="adm_Nombre" name="adm_Nombre" type="text" autoComplete="name" required
                  value={formData.adm_Nombre} onChange={handleChange}
                  className="registro-form__input" placeholder="Como aparece en tu cédula"
                />
              </Campo>
              <div className="registro-form__fila">
                <Campo id="adm_Correo" etiqueta="Correo">
                  <input
                    id="adm_Correo" name="adm_Correo" type="email" autoComplete="email" required
                    value={formData.adm_Correo} onChange={handleChange}
                    className="registro-form__input" placeholder="correo@ejemplo.com"
                  />
                </Campo>
                <Campo id="adm_Celular" etiqueta="Celular">
                  <input
                    id="adm_Celular" name="adm_Celular" type="tel" inputMode="tel" autoComplete="tel" required
                    minLength="7" maxLength="10"
                    value={formData.adm_Celular} onChange={handleNumero}
                    className="registro-form__input" placeholder="3001234567"
                  />
                </Campo>
              </div>
              <Campo id="adm_Password" etiqueta="Contraseña">
                <div className="registro-form__con-boton">
                  <input
                    id="adm_Password" name="adm_Password" type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password" required minLength="6"
                    value={formData.adm_Password} onChange={handleChange}
                    className="registro-form__input" placeholder="Mínimo 6 caracteres"
                    aria-describedby="registro-fuerza"
                  />
                  <button
                    type="button"
                    className="registro-form__ojo"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="Mostrar contraseña"
                    aria-pressed={showPassword}
                  >
                    {showPassword ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
                  </button>
                </div>
                <div className="registro-fuerza" id="registro-fuerza" data-nivel={fuerza}>
                  <div className="registro-fuerza__barras" aria-hidden="true">
                    {[1, 2, 3, 4].map((n) => (
                      <span key={n} className={n <= fuerza ? 'registro-fuerza__barra registro-fuerza__barra--on' : 'registro-fuerza__barra'} />
                    ))}
                  </div>
                  <span className="registro-fuerza__texto" aria-live="polite">
                    {formData.adm_Password ? `Seguridad: ${NIVELES_CLAVE[fuerza]}` : 'Combina letras, números y símbolos.'}
                  </span>
                </div>
              </Campo>
            </fieldset>

            <fieldset className="registro-form__grupo" data-paso="1" hidden={paso !== 1}>
              <legend className="registro-form__leyenda">Datos de la tienda</legend>

              <div className="registro-form__logo">
                <input
                  id="tienda_Img" name="tienda_Img" type="file" accept="image/*" required
                  onChange={handleChange} className="registro-form__archivo"
                />
                <label htmlFor="tienda_Img" className="registro-form__soltar">
                  <span className="registro-form__miniatura">
                    {previewImage ? <img src={previewImage} alt="Vista previa del logo" /> : <ImagePlus aria-hidden="true" />}
                  </span>
                  <span className="registro-form__soltar-texto">
                    <strong>{formData.tienda_Img ? 'Cambiar logo' : 'Sube el logo de tu tienda'}</strong>
                    <span>{formData.tienda_Img ? formData.tienda_Img.name : 'PNG o JPG, cuadrado se ve mejor'}</span>
                  </span>
                </label>
              </div>

              <div className="registro-form__fila">
                <Campo id="tienda_Id" etiqueta="ID de la tienda">
                  <input
                    id="tienda_Id" name="tienda_Id" type="text" required
                    value={formData.tienda_Id} onChange={handleChange}
                    className="registro-form__input" placeholder="Ej. T-001"
                  />
                </Campo>
                <Campo id="tienda_Nombre" etiqueta="Nombre de la tienda">
                  <input
                    id="tienda_Nombre" name="tienda_Nombre" type="text" autoComplete="organization" required
                    value={formData.tienda_Nombre} onChange={handleChange}
                    className="registro-form__input" placeholder="Ej. Tienda La Esquina"
                  />
                </Campo>
              </div>
              <div className="registro-form__fila">
                <Campo id="tienda_Correo" etiqueta="Correo de la tienda">
                  <input
                    id="tienda_Correo" name="tienda_Correo" type="email" required
                    value={formData.tienda_Correo} onChange={handleChange}
                    className="registro-form__input" placeholder="tienda@ejemplo.com"
                  />
                </Campo>
                <Campo id="tienda_Celular" etiqueta="Celular de la tienda">
                  <input
                    id="tienda_Celular" name="tienda_Celular" type="tel" inputMode="tel" required
                    minLength="7" maxLength="10"
                    value={formData.tienda_Celular} onChange={handleNumero}
                    className="registro-form__input" placeholder="3001234567"
                  />
                </Campo>
              </div>
              <Campo id="tienda_Ubicacion" etiqueta="Ubicación">
                <input
                  id="tienda_Ubicacion" name="tienda_Ubicacion" type="text" autoComplete="street-address" required
                  value={formData.tienda_Ubicacion} onChange={handleChange}
                  className="registro-form__input" placeholder="Dirección o barrio"
                />
              </Campo>
            </fieldset>

            <div className="registro-form__acciones">
              {paso > 0 && (
                <button type="button" className="registro-form__atras" onClick={() => irAlPaso(paso - 1)}>
                  <ArrowLeft aria-hidden="true" />
                  Atrás
                </button>
              )}
              <button type="submit" disabled={loading} aria-busy={loading} className="registro-form__siguiente">
                {loading ? (
                  <>
                    <span className="registro-form__girando" aria-hidden="true" />
                    Creando tu tienda…
                  </>
                ) : ultimo ? (
                  <>
                    Crear mi tienda
                    <Check aria-hidden="true" />
                  </>
                ) : (
                  <>
                    Continuar
                    <ArrowRight aria-hidden="true" />
                  </>
                )}
              </button>
            </div>
          </form>

          <p className="registro-panel__ingreso">
            ¿Ya tienes cuenta?{' '}
            <Link to="/" className="registro-form__enlace">Inicia sesión</Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default SignUp;
