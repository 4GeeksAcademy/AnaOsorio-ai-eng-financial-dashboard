# AGENTS.md

## Proyecto

Panel de métricas financieras con datos simulados, frontend React y backend FastAPI.

## Stack y estructura

- Frontend: React 19, TypeScript 6, Vite 8, Tailwind CSS 4 y Recharts.
- Backend: Python 3.13, FastAPI y Pydantic.
- `frontend/src/`: interfaz, componentes y utilidades; `backend/app/`: API; cada lado tiene pruebas.
- Docker Compose define los servicios `frontend` y `backend`. Vite dirige `/api` al backend en el puerto 8000.

## Comandos

- Desde la raíz: `docker compose up --build` (documentado en el README).
- Desde `frontend/`: `npm run dev`, `npm run build`, `npm run lint`, `npm test`, `npm run test:watch`, `npm run test:coverage` y `npm run preview` (scripts declarados en `package.json`).
- Hay pruebas de backend y dependencia `pytest`, pero no se documenta aquí un comando para ejecutarlas.

## Convenciones

- Los modelos Pydantic y tipos `Literal` de la API definen el contrato; los tipos del frontend están en `src/lib/financial-types.ts`.
- Los cálculos del frontend están separados en `src/lib/financial-utils.ts` y tienen pruebas propias.
- Si cambia el contrato, revisa los consumidores y pruebas de backend y frontend.

## Reglas de dominio

- Tipos admitidos: operaciones `income`/`outcome`; negocio `B2B`/`B2C`; agrupación `day`/`week`/`month`. Las categorías están definidas en `backend/app/routes.py`.
- La API genera movimientos simulados de forma reproducible con semilla `42`; las fechas dependen de la fecha actual.
- El frontend calcula beneficio como ingresos menos egresos y margen como beneficio dividido por ingresos. La definición financiera esperada no está confirmada en la documentación revisada.

## Forma de trabajar

- Antes de trabajar, revisa las instrucciones en `.agents/rules`, las skills en `.agents/skills` y los documentos relevantes de `memory-bank/`, incluidos `product.md` y `techContext.md`.
- Antes de trabajar en frontend, lee `.agents/rules/frontend.md`; antes de trabajar en backend, lee `.agents/rules/backend.md`.
- Después de cada nueva implementación o cambio importante en el código, actualiza los documentos pertinentes de `memory-bank/` para que reflejen el estado actual verificado del proyecto. Distingue los hechos de las suposiciones.
- Elige pruebas relacionadas con el comportamiento modificado. Las suites existentes son `backend/tests/test_routes.py` y `frontend/src/lib/financial-utils.test.ts`.

## Límites y verificación

- El encabezado muestra un periodo fijo de 2024 aunque las fechas simuladas se calculan respecto al mes actual.
- El agrupamiento mensual del frontend usa fechas locales; los cambios de fecha deben considerar la zona horaria.
- La interfaz principal solicita `/api/metrics`; no se verificó aquí la integración de las demás rutas. La respuesta JSON tampoco tiene validación explícita en ejecución.
- Las pruebas existentes cubren rutas y utilidades, pero no hay un criterio documentado que permita afirmar que la cobertura sea suficiente. Los comandos anteriores están declarados, no implican que se hayan ejecutado.
