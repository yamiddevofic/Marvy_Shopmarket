import { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { AlertCircle, CheckCircle2, RefreshCw, Trash2 } from "lucide-react";
import Layout from "../Layout/Layout";
import GestionHero from "../components/Panel/GestionHero";
import CategoriasGasto from "../components/Panel/CategoriasGasto";
import { api } from "../services/api";
import { PERIODOS, diaCorto, entero, pesos } from "../utils/negocio";

const safeObj = (obj) => (obj && typeof obj === "object" && Object.keys(obj).length > 0 ? obj : null);
const safeStr = (str) => (typeof str === "string" && str.trim().length > 0 ? str : null);

const hoy = () => new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD en hora local
const vacio = () => ({ descripcion: "", categoria: "", monto: "", dia: hoy() });

// Para orientar al elegir la categoría; las categorías válidas las define el backend.
const AYUDA_CATEGORIA = {
  Fijos: "Arriendo, servicios públicos, internet",
  Mantenimiento: "Reparaciones, aseo, pintura",
  Mercancía: "Compra de productos para vender",
  Nómina: "Pagos al equipo",
  Transporte: "Domicilios, fletes, gasolina",
  Impuestos: "Impuestos, permisos y trámites",
  Otros: "Lo que no encaje en las demás",
};

const SIN_GASTOS = { hoy: "hoy", semana: "en los últimos 7 días", mes: "este mes" };

// Gastos: las salidas de dinero de la tienda, agrupadas por categoría.
const Expenses = ({ userName, storeInfo }) => {
  const [periodo, setPeriodo] = useState("mes");
  // undefined = cargando, false = falló, arreglo = listo
  const [gastos, setGastos] = useState(undefined);
  const [categorias, setCategorias] = useState(Object.keys(AYUDA_CATEGORIA));
  const [form, setForm] = useState(vacio);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const [exito, setExito] = useState("");

  const cargar = useCallback(() => {
    setGastos(undefined);
    api.get(`/listar-gastos?periodo=${periodo}`)
      .then((data) => {
        setGastos(Array.isArray(data?.gastos) ? data.gastos : []);
        if (Array.isArray(data?.categorias)) setCategorias(data.categorias);
      })
      .catch(() => setGastos(false));
  }, [periodo]);

  useEffect(() => { cargar(); }, [cargar]);

  useEffect(() => {
    if (!exito) return undefined;
    const t = setTimeout(() => setExito(""), 5000);
    return () => clearTimeout(t);
  }, [exito]);

  const cambiar = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const enviar = async (e) => {
    e.preventDefault();
    setGuardando(true);
    setError("");
    setExito("");
    try {
      const { gasto } = await api.post("/registrar-gasto", { ...form, descripcion: form.descripcion.trim(), monto: parseFloat(form.monto) });
      setExito(`Gasto de ${pesos(gasto.monto)} en ${gasto.categoria} registrado.`);
      setForm(vacio());
      cargar();
    } catch (err) {
      setError(err.message || "No se pudo registrar el gasto.");
    } finally {
      setGuardando(false);
    }
  };

  const lista = Array.isArray(gastos) ? gastos : [];
  const total = lista.reduce((suma, g) => suma + g.monto, 0);
  const porCategoria = Object.entries(lista.reduce((acc, g) => ({ ...acc, [g.categoria]: (acc[g.categoria] || 0) + g.monto }), {}))
    .sort((a, b) => b[1] - a[1]);

  let cuerpo;
  if (gastos === undefined) {
    cuerpo = (
      <div className="gestion-lista" aria-busy="true" aria-label="Cargando gastos">
        {[0, 1, 2].map((i) => <span key={i} className="esqueleto gestion-lista__esqueleto" />)}
      </div>
    );
  } else if (gastos === false) {
    cuerpo = (
      <div className="gestion-vacio">
        <p className="gestion-vacio__texto">No pudimos cargar los gastos.</p>
        <button type="button" className="boton" onClick={cargar}><RefreshCw aria-hidden="true" /> Reintentar</button>
      </div>
    );
  } else if (!lista.length) {
    cuerpo = <p className="historial__vacio">No hay gastos registrados {SIN_GASTOS[periodo]}.</p>;
  } else {
    cuerpo = (
      <>
        <CategoriasGasto filas={porCategoria} total={total} />
        <ul className="gastos__lista" aria-label="Gastos del periodo">
          {lista.map((g) => <GastoFila key={g._id} gasto={g} onEliminado={cargar} />)}
        </ul>
      </>
    );
  }

  return (
    <Layout userName={safeStr(userName)} storeInfo={safeObj(storeInfo)}>
      <main className="gestion gestion--lista">
        <GestionHero id="gastos" titulo="Gastos" descripcion="Anota lo que sale de la caja: arriendo, reparaciones, mercancía… Así sabes en qué se va la plata." />

        <div className="gestion__cuerpo">
          <section className="tarjeta gestion-formulario" aria-labelledby="gasto-accion">
            <header className="tarjeta__titulos">
              <h2 id="gasto-accion" className="tarjeta__titulo">Registrar gasto</h2>
              <p className="tarjeta__ayuda">Los campos con <span className="gestion-form__requerido">*</span> son obligatorios.</p>
            </header>

            <div role="alert" className="gestion-formulario__avisos">
              {error && <p className="aviso aviso--error"><AlertCircle aria-hidden="true" /> {error}</p>}
            </div>
            <div role="status" className="gestion-formulario__avisos">
              {exito && <p className="aviso aviso--ok"><CheckCircle2 aria-hidden="true" /> {exito}</p>}
            </div>

            <form onSubmit={enviar} className="gestion-form">
              <div className="gestion-form__campos">
                <div className="gestion-form__campo">
                  <label htmlFor="gasto-descripcion" className="gestion-form__etiqueta">Descripción<span className="gestion-form__requerido" aria-hidden="true"> *</span></label>
                  <input id="gasto-descripcion" name="descripcion" value={form.descripcion} onChange={cambiar} required maxLength={100} className="gestion-form__input" placeholder="Ej. Recibo de la luz" />
                </div>
                <div className="gestion-form__campo">
                  <label htmlFor="gasto-categoria" className="gestion-form__etiqueta">Categoría<span className="gestion-form__requerido" aria-hidden="true"> *</span></label>
                  <select id="gasto-categoria" name="categoria" value={form.categoria} onChange={cambiar} required className="gestion-form__input" aria-describedby="gasto-categoria-ayuda">
                    <option value="">Seleccionar…</option>
                    {categorias.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <p id="gasto-categoria-ayuda" className="gestion-form__ayuda">{AYUDA_CATEGORIA[form.categoria] || " "}</p>
                </div>
                <div className="gestion-form__campo">
                  <label htmlFor="gasto-monto" className="gestion-form__etiqueta">Monto<span className="gestion-form__requerido" aria-hidden="true"> *</span></label>
                  <input id="gasto-monto" name="monto" type="number" min="1" step="any" inputMode="decimal" value={form.monto} onChange={cambiar} required className="gestion-form__input" placeholder="Ej. 45000" />
                </div>
                <div className="gestion-form__campo">
                  <label htmlFor="gasto-dia" className="gestion-form__etiqueta">Fecha<span className="gestion-form__requerido" aria-hidden="true"> *</span></label>
                  <input id="gasto-dia" name="dia" type="date" max={hoy()} value={form.dia} onChange={cambiar} required className="gestion-form__input" />
                </div>
              </div>
              <div className="gestion-form__pie">
                <button type="submit" disabled={guardando} aria-busy={guardando} className="boton boton--primario gestion-form__enviar">
                  {guardando ? (<><span className="boton__girando" aria-hidden="true" /> Guardando…</>) : "Registrar gasto"}
                </button>
              </div>
            </form>
          </section>

          <section className="tarjeta historial" aria-labelledby="gastos-titulo">
            <header className="tarjeta__titulos">
              <h2 id="gastos-titulo" className="tarjeta__titulo">Gastos registrados</h2>
              <p className="tarjeta__ayuda" aria-live="polite">
                {Array.isArray(gastos) ? `${entero(lista.length)} ${lista.length === 1 ? "gasto" : "gastos"} · ${pesos(total)}` : " "}
              </p>
            </header>
            <div className="segmentos" role="group" aria-label="Periodo de los gastos">
              {PERIODOS.map((p) => (
                <button key={p.valor} type="button" className="segmentos__opcion" aria-pressed={periodo === p.valor} onClick={() => setPeriodo(p.valor)}>
                  {p.texto}
                </button>
              ))}
            </div>
            {cuerpo}
          </section>
        </div>
      </main>
    </Layout>
  );
};

Expenses.propTypes = {
  userName: PropTypes.string,
  storeInfo: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
};

const GastoFila = ({ gasto, onEliminado }) => {
  const [confirmando, setConfirmando] = useState(false);
  const [borrando, setBorrando] = useState(false);
  const [error, setError] = useState("");

  const borrar = async () => {
    setBorrando(true);
    setError("");
    try {
      await api.delete(`/eliminar-gasto/${gasto._id}`);
      onEliminado();
    } catch (err) {
      setError(err.message || "No se pudo borrar el gasto.");
      setBorrando(false);
      setConfirmando(false);
    }
  };

  return (
    <li className="gasto-fila">
      <span className="gasto-fila__textos">
        <span className="gasto-fila__descripcion">{gasto.descripcion}</span>
        <span className="gasto-fila__dato">{diaCorto(gasto.dia)} · {gasto.categoria}</span>
      </span>
      <span className="gasto-fila__monto">{pesos(gasto.monto)}</span>
      {confirmando ? (
        <span className="gasto-fila__confirmar">
          <button type="button" className="boton" onClick={() => setConfirmando(false)} disabled={borrando}>No</button>
          <button type="button" className="boton boton--peligro-lleno" onClick={borrar} disabled={borrando} aria-busy={borrando}>
            {borrando ? <span className="boton__girando" aria-hidden="true" /> : null} Borrar
          </button>
        </span>
      ) : (
        <button type="button" className="gasto-fila__borrar" onClick={() => setConfirmando(true)} aria-label={`Borrar el gasto ${gasto.descripcion}`}>
          <Trash2 aria-hidden="true" />
        </button>
      )}
      {error && <p className="aviso aviso--error gasto-fila__error" role="alert"><AlertCircle aria-hidden="true" /> {error}</p>}
    </li>
  );
};

GastoFila.propTypes = {
  gasto: PropTypes.object.isRequired,
  onEliminado: PropTypes.func.isRequired,
};

export default Expenses;
