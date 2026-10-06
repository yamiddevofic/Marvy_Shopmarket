import PropTypes from 'prop-types';
import FachadaTienda from './FachadaTienda';

// Ilustraciones de las pantallas de gestión. Cada una es una escena pequeña de
// tienda (viewBox 240×150, suelo en y=132) dibujada solo con clases `ilus-*`:
// los colores salen de los tokens de `.gestion-hero` y cambian solos en oscuro.
// Son decorativas (aria-hidden): el título y el formulario dicen lo mismo.

// Suelo común: baldosas del local (las pantallas de gestión pasan adentro de la tienda).
const Suelo = () => (
  <>
    <rect className="ilus-suelo" x="0" y="132" width="240" height="18" />
    <path className="ilus-baldosa" d="M0 140h240M30 132v18M70 132v18M110 132v18M150 132v18M190 132v18M230 132v18" />
  </>
);

const Productos = () => (
  <>
    <Suelo />
    {/* estante de dos niveles */}
    <rect className="ilus-madera" x="40" y="30" width="6" height="102" rx="2" />
    <rect className="ilus-madera" x="194" y="30" width="6" height="102" rx="2" />
    <rect className="ilus-tabla" x="40" y="62" width="160" height="6" rx="2" />
    <rect className="ilus-tabla" x="40" y="98" width="160" height="6" rx="2" />
    <rect className="ilus-tabla" x="40" y="126" width="160" height="6" rx="2" />
    {/* nivel alto: frascos y caja */}
    <rect className="ilus-trazo ilus-vidrio" x="56" y="38" width="20" height="24" rx="4" />
    <rect className="ilus-tapa" x="58" y="34" width="16" height="5" rx="2" />
    <rect className="ilus-trazo ilus-tomate" x="86" y="42" width="22" height="20" rx="3" />
    <rect className="ilus-trazo ilus-mostaza" x="118" y="36" width="24" height="26" rx="3" />
    <circle className="ilus-trazo ilus-verde" cx="160" cy="52" r="10" />
    <path className="ilus-linea" d="M160 42v-4" />
    {/* nivel medio */}
    <rect className="ilus-trazo ilus-carton" x="56" y="76" width="34" height="22" rx="3" />
    <rect className="ilus-trazo ilus-verde" x="100" y="72" width="18" height="26" rx="4" />
    <rect className="ilus-trazo ilus-vidrio" x="126" y="76" width="24" height="22" rx="3" />
    <rect className="ilus-trazo ilus-mostaza" x="158" y="80" width="28" height="18" rx="3" />
    {/* nivel bajo */}
    <rect className="ilus-trazo ilus-carton" x="52" y="108" width="40" height="18" rx="2" />
    <rect className="ilus-trazo ilus-carton" x="100" y="108" width="40" height="18" rx="2" />
    <rect className="ilus-trazo ilus-carton" x="148" y="108" width="40" height="18" rx="2" />
    {/* etiqueta de precio */}
    <path className="ilus-cuerda" d="M120 62v14" />
    <g className="ilus-etiqueta">
      <rect className="ilus-trazo ilus-papel" x="106" y="76" width="30" height="16" rx="3" />
      <circle className="ilus-tinta" cx="111" cy="84" r="1.8" />
      <rect className="ilus-tinta" x="116" y="82" width="15" height="4" rx="2" />
    </g>
  </>
);

const Inventario = () => (
  <>
    <Suelo />
    {/* pila de cajas */}
    <rect className="ilus-trazo ilus-carton" x="30" y="100" width="62" height="32" rx="2" />
    <rect className="ilus-trazo ilus-carton" x="96" y="100" width="62" height="32" rx="2" />
    <rect className="ilus-trazo ilus-carton-b" x="48" y="68" width="62" height="32" rx="2" />
    <rect className="ilus-trazo ilus-carton" x="66" y="36" width="50" height="32" rx="2" />
    <path className="ilus-cinta" d="M61 100v14M127 100v14M79 68v14M91 36v12" />
    <rect className="ilus-trazo ilus-papel" x="38" y="114" width="20" height="12" rx="1.5" />
    <path className="ilus-linea" d="M42 118h12M42 122h8" />
    {/* tablilla con lista chequeada */}
    <g className="ilus-tablilla">
      <rect className="ilus-trazo ilus-madera-c" x="146" y="22" width="68" height="92" rx="6" />
      <rect className="ilus-trazo ilus-papel" x="153" y="34" width="54" height="74" rx="3" />
      <rect className="ilus-trazo ilus-metal" x="165" y="17" width="30" height="12" rx="4" />
      <path className="ilus-check" d="M158 48l4 4 7-8" />
      <rect className="ilus-tinta" x="174" y="46" width="26" height="4" rx="2" />
      <path className="ilus-check" d="M158 66l4 4 7-8" />
      <rect className="ilus-tinta" x="174" y="64" width="20" height="4" rx="2" />
      <path className="ilus-check" d="M158 84l4 4 7-8" />
      <rect className="ilus-tinta" x="174" y="82" width="24" height="4" rx="2" />
      <circle className="ilus-trazo ilus-vacio" cx="163" cy="100" r="4.5" />
      <rect className="ilus-tinta ilus-tinta--suave" x="174" y="98" width="16" height="4" rx="2" />
    </g>
  </>
);

