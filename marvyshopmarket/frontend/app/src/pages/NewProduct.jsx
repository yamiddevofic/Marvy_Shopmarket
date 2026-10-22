import { useCallback, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { AlertCircle, ArrowRight, CheckCircle2, PencilLine, X } from "lucide-react";
import Layout from "../Layout/Layout";
import GestionHero from "../components/Panel/GestionHero";
import { api } from "../services/api";
import { entero, pesos } from "../utils/negocio";

const VACIO = { nombre: "", categoria: "", precio: "", stock: "" };

const safeObj = (obj) => (obj && typeof obj === "object" && Object.keys(obj).length > 0 ? obj : null);
const safeStr = (str) => (typeof str === "string" && str.trim().length > 0 ? str : null);

// Compara nombres sin importar mayúsculas, tildes ni espacios sobrantes
const normalizar = (texto) => String(texto ?? "").normalize("NFD").replace(/[̀-ͯ]/g, "").trim().replace(/\s+/g, " ").toLowerCase();

const hoy = () => new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD en hora local

const datosDe = (producto) => ({
  nombre: producto.nombre ?? "",
  categoria: producto.categoria ?? "",
  precio: producto.precio ?? "",
  stock: producto.stock ?? "",
});

// Productos: agregar uno nuevo o actualizar uno existente.
// Al escribir el nombre de un producto que ya existe, el formulario se llena
// con su información y pasa a modo "actualizar".
const NewProduct = ({ userName, storeInfo }) => {
  const [productos, setProductos] = useState([]);
  const [form, setForm] = useState(VACIO);
  const [existente, setExistente] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const [exito, setExito] = useState("");
  const nombreRef = useRef(null);

  const cargar = useCallback(() => {
    api.get("/listar-productos")
      .then((data) => setProductos(Array.isArray(data) ? data : []))
      .catch(() => setError("No pudimos cargar los productos existentes: solo podrás registrar nuevos."));
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  useEffect(() => {
    if (!exito) return undefined;
    const t = setTimeout(() => setExito(""), 5000);
    return () => clearTimeout(t);
  }, [exito]);

  const categorias = [...new Set(productos.map((p) => p.categoria).filter(Boolean))].sort((a, b) => a.localeCompare(b));

  const cambiarNombre = (valor) => {
    const coincidencia = productos.find((p) => normalizar(p.nombre) === normalizar(valor));
    if (coincidencia && coincidencia._id !== existente?._id) {
      // Autocompletar con la información del producto existente
      setExistente(coincidencia);
      setForm({ ...datosDe(coincidencia), nombre: valor });
    } else if (!coincidencia && existente) {
      // Dejó de coincidir: los datos eran del otro producto, se limpian
      setExistente(null);
      setForm({ ...VACIO, nombre: valor });
    } else {
      setForm((prev) => ({ ...prev, nombre: valor }));
    }
  };

  const cambiar = (e) => {
    const { name, value } = e.target;
    if (name === "nombre") cambiarNombre(value);
    else setForm((prev) => ({ ...prev, [name]: value }));
  };

  const limpiar = () => {
    setForm(VACIO);
    setExistente(null);
    setError("");
    nombreRef.current?.focus();
  };

  const enviar = async (e) => {
    e.preventDefault();
    setGuardando(true);
    setError("");
    setExito("");

    // Si solo cambian mayúsculas o tildes, se conserva el nombre como estaba escrito
    const nombre = existente && normalizar(form.nombre) === normalizar(existente.nombre)
      ? existente.nombre
      : form.nombre.trim().replace(/\s+/g, " ");
    const precio = parseFloat(form.precio) || 0;
    const datos = {
      nombre,
      categoria: form.categoria.trim(),
      stock: parseInt(form.stock, 10) || 0,
    };

    try {
      if (existente) {
        // Solo se envía el precio si cambió, para no reescribir su historial
        if (precio !== Number(existente.precio)) datos.precios = [{ fecha: hoy(), precio }];
        await api.patch(`/actualizar-producto/${existente._id}`, datos);
        setExito(`«${nombre}» se actualizó.`);
      } else {
        await api.post("/registrar-producto", { ...datos, precios: [{ fecha: hoy(), precio }] });
        setExito(`«${nombre}» se agregó al inventario.`);
      }
      setForm(VACIO);
      setExistente(null);
      cargar();
    } catch (err) {
      setError(err.message || "No se pudo guardar el producto.");
    } finally {
      setGuardando(false);
    }
  };

  const modo = existente ? "Actualizar producto" : "Agregar producto";

  return (
    <Layout userName={safeStr(userName)} storeInfo={safeObj(storeInfo)}>
      <main className="gestion gestion--simple">
        <GestionHero id="new-product" titulo="Productos" descripcion="Agrega productos nuevos o actualiza el precio y las existencias de los que ya tienes." />

        <section className="tarjeta gestion-formulario" aria-labelledby="producto-accion">
          <header className="tarjeta__cabeza">
            <div className="tarjeta__titulos">
              <h2 id="producto-accion" className="tarjeta__titulo">{modo}</h2>
              <p className="tarjeta__ayuda">Escribe el nombre: si el producto ya existe, se llena con su información.</p>
            </div>
            <Link to="/inventario" className="tarjeta__enlace">
              Ver inventario <ArrowRight aria-hidden="true" />
            </Link>
          </header>

          <div role="alert" className="gestion-formulario__avisos">
            {error && <p className="aviso aviso--error"><AlertCircle aria-hidden="true" /> {error}</p>}
          </div>
          <div role="status" className="gestion-formulario__avisos">
            {exito && <p className="aviso aviso--ok"><CheckCircle2 aria-hidden="true" /> {exito}</p>}
          </div>

          <form onSubmit={enviar} className="gestion-form">
            <div className="gestion-form__campos">
              <div className="gestion-form__campo gestion-form__campo--ancho">
                <label htmlFor="producto-nombre" className="gestion-form__etiqueta">
                  Nombre del producto<span className="gestion-form__requerido" aria-hidden="true"> *</span>
                </label>
                <input
                  ref={nombreRef}
                  id="producto-nombre"
                  name="nombre"
                  list="producto-sugerencias"
                  value={form.nombre}
                  onChange={cambiar}
                  required
                  autoComplete="off"
                  className="gestion-form__input"
                  placeholder="Ej. Arroz Diana 1 kg"
                  aria-describedby={existente ? "producto-existente" : undefined}
                />
                <datalist id="producto-sugerencias">
                  {productos.map((p) => <option key={p._id} value={p.nombre} />)}
                </datalist>
              </div>

              {existente && (
                <div id="producto-existente" className="producto-existente gestion-form__campo--ancho">
                  <PencilLine aria-hidden="true" />
                  <p>
                    <strong>Ya existe.</strong> Hoy tiene {entero(Number(existente.stock) || 0)} und. a {pesos(existente.precio)}. Lo que cambies se guardará en este producto.
                  </p>
                  <button type="button" className="producto-existente__otro" onClick={limpiar}>
                    <X aria-hidden="true" /> Registrar otro
                  </button>
                </div>
              )}

              <div className="gestion-form__campo">
                <label htmlFor="producto-categoria" className="gestion-form__etiqueta">
                  Categoría<span className="gestion-form__requerido" aria-hidden="true"> *</span>
                </label>
                <input id="producto-categoria" name="categoria" list="producto-categorias" value={form.categoria} onChange={cambiar} required className="gestion-form__input" placeholder="Ej. Granos" />
                <datalist id="producto-categorias">
                  {categorias.map((c) => <option key={c} value={c} />)}
                </datalist>
              </div>

              <div className="gestion-form__campo">
                <label htmlFor="producto-precio" className="gestion-form__etiqueta">
                  Precio de venta<span className="gestion-form__requerido" aria-hidden="true"> *</span>
                </label>
                <input id="producto-precio" name="precio" type="number" min="0" step="any" inputMode="decimal" value={form.precio} onChange={cambiar} required className="gestion-form__input" placeholder="Ej. 4800" />
              </div>

              <div className="gestion-form__campo">
                <label htmlFor="producto-stock" className="gestion-form__etiqueta">
                  Unidades en stock<span className="gestion-form__requerido" aria-hidden="true"> *</span>
                </label>
                <input id="producto-stock" name="stock" type="number" min="0" step="1" inputMode="numeric" value={form.stock} onChange={cambiar} required className="gestion-form__input" placeholder="Ej. 24" />
              </div>
            </div>

            <div className="gestion-form__pie">
              {existente && (
                <button type="button" className="boton" onClick={limpiar} disabled={guardando}>Cancelar</button>
              )}
              <button type="submit" disabled={guardando} aria-busy={guardando} className="boton boton--primario gestion-form__enviar">
                {guardando ? (<><span className="boton__girando" aria-hidden="true" /> Guardando…</>) : modo}
              </button>
            </div>
          </form>
        </section>
      </main>
    </Layout>
  );
};

NewProduct.propTypes = {
  userName: PropTypes.string,
  storeInfo: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
};

export default NewProduct;
