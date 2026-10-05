// Emblema de Marvy: el carrito de siempre, en SVG, con tres productos que caen
// dentro al cargar (primero el emblema, luego el titular).
const EmblemaTienda = () => (
  <svg className="emblema-tienda" viewBox="0 0 64 64" aria-hidden="true" focusable="false">
    <circle cx="32" cy="32" r="32" className="emblema-tienda__fondo" />
    <g className="emblema-tienda__productos">
      <rect x="25" y="20" width="8" height="10" rx="1.5" className="emblema-tienda__producto" style={{ '--i': 0 }} />
      <rect x="34" y="17" width="6" height="13" rx="2" className="emblema-tienda__producto" style={{ '--i': 1 }} />
      <circle cx="44" cy="26" r="4" className="emblema-tienda__producto" style={{ '--i': 2 }} />
    </g>
    <g className="emblema-tienda__carrito">
      <path d="M13 17h5l5 21h22l4 -14H21" />
      <circle cx="25" cy="45" r="2.6" />
      <circle cx="42" cy="45" r="2.6" />
    </g>
  </svg>
);

export default EmblemaTienda;