const Ventas = () => (
  <>
    <Suelo />
    {/* mostrador */}
    <rect className="ilus-trazo ilus-madera-c" x="24" y="96" width="192" height="36" rx="3" />
    <rect className="ilus-tabla" x="20" y="90" width="200" height="8" rx="3" />
    {/* caja registradora */}
    <path className="ilus-trazo ilus-verde-o" d="M78 90l8-30h68l8 30z" />
    <rect className="ilus-trazo ilus-verde-o" x="70" y="76" width="100" height="14" rx="3" />
    <rect className="ilus-trazo ilus-pantalla" x="100" y="38" width="40" height="22" rx="3" />
    <path className="ilus-luz" d="M107 54l7-7 6 5 8-9" />
    <rect className="ilus-trazo ilus-verde-o" x="108" y="58" width="24" height="8" />
    <g className="ilus-teclas">
      <circle cx="94" cy="68" r="2.2" /><circle cx="104" cy="68" r="2.2" /><circle cx="114" cy="68" r="2.2" />
      <circle cx="126" cy="68" r="2.2" /><circle cx="136" cy="68" r="2.2" /><circle cx="146" cy="68" r="2.2" />
    </g>
    <rect className="ilus-trazo ilus-gaveta" x="84" y="80" width="72" height="8" rx="2" />
    <circle className="ilus-pomo" cx="120" cy="84" r="2" />
    {/* tiquete que sale */}
    <g className="ilus-tiquete">
      <path className="ilus-trazo ilus-papel" d="M172 90v-40h26v40l-4.3-3-4.3 3-4.4-3-4.3 3-4.4-3z" />
      <rect className="ilus-tinta" x="177" y="56" width="16" height="3" rx="1.5" />
      <rect className="ilus-tinta ilus-tinta--suave" x="177" y="63" width="12" height="3" rx="1.5" />
      <rect className="ilus-tinta ilus-tinta--suave" x="177" y="70" width="14" height="3" rx="1.5" />
      <rect className="ilus-tinta" x="177" y="77" width="9" height="3" rx="1.5" />
    </g>
    {/* monedas */}
    <ellipse className="ilus-trazo ilus-mostaza" cx="46" cy="87" rx="12" ry="3.5" />
    <ellipse className="ilus-trazo ilus-mostaza" cx="46" cy="83" rx="12" ry="3.5" />
    <ellipse className="ilus-trazo ilus-mostaza" cx="46" cy="79" rx="12" ry="3.5" />
  </>
);

const Reportes = () => (
  <>
    <Suelo />
    {/* hoja de atrás, ladeada */}
    <rect className="ilus-trazo ilus-papel ilus-papel--atras" x="50" y="20" width="116" height="112" rx="6" transform="rotate(-7 108 76)" />
    {/* hoja con gráfico */}
    <rect className="ilus-trazo ilus-papel" x="62" y="14" width="116" height="118" rx="6" />
    <rect className="ilus-tinta" x="76" y="26" width="48" height="5" rx="2.5" />
    <rect className="ilus-tinta ilus-tinta--suave" x="76" y="36" width="30" height="4" rx="2" />
    <path className="ilus-eje" d="M78 112h84M78 112V50" />
    <rect className="ilus-barra ilus-verde-o" x="86" y="86" width="14" height="26" rx="2" />
    <rect className="ilus-barra ilus-verde-o" x="108" y="72" width="14" height="40" rx="2" />
    <rect className="ilus-barra ilus-mostaza" x="130" y="60" width="14" height="52" rx="2" />
    <rect className="ilus-barra ilus-verde-o" x="152" y="78" width="14" height="34" rx="2" />
    <path className="ilus-tendencia" d="M86 80l22-14 22-4 32-18" />
    <circle className="ilus-punto" cx="162" cy="44" r="3.5" />
    {/* lápiz */}
    <g className="ilus-lapiz">
      <path className="ilus-trazo ilus-mostaza" d="M184 118l30-62 8 4-30 62z" />
      <path className="ilus-trazo ilus-madera-c" d="M184 118l-2 12 11-5z" />
      <path className="ilus-trazo ilus-tomate" d="M214 56l4-8 8 4-4 8z" />
    </g>
  </>
);

