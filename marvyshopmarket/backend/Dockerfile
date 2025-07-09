FROM python:3.13

# ── dependencias nativas ─────────────────────────
RUN apt-get update && apt-get install -y \
    build-essential default-libmysqlclient-dev gcc pkg-config python3-dev \
    && rm -rf /var/lib/apt/lists/*

# ── carpeta de trabajo (raíz del proyecto dentro de la imagen) ──
WORKDIR /app

# ── requirements ──
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# ── código de tu aplicación ──
COPY app ./app
COPY migrations ./migrations

# ── comando de arranque ──
#  - $PORT lo inyecta Render automáticamente.
#  - usamos `sh -c` para que bash expanda la variable en la forma exec JSON.
CMD ["sh", "-c", "exec gunicorn -w 4 -b 0.0.0.0:${PORT:-5000} 'app:create_app()'"]
