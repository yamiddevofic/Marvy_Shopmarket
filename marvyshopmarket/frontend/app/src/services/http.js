// Ejemplo con fetch
export async function getInfo() {
    return fetch('/api/consultar-info', {
      method: 'GET',
      credentials: 'include',      // 🔑   <<<<<<   OBLIGATORIO
      headers: { 'Content-Type': 'application/json' }
    }).then(r => {
      if (!r.ok) throw new Error('No autorizado');
      return r.json();
    });
  }
  