# Progreso del proyecto

## Funciones

Estado descrito por el código; no implica que las pruebas se hayan ejecutado.

- El frontend solicita movimientos a `/api/metrics`, calcula cuatro KPI y genera agregaciones mensuales para dos gráficos. Muestra estados de carga y error, y los gráficos contemplan ausencia de datos. Fuentes: [App.tsx](../frontend/src/App.tsx), [financial-utils.ts](../frontend/src/lib/financial-utils.ts), [kpi-row.tsx](../frontend/src/components/dashboard/kpi-row.tsx), [income-outcome-chart.tsx](../frontend/src/components/dashboard/income-outcome-chart.tsx), [profit-percent-chart.tsx](../frontend/src/components/dashboard/profit-percent-chart.tsx).
- El backend genera 360 movimientos simulados con semilla `42` y define endpoints para movimientos, facets, resumen, categorías principales, comparación, alertas y segmentación B2B/B2C. Fuente: [routes.py](../backend/app/routes.py).
- Hay pruebas de utilidades financieras y de endpoints, filtros y contratos. Su existencia no confirma que hayan pasado ni que la cobertura sea suficiente. Fuentes: [financial-utils.test.ts](../frontend/src/lib/financial-utils.test.ts), [test_routes.py](../backend/tests/test_routes.py), [verification.md](../verification.md).

## Limitaciones actuales

- El encabezado fija `2024 - Full Year`, pero las fechas de los datos simulados se calculan respecto al mes actual. Fuentes: [App.tsx](../frontend/src/App.tsx), [routes.py](../backend/app/routes.py).
- El agrupamiento mensual del frontend convierte fechas ISO en `Date` y usa getters locales, por lo que puede verse afectado por la zona horaria. Fuente: [financial-utils.ts](../frontend/src/lib/financial-utils.ts).
- `response.json()` se trata como `FinancialMovement[]` sin validar la estructura en ejecución. Fuente: [App.tsx](../frontend/src/App.tsx).
- La pantalla principal solo consume `/api/metrics`; las otras rutas de análisis existen, pero no se observó que `App` las utilice. Fuentes: [App.tsx](../frontend/src/App.tsx), [routes.py](../backend/app/routes.py).
- La definición de negocio esperada para beneficio y margen no está confirmada. Además, la generación con `random.seed()` modifica el generador aleatorio global. Fuentes: [financial-utils.ts](../frontend/src/lib/financial-utils.ts), [routes.py](../backend/app/routes.py), [verification.md](../verification.md).
- No hay un criterio documentado para considerar suficiente la cobertura de pruebas ni un comando de ejecución de pytest documentado en el repositorio. Fuente: [AGENTS.md](../AGENTS.md).

## Próximos pasos sugeridos

- Alinear el periodo mostrado con las fechas de los movimientos y añadir pruebas de fechas cercanas a límites de mes y año, independientemente de zona horaria.
- Definir con el producto las fórmulas y el periodo que deben representar los KPI antes de tratarlos como reglas oficiales.
- Validar la respuesta JSON en ejecución o añadir una prueba de integración para el contrato frontend-backend.
- Decidir si las rutas adicionales deben conectarse a la interfaz; si se integran, cubrir sus flujos con pruebas y aclarar las diferencias entre filtros de endpoints.
- Considerar un generador aleatorio local para conservar reproducibilidad sin alterar el estado global.
- Documentar cómo ejecutar las pruebas de backend y ejecutar las suites existentes antes de afirmar que pasan; establecer un criterio de cobertura solo si el proyecto lo requiere.