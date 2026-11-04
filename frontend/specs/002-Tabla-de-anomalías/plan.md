## Cambios de backend
- Ajustar `detect_outcome_alerts` para calcular la media móvil de los tres períodos anteriores; actualmente promedia todos los períodos previos.
- Limitar `threshold` a `0.01–1.0`; el endpoint ya admite umbral, agrupación y fechas.

## Cambios de frontend
- Añadir el tipo de alerta a los tipos del frontend.
- Consultar alertas con umbral inicial `0.3` y el rango de fechas activo de la Funcionalidad 1.
- Añadir una tabla bajo los gráficos con las cuatro columnas requeridas y un estado vacío explícito.

## Archivos afectados
- `backend/app/routes.py`
- `backend/tests/test_routes.py`
- `frontend/src/App.tsx`
- `frontend/src/lib/financial-types.ts`
- Nuevo `frontend/src/components/dashboard/anomaly-alerts-table.tsx`

## Orden recomendado
1. Actualizar el cálculo y los límites del endpoint de alertas.
2. Cubrirlos en las pruebas existentes del backend.
3. Añadir el tipo y la tabla en el frontend.
4. Conectar la consulta con el umbral y el rango de fechas activo.

## Verificación básica
Ejecutar `pytest backend/tests/test_routes.py`, `npm test` y `npm run build`. Comprobar umbral inicial y cambios, rango de fechas, datos de la tabla y estado vacío.
