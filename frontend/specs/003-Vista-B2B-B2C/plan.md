## Cambios de backend
- Extender `MetricsFacets`: ahora `/api/metrics/facets` devuelve categorías globales, no separadas por grupo.
- No hace falta cambiar `/api/metrics/categories/top`: ya filtra por operación, grupo y rango de fechas, y permite devolver hasta cinco categorías.

## Cambios de frontend
- Añadir los tipos para las facetas ampliadas y la comparación.
- En `App.tsx`, dar acceso a la nueva vista y pasarle el rango de fechas de la Funcionalidad 1.
- Crear una vista con dos tablas y un gráfico Recharts. Consultar las facetas y los top 5 de ingresos de cada grupo; calcular los porcentajes sobre el total del grupo.

## Archivos afectados
- `backend/app/routes.py`
- `backend/tests/test_routes.py`
- `frontend/src/App.tsx`
- `frontend/src/lib/financial-types.ts`
- `frontend/specs/api-types.ts`
- Nuevo `frontend/src/components/dashboard/business-comparison-view.tsx`

## Orden recomendado
1. Ampliar facetas para informar categorías por grupo y actualizar su prueba.
2. Añadir tipos de frontend para la respuesta y comparación.
3. Crear la vista y conectarla a las consultas con el rango activo.
4. Añadir el acceso a la vista desde `App.tsx`.

## Verificación básica
Ejecutar `pytest backend/tests/test_routes.py`, `npm test` y `npm run build`. Comprobar ambas tablas, los porcentajes por grupo, el total comparado y que el rango afecte tablas y gráfico.
