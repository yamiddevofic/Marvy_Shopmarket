import PropTypes from 'prop-types';

// Escena del hero: una tienda de barrio dibujada por capas (cielo, barrio
// lejano, edificios vecinos, fachada, andén). Una sola escena para los dos
// temas: los colores salen de tokens de escena y lo que solo existe de día
// (sol, nubes, aves) o de noche (luna, estrellas, luces) siempre está en el
// DOM y se muestra con un token de opacidad, para que el cambio de tema se vea
// como un atardecer y no como un salto.

const ESTRELLAS = [
  [60, 40, 1.6], [140, 90, 1.2], [210, 30, 1.4], [300, 70, 1.1], [380, 25, 1.5],
  [450, 95, 1.2], [520, 45, 1.3], [700, 35, 1.4], [760, 100, 1.1], [100, 150, 1],
  [330, 140, 1.2], [600, 130, 1],
];

// Siluetas del barrio lejano: [x, ancho, alto]
const BARRIO_LEJANO = [
  [0, 70, 150], [65, 50, 115], [110, 80, 175], [185, 55, 130], [235, 70, 160],
  [300, 60, 120], [355, 85, 185], [435, 55, 140], [485, 75, 170], [555, 60, 125],
  [610, 80, 180], [685, 55, 135], [735, 70, 160],
];

// Ventanas de los edificios vecinos: [x, y]
const VENTANAS_VECINAS = [
  [28, 300], [68, 300], [108, 300], [28, 345], [108, 345], [68, 390], [108, 390],
  [632, 290], [672, 290], [712, 290], [752, 290], [632, 335], [712, 335], [752, 335],
  [672, 380], [752, 380],
];

// Rayas del toldo: cada una con borde inferior ondulado (festón)
const RAYAS_TOLDO = Array.from({ length: 9 }, (_, i) => 220 + i * 40);

// Productos en los estantes de la vitrina: [tipo, x, y, token de color]
const PRODUCTOS = [
  ['frasco', 258, 368, '--producto-1'], ['frasco', 274, 368, '--producto-2'],
  ['caja', 292, 360, '--producto-3'], ['botella', 322, 352, '--producto-4'],
  ['botella', 334, 352, '--producto-1'], ['caja', 350, 362, '--producto-2'],
  ['frasco', 378, 368, '--producto-3'], ['frasco', 394, 368, '--producto-4'],
  ['caja', 256, 398, '--producto-4'], ['caja', 276, 398, '--producto-1'],
  ['bolsa', 302, 396, '--producto-2'], ['bolsa', 324, 396, '--producto-3'],
  ['botella', 352, 390, '--producto-2'], ['botella', 364, 390, '--producto-4'],
  ['caja', 380, 398, '--producto-3'], ['frasco', 262, 438, '--producto-3'],
  ['frasco', 278, 438, '--producto-1'], ['botella', 300, 428, '--producto-1'],
  ['caja', 318, 432, '--producto-4'], ['bolsa', 344, 432, '--producto-1'],
  ['caja', 372, 432, '--producto-2'], ['frasco', 396, 438, '--producto-4'],
];

// Bombillos de la guirnalda bajo el letrero
const BOMBILLOS = Array.from({ length: 11 }, (_, i) => 232 + i * 34);

function Producto({ tipo, x, y, color }) {
  const relleno = { fill: `var(${color})` };
  if (tipo === 'frasco') {
    return (
      <g>
        <rect x={x} y={y - 2} width="12" height="4" rx="1" className="escena-tienda__tapa" />
        <rect x={x - 1} y={y} width="14" height="14" rx="3" style={relleno} />
      </g>
    );
  }
  if (tipo === 'botella') {
    return (
      <g>
        <rect x={x + 3} y={y} width="4" height="7" className="escena-tienda__tapa" />
        <rect x={x} y={y + 6} width="10" height="16" rx="3" style={relleno} />
      </g>
    );
  }
  if (tipo === 'bolsa') {
    return <path d={`M${x} ${y + 18} l2 -16 h16 l2 16 z`} style={relleno} />;
  }
  return <rect x={x} y={y} width="16" height="22" rx="1.5" style={relleno} />;
}

Producto.propTypes = {
  tipo: PropTypes.oneOf(['frasco', 'botella', 'bolsa', 'caja']).isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  /** nombre de un token de escena, p. ej. '--producto-1' */
  color: PropTypes.string.isRequired,
};

