#!/usr/bin/env bash
# Levanta backend (Flask, datos de demo) y frontend (Vite) en tu máquina.
# Requisitos: Python 3.10+ y Node 18+.  Uso:  ./run-demo.sh
set -e
cd "$(dirname "$0")"
PYTHON="${PYTHON:-python3}"

if [ ! -d backend/.venv ]; then
  "$PYTHON" -m venv backend/.venv
fi
backend/.venv/bin/pip install -q -r backend/requirements-dev.txt

if [ ! -d frontend/app/node_modules ]; then
  (cd frontend/app && npm install --no-audit --no-fund)
fi

trap 'kill 0' EXIT INT TERM

(cd backend && .venv/bin/python dev_server.py) &
(cd frontend/app && VITE_API_URL= npx vite --host 127.0.0.1) &

echo
echo "  Abre http://127.0.0.1:5173"
echo "  Cédula 12345678  ·  Contraseña clave123"
echo "  Ctrl+C para detener todo"
echo
wait
