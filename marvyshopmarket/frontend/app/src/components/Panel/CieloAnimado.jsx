// Cielo vivo para la cabecera del panel principal: de día sol con rayos que
// giran, nubes que pasan y un par de pájaros; de noche luna, estrellas que
// titilan y luciérnagas cerca del pasto. Cada pieza se ubica en % y tiene un
// tamaño fijo en px, así no se deforma ni crece con el ancho de la cabecera.
// Decorativo (aria-hidden); el tema solo cambia opacidades por CSS (panel.css).

const ESTRELLAS = [
  [6, 11, 2], [15, 24, 1.5], [24, 8, 2.5], [34, 18, 1.5], [44, 6, 2], [53, 22, 1.5],
  [61, 10, 2.5], [70, 29, 1.5], [76, 7, 2], [93, 32, 2], [11, 42, 1.5], [30, 35, 2],
  [58, 43, 1.5], [97, 13, 1.5],
];
const DESTELLOS = [[19, 15], [49, 14], [73, 18]];
const LUCIERNAGAS = [[8, 80], [23, 89], [37, 75], [52, 86], [66, 78], [80, 90], [92, 76]];
const NUBES = [[-6, 4, 92], [36, 3, 58], [60, 10, 74]];

const pos = (x, y) => ({ left: `${x}%`, top: `${y}%` });

const CieloAnimado = () => (
  <div className="cielo" aria-hidden="true">
    <div className="cielo__dia">
      {NUBES.map(([x, y, ancho], i) => (
        <svg key={i} className={`cielo__nube cielo__nube--${i}`} style={{ ...pos(x, y), width: ancho }} viewBox="0 0 66 32">
          <path d="M0 22a10 10 0 0 1 10-10a14 14 0 0 1 26-5a11 11 0 0 1 18 7a9 9 0 0 1 3 18H8a8 8 0 0 1-8-8z" />
        </svg>
      ))}
      <svg className="cielo__pajaros" viewBox="0 0 36 14">
        <path d="M1 6q4-4 8 0q4-4 8 0" />
        <path d="M21 11q3-3 6 0q3-3 6 0" />
      </svg>
      <svg className="cielo__astro" viewBox="-34 -34 68 68">
        <circle className="cielo__sol-aura" r="30" />
        <g className="cielo__rayos">
          {Array.from({ length: 12 }, (_, i) => (
            <line key={i} x1="0" y1="-21" x2="0" y2="-28" transform={`rotate(${i * 30})`} />
          ))}
        </g>
        <circle className="cielo__sol-disco" r="15" />
      </svg>
    </div>

    <div className="cielo__noche">
      {ESTRELLAS.map(([x, y, r], i) => (
        <span key={i} className="cielo__estrella" style={{ ...pos(x, y), width: r * 2, height: r * 2, '--i': i }} />
      ))}
      {DESTELLOS.map(([x, y], i) => (
        <svg key={i} className="cielo__destello" style={{ ...pos(x, y), '--i': i }} viewBox="-6 -6 12 12">
          <path d="M0-6l1.4 4.6 4.6 1.4-4.6 1.4-1.4 4.6-1.4-4.6-4.6-1.4 4.6-1.4z" />
        </svg>
      ))}
      <svg className="cielo__astro" viewBox="-34 -34 68 68">
        <circle className="cielo__luna-halo" r="30" />
        <circle className="cielo__luna-disco" r="15" />
        <circle className="cielo__luna-crater" cx="-5" cy="-3" r="3" />
        <circle className="cielo__luna-crater" cx="5" cy="5" r="2" />
        <circle className="cielo__luna-crater" cx="4" cy="-7" r="1.4" />
      </svg>
      {LUCIERNAGAS.map(([x, y], i) => (
        <span key={i} className="cielo__luciernaga" style={{ ...pos(x, y), '--i': i }} />
      ))}
    </div>
  </div>
);

export default CieloAnimado;
