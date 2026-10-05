import PropTypes from 'prop-types';

// Escena del hero: una tienda de barrio dibujada por capas (montañas, barrio
// lejano, edificios vecinos, fachada, andén). Una sola escena para los dos
// temas: los colores salen de tokens de escena y lo que solo existe de día
// (sol, nubes, aves) o de noche (luna, estrellas, luces) siempre está en el
// DOM y se muestra con un token de opacidad, para que el cambio de tema se vea
// como un atardecer y no como un salto.
//
// El viewBox es solo la zona que siempre debe verse (de las frutas al farol).
// El barrio sigue dibujado fuera de él hacia los lados y el cielo hacia arriba
// (overflow visible), así la escena llena cualquier proporción sin estirarse ni
// cortar la tienda; el CSS decide el tamaño del marco.
const VIEWBOX = { x: 140, y: 220, ancho: 600, alto: 300 };

// Lo que se repite hacia los lados se dibuja con este desplazamiento
const TRAMO = 800;
const REPETICIONES = [-2, -1, 0, 1, 2];

const ESTRELLAS = [
  [60, 40, 1.6], [140, 90, 1.2], [210, 30, 1.4], [300, 70, 1.1], [380, 25, 1.5],
  [450, 95, 1.2], [520, 45, 1.3], [700, 35, 1.4], [760, 100, 1.1], [100, 150, 1],
  [330, 140, 1.2], [600, 130, 1], [40, -120, 1.3], [260, -60, 1.1], [480, -150, 1.4],
  [640, -40, 1.2], [180, -200, 1], [720, -180, 1.3],
];

// Siluetas del barrio lejano: [x, ancho, alto]
const BARRIO_LEJANO = [
  [0, 70, 150], [65, 50, 115], [110, 80, 175], [185, 55, 130], [235, 70, 160],
  [300, 60, 120], [355, 85, 185], [435, 55, 140], [485, 75, 170], [555, 60, 125],
  [610, 80, 180], [685, 55, 135], [735, 70, 160],
];

// Cordilleras al fondo: [altura de cada cumbre sobre el valle]
const MONTANAS_LEJANAS = [110, 150, 90, 170, 120, 140, 100, 160, 130, 115, 150, 95, 135, 105];
const MONTANAS_CERCANAS = [34, 22, 40, 28, 36, 24, 42, 30, 26, 38, 32, 28, 36, 24, 40, 30];

// Edificios vecinos: [x, techo, ancho]; todos llegan al andén (y = 480)
const VECINOS = [
  [-520, 292, 260], [-250, 228, 240], [0, 270, 160],
  [600, 258, 200], [810, 236, 220], [1040, 296, 240], [1290, 250, 230],
];

// Ventanas en rejilla; algunas se omiten para que no parezcan de catálogo
const ventanasDe = ([x, techo, ancho]) => {
  const ventanas = [];
  for (let fila = 0; techo + 32 + fila * 45 + 28 < 450; fila++) {
    for (let col = 0; 28 + col * 40 + 22 <= ancho - 6; col++) {
      if ((fila * 3 + col + Math.round(x / 10)) % 5 !== 3) {
        ventanas.push([x + 28 + col * 40, techo + 32 + fila * 45]);
      }
    }
  }
  return ventanas;
};

// Una cordillera continua: picos con laderas algo curvas (cordillera) o
// lomas redondeadas (colinas)
const sierra = (alturas, valle, paso, inicio, redondas = false) => {
  let d = `M${inicio} 480 V${valle}`;
  alturas.forEach((alto, i) => {
    const x = inicio + i * paso;
    const cima = valle - alto;
    d += redondas
      ? ` Q${x + paso / 2} ${valle - alto * 2} ${x + paso} ${valle}`
      : ` Q${x + paso * 0.3} ${cima + alto * 0.3} ${x + paso / 2} ${cima} Q${x + paso * 0.7} ${cima + alto * 0.3} ${x + paso} ${valle}`;
  });
  return `${d} V480 Z`;
};

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

