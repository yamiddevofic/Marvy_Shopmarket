import useContador from '../../hooks/useContador';

// Elementos gráficos del día a día de una tienda, flotando sobre la escena:
// el tiquete de ventas con su gráfico semanal, una etiqueta de precio y un
// aviso de stock bajo. Son ilustración (aria-hidden), con cifras de ejemplo.

const VENTAS_SEMANA = [
  ['L', 0.48], ['M', 0.62], ['M', 0.55], ['J', 0.7], ['V', 0.86], ['S', 1], ['D', 0.74],
];
const VENTAS_HOY = 486300;
const PESOS = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });

const TarjetasNegocio = () => {
  const ventas = useContador(VENTAS_HOY, { duracion: 1400, retraso: 1200 });

  return (
    <div className="tarjetas-negocio" aria-hidden="true">
      <div className="tarjeta-flotante tiquete" style={{ '--i': 0 }}>
        <p className="tiquete__etiqueta">Ventas de hoy</p>
        <p className="tiquete__cifra">{PESOS.format(ventas)}</p>
        <div className="tiquete__grafico">
          {VENTAS_SEMANA.map(([dia, alto], i) => (
            <div key={i} className="tiquete__columna">
              <span
                className={`tiquete__barra${i === 5 ? ' tiquete__barra--hoy' : ''}`}
                style={{ '--alto': alto, '--i': i }}
              />
              <span className="tiquete__dia">{dia}</span>
            </div>
          ))}
        </div>
        <p className="tiquete__tendencia">▲ 12 % vs. la semana pasada</p>
      </div>

      <div className="tarjeta-flotante etiqueta-precio" style={{ '--i': 1 }}>
        <span className="etiqueta-precio__ojal" />
        <span className="etiqueta-precio__nombre">Arroz 1 kg</span>
        <span className="etiqueta-precio__valor">$4.800</span>
      </div>

      <div className="tarjeta-flotante aviso-stock" style={{ '--i': 2 }}>
        <span className="aviso-stock__punto" />
        <span>Panela · quedan 3</span>
      </div>
    </div>
  );
};

export default TarjetasNegocio;
