import { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Link, useLocation } from "react-router-dom";
import { Archive, Boxes, PackageX, Plus, RefreshCw, TriangleAlert, User } from "lucide-react";
import Layout from "../Layout/Layout";
import GestionHero from "../components/Panel/GestionHero";
import ParentComponent from "../components/ParentComponent";
import PlaceholderComponent from "../components/PlaceholderComponent";
import { api } from "../services/api";
import { STOCK_BAJO, entero } from "../utils/negocio";

const POR_PAGINA = 8;
const FILTROS = ["todos", "bajo", "agotado"];

const safeObj = (obj) => (obj && typeof obj === "object" && Object.keys(obj).length > 0 ? obj : null);
const safeStr = (str) => (typeof str === "string" && str.trim().length > 0 ? str : null);

// Inventario: cuántos productos hay, cuáles se están agotando, y editar o borrar cada uno.
// Agregar productos o reponer existencias se hace en Productos.
const Stock = ({ userName, storeInfo }) => {
  const location = useLocation();
  // undefined = cargando, false = falló, arreglo = listo
  const [productos, setProductos] = useState(undefined);
  const [filtro, setFiltro] = useState(FILTROS.includes(location.state?.filtro) ? location.state.filtro : "todos");
  const [currentPage, setCurrentPage] = useState(1);

  const cargar = useCallback(() => {
    setProductos(undefined);
    api.get("/listar-productos")
      .then((data) => setProductos(Array.isArray(data) ? data : []))
      .catch(() => setProductos(false));
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const elegirFiltro = (valor) => {
    setFiltro(valor);
    setCurrentPage(1);
  };

  const lista = Array.isArray(productos) ? productos : [];
  const unidades = lista.reduce((total, p) => total + (Number(p.stock) || 0), 0);
  const porAgotarse = lista.filter((p) => Number(p.stock) <= STOCK_BAJO).length;
  const agotados = lista.filter((p) => Number(p.stock) <= 0).length;

  const resumen = [
    { valor: "todos", etiqueta: "Productos", cifra: lista.length, nota: `${entero(unidades)} unidades en total`, Icono: Boxes },
    { valor: "bajo", etiqueta: "Por agotarse", cifra: porAgotarse, nota: `${STOCK_BAJO} unidades o menos`, Icono: TriangleAlert, tono: porAgotarse ? "alerta" : null },
    { valor: "agotado", etiqueta: "Agotados", cifra: agotados, nota: "Sin unidades", Icono: PackageX, tono: agotados ? "error" : null },
  ];

  let cuerpo;
  if (productos === undefined) {
    cuerpo = (
      <div className="gestion-lista" aria-busy="true" aria-label="Cargando inventario">
        <span className="esqueleto gestion-lista__esqueleto gestion-lista__esqueleto--titulo" />
        {[0, 1, 2, 3].map((i) => <span key={i} className="esqueleto gestion-lista__esqueleto" />)}
      </div>
    );
  } else if (productos === false) {
    cuerpo = (
      <div className="gestion-vacio">
        <h2 className="gestion-vacio__titulo">No pudimos cargar el inventario</h2>
        <button type="button" className="boton" onClick={cargar}>
          <RefreshCw aria-hidden="true" /> Reintentar
        </button>
      </div>
    );
  } else if (!lista.length) {
    cuerpo = <PlaceholderComponent id="stock" Archive={Archive} />;
  } else {
    cuerpo = (
      <ParentComponent
        typeId="stock"
        m={productos}
        filtro={filtro}
        onCambio={setProductos}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        goToNextPage={() => setCurrentPage((p) => p + 1)}
        goToPrevPage={() => setCurrentPage((p) => Math.max(1, p - 1))}
        goToPage={setCurrentPage}
        itemsPerPage={POR_PAGINA}
        User={User}
      />
    );
  }

  return (
    <Layout userName={safeStr(userName)} storeInfo={safeObj(storeInfo)}>
      <main className="gestion">
        <GestionHero id="stock" titulo="Inventario" descripcion="Revisa cuántos productos tienes, cuáles se están agotando y corrige o borra los que necesites." />

        <section className="tarjeta inventario-resumen" aria-label="Resumen del inventario">
          <div className="inventario-resumen__filtros" role="group" aria-label="Filtrar inventario">
            {resumen.map(({ valor, etiqueta, cifra, nota, Icono, tono }) => (
              <button
                key={valor}
                type="button"
                className={`inventario-filtro${tono ? ` inventario-filtro--${tono}` : ""}`}
                aria-pressed={filtro === valor}
                onClick={() => elegirFiltro(valor)}
                disabled={!Array.isArray(productos)}
              >
                <span className="inventario-filtro__etiqueta">
                  <Icono aria-hidden="true" /> {etiqueta}
                </span>
                <span className="inventario-filtro__cifra">
                  {Array.isArray(productos) ? entero(cifra) : <span className="esqueleto inventario-filtro__esqueleto" aria-label="Cargando" />}
                </span>
                <span className="inventario-filtro__nota">{nota}</span>
              </button>
            ))}
          </div>
          <Link to="/productos" className="boton boton--primario inventario-resumen__agregar">
            <Plus aria-hidden="true" /> Agregar o reponer
          </Link>
        </section>

        <section className="tarjeta gestion-tarjeta--lista" aria-label="Productos del inventario">
          {cuerpo}
        </section>
      </main>
    </Layout>
  );
};

Stock.propTypes = {
  userName: PropTypes.string,
  storeInfo: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
};

export default Stock;
