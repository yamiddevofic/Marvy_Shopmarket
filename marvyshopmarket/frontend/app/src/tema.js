// Tema claro/oscuro compartido por toda la app.
// La clase `dark` en <html> activa tanto las variantes `dark:` de Tailwind
// como los tokens oscuros de src/styles/tokens.css.
//
// Por defecto el tema sigue la hora: oscuro de noche y claro de día. Si la
// persona lo cambia a mano, esa elección vale solo hasta el siguiente cambio
// de día a noche (o al revés); después vuelve a ser automático.
const CLAVE = 'theme-manual';
const COLOR_BARRA = { light: '#f1f7f3', dark: '#0b1611' };
const AMANECER = 6; // 6:00
const ANOCHECER = 19; // 19:00, igual que el saludo «Buenas noches» del inicio
export const EVENTO_TEMA = 'tema-cambio';

const esNoche = (fecha) => fecha.getHours() >= ANOCHECER || fecha.getHours() < AMANECER;

// Identifica el tramo actual (un día o una noche concreta); la noche que
// cruza la medianoche pertenece a la fecha en que empezó.
function periodoActual(fecha = new Date()) {
  const inicio = new Date(fecha);
  if (fecha.getHours() < AMANECER) inicio.setDate(inicio.getDate() - 1);
  const dia = `${inicio.getFullYear()}-${inicio.getMonth() + 1}-${inicio.getDate()}`;
  return `${dia}-${esNoche(fecha) ? 'noche' : 'dia'}`;
}

export const temaSegunHora = (fecha = new Date()) => (esNoche(fecha) ? 'dark' : 'light');

export function leerTema() {
  try {
    const manual = JSON.parse(localStorage.getItem(CLAVE));
    if (manual?.periodo === periodoActual() && (manual.tema === 'light' || manual.tema === 'dark')) {
      return manual.tema;
    }
  } catch {
    // almacenamiento bloqueado o valor inválido: se usa la hora
  }
  return temaSegunHora();
}

export function aplicarTema(tema) {
  const root = document.documentElement;
  root.classList.toggle('dark', tema === 'dark');
  root.classList.toggle('light', tema !== 'dark');
  root.style.colorScheme = tema === 'dark' ? 'dark' : 'light';
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', COLOR_BARRA[tema] || COLOR_BARRA.light);
  window.dispatchEvent(new CustomEvent(EVENTO_TEMA, { detail: tema }));
}

export function guardarTema(tema) {
  aplicarTema(tema);
  try {
    localStorage.setItem(CLAVE, JSON.stringify({ tema, periodo: periodoActual() }));
  } catch {
    // sin persistencia: el tema sigue aplicado durante la sesión
  }
}

// Se llama antes del primer render para evitar un destello claro al cargar en oscuro.
// Luego revisa cada minuto: al amanecer o anochecer el tema cambia solo.
export function aplicarTemaInicial() {
  let actual = leerTema();
  aplicarTema(actual);
  setInterval(() => {
    const siguiente = leerTema();
    if (siguiente !== actual) {
      actual = siguiente;
      aplicarTema(siguiente);
    }
  }, 60 * 1000);
}
