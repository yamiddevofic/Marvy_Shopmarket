// Reglas y formatos del negocio compartidos por el panel.

// Un producto con esta cantidad o menos se considera "por reponer".
export const STOCK_BAJO = 5;

const PESOS = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });
const ENTERO = new Intl.NumberFormat('es-CO');

export const pesos = (valor) => (Number.isFinite(Number(valor)) && valor !== null && valor !== '' ? PESOS.format(Number(valor)) : '—');
export const entero = (valor) => ENTERO.format(valor);

// Estado del stock como texto + tono: el color nunca va solo.
export const estadoStock = (stock) => {
  const n = Number(stock);
  if (!Number.isFinite(n)) return null;
  if (n <= 0) return { texto: 'Agotado', tono: 'error' };
  if (n <= STOCK_BAJO) return { texto: 'Bajo', tono: 'alerta' };
  return null;
};

// Métodos de pago que acepta el backend, con su nombre para mostrar.
export const METODOS_PAGO = [
  { valor: 'efectivo', texto: 'Efectivo' },
  { valor: 'transferencia', texto: 'Transferencia' },
  { valor: 'tarjeta', texto: 'Tarjeta' },
  { valor: 'fiado', texto: 'Fiado' },
];
export const textoMetodo = (valor) => METODOS_PAGO.find((m) => m.valor === valor)?.texto || valor;

// Periodos de consulta que entiende el backend (?periodo=…); "todas" no filtra.
export const PERIODOS = [
  { valor: 'hoy', texto: 'Hoy' },
  { valor: 'semana', texto: '7 días' },
  { valor: 'mes', texto: 'Este mes' },
];

// Fechas que llegan como "YYYY-MM-DD" o ISO con zona: se muestran sin reinterpretar la zona.
export const diaCorto = (dia) => {
  const [a, m, d] = String(dia).slice(0, 10).split('-').map(Number);
  const texto = new Date(a, m - 1, d).toLocaleDateString('es-CO', { weekday: 'short', day: 'numeric', month: 'short' });
  return texto.charAt(0).toUpperCase() + texto.slice(1);
};
export const horaDe = (fechaIso) => {
  const [h, min] = String(fechaIso).slice(11, 16).split(':').map(Number);
  return new Date(2000, 0, 1, h, min).toLocaleTimeString('es-CO', { hour: 'numeric', minute: '2-digit' });
};

const COMPACTO = new Intl.NumberFormat('es-CO', { notation: 'compact', maximumFractionDigits: 1 });
export const pesosCorto = (valor) => `$${COMPACTO.format(valor)}`;
