import PropTypes from 'prop-types';

// Escena del registro: la gran apertura de una tienda nueva. Banderines entre
// los edificios, globos, cajas recién llegadas y la cinta de inauguración
// atravesando la puerta. Misma idea que la escena del login (tokens de color,
// día ↔ noche con opacidades) pero con otra historia: aquí la tienda todavía
// no abre, la estás creando.
//
// El viewBox es la zona que siempre se ve (la tienda y sus globos). El barrio y
// el andén siguen dibujados hacia los lados (overflow visible).
const TRAMO = 700;
const REPETICIONES = [-2, -1, 0, 1, 2];

// Edificios vecinos: [x, techo, ancho]; todos llegan al andén (y = 250)
const VECINOS = [
  [-300, 120, 130], [-150, 80, 120], [20, 150, 150],
  [430, 140, 130], [580, 95, 120],
];

const ESTRELLAS = [
  [30, 30, 1.5], [120, 70, 1.1], [210, 20, 1.3], [330, 55, 1.2], [420, 15, 1.5],
  [520, 60, 1.2], [600, 25, 1.3], [-60, 40, 1.2], [660, 80, 1.1], [70, -70, 1.2],
  [260, -40, 1.1], [470, -90, 1.3], [-120, -30, 1.2], [610, -60, 1],
];

// Banderines: se reparten sobre una curva (la cuerda) entre dos puntos
const CUERDA = { x0: -70, y0: 70, x1: 670, y1: 70, caida: 60 };
const NUM_BANDERINES = 17;
const COLORES_BANDERIN = ['--toldo-a', '--mostaza', '--tomate', '--azul'];

const puntoDeCuerda = (t) => {
  const { x0, y0, x1, y1, caida } = CUERDA;
  const cx = (x0 + x1) / 2;
  const cy = Math.max(y0, y1) + caida * 2;
  const mt = 1 - t;
  return [
    mt * mt * x0 + 2 * mt * t * cx + t * t * x1,
    mt * mt * y0 + 2 * mt * t * cy + t * t * y1,
  ];
};

const banderines = Array.from({ length: NUM_BANDERINES }, (_, i) => {
  const [x, y] = puntoDeCuerda((i + 0.5) / NUM_BANDERINES);
  return { x, y, color: COLORES_BANDERIN[i % COLORES_BANDERIN.length], i };
});

const GLOBOS = [
  { x: 128, y: 150, tono: '--tomate', i: 0 },
  { x: 152, y: 132, tono: '--mostaza', i: 1 },
  { x: 176, y: 154, tono: '--toldo-a', i: 2 },
];

const Destello = ({ x, y, tam = 8, i = 0 }) => (
  <path
    className="escena-apertura__destello"
    style={{ '--i': i, transformOrigin: `${x}px ${y}px` }}
    d={`M${x} ${y - tam} Q${x} ${y} ${x + tam} ${y} Q${x} ${y} ${x} ${y + tam} Q${x} ${y} ${x - tam} ${y} Q${x} ${y} ${x} ${y - tam}Z`}
  />
);

Destello.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  tam: PropTypes.number,
  i: PropTypes.number,
};