function Arbol({ x, escala = 1 }) {
  return (
    <g transform={`translate(${x} 480) scale(${escala})`}>
      <rect x="-4" y="-78" width="8" height="78" rx="2" className="escena-tienda__tronco" />
      <circle cx="0" cy="-98" r="30" className="escena-tienda__copa" />
      <circle cx="-22" cy="-80" r="20" className="escena-tienda__copa" />
      <circle cx="22" cy="-82" r="22" className="escena-tienda__copa" />
      <circle cx="-8" cy="-112" r="14" className="escena-tienda__copa-luz" />
    </g>
  );
}

Arbol.propTypes = {
  x: PropTypes.number.isRequired,
  escala: PropTypes.number,
};

function Maceta({ x }) {
  return (
    <g>
      <ellipse cx={x} cy="456" rx="9" ry="14" className="escena-tienda__copa" />
      <ellipse cx={x - 8} cy="462" rx="6" ry="10" transform={`rotate(-25 ${x - 8} 462)`} className="escena-tienda__copa-luz" />
      <ellipse cx={x + 8} cy="462" rx="6" ry="10" transform={`rotate(25 ${x + 8} 462)`} className="escena-tienda__copa" />
      <path d={`M${x - 10} 466 h20 l-3 14 h-14 z`} className="escena-tienda__maceta" />
    </g>
  );
}

Maceta.propTypes = { x: PropTypes.number.isRequired };

function Tanque({ x, techo }) {
  return (
    <g className="escena-tienda__tanque">
      <rect x={x} y={techo - 26} width="34" height="20" rx="3" />
      <rect x={x + 4} y={techo - 6} width="3" height="6" />
      <rect x={x + 27} y={techo - 6} width="3" height="6" />
    </g>
  );
}

