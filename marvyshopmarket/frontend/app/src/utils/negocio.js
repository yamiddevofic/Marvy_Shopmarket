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