const EscenaApertura = () => (
  <svg
    className="escena-apertura"
    viewBox="0 0 600 300"
    preserveAspectRatio="xMidYMax meet"
    aria-hidden="true"
    focusable="false"
  >
    <defs>
      <linearGradient id="apertura-niebla" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" className="escena-apertura__niebla-arriba" />
        <stop offset="1" className="escena-apertura__niebla-abajo" />
      </linearGradient>
    </defs>

    {/* Cielo: astros y nubes */}
    <g className="escena-apertura__estrellas">
      {ESTRELLAS.map(([x, y, r], i) => (
        <circle key={i} cx={x} cy={y} r={r} style={{ '--i': i }} />
      ))}
    </g>
    <circle className="escena-apertura__sol-aura" cx="500" cy="40" r="46" />
    <circle className="escena-apertura__sol" cx="500" cy="40" r="26" />
    <circle className="escena-apertura__luna" cx="500" cy="40" r="22" />
    <g className="escena-apertura__nube">
      <ellipse cx="70" cy="30" rx="34" ry="10" />
      <ellipse cx="92" cy="22" rx="22" ry="11" />
    </g>
    <g className="escena-apertura__nube escena-apertura__nube--b">
      <ellipse cx="360" cy="14" rx="30" ry="9" />
      <ellipse cx="380" cy="8" rx="18" ry="9" />
    </g>

    {/* Colinas */}
    <path
      className="escena-apertura__colina-1"
      d="M-700 250 L-700 190 Q-560 130 -420 180 T-140 170 T140 185 T420 165 T700 180 T980 170 L1300 190 L1300 250Z"
    />
    <path
      className="escena-apertura__colina-2"
      d="M-700 250 L-700 215 Q-520 180 -360 212 T-60 205 T220 215 T500 200 T800 212 T1100 205 L1300 215 L1300 250Z"
    />

    {/* Barrio: edificios vecinos repetidos hacia los lados */}
    {REPETICIONES.map((r) => (
      <g key={r} transform={`translate(${r * TRAMO} 0)`}>
        {VECINOS.map(([x, techo, ancho], i) => (
          <g key={x}>
            <rect
              className={i % 2 ? 'escena-apertura__vecino-b' : 'escena-apertura__vecino-a'}
              x={x}
              y={techo}
              width={ancho}
              height={250 - techo}
            />
            <rect className="escena-apertura__cornisa" x={x - 3} y={techo - 4} width={ancho + 6} height="6" rx="2" />
            {Array.from({ length: Math.floor((250 - techo - 28) / 36) }, (_, f) =>
              Array.from({ length: Math.floor(ancho / 40) }, (_, c) => (
                <g key={`${f}-${c}`}>
                  <rect
                    className="escena-apertura__ventana"
                    x={x + 12 + c * 40}
                    y={techo + 16 + f * 36}
                    width="20"
                    height="20"
                    rx="3"
                  />
                  <rect
                    className={`escena-apertura__ventana-luz${(f + c + i) % 3 === 0 ? ' escena-apertura__ventana-luz--tenue' : ''}`}
                    x={x + 12 + c * 40}
                    y={techo + 16 + f * 36}
                    width="20"
                    height="20"
                    rx="3"
                  />
                </g>
              ))
            )}
          </g>
        ))}
      </g>
    ))}
    <rect x="-1400" y="120" width="3200" height="130" fill="url(#apertura-niebla)" />

    {/* Cuerda y banderines (cuelgan entre el barrio y encima de la tienda) */}
    <g className="escena-apertura__banderines">
      <path
        className="escena-apertura__cuerda"
        d={`M${CUERDA.x0} ${CUERDA.y0} Q${(CUERDA.x0 + CUERDA.x1) / 2} ${Math.max(CUERDA.y0, CUERDA.y1) + CUERDA.caida * 2} ${CUERDA.x1} ${CUERDA.y1}`}
      />
      {banderines.map(({ x, y, color, i }) => (
        <path
          key={i}
          className="escena-apertura__banderin"
          style={{ fill: `var(${color})`, '--i': i, transformOrigin: `${x}px ${y}px` }}
          d={`M${x - 9} ${y} L${x + 9} ${y} L${x} ${y + 20}Z`}
        />
      ))}
    </g>

    {/* Tienda */}
    <g>
      <rect className="escena-apertura__fachada" x="196" y="102" width="208" height="148" />
      <rect className="escena-apertura__cornisa" x="190" y="96" width="220" height="10" rx="3" />

      {/* Letrero */}
      <rect className="escena-apertura__letrero" x="214" y="114" width="172" height="34" rx="7" />
      <text className="escena-apertura__letrero-texto" x="300" y="137" textAnchor="middle">
        TU TIENDA
      </text>
      <Destello x={222} y={110} tam={9} i={0} />
      <Destello x={392} y={118} tam={7} i={1} />
      <Destello x={372} y={104} tam={5} i={2} />

      {/* Toldo */}
      <g className="escena-apertura__toldo">
        {Array.from({ length: 8 }, (_, i) => (
          <path
            key={i}
            className={i % 2 ? 'escena-apertura__raya-b' : 'escena-apertura__raya-a'}
            d={`M${200 + i * 25} 154 H${225 + i * 25} V176 Q${212.5 + i * 25} 186 ${200 + i * 25} 176Z`}
          />
        ))}
      </g>

      {/* Vitrina con cajas sin abrir */}
      <rect className="escena-apertura__marco" x="210" y="188" width="86" height="62" rx="3" />
      <rect className="escena-apertura__vidrio" x="215" y="193" width="76" height="52" rx="2" />
      <rect className="escena-apertura__vidrio-luz" x="215" y="193" width="76" height="52" rx="2" />
      <rect className="escena-apertura__estantes" x="215" y="217" width="76" height="3" />
      <rect className="escena-apertura__caja-chica" x="222" y="203" width="16" height="14" rx="1.5" />
      <rect className="escena-apertura__caja-chica escena-apertura__caja-chica--b" x="242" y="198" width="14" height="19" rx="1.5" />
      <circle className="escena-apertura__caja-chica escena-apertura__caja-chica--c" cx="270" cy="210" r="7" />
      <rect className="escena-apertura__caja-chica escena-apertura__caja-chica--b" x="224" y="228" width="22" height="17" rx="1.5" />
      <rect className="escena-apertura__caja-chica" x="252" y="230" width="18" height="15" rx="1.5" />
      <path className="escena-apertura__reflejo" d="M221 193 L235 193 L221 245Z" />

      {/* Puerta con la cinta de inauguración */}
      <rect className="escena-apertura__marco" x="312" y="186" width="70" height="64" rx="3" />
      <rect className="escena-apertura__puerta" x="317" y="191" width="60" height="59" rx="2" />
      <circle className="escena-apertura__pomo" cx="368" cy="224" r="3" />
      <path className="escena-apertura__reflejo" d="M322 191 L336 191 L322 240Z" />
    </g>

    {/* Andén */}
    <rect className="escena-apertura__anden" x="-1400" y="250" width="3200" height="80" />
    <rect className="escena-apertura__bordillo" x="-1400" y="250" width="3200" height="6" />
    <path className="escena-apertura__junta" d="M-1400 280 H1800 M-1400 306 H1800" />

    {/* Cinta de inauguración: cruza la puerta con un moño al centro */}
    <g className="escena-apertura__cinta">
      <path className="escena-apertura__cinta-banda" d="M180 214 L418 206 L418 218 L180 226Z" />
      <path className="escena-apertura__cinta-lazo" d="M299 216 L276 202 L278 232Z M299 216 L322 202 L320 232Z" />
      <circle className="escena-apertura__cinta-nudo" cx="299" cy="216" r="6" />
      <path className="escena-apertura__cinta-banda" d="M294 220 L282 250 L292 246 L298 252 L302 222Z" />
      <path className="escena-apertura__cinta-banda" d="M304 220 L318 250 L308 246 L302 252 L298 222Z" />
    </g>

    {/* Cajas recién llegadas a la derecha */}
    <g className="escena-apertura__cajas">
      <rect className="escena-apertura__caja" x="416" y="224" width="38" height="26" rx="2" />
      <rect className="escena-apertura__cinta-caja" x="431" y="224" width="8" height="26" />
      <rect className="escena-apertura__caja escena-apertura__caja--b" x="458" y="230" width="30" height="20" rx="2" />
      <rect className="escena-apertura__cinta-caja" x="469" y="230" width="7" height="20" />
      <rect className="escena-apertura__caja escena-apertura__caja--c" x="426" y="202" width="30" height="22" rx="2" />
      <rect className="escena-apertura__cinta-caja" x="437" y="202" width="7" height="22" />
    </g>

    {/* Cartel «NUEVO» */}
    <g className="escena-apertura__cartel">
      <rect className="escena-apertura__poste" x="494" y="196" width="5" height="54" rx="2" />
      <g className="escena-apertura__cartel-giro">
        <rect className="escena-apertura__cartel-fondo" x="470" y="176" width="52" height="28" rx="6" />
        <text className="escena-apertura__cartel-texto" x="496" y="194" textAnchor="middle">NUEVO</text>
      </g>
    </g>

    {/* Globos atados a la entrada */}
    <g>
      {GLOBOS.map(({ x, y, tono, i }) => (
        <g key={i} className="escena-apertura__globo" style={{ '--i': i, transformOrigin: '150px 250px' }}>
          <path className="escena-apertura__hilo" d={`M${x} ${y + 20} Q${150 + (x - 150) * 0.3} ${y + 70} 150 246`} />
          <ellipse cx={x} cy={y} rx="14" ry="18" style={{ fill: `var(${tono})` }} />
          <path d={`M${x - 3} ${y + 18} L${x + 3} ${y + 18} L${x} ${y + 23}Z`} style={{ fill: `var(${tono})` }} />
          <ellipse className="escena-apertura__brillo" cx={x - 5} cy={y - 6} rx="3" ry="6" />
        </g>
      ))}
      <rect className="escena-apertura__lastre" x="142" y="242" width="16" height="8" rx="2" />
    </g>

    {/* Planta */}
    <g>
      <rect className="escena-apertura__maceta" x="171" y="234" width="20" height="16" rx="3" />
      <path className="escena-apertura__copa" d="M181 236 C168 228 166 214 172 208 C177 216 181 224 181 236Z M181 236 C194 226 196 214 190 206 C185 214 181 224 181 236Z" />
    </g>
  </svg>
);

export default EscenaApertura;
