# Marvy Shopmarket 🛒

> **Gestión integral para tiendas de barrio – backend Flask + frontend React / Vite, todo orquestado con Docker Compose.**

---

## Índice

1. [Descripción](#descripción-del-proyecto-)
2. [Demo & capturas](#capturas-de-pantalla-)
3. [Arquitectura](#arquitectura-)
4. [Guía rápida (Docker Compose)](#guía-rápida-)
5. [Instalación manual](#instalación-clásica-)
6. [Scripts útiles](#scripts-útiles-)
7. [Contribuciones](#contribuciones-)
8. [Licencia y contacto](#licencia-)

---

## Descripción del proyecto 📝

**Marvy Shopmarket** es una solución web que permite a los tenderos llevar el control de:

| Módulo      | ¿Qué resuelve?                                 |
| ----------- | ---------------------------------------------- |
| Ventas      | Registro y análisis de ventas diarias.         |
| Inventario  | Altas, bajas y ajustes de stock.               |
| Proveedores | Catálogo y seguimiento de entregas.            |
| Gastos      | Histórico de egresos operativos.               |
| Seguridad   | Autenticación para administradores y tenderos. |
| UX          | Tema claro/oscuro con React + Tailwind.        |

---

## Capturas de pantalla 📸

|                                                   |                                                        |                                                        |
| :-----------------------------------------------: | :----------------------------------------------------: | :----------------------------------------------------: |
| ![Login](https://i.postimg.cc/pTh6cKpR/login.png) | ![Home claro](https://i.postimg.cc/2yqrwqfZ/home2.png) | ![Home oscuro](https://i.postimg.cc/3wKsJyWH/home.png) |
|                      *Login*                      |                   *Inicio modo claro*                  |                  *Inicio modo oscuro*                  |

---

## Arquitectura 🔧

| Capa           | Tech Stack                                    | Detalles clave                                         |
| -------------- | --------------------------------------------- | ------------------------------------------------------ |
| **Frontend**   | React + Vite + Tailwind CSS                   | Hot-reload con Docker bind-mount y polling.            |
| **Backend**    | Flask 3 + SQLAlchemy + Gunicorn               | API REST en `/api/*`, CORS configurable por entorno.   |
| **BD**         | MySQL 8 (Hostinger) + MongoDB Atlas           | MySQL: tiendas/usuarios. MongoDB: productos.           |
| **Infra dev**  | Docker Compose                                | Servicios `frontend` y `backend` en misma red interna. |
| **Infra prod** | Multi-stage build ⇒ Nginx (static) + Gunicorn | Listo para CI/CD.                                      |

```
┌───────────┐      http://localhost:5173
│  React    │  ←────────────────────────  Navegador
│  Vite HMR │          fetch /api/*
└─────▲─────┘
      │ internal DNS (backend:5000)
┌─────┴─────┐
│   Flask   │
│ Gunicorn  │──► MySQL (srv1534.hstgr.io)
└───────────┘
```

---

## Guía rápida 🚀

### 1. Pre-requisitos

* Docker Desktop (v4.x) con Compose v2 activado.
* Archivo `backend/.env` con credenciales (copia `backend/.env.example`):

```env
SECRET_KEY=🎲cámbiame!
SQLALCHEMY_DATABASE_URI=mysql+mysqldb://usuario:clave@srv1534.hstgr.io/bd?charset=utf8mb4
MONGO_URI=mongodb+srv://usuario:clave@cluster.mongodb.net/tienda
```

La app no arranca si faltan `SECRET_KEY` o `SQLALCHEMY_DATABASE_URI`. Sin `MONGO_URI` los endpoints de productos responden 503.

### 2. Levantar todo

```bash
git clone https://github.com/yamid-dev/marvy-shopmarket.git
cd marvy-shopmarket
docker compose up --build
```

| Servicio | URL en host                                                      |
| -------- | ---------------------------------------------------------------- |
| Frontend | [http://localhost:5173](http://localhost:5173)                   |
| Backend  | [http://localhost:5000/api/ping](http://localhost:5000/api/ping) |

Cambios en `frontend/app` o `backend/app` se recargan sin rebuild.

---

## Instalación clásica 🛠️

> Úsala solo si prefieres **sin Docker**.

```bash
# Backend
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
python run.py           # http://127.0.0.1:3333

# Frontend
cd ../frontend/app
npm install
npm run dev -- --host    # http://localhost:5173
```

Configura `VITE_API_URL` en `frontend/app/.env.local` si tu backend corre en otro puerto.

---

## Estructura del backend 🧱

```
backend/app/
├── __init__.py      # create_app(): config, extensiones, CORS, blueprints, errores
├── config.py        # Development / Production / Testing (secretos solo por entorno)
├── extensions.py    # db, bcrypt, migrate, mongo
├── auth.py          # sesión y decorador login_required(rol)
├── errors.py        # APIError + manejadores JSON globales
├── models.py        # modelos SQLAlchemy
├── services/        # lógica de negocio (auth, tienda, tendero, producto)
└── routes/          # blueprints HTTP delgados, uno por dominio
```

Todas las operaciones sobre tenderos y productos se limitan a la tienda de la sesión.
En el frontend, todas las llamadas pasan por `src/services/api.js` (envía la cookie de sesión).

## Demo local sin bases de datos 🧪

Para probar la app en tu máquina sin MySQL, MongoDB ni `.env` (Python 3.10+ y Node 18+):

```bash
cd marvyshopmarket
./run-demo.sh          # Linux / macOS (en Windows usa Git Bash o WSL)
```

Abre http://127.0.0.1:5173 e inicia sesión con cédula `12345678` y contraseña `clave123`.
Usa SQLite (`backend/dev.db`) y un MongoDB simulado con productos de ejemplo. Ctrl+C detiene todo.
Solo para desarrollo: no uses esta configuración en producción.

## Pruebas ✅

```bash
cd backend
pip install -r requirements-dev.txt   # no requiere MySQL ni MongoDB (usa SQLite y mongomock)
python -m pytest
```

---

## Scripts útiles 💡

| Acción                 | Comando                                             |
| ---------------------- | --------------------------------------------------- |
| Reconstruir imágenes   | `docker compose build`                              |
| Ver logs live          | `docker compose logs -f frontend backend`           |
| Limpiar todo           | `docker compose down -v --remove-orphans`           |
| Generar build estático | `npm run build` → artefactos en `frontend/app/dist` |

---

## Contribuciones 👥

1. **Fork** del repo
2. `git checkout -b feature/miFuncionalidad`
3. `git commit -m "feat: miFuncionalidad"`
4. `git push origin feature/miFuncionalidad`
5. Abre un **Pull Request** – ¡serás bienvenido!

---

## Licencia 📄

Distribuido bajo licencia [MIT](https://github.com/yamid-dev/Marvy_Shopmarket/blob/main/licencia.md).

## Contacto 📧

Cualquier duda o sugerencia: [yhrodriguez1@hotmail.com](mailto:yhrodriguez1@hotmail.com)

¡Gracias por aportar a **Marvy Shopmarket** y ayudar a las tiendas de barrio a digitalizarse! 🚀
