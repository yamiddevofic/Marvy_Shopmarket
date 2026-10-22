import { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { ArrowDownLeft, ArrowRight, ArrowUpRight, RefreshCw, Scale } from 'lucide-react';
import CategoriasGasto from '../Panel/CategoriasGasto';
import { api } from '../../services/api';
import { PERIODOS, diaCorto, entero, pesos, pesosCorto } from '../../utils/negocio';

// Entradas (ventas) y salidas (gastos) del periodo, con su balance y el detalle
// de en qué se fue el dinero. Solo el administrador puede ver la caja.
const Caja = () => {
  const [periodo, setPeriodo] = useState('hoy');
  // undefined = cargando, false = falló, null = sin permiso, objeto = listo
  const [resumen, setResumen] = useState(undefined);

  const cargar = useCallback(() => {
    setResumen(undefined);
    api.get(`/resumen-caja?periodo=${periodo}`)
      .then(setResumen)
      .catch((err) => setResumen(err.status === 403 ? null : false));
  }, [periodo]);

  useEffect(() => { cargar(); }, [cargar]);

  if (resumen === null) return null;

  let cuerpo;
  if (resumen === undefined) {
    cuerpo = (
      <div className="caja__cifras" aria-busy="true" aria-label="Cargando resumen">
        {[0, 1, 2].map((i) => <span key={i} className="esqueleto caja__esqueleto" />)}
      </div>
    );
  } else if (resumen === false) {
    cuerpo = (
      <div className="reponer__estado">
        <p>No pudimos cargar las entradas y salidas.</p>
        <button type="button" className="boton" onClick={cargar}><RefreshCw aria-hidden="true" /> Reintentar</button>
      </div>
    );
  } else {
    const ganancia = resumen.balance >= 0;
    const total = resumen.salidas;
    cuerpo = (
      <>
        <dl className="caja__cifras">
          <div className="caja-cifra caja-cifra--entradas">
            <dt><ArrowDownLeft aria-hidden="true" /> Entradas</dt>
            <dd className="caja-cifra__valor">{pesos(resumen.entradas)}</dd>
            <dd className="caja-cifra__nota">{entero(resumen.num_ventas)} {resumen.num_ventas === 1 ? 'venta' : 'ventas'}</dd>
          </div>
          <div className="caja-cifra caja-cifra--salidas">
            <dt><ArrowUpRight aria-hidden="true" /> Salidas</dt>
            <dd className="caja-cifra__valor">{pesos(resumen.salidas)}</dd>
            <dd className="caja-cifra__nota">{entero(resumen.num_gastos)} {resumen.num_gastos === 1 ? 'gasto' : 'gastos'}</dd>
          </div>
          <div className="caja-cifra">
            <dt><Scale aria-hidden="true" /> Balance</dt>
            <dd className="caja-cifra__valor">{ganancia ? '' : '−'}{pesos(Math.abs(resumen.balance))}</dd>
            <dd className="caja-cifra__nota">
              <span className={`chip ${ganancia ? '' : 'chip--alerta'}`}>{ganancia ? 'A favor' : 'En contra'}</span>
            </dd>
          </div>
        </dl>

        {resumen.por_dia.length > 1 && <GraficoDias dias={resumen.por_dia} />}

        <div className="caja__categorias">
          <h3 className="caja__subtitulo">¿En qué se fue la plata?</h3>
          {resumen.gastos_por_categoria.length ? (
            <CategoriasGasto filas={resumen.gastos_por_categoria.map((c) => [c.categoria, c.total])} total={total} />
          ) : (
            <p className="caja__nada">No hay gastos registrados en este periodo.</p>
          )}
        </div>
      </>
    );
  }

  return (
    <section className="tarjeta caja" aria-labelledby="caja-titulo">
      <header className="tarjeta__cabeza caja__cabeza">
        <div className="tarjeta__titulos">
          <h2 id="caja-titulo" className="tarjeta__titulo">Entradas y salidas</h2>
          <p className="tarjeta__ayuda">Ventas que entraron y gastos que salieron de la caja</p>
        </div>
        <div className="segmentos" role="group" aria-label="Periodo del resumen">
          {PERIODOS.map((p) => (
            <button key={p.valor} type="button" className="segmentos__opcion" aria-pressed={periodo === p.valor} onClick={() => setPeriodo(p.valor)}>
              {p.texto}
            </button>
          ))}
        </div>
      </header>
      {cuerpo}
      <footer className="caja__enlaces">
        <Link to="/ventas" className="tarjeta__enlace">Ver ventas <ArrowRight aria-hidden="true" /></Link>
        <Link to="/gastos" className="tarjeta__enlace">Registrar gasto <ArrowRight aria-hidden="true" /></Link>
      </footer>
    </section>
  );
};

// Barras pareadas por día (entradas y salidas en un mismo eje de pesos).
const GraficoDias = ({ dias }) => {
  const [activo, setActivo] = useState(null);
  const maximo = Math.max(...dias.flatMap((d) => [d.entradas, d.salidas]), 1);
  const muchos = dias.length > 10;
  const etiquetaDia = (dia, i) => {
    if (!muchos) return diaCorto(dia).split(' ')[0].replace(/[.,]/g, '');
    const n = Number(dia.slice(8, 10));
    return n === 1 || i === dias.length - 1 || n % 5 === 0 ? String(n) : '';
  };
  const d = activo === null ? null : dias[activo];

  return (
    <figure className="grafico-dias">
      <figcaption className="grafico-dias__leyenda">
        <span className="grafico-dias__clave grafico-dias__clave--entradas">Entradas</span>
        <span className="grafico-dias__clave grafico-dias__clave--salidas">Salidas</span>
      </figcaption>
      <div className="grafico-dias__plano" aria-hidden="true" onMouseLeave={() => setActivo(null)}>
        <span className="grafico-dias__guia" style={{ bottom: '100%' }}><span>{pesosCorto(maximo)}</span></span>
        <span className="grafico-dias__guia" style={{ bottom: '50%' }}><span>{pesosCorto(maximo / 2)}</span></span>
        <span className="grafico-dias__guia grafico-dias__guia--base" style={{ bottom: 0 }}><span>$0</span></span>
        <div className="grafico-dias__columnas">
          {dias.map((dia, i) => (
            <div
              key={dia.dia}
              className={`grafico-dias__col${activo === i ? ' grafico-dias__col--activa' : ''}`}
              onMouseEnter={() => setActivo(i)}
            >
              <div className="grafico-dias__barras">
                <span className="grafico-dias__barra grafico-dias__barra--entradas" style={{ height: `${(dia.entradas / maximo) * 100}%` }} />
                <span className="grafico-dias__barra grafico-dias__barra--salidas" style={{ height: `${(dia.salidas / maximo) * 100}%` }} />
              </div>
              <span className="grafico-dias__dia">{etiquetaDia(dia.dia, i)}</span>
            </div>
          ))}
        </div>
        {d && (
          <div className="grafico-dias__tooltip" style={{ left: `${((activo + 0.5) / dias.length) * 100}%` }}>
            <strong>{diaCorto(d.dia)}</strong>
            <span className="grafico-dias__clave grafico-dias__clave--entradas">Entradas {pesos(d.entradas)}</span>
            <span className="grafico-dias__clave grafico-dias__clave--salidas">Salidas {pesos(d.salidas)}</span>
          </div>
        )}
      </div>
      {/* La misma información como tabla, para lectores de pantalla */}
      <table className="sr-only">
        <caption>Entradas y salidas por día</caption>
        <thead><tr><th scope="col">Día</th><th scope="col">Entradas</th><th scope="col">Salidas</th></tr></thead>
        <tbody>
          {dias.map((dia) => (
            <tr key={dia.dia}><th scope="row">{diaCorto(dia.dia)}</th><td>{pesos(dia.entradas)}</td><td>{pesos(dia.salidas)}</td></tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
};

GraficoDias.propTypes = {
  dias: PropTypes.arrayOf(PropTypes.shape({ dia: PropTypes.string, entradas: PropTypes.number, salidas: PropTypes.number })).isRequired,
};

export default Caja;
