import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import PropTypes from "prop-types";
import { AlertCircle, CheckCircle2, ChevronDown, Minus, Plus, RefreshCw, Search, ShoppingBasket, Trash2, Undo2, X } from "lucide-react";
import Layout from "../Layout/Layout";
import GestionHero from "../components/Panel/GestionHero";
import { api } from "../services/api";
import { METODOS_PAGO, PERIODOS, diaCorto, entero, horaDe, pesos, textoMetodo } from "../utils/negocio";

const MAX_RESULTADOS = 6;
const BILLETES = [2000, 5000, 10000, 20000, 50000, 100000];

// Atajos para "paga con": exacto, el siguiente mil redondo y los billetes que alcanzan.
const montosRapidos = (total) => {
  if (total <= 0) return [];
  const redondo = Math.ceil(total / 1000) * 1000;
  const opciones = [total, redondo, ...BILLETES.filter((b) => b > total)];
  return [...new Set(opciones)].slice(0, 5);
};
const PERIODOS_HISTORIAL = [...PERIODOS, { valor: "todas", texto: "Todas" }];
const SIN_VENTAS = { hoy: "hoy", semana: "en los últimos 7 días", mes: "este mes", todas: "registradas" };

const safeObj = (obj) => (obj && typeof obj === "object" && Object.keys(obj).length > 0 ? obj : null);
const safeStr = (str) => (typeof str === "string" && str.trim().length > 0 ? str : null);
const normalizar = (texto) => String(texto ?? "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

// Ventas: armar la venta con productos del inventario (descuenta las unidades)
// y consultar el historial, con opción de anular una venta equivocada.
const RegisterSales = ({ userName, storeInfo }) => {
  // undefined = cargando, false = falló, arreglo = listo
  const [productos, setProductos] = useState(undefined);
  const [ventas, setVentas] = useState(undefined);
  const [periodo, setPeriodo] = useState("hoy");

  const [busqueda, setBusqueda] = useState("");
  const [carrito, setCarrito] = useState([]); // [{ producto_id, cantidad }]
  const [metodo, setMetodo] = useState("efectivo");
  const [recibido, setRecibido] = useState(""); // con cuánto paga el cliente (solo efectivo)
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const [exito, setExito] = useState("");
  const buscarRef = useRef(null);

  const cargarProductos = useCallback(() => {
    api.get("/listar-productos")
      .then((data) => setProductos(Array.isArray(data) ? data : []))
      .catch(() => setProductos(false));
  }, []);

  const cargarVentas = useCallback(() => {
    setVentas(undefined);
    api.get(periodo === "todas" ? "/listar-ventas" : `/listar-ventas?periodo=${periodo}`)
      .then((data) => setVentas(Array.isArray(data) ? data : []))
      .catch(() => setVentas(false));
  }, [periodo]);

  useEffect(() => { cargarProductos(); }, [cargarProductos]);
  useEffect(() => { cargarVentas(); }, [cargarVentas]);

  useEffect(() => {
    if (!exito) return undefined;
    const t = setTimeout(() => setExito(""), 5000);
    return () => clearTimeout(t);
  }, [exito]);

  const porId = useMemo(() => new Map((Array.isArray(productos) ? productos : []).map((p) => [p._id, p])), [productos]);

  const termino = normalizar(busqueda.trim());
  const resultados = termino && Array.isArray(productos)
    ? productos.filter((p) => normalizar(p.nombre).includes(termino) || normalizar(p.categoria).includes(termino)).slice(0, MAX_RESULTADOS)
    : [];

  const enCarrito = (id) => carrito.find((l) => l.producto_id === id)?.cantidad || 0;

  const agregar = (producto) => {
    if (enCarrito(producto._id) >= Number(producto.stock)) return;
    setCarrito((prev) => (prev.some((l) => l.producto_id === producto._id)
      ? prev.map((l) => (l.producto_id === producto._id ? { ...l, cantidad: l.cantidad + 1 } : l))
      : [...prev, { producto_id: producto._id, cantidad: 1 }]));
    setBusqueda("");
    setError("");
    buscarRef.current?.focus();
  };

  const cambiarCantidad = (id, cantidad) => {
    const max = Number(porId.get(id)?.stock) || 0;
    const n = Math.max(1, Math.min(max, Math.floor(Number(cantidad) || 1)));
    setCarrito((prev) => prev.map((l) => (l.producto_id === id ? { ...l, cantidad: n } : l)));
  };

  const quitar = (id) => setCarrito((prev) => prev.filter((l) => l.producto_id !== id));

  const lineas = carrito.map((l) => {
    const p = porId.get(l.producto_id);
    return { ...l, nombre: p?.nombre ?? "Producto", precio: Number(p?.precio) || 0, stock: Number(p?.stock) || 0 };
  });
  const total = lineas.reduce((suma, l) => suma + l.precio * l.cantidad, 0);
  const unidades = lineas.reduce((suma, l) => suma + l.cantidad, 0);

  // Vueltos: solo aplican en efectivo y cuando se escribe con cuánto paga
  const enEfectivo = metodo === "efectivo";
  const pagaCon = recibido === "" ? null : Number(recibido);
  const vueltos = enEfectivo && pagaCon !== null ? pagaCon - total : null;
  const faltaDinero = vueltos !== null && vueltos < 0;

  const alBuscarTecla = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const primero = resultados.find((p) => Number(p.stock) > enCarrito(p._id));
      if (primero) agregar(primero);
    } else if (e.key === "Escape") {
      setBusqueda("");
    }
  };

  const registrar = async () => {
    if (!carrito.length || faltaDinero) return;
    setGuardando(true);
    setError("");
    setExito("");
    try {
      const cuerpo = { items: carrito, metodo };
      if (enEfectivo && pagaCon !== null) cuerpo.recibido = pagaCon;
      const { venta } = await api.post("/registrar-venta", cuerpo);
      setCarrito([]);
      setMetodo("efectivo");
      setRecibido("");
      setExito(venta.cambio
        ? `Venta por ${pesos(venta.total)} registrada. Entrega ${pesos(venta.cambio)} de vueltos.`
        : `Venta por ${pesos(venta.total)} registrada. Las unidades se descontaron del inventario.`);
      cargarProductos();
      cargarVentas();
    } catch (err) {
      setError(err.message || "No se pudo registrar la venta.");
      cargarProductos(); // el stock pudo cambiar mientras se armaba la venta
    } finally {
      setGuardando(false);
    }
  };

  const alAnular = () => {
    cargarProductos();
    cargarVentas();
  };

  return (
    <Layout userName={safeStr(userName)} storeInfo={safeObj(storeInfo)}>
      <main className="gestion">
        <GestionHero id="register-sales" titulo="Ventas" descripcion="Registra lo que vendes: las unidades salen solas del inventario. Abajo tienes el historial." />

        <div className="ventas__cuerpo">
          <section className="tarjeta venta-nueva" aria-labelledby="venta-nueva-titulo">
            <header className="tarjeta__titulos">
              <h2 id="venta-nueva-titulo" className="tarjeta__titulo">Nueva venta</h2>
              <p className="tarjeta__ayuda">Busca un producto y presiona Enter o tócalo para agregarlo.</p>
            </header>

            <div role="alert" className="gestion-formulario__avisos">
              {error && <p className="aviso aviso--error"><AlertCircle aria-hidden="true" /> {error}</p>}
            </div>
            <div role="status" className="gestion-formulario__avisos">
              {exito && <p className="aviso aviso--ok"><CheckCircle2 aria-hidden="true" /> {exito}</p>}
            </div>

            <div className="venta-buscar">
              <label className="gestion-buscar">
                <Search aria-hidden="true" />
                <span className="sr-only">Buscar producto para vender</span>
                <input
                  ref={buscarRef}
                  type="search"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  onKeyDown={alBuscarTecla}
                  placeholder={productos === undefined ? "Cargando productos…" : "Buscar producto o categoría"}
                  disabled={!Array.isArray(productos)}
                  className="gestion-buscar__input"
                  autoComplete="off"
                />
              </label>
              {productos === false && (
                <p className="aviso aviso--error">
                  <AlertCircle aria-hidden="true" /> No pudimos cargar los productos.
                  <button type="button" className="tarjeta__enlace" onClick={cargarProductos}>Reintentar</button>
                </p>
              )}
              {termino && Array.isArray(productos) && (
                <ul className="venta-resultados" aria-label="Productos encontrados">
                  {resultados.length === 0 && <li className="venta-resultados__vacio">Ningún producto coincide con «{busqueda}».</li>}
                  {resultados.map((p) => {
                    const disponibles = Number(p.stock) - enCarrito(p._id);
                    return (
                      <li key={p._id}>
                        <button type="button" className="venta-resultado" onClick={() => agregar(p)} disabled={disponibles <= 0}>
                          <span className="venta-resultado__textos">
                            <span className="venta-resultado__nombre">{p.nombre}</span>
                            <span className="venta-resultado__dato">
                              {Number(p.stock) <= 0 ? "Agotado" : `${entero(disponibles)} disponibles`} · {p.categoria}
                            </span>
                          </span>
                          <span className="venta-resultado__precio">{pesos(p.precio)}</span>
                          <Plus className="venta-resultado__mas" aria-hidden="true" />
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {lineas.length === 0 ? (
              <div className="venta-vacia">
                <ShoppingBasket aria-hidden="true" />
                <p>La venta está vacía. Agrega productos con el buscador.</p>
              </div>
            ) : (
              <ul className="venta-lineas" aria-label="Productos de la venta">
                {lineas.map((l) => (
                  <li key={l.producto_id} className="venta-linea">
                    <span className="venta-linea__textos">
                      <span className="venta-linea__nombre">{l.nombre}</span>
                      <span className="venta-linea__dato">{pesos(l.precio)} c/u</span>
                    </span>
                    <span className="venta-cantidad" role="group" aria-label={`Cantidad de ${l.nombre}`}>
                      <button type="button" onClick={() => cambiarCantidad(l.producto_id, l.cantidad - 1)} disabled={l.cantidad <= 1} aria-label="Quitar una unidad">
                        <Minus aria-hidden="true" />
                      </button>
                      <input
                        type="number"
                        min="1"
                        max={l.stock}
                        inputMode="numeric"
                        value={l.cantidad}
                        onChange={(e) => cambiarCantidad(l.producto_id, e.target.value)}
                        aria-label={`Unidades de ${l.nombre}`}
                      />
                      <button type="button" onClick={() => cambiarCantidad(l.producto_id, l.cantidad + 1)} disabled={l.cantidad >= l.stock} aria-label="Agregar una unidad">
                        <Plus aria-hidden="true" />
                      </button>
                    </span>
                    <span className="venta-linea__subtotal">{pesos(l.precio * l.cantidad)}</span>
                    <button type="button" className="venta-linea__quitar" onClick={() => quitar(l.producto_id)} aria-label={`Quitar ${l.nombre} de la venta`}>
                      <X aria-hidden="true" />
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <fieldset className="venta-metodo">
              <legend className="gestion-form__etiqueta">Método de pago</legend>
              <div className="venta-metodo__opciones">
                {METODOS_PAGO.map((m) => (
                  <label key={m.valor} className="venta-metodo__opcion">
                    <input type="radio" name="metodo" value={m.valor} checked={metodo === m.valor} onChange={() => setMetodo(m.valor)} />
                    <span>{m.texto}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            {enEfectivo && total > 0 && (
              <div className="venta-vueltos">
                <div className="gestion-form__campo">
                  <label htmlFor="venta-recibido" className="gestion-form__etiqueta">¿Con cuánto paga?</label>
                  <input
                    id="venta-recibido"
                    type="number"
                    min="0"
                    step="any"
                    inputMode="numeric"
                    value={recibido}
                    onChange={(e) => setRecibido(e.target.value)}
                    className="gestion-form__input"
                    placeholder={`Ej. ${entero(montosRapidos(total).at(-1))}`}
                    aria-describedby="venta-vueltos-resultado"
                  />
                </div>
                <div className="venta-vueltos__rapidos" role="group" aria-label="Montos rápidos">
                  {montosRapidos(total).map((monto) => (
                    <button key={monto} type="button" className="venta-vueltos__rapido" aria-pressed={pagaCon === monto} onClick={() => setRecibido(String(monto))}>
                      {monto === total ? "Exacto" : pesos(monto)}
                    </button>
                  ))}
                </div>
                <p id="venta-vueltos-resultado" className={`venta-vueltos__resultado${faltaDinero ? " venta-vueltos__resultado--falta" : ""}`} aria-live="polite">
                  {vueltos === null ? (
                    <span className="venta-vueltos__etiqueta">Escribe con cuánto paga para calcular los vueltos</span>
                  ) : faltaDinero ? (
                    <><span className="venta-vueltos__etiqueta"><AlertCircle aria-hidden="true" /> Faltan</span><strong>{pesos(-vueltos)}</strong></>
                  ) : (
                    <><span className="venta-vueltos__etiqueta">Vueltos</span><strong>{pesos(vueltos)}</strong></>
                  )}
                </p>
              </div>
            )}

            <footer className="venta-total">
              <p className="venta-total__cifra">
                <span className="venta-total__etiqueta">Total{unidades ? ` · ${entero(unidades)} ${unidades === 1 ? "unidad" : "unidades"}` : ""}</span>
                <strong>{pesos(total)}</strong>
              </p>
              <button type="button" className="boton boton--primario venta-total__boton" onClick={registrar} disabled={!carrito.length || guardando || faltaDinero} aria-busy={guardando}>
                {guardando ? (<><span className="boton__girando" aria-hidden="true" /> Guardando…</>) : "Registrar venta"}
              </button>
            </footer>
          </section>

          <Historial ventas={ventas} periodo={periodo} onPeriodo={setPeriodo} onReintentar={cargarVentas} onAnulada={alAnular} />
        </div>
      </main>
    </Layout>
  );
};

RegisterSales.propTypes = {
  userName: PropTypes.string,
  storeInfo: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
};

// Historial de ventas del periodo elegido, de la más reciente a la más antigua.
const Historial = ({ ventas, periodo, onPeriodo, onReintentar, onAnulada }) => {
  const validas = Array.isArray(ventas) ? ventas.filter((v) => !v.anulada) : [];
  const total = validas.reduce((suma, v) => suma + v.total, 0);

  let cuerpo;
  if (ventas === undefined) {
    cuerpo = (
      <div className="gestion-lista" aria-busy="true" aria-label="Cargando ventas">
        {[0, 1, 2].map((i) => <span key={i} className="esqueleto gestion-lista__esqueleto" />)}
      </div>
    );
  } else if (ventas === false) {
    cuerpo = (
      <div className="gestion-vacio">
        <p className="gestion-vacio__texto">No pudimos cargar el historial.</p>
        <button type="button" className="boton" onClick={onReintentar}><RefreshCw aria-hidden="true" /> Reintentar</button>
      </div>
    );
  } else if (!ventas.length) {
    cuerpo = <p className="historial__vacio">No hay ventas {SIN_VENTAS[periodo]}.</p>;
  } else {
    cuerpo = (
      <ul className="historial__lista">
        {ventas.map((v) => <VentaFila key={v._id} venta={v} mostrarDia={periodo !== "hoy"} onAnulada={onAnulada} />)}
      </ul>
    );
  }

  return (
    <section className="tarjeta historial" aria-labelledby="historial-titulo">
      <header className="tarjeta__titulos">
        <h2 id="historial-titulo" className="tarjeta__titulo">Historial de ventas</h2>
        <p className="tarjeta__ayuda" aria-live="polite">
          {Array.isArray(ventas) ? `${entero(validas.length)} ${validas.length === 1 ? "venta" : "ventas"} · ${pesos(total)}` : " "}
        </p>
      </header>
      <div className="segmentos" role="group" aria-label="Periodo del historial">
        {PERIODOS_HISTORIAL.map((p) => (
          <button key={p.valor} type="button" className="segmentos__opcion" aria-pressed={periodo === p.valor} onClick={() => onPeriodo(p.valor)}>
            {p.texto}
          </button>
        ))}
      </div>
      {cuerpo}
    </section>
  );
};

Historial.propTypes = {
  ventas: PropTypes.oneOfType([PropTypes.array, PropTypes.oneOf([false])]),
  periodo: PropTypes.string.isRequired,
  onPeriodo: PropTypes.func.isRequired,
  onReintentar: PropTypes.func.isRequired,
  onAnulada: PropTypes.func.isRequired,
};

const VentaFila = ({ venta, mostrarDia, onAnulada }) => {
  const [confirmando, setConfirmando] = useState(false);
  const [anulando, setAnulando] = useState(false);
  const [error, setError] = useState("");
  const resumen = venta.items.map((i) => `${i.nombre} ×${i.cantidad}`).join(", ");

  const anular = async () => {
    setAnulando(true);
    setError("");
    try {
      await api.post(`/anular-venta/${venta._id}`);
      onAnulada();
    } catch (err) {
      setError(err.message || "No se pudo anular la venta.");
      setAnulando(false);
      setConfirmando(false);
    }
  };

  return (
    <li>
      <details className={`venta-historial${venta.anulada ? " venta-historial--anulada" : ""}`}>
        <summary className="venta-historial__resumen">
          <span className="venta-historial__cuando">
            {mostrarDia && <span className="venta-historial__dia">{diaCorto(venta.dia)}</span>}
            {horaDe(venta.fecha)}
          </span>
          <span className="venta-historial__items">{resumen}</span>
          <span className="venta-historial__total">
            {venta.anulada ? <span className="chip chip--neutro">Anulada</span> : <span className="chip chip--neutro">{textoMetodo(venta.metodo)}</span>}
            <span className="venta-historial__cifra">{pesos(venta.total)}</span>
          </span>
          <ChevronDown className="venta-historial__flecha" aria-hidden="true" />
        </summary>
        <div className="venta-historial__detalle">
          <table className="venta-detalle">
            <caption className="sr-only">Productos de la venta</caption>
            <thead>
              <tr><th scope="col">Producto</th><th scope="col">Cant.</th><th scope="col">Precio</th><th scope="col">Subtotal</th></tr>
            </thead>
            <tbody>
              {venta.items.map((i) => (
                <tr key={i.producto_id}>
                  <td>{i.nombre}</td><td>{entero(i.cantidad)}</td><td>{pesos(i.precio_unitario)}</td><td>{pesos(i.subtotal)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="venta-historial__pie">
            <p>
              {[
                venta.vendedor?.nombre && `Vendió ${venta.vendedor.nombre}`,
                venta.recibido != null && `Pagó con ${pesos(venta.recibido)} · vueltos ${pesos(venta.cambio)}`,
              ].filter(Boolean).join(" · ")}
            </p>
            {!venta.anulada && (confirmando ? (
              <span className="venta-historial__confirmar">
                <span>¿Anular? Las unidades vuelven al inventario.</span>
                <button type="button" className="boton" onClick={() => setConfirmando(false)} disabled={anulando}>No</button>
                <button type="button" className="boton boton--peligro-lleno" onClick={anular} disabled={anulando} aria-busy={anulando}>
                  {anulando ? <span className="boton__girando" aria-hidden="true" /> : <Trash2 aria-hidden="true" />} Sí, anular
                </button>
              </span>
            ) : (
              <button type="button" className="boton boton--peligro" onClick={() => setConfirmando(true)}>
                <Undo2 aria-hidden="true" /> Anular venta
              </button>
            ))}
          </div>
          {error && <p className="aviso aviso--error" role="alert"><AlertCircle aria-hidden="true" /> {error}</p>}
        </div>
      </details>
    </li>
  );
};

VentaFila.propTypes = {
  venta: PropTypes.object.isRequired,
  mostrarDia: PropTypes.bool,
  onAnulada: PropTypes.func.isRequired,
};

export default RegisterSales;
