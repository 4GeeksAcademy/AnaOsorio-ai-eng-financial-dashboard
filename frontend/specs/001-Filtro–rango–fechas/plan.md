## Cambios de backend
No hacen falta: `/api/metrics` ya aplica `start_date` y `end_date` opcionales, y `/api/metrics/facets` ya devuelve las fechas mínima y máxima.

## Cambios de frontend
Añadir los campos de fecha y el rango disponible en la zona superior. En `App.tsx`, cargar las facetas y volver a consultar métricas cuando cambien las fechas; calcular KPI y gráficos con la misma respuesta filtrada. Enviar fechas seleccionadas como `YYYY-MM-DD` y conservar los estados de carga y error.

## Archivos afectados
- `frontend/src/App.tsx`
- `frontend/src/components/dashboard/dashboard-header.tsx`
- `frontend/src/lib/financial-types.ts`, para el tipo de respuesta de facetas.

## Orden recomendado
1. Añadir o reutilizar el tipo de facetas en los tipos del frontend.
2. Cargar y mostrar el rango de fechas disponible en el encabezado.
3. Añadir controles opcionales y conectar sus cambios con la consulta de métricas.
4. Verificar los estados de carga, error y resultados vacíos.

## Verificación básica
Ejecutar las pruebas existentes de backend para filtros y facetas, y `npm run build`. Comprobar en el dashboard rango vacío, solo inicio, solo fin y ambas fechas; confirmar que KPI y gráficos reflejan el mismo filtro.

## Riesgo
El cambio principal es sustituir la carga única por consultas repetidas. Si las respuestas llegan desordenadas, una consulta anterior podría sobrescribir los datos del filtro actual. También hay que evitar que un error previo permanezca visible tras una consulta exitosa.