const EscenaTienda = () => (
  <svg
    className="escena-tienda"
    viewBox="0 0 800 520"
    preserveAspectRatio="xMidYMax slice"
    aria-hidden="true"
    focusable="false"
  >
    <defs>
      <linearGradient id="escena-cielo" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" className="escena-tienda__cielo-1" />
        <stop offset="1" className="escena-tienda__cielo-2" />
      </linearGradient>
      <radialGradient id="escena-halo">
        <stop offset="0" className="escena-tienda__halo-centro" />
        <stop offset="1" className="escena-tienda__halo-borde" />
      </radialGradient>
      <mask id="escena-luna">
        <rect width="800" height="520" fill="white" />
        <circle cx="668" cy="96" r="30" fill="black" />
      </mask>
    </defs>

    {/* Cielo */}
    <rect width="800" height="520" fill="url(#escena-cielo)" className="escena-tienda__cielo" />

    {/* Noche: estrellas y luna */}
    <g className="escena-tienda__estrellas">
      {ESTRELLAS.map(([cx, cy, r], i) => (
        <circle key={i} cx={cx} cy={cy} r={r} style={{ '--i': i }} />
      ))}
    </g>
    <circle cx="650" cy="110" r="32" mask="url(#escena-luna)" className="escena-tienda__luna" />

    {/* Día: sol, nubes y aves */}
    <circle cx="650" cy="110" r="36" className="escena-tienda__sol" />
    <g className="escena-tienda__nube escena-tienda__nube--a">
      <ellipse cx="150" cy="120" rx="54" ry="18" />
      <ellipse cx="180" cy="104" rx="34" ry="20" />
      <ellipse cx="128" cy="108" rx="24" ry="14" />
    </g>
    <g className="escena-tienda__nube escena-tienda__nube--b">
      <ellipse cx="470" cy="70" rx="44" ry="14" />
      <ellipse cx="494" cy="58" rx="26" ry="15" />
    </g>
    <g className="escena-tienda__aves">
      <path d="M430 52 q8 -8 16 0 q8 -8 16 0" />
      <path d="M470 40 q6 -6 12 0 q6 -6 12 0" />
    </g>

    {/* Barrio lejano */}
    <g className="escena-tienda__capa-1">
      {BARRIO_LEJANO.map(([x, ancho, alto]) => (
        <rect key={x} x={x} y={480 - alto} width={ancho} height={alto} />
      ))}
    </g>

    {/* Edificios vecinos */}
    <g className="escena-tienda__capa-2">
      <rect x="0" y="270" width="160" height="210" />
      <rect x="600" y="258" width="200" height="222" />
      <rect x="0" y="262" width="160" height="10" className="escena-tienda__cornisa" />
      <rect x="600" y="250" width="200" height="10" className="escena-tienda__cornisa" />
    </g>
    <g className="escena-tienda__ventanas">
      {VENTANAS_VECINAS.map(([x, y]) => (
        <g key={`${x}-${y}`}>
          <rect x={x} y={y} width="22" height="28" rx="2" className="escena-tienda__ventana" />
          <rect x={x} y={y} width="22" height="28" rx="2" className="escena-tienda__ventana-luz" />
        </g>
      ))}
    </g>

    {/* Halo de la tienda y del farol (noche) */}
    <ellipse cx="400" cy="400" rx="260" ry="140" fill="url(#escena-halo)" className="escena-tienda__resplandor" />
    <circle cx="718" cy="300" r="70" fill="url(#escena-halo)" className="escena-tienda__resplandor" />

    {/* Fachada */}
    <rect x="220" y="252" width="360" height="228" className="escena-tienda__fachada" />
    <rect x="212" y="246" width="376" height="10" rx="2" className="escena-tienda__cornisa" />

    {/* Letrero */}
    <rect x="262" y="262" width="276" height="38" rx="8" className="escena-tienda__letrero" />
    <text x="400" y="288" textAnchor="middle" className="escena-tienda__letrero-texto">
      TIENDA MARVY
    </text>

    {/* Guirnalda de bombillos */}
    <path d="M226 306 Q400 322 574 306" className="escena-tienda__cable" />
    <g className="escena-tienda__bombillos">
      {BOMBILLOS.map((x, i) => (
        <circle key={x} cx={x} cy={308 + Math.sin((i / 10) * Math.PI) * 7} r="3.2" />
      ))}
    </g>

    {/* Toldo de rayas con festón; se mece despacio */}
    <g className="escena-tienda__toldo">
      {RAYAS_TOLDO.map((x, i) => (
        <path
          key={x}
          d={`M${x} 318 h40 v24 a20 12 0 0 1 -40 0 z`}
          className={i % 2 === 0 ? 'escena-tienda__raya-a' : 'escena-tienda__raya-b'}
        />
      ))}
    </g>

    {/* Vitrina con estantes */}
    <rect x="240" y="352" width="180" height="112" rx="4" className="escena-tienda__marco" />
    <rect x="248" y="358" width="164" height="100" className="escena-tienda__vidrio" />
    <rect x="248" y="358" width="164" height="100" className="escena-tienda__vidrio-luz" />
    <g>
      {PRODUCTOS.map(([tipo, x, y, color], i) => (
        <Producto key={i} tipo={tipo} x={x} y={y - 6} color={color} />
      ))}
    </g>
    <g className="escena-tienda__estantes">
      <rect x="248" y="376" width="164" height="4" />
      <rect x="248" y="410" width="164" height="4" />
      <rect x="248" y="446" width="164" height="4" />
    </g>
    <path d="M256 362 l40 0 l-30 60 l-40 0 z" className="escena-tienda__reflejo" />

    {/* Puerta y aviso de ABIERTO */}
    <rect x="440" y="350" width="110" height="130" rx="4" className="escena-tienda__marco" />
    <rect x="450" y="360" width="90" height="120" className="escena-tienda__puerta" />
    <rect x="458" y="368" width="74" height="50" rx="2" className="escena-tienda__vidrio" />
    <rect x="458" y="368" width="74" height="50" rx="2" className="escena-tienda__vidrio-luz" />
    <circle cx="530" cy="430" r="4" className="escena-tienda__pomo" />
    <g className="escena-tienda__aviso">
      <path d="M478 366 L495 352 L512 366" className="escena-tienda__cable" />
      <rect x="466" y="366" width="58" height="22" rx="4" className="escena-tienda__aviso-fondo" />
      <text x="495" y="381" textAnchor="middle" className="escena-tienda__aviso-texto">
        ABIERTO
      </text>
    </g>

    {/* Andén */}
    <rect x="0" y="480" width="800" height="40" className="escena-tienda__anden" />
    <rect x="0" y="480" width="800" height="4" className="escena-tienda__bordillo" />

    {/* Huacal de frutas */}
    <g className="escena-tienda__huacal">
      <circle cx="176" cy="448" r="9" className="escena-tienda__naranja" />
      <circle cx="194" cy="446" r="9" className="escena-tienda__naranja" />
      <circle cx="212" cy="449" r="9" className="escena-tienda__tomate" />
      <circle cx="228" cy="447" r="9" className="escena-tienda__tomate" />
      <path d="M166 446 q16 -22 34 -8" className="escena-tienda__platano" />
      <path d="M172 444 q16 -20 32 -6" className="escena-tienda__platano" />
      <rect x="164" y="452" width="78" height="30" rx="2" className="escena-tienda__madera" />
      <rect x="164" y="460" width="78" height="3" className="escena-tienda__veta" />
      <rect x="164" y="470" width="78" height="3" className="escena-tienda__veta" />
    </g>

    {/* Pizarra de precios del día */}
    <g className="escena-tienda__pizarra">
      <path d="M592 482 L606 404 M652 482 L638 404" className="escena-tienda__caballete" />
      <rect x="588" y="404" width="68" height="62" rx="3" className="escena-tienda__pizarra-fondo" />
      <text x="622" y="422" textAnchor="middle" className="escena-tienda__tiza escena-tienda__tiza--titulo">HOY</text>
      <text x="622" y="439" textAnchor="middle" className="escena-tienda__tiza">Panela</text>
      <text x="622" y="456" textAnchor="middle" className="escena-tienda__tiza">$3.500</text>
    </g>

    {/* Farol */}
    <g className="escena-tienda__farol">
      <rect x="714" y="312" width="8" height="170" />
      <path d="M702 312 h32 l-6 -22 h-20 z" />
    </g>
    <rect x="708" y="292" width="20" height="18" rx="2" className="escena-tienda__farol-luz" />
  </svg>
);

export default EscenaTienda;
