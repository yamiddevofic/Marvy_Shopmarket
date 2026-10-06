// Fachada de la tienda con su toldo a rayas y el letrero de «Abierto».
// Es ilustración (aria-hidden); sus colores salen de los tokens de .panel-hero.
const RAYAS = [0, 1, 2, 3, 4, 5];

const FachadaTienda = () => (
  <svg className="fachada-tienda" viewBox="0 0 240 150" aria-hidden="true" focusable="false">
    <rect className="fachada-tienda__anden" x="0" y="132" width="240" height="18" />
    <rect className="fachada-tienda__muro" x="30" y="40" width="180" height="94" rx="4" />
    <g className="fachada-tienda__toldo">
      {RAYAS.map((i) => (
        <path
          key={i}
          className={i % 2 ? 'fachada-tienda__raya-b' : 'fachada-tienda__raya-a'}
          d={`M${30 + i * 30} 52h30l${i % 2 ? 4 : 4} 22a15 8 0 0 1 -30 0z`}
        />
      ))}
    </g>
    <rect className="fachada-tienda__marco" x="48" y="82" width="86" height="52" rx="3" />
    <rect className="fachada-tienda__vidrio" x="53" y="87" width="76" height="47" rx="2" />
    <rect className="fachada-tienda__estante" x="58" y="102" width="66" height="3" />
    <rect className="fachada-tienda__estante" x="58" y="120" width="66" height="3" />
    <rect className="fachada-tienda__producto" x="62" y="93" width="9" height="9" rx="1.5" />
    <rect className="fachada-tienda__producto fachada-tienda__producto--b" x="76" y="95" width="8" height="7" rx="1.5" />
    <circle className="fachada-tienda__producto fachada-tienda__producto--c" cx="100" cy="98" r="4" />
    <rect className="fachada-tienda__producto fachada-tienda__producto--c" x="64" y="110" width="12" height="10" rx="1.5" />
    <rect className="fachada-tienda__producto" x="82" y="112" width="9" height="8" rx="1.5" />
    <rect className="fachada-tienda__puerta" x="150" y="86" width="44" height="48" rx="3" />
    <circle className="fachada-tienda__pomo" cx="157" cy="112" r="2.2" />
    <g className="fachada-tienda__letrero">
      <rect x="157" y="58" width="48" height="18" rx="4" />
      <text x="181" y="71" textAnchor="middle">ABIERTO</text>
    </g>
    <path className="fachada-tienda__cuerda" d="M0 30 Q120 8 240 30" />
    {[24, 62, 100, 138, 176, 214].map((x, i) => (
      <path
        key={x}
        className="fachada-tienda__banderin"
        style={{ '--i': i }}
        d={`M${x} ${23 + Math.sin((x / 240) * Math.PI) * -6 + 6}l9 0l-4.5 11z`}
      />
    ))}
  </svg>
);

export default FachadaTienda;
