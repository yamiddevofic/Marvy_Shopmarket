// Tema claro/oscuro compartido por toda la app.
// La clase `dark` en <html> activa tanto las variantes `dark:` de Tailwind
// como los tokens oscuros de src/styles/tokens.css.
const CLAVE = 'theme';
const COLOR_BARRA = { light: '#f1f7f3', dark: '#0b1611' };

export function leerTema() {
  try {
    const guardado = localStorage.getItem(CLAVE);
    if (guardado === 'light' || guardado === 'dark') return guardado;
  } catch {
    // almacenamiento bloqueado (modo privado): se usa la preferencia del sistema
  }
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function aplicarTema(tema) {
  const root = document.documentElement;
  root.classList.toggle('dark', tema === 'dark');
  root.classList.toggle('light', tema !== 'dark');
  root.style.colorScheme = tema === 'dark' ? 'dark' : 'light';
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', COLOR_BARRA[tema] || COLOR_BARRA.light);
}

export function guardarTema(tema) {
  aplicarTema(tema);
  try {
    localStorage.setItem(CLAVE, tema);
  } catch {
    // sin persistencia: el tema sigue aplicado durante la sesión
  }
}

// Se llama antes del primer render para evitar un destello claro al cargar en oscuro.
export function aplicarTemaInicial() {
  aplicarTema(leerTema());
}
