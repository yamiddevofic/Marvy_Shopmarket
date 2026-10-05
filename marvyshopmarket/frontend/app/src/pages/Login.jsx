import { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import ToggleTheme from '../components/Toggle/ToggleTheme';
import EscenaTienda from '../components/Login/EscenaTienda';
import EmblemaTienda from '../components/Login/EmblemaTienda';
import { EtiquetaPrecio, TableroVentas } from '../components/Login/TarjetasNegocio';
import { useAppContext } from '../context/AppContext';
import { api } from '../services/api';

// Titular en dos líneas: afirmación + remate en serif cursiva.
// Cada palabra entra por separado (--i marca el escalonado).
const TITULAR_LINEA_1 = ['Tu', 'tienda', 'de', 'barrio,'];
const TITULAR_REMATE = ['siempre', 'al', 'día'];
const CEDULA_VALIDA = /^\d{8,10}$/;

const Login = () => {
  const [cedula, setCedula] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [mostrarAyuda, setMostrarAyuda] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { setAdminInfo, setSelectedOption } = useAppContext();

  const navigate = useNavigate();
  const location = useLocation();

  // Redirección automática si ya está autenticado
  useEffect(() => {
    const isLoggedIn = Cookies.get('loggedIn'); // Las cookies se guardan como strings
    if (isLoggedIn === 'true' && location.pathname !== '/home') {
      navigate('/home', { replace: true });
    }
  }, [navigate, location.pathname]);

  useEffect(() => {
    setAdminInfo('default');
    setSelectedOption('login');
  }, [setAdminInfo, setSelectedOption]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!cedula || !password) {
      setError('Escribe tu cédula y tu contraseña para entrar.');
      return;
    }
    if (!CEDULA_VALIDA.test(cedula)) {
      setError('La cédula debe tener entre 8 y 10 números.');
      return;
    }

    try {
      setIsLoading(true);
      setError('');

      const data = await api.post('/verificar-usuario', { userid: cedula, password });
      // ProtectedRoute compara exactamente con el texto 'true'
      Cookies.set('loggedIn', 'true', { sameSite: 'Lax' });

      try {
        localStorage.setItem('authInfo', JSON.stringify(data));
      } catch {
        // sin almacenamiento local la sesión sigue funcionando con la cookie
      }
      setAdminInfo(data);
      navigate('/home', { replace: true });
    } catch (err) {
      setError(err.message || 'No pudimos conectar con el servidor. Intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  let indicePalabra = 0;
  const palabra = (texto) => (
    <span key={texto} className="login-hero__palabra" style={{ '--i': indicePalabra++ }}>
      {texto}
    </span>
  );

  return (
    <div className="login">
      <a className="login__saltar" href="#login-cedula">Saltar al formulario</a>

      <header className="login-hero">
        <div className="login-hero__tema">
          <ToggleTheme floating={false} />
        </div>

        <div className="login-hero__cabecera">
          <div className="login-hero__texto">
            <div className="login-hero__marca">
              <EmblemaTienda />
              <span className="login-hero__nombre">Marvy Shopmarket</span>
            </div>
            <h1 className="login-hero__titulo">
              <span className="login-hero__linea">{TITULAR_LINEA_1.map(palabra)}</span>
              <em className="login-hero__linea login-hero__remate">{TITULAR_REMATE.map(palabra)}</em>
            </h1>
            <p className="login-hero__bajada">Ventas, inventario y tenderos en un solo lugar.</p>
          </div>
          <TableroVentas />
        </div>

        <div className="login-hero__escena">
          <div className="login-hero__marco">
            <EscenaTienda />
            <EtiquetaPrecio />
          </div>
        </div>
      </header>

      <main className="login-panel">
        <div className="login-panel__tarjeta">
          <h2 className="login-panel__titulo">Inicia sesión</h2>
          <p className="login-panel__ayuda">Entra con tu cédula y la contraseña de tu tienda.</p>

          <div className="login-panel__error" role="alert" aria-live="assertive">
            {error && <p>{error}</p>}
          </div>

          <form onSubmit={handleSubmit} className="login-form" noValidate>
            <div className="login-form__campo">
              <label htmlFor="login-cedula" className="login-form__etiqueta">Cédula</label>
              <input
                id="login-cedula"
                type="text"
                inputMode="numeric"
                autoComplete="username"
                maxLength="10"
                value={cedula}
                onChange={(e) => setCedula(e.target.value.replace(/\D/g, ''))}
                className="login-form__input"
                placeholder="Ej. 1012345678"
                aria-invalid={Boolean(error) && !CEDULA_VALIDA.test(cedula)}
              />
            </div>

            <div className="login-form__campo">
              <label htmlFor="login-password" className="login-form__etiqueta">Contraseña</label>
              <div className="login-form__con-boton">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="login-form__input"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="login-form__ojo"
                  aria-label="Mostrar contraseña"
                  aria-pressed={showPassword}
                >
                  {showPassword ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
                </button>
              </div>
            </div>

            <div className="login-form__olvido">
              <button
                type="button"
                className="login-form__enlace"
                aria-expanded={mostrarAyuda}
                aria-controls="login-ayuda-clave"
                onClick={() => setMostrarAyuda(!mostrarAyuda)}
              >
                ¿Olvidaste tu contraseña?
              </button>
              <p id="login-ayuda-clave" className="login-form__nota" hidden={!mostrarAyuda}>
                Pídele al administrador de tu tienda que te asigne una nueva.
              </p>
            </div>

            <button type="submit" disabled={isLoading} aria-busy={isLoading} className="login-form__entrar">
              {isLoading ? (
                <>
                  <span className="login-form__girando" aria-hidden="true" />
                  Entrando…
                </>
              ) : (
                'Entrar a mi tienda'
              )}
            </button>
          </form>

          <p className="login-panel__registro">
            ¿Aún no tienes cuenta?{' '}
            <Link to="/registrarse" className="login-form__enlace">Registra tu tienda</Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Login;
