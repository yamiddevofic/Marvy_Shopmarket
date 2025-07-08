# ── Dev Stage ──────────────────────────────────────────────────────────
FROM node:18-alpine

# 1️⃣ Directorio de trabajo dentro del contenedor
WORKDIR /app

# 2️⃣ Copiamos SOLO los manifests para aprovechar la caché de Docker
COPY app/package*.json ./

# 3️⃣ Instalamos las dependencias
RUN npm install

# 4️⃣ Copiamos el resto del código (React + Vite)
COPY app/. .

# 5️⃣ Puerto por defecto del servidor Vite
EXPOSE 5173

# 6️⃣ Arrancamos Vite con HMR accesible desde el host
CMD ["npm", "run", "dev", "--", "--host"]