Tanque.propTypes = {
  x: PropTypes.number.isRequired,
  techo: PropTypes.number.isRequired,
};

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
    viewBox={`${VIEWBOX.x} ${VIEWBOX.y} ${VIEWBOX.ancho} ${VIEWBOX.alto}`}
    preserveAspectRatio="xMidYMax meet"
    aria-hidden="true"
    focusable="false"
  >
    <defs>
      <radialGradient id="escena-halo">
        <stop offset="0" className="escena-tienda__halo-centro" />
        <stop offset="1" className="escena-tienda__halo-borde" />
      </radialGradient>
      <linearGradient id="escena-niebla" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" className="escena-tienda__niebla-arriba" />
        <stop offset="1" className="escena-tienda__niebla-abajo" />
      </linearGradient>
      <mask id="escena-luna">
        <rect x="600" y="140" width="200" height="160" fill="white" />
        <circle cx="712" cy="206" r="26" fill="black" />
      </mask>
      <pattern id="escena-baldosas" width="48" height="40" patternUnits="userSpaceOnUse" x="0" y="484">
        <path d="M0 0 V40 M0 18 H48" className="escena-tienda__junta" />
      </pattern>
    </defs>

    {/* Noche: estrellas y luna. El cielo es el fondo del hero. */}
    <g className="escena-tienda__estrellas">
      {[-1, 0, 1].flatMap((k) =>
        ESTRELLAS.map(([cx, cy, r], i) => (
          <circle key={`${k}-${i}`} cx={cx + k * TRAMO} cy={cy} r={r} style={{ '--i': i }} />
        )),
      )}
    </g>
    <circle cx="696" cy="220" r="28" mask="url(#escena-luna)" className="escena-tienda__luna" />

    {/* Día: sol, nubes y aves */}
    <circle cx="696" cy="226" r="46" className="escena-tienda__sol-aura" />
    <circle cx="696" cy="226" r="32" className="escena-tienda__sol" />
    <g className="escena-tienda__nube escena-tienda__nube--a">
      <ellipse cx="150" cy="120" rx="54" ry="18" />
      <ellipse cx="180" cy="104" rx="34" ry="20" />
      <ellipse cx="128" cy="108" rx="24" ry="14" />
    </g>
    <g className="escena-tienda__nube escena-tienda__nube--b">
      <ellipse cx="470" cy="70" rx="44" ry="14" />
      <ellipse cx="494" cy="58" rx="26" ry="15" />
    </g>
    <g className="escena-tienda__nube escena-tienda__nube--c">
      <ellipse cx="960" cy="150" rx="50" ry="15" />
      <ellipse cx="986" cy="136" rx="28" ry="16" />
      <ellipse cx="-160" cy="60" rx="46" ry="14" />
      <ellipse cx="-136" cy="48" rx="26" ry="14" />
    </g>
    <g className="escena-tienda__aves">
      <path d="M430 52 q8 -8 16 0 q8 -8 16 0" />
      <path d="M470 40 q6 -6 12 0 q6 -6 12 0" />
    </g>

    {/* Cordilleras */}
    <path d={sierra(MONTANAS_LEJANAS, 400, 280, -1700)} className="escena-tienda__montana-1" />
    <path d={sierra(MONTANAS_CERCANAS, 420, 240, -1800, true)} className="escena-tienda__montana-2" />

    {/* Barrio lejano, con bruma que lo funde con las montañas */}
    <g className="escena-tienda__capa-1">
      {REPETICIONES.flatMap((k) =>
        BARRIO_LEJANO.map(([x, ancho, alto]) => (
          <rect key={`${k}-${x}`} x={x + k * TRAMO} y={480 - alto} width={ancho} height={alto} />
        )),
      )}
    </g>
    <rect x="-2000" y="290" width="4800" height="190" fill="url(#escena-niebla)" />

    {/* Edificios vecinos */}
    <g className="escena-tienda__capa-2">
      {VECINOS.map(([x, techo, ancho]) => (
        <rect key={x} x={x} y={techo} width={ancho} height={480 - techo} />
      ))}
    </g>
    <g className="escena-tienda__cornisa">
      {VECINOS.map(([x, techo, ancho]) => (
        <rect key={x} x={x - 4} y={techo - 8} width={ancho + 8} height="10" rx="1" />
      ))}
    </g>
    <Tanque x={-200} techo={220} />
    <Tanque x={900} techo={228} />
    <g className="escena-tienda__ventanas">
      {VECINOS.flatMap(ventanasDe).map(([x, y]) => (
        <g key={`${x}-${y}`}>
          <rect x={x} y={y} width="22" height="28" rx="2" className="escena-tienda__ventana" />
          <rect x={x} y={y} width="22" height="28" rx="2" className="escena-tienda__ventana-luz" />
        </g>
      ))}
    </g>

    {/* Halo de la tienda y del farol (noche) */}
    <ellipse cx="400" cy="400" rx="260" ry="140" fill="url(#escena-halo)" className="escena-tienda__resplandor" />
    <circle cx="718" cy="300" r="70" fill="url(#escena-halo)" className="escena-tienda__resplandor" />

    {/* Árboles del andén, a los lados de la tienda */}
    <Arbol x={118} />
    <Arbol x={790} escala={1.1} />
    <Arbol x={-330} escala={0.95} />
    <Arbol x={1180} />

    {/* Fachada */}
    <rect x="220" y="252" width="360" height="228" className="escena-tienda__fachada" />
    <rect x="212" y="246" width="376" height="10" rx="2" className="escena-tienda__cornisa" />
    <rect x="220" y="470" width="360" height="10" className="escena-tienda__zocalo" />

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
    <Maceta x={566} />

    {/* Andén con baldosas */}
    <rect x="-2000" y="480" width="4800" height="80" className="escena-tienda__anden" />
    <rect x="-2000" y="484" width="4800" height="76" fill="url(#escena-baldosas)" />
    <rect x="-2000" y="480" width="4800" height="4" className="escena-tienda__bordillo" />

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