const Proveedores = () => (
  <>
    <Suelo />
    {/* camión de reparto */}
    <rect className="ilus-trazo ilus-verde-o" x="22" y="52" width="110" height="70" rx="5" />
    <path className="ilus-trazo ilus-papel" d="M132 74h32l20 22v26h-52z" />
    <path className="ilus-trazo ilus-vidrio" d="M140 80h20l13 15h-33z" />
    <rect className="ilus-trazo ilus-verde-o" x="22" y="108" width="162" height="14" rx="3" />
    <rect className="ilus-trazo ilus-tabla" x="28" y="60" width="98" height="6" rx="2" />
    <text className="ilus-rotulo" x="77" y="94" textAnchor="middle">SURTIDO</text>
    <circle className="ilus-trazo ilus-llanta" cx="54" cy="124" r="11" />
    <circle className="ilus-llanta-c" cx="54" cy="124" r="4" />
    <circle className="ilus-trazo ilus-llanta" cx="152" cy="124" r="11" />
    <circle className="ilus-llanta-c" cx="152" cy="124" r="4" />
    <rect className="ilus-faro" x="180" y="106" width="5" height="6" rx="1.5" />
    {/* cajas que bajan */}
    <rect className="ilus-trazo ilus-carton" x="190" y="108" width="24" height="24" rx="2" />
    <rect className="ilus-trazo ilus-carton-b" x="204" y="86" width="22" height="22" rx="2" />
    <path className="ilus-cinta" d="M202 108v10M215 86v8" />
  </>
);

const Suministros = () => (
  <>
    <Suelo />
    {/* estiba con cajas */}
    <rect className="ilus-trazo ilus-madera-c" x="26" y="120" width="130" height="12" rx="2" />
    <path className="ilus-linea" d="M52 120v12M91 120v12M130 120v12" />
    <rect className="ilus-trazo ilus-carton" x="30" y="84" width="58" height="36" rx="2" />
    <rect className="ilus-trazo ilus-carton-b" x="92" y="84" width="60" height="36" rx="2" />
    <rect className="ilus-trazo ilus-carton" x="46" y="50" width="56" height="34" rx="2" />
    <path className="ilus-cinta" d="M59 84v14M122 84v14M74 50v14" />
    {/* caja abierta con botellas */}
    <g className="ilus-abierta">
      <path className="ilus-trazo ilus-carton-b" d="M164 90h56l-6 42h-44z" />
      <rect className="ilus-trazo ilus-verde" x="172" y="66" width="10" height="30" rx="4" />
      <rect className="ilus-trazo ilus-mostaza" x="188" y="60" width="10" height="36" rx="4" />
      <rect className="ilus-trazo ilus-tomate" x="204" y="68" width="10" height="28" rx="4" />
      <path className="ilus-trazo ilus-carton" d="M164 90l-10-12 18 4zM220 90l10-12-18 4z" />
    </g>
    {/* tarjeta de entrega */}
    <g className="ilus-etiqueta">
      <rect className="ilus-trazo ilus-papel" x="108" y="24" width="52" height="22" rx="4" />
      <path className="ilus-check" d="M116 35l4 4 7-8" />
      <rect className="ilus-tinta" x="132" y="30" width="22" height="4" rx="2" />
      <rect className="ilus-tinta ilus-tinta--suave" x="132" y="38" width="16" height="3" rx="1.5" />
    </g>
  </>
);

const Tenderos = () => (
  <>
    <Suelo />
    {/* toldo */}
    <path className="ilus-trazo ilus-verde-o" d="M30 20h180l-12 24H42z" />
    <path className="ilus-franja" d="M60 20l-4 24M90 20l-2 24M120 20v24M150 20l2 24M180 20l4 24" />
    {/* persona tras el mostrador */}
    <circle className="ilus-trazo ilus-piel" cx="120" cy="66" r="13" />
    <path className="ilus-trazo ilus-pelo" d="M107 64c0-12 8-16 14-16s12 5 12 14c-6-3-14-5-26 2z" />
    <circle className="ilus-tinta" cx="115" cy="68" r="1.5" />
    <circle className="ilus-tinta" cx="125" cy="68" r="1.5" />
    <path className="ilus-sonrisa" d="M115 73q5 4 10 0" />
    <path className="ilus-trazo ilus-delantal" d="M96 112c0-18 8-30 24-30s24 12 24 30z" />
    <path className="ilus-trazo ilus-papel" d="M108 112v-18h24v18z" />
    {/* mostrador */}
    <rect className="ilus-trazo ilus-madera-c" x="24" y="104" width="192" height="28" rx="3" />
    <rect className="ilus-tabla" x="18" y="98" width="204" height="8" rx="3" />
    {/* balanza y frascos */}
    <path className="ilus-trazo ilus-metal" d="M42 98v-14M30 84h24" />
    <path className="ilus-trazo ilus-mostaza" d="M30 84q12 12 24 0z" />
    <rect className="ilus-trazo ilus-vidrio" x="176" y="76" width="18" height="22" rx="4" />
    <rect className="ilus-trazo ilus-tomate" x="198" y="84" width="14" height="14" rx="2" />
  </>
);

const ESCENAS = {
  'new-product': Productos,
  stock: Inventario,
  'register-sales': Ventas,
  report: Reportes,
  'register-vendors': Proveedores,
  'register-supplies': Suministros,
  'register-shopkeeper': Tenderos,
};

const Ilustracion = ({ id }) => {
  const Escena = ESCENAS[id];
  if (!Escena) return <FachadaTienda />;
  return (
    <svg className="ilus" viewBox="0 0 240 150" aria-hidden="true" focusable="false">
      <Escena />
    </svg>
  );
};

Ilustracion.propTypes = {
  id: PropTypes.string,
};

export default Ilustracion;
