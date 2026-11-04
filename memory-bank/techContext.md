# Contexto técnico

## Stack

- Frontend: React 19, TypeScript 6, Vite 8, Tailwind CSS 4 y Recharts. El contenedor usa Node 24 Alpine.
- Backend: Python 3.13, FastAPI, Pydantic y Uvicorn. El contenedor usa `debugpy`.
- Dependencias y scripts del frontend: `frontend/package.json`. Dependencias del backend: `backend/requirements.txt`.

## Estructura

- `frontend/src/`: aplicación, componentes y utilidades.
- `frontend/src/lib/`: tipos y cálculos financieros.
- `backend/app/`: aplicación FastAPI y rutas.
- Pruebas: `frontend/src/lib/financial-utils.test.ts` y `backend/tests/test_routes.py`.

## Comandos

- Desde la raíz: `docker compose up --build` (documentado en `README.es.md`).
- Desde `frontend/`: `npm run dev`, `npm run build`, `npm run lint`, `npm test`, `npm run test:watch`, `npm run test:coverage` y `npm run preview` (declarados en `frontend/package.json`).
- El contenedor backend arranca Uvicorn mediante `debugpy` en el puerto 8000 (`backend/Dockerfile`). No hay un comando para ejecutar pytest documentado en el repositorio.

## Comunicación frontend-backend

- Docker Compose define los servicios `frontend` y `backend`; el frontend depende del backend y expone el puerto 5173. El backend expone los puertos 8000 y 5678 (`docker-compose.yml`).
- Vite redirige las solicitudes `/api` a `http://backend:8000` (`frontend/vite.config.ts`).
- La pantalla principal consulta `/api/metrics`; `VITE_API_BASE_URL` permite anteponer una URL base (`frontend/src/App.tsx`).
- FastAPI registra el router y configura CORS (`backend/app/main.py`). El modelo del movimiento está definido en backend y representado por tipos TypeScript en frontend (`backend/app/routes.py`, `frontend/src/lib/financial-types.ts`).