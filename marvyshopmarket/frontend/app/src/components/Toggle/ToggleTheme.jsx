import { useEffect, useId, useState } from 'react';
import PropTypes from 'prop-types';
import { EVENTO_TEMA, guardarTema, leerTema } from '../../tema';

const cn = (...classes) => classes.filter(Boolean).join(' ');

// Botón rápido de tema: un sol que recoge sus rayos y una sombra que lo
// convierte en luna. Es un toggle: aria-pressed indica si el modo oscuro está activo.
// `floating` (por defecto) lo fija en la esquina inferior derecha.
const ToggleTheme = ({ className, floating = true }) => {
  const [tema, setTema] = useState(leerTema);
  const mascara = `sombra-${useId().replace(/:/g, '')}`;
  const oscuro = tema === 'dark';

  // El tema puede cambiar solo (amanecer/anochecer) o desde otro botón.
  useEffect(() => {
    const alCambiar = (e) => setTema(e.detail);
    window.addEventListener(EVENTO_TEMA, alCambiar);
    return () => window.removeEventListener(EVENTO_TEMA, alCambiar);
  }, []);

  const alternar = () => {
    const siguiente = oscuro ? 'light' : 'dark';
    guardarTema(siguiente);
  };

  return (
    <button
      type="button"
      onClick={alternar}
      aria-pressed={oscuro}
      aria-label="Modo oscuro"
      title={oscuro ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      className={cn(
        'boton-tema rounded-full transition-all duration-300',
        'hover:scale-110 focus:outline-none focus-visible:ring-2',
        'focus-visible:ring-emerald-400 focus-visible:ring-offset-2',
        'bg-white dark:bg-emerald-800 shadow-lg',
        floating && 'fixed right-4 bottom-4 z-40',
        className
      )}
    >
      <svg className="boton-tema__icono" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <mask id={mascara}>
          <rect width="24" height="24" fill="white" />
          <circle className="boton-tema__sombra" cx="24" cy="4" r="7" fill="black" />
        </mask>
        <circle className="boton-tema__astro" cx="12" cy="12" r="5" mask={`url(#${mascara})`} />
        <g className="boton-tema__rayos">
          <line x1="12" y1="1.5" x2="12" y2="3.5" />
          <line x1="12" y1="20.5" x2="12" y2="22.5" />
          <line x1="1.5" y1="12" x2="3.5" y2="12" />
          <line x1="20.5" y1="12" x2="22.5" y2="12" />
          <line x1="4.6" y1="4.6" x2="6" y2="6" />
          <line x1="18" y1="18" x2="19.4" y2="19.4" />
          <line x1="4.6" y1="19.4" x2="6" y2="18" />
          <line x1="18" y1="6" x2="19.4" y2="4.6" />
        </g>
      </svg>
    </button>
  );
};

ToggleTheme.propTypes = {
  className: PropTypes.string,
  /** true: fijo en la esquina inferior derecha; false: se ubica donde lo ponga el padre */
  floating: PropTypes.bool,
};

export default ToggleTheme;
