import { useEffect, useState } from 'react';

// Cuenta de 0 a `objetivo` en `duracion` ms tras `retraso` ms.
// Con prefers-reduced-motion devuelve el valor final desde el principio.
export default function useContador(objetivo, { duracion = 1200, retraso = 0 } = {}) {
  const sinMovimiento = typeof window !== 'undefined'
    && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const [valor, setValor] = useState(sinMovimiento ? objetivo : 0);

  useEffect(() => {
    if (sinMovimiento) return undefined;
    let frame;
    let inicio;
    const temporizador = setTimeout(() => {
      const paso = (t) => {
        inicio ??= t;
        const progreso = Math.min((t - inicio) / duracion, 1);
        const suavizado = 1 - (1 - progreso) ** 3;
        setValor(Math.round(objetivo * suavizado));
        if (progreso < 1) frame = requestAnimationFrame(paso);
      };
      frame = requestAnimationFrame(paso);
    }, retraso);
    return () => {
      clearTimeout(temporizador);
      cancelAnimationFrame(frame);
    };
  }, [objetivo, duracion, retraso, sinMovimiento]);

  return valor;
}
