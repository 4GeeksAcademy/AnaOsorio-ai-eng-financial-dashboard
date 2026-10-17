# Resumen del producto

## Hechos comprobados

- Es un panel web de métricas financieras con frontend React y backend FastAPI.
- La pantalla principal obtiene movimientos de `/api/metrics` y muestra indicadores financieros y gráficos mensuales de ingresos, egresos y porcentaje de beneficio.
- El frontend calcula el beneficio como ingresos menos egresos y el porcentaje como beneficio dividido por ingresos; si no hay ingresos, muestra 0%.
- El backend genera 360 movimientos simulados por conjunto, con semilla `42`. Las fechas se calculan respecto a la fecha actual.
- Cada movimiento tiene fecha, importe, tipo de operación (`income`/`outcome`), categoría y segmento (`B2B`/`B2C`).
- El encabezado muestra `2024 - Full Year`, aunque las fechas generadas no necesariamente corresponden a 2024.
- La API incluye rutas adicionales para resumen, categorías principales, comparación, alertas y movimientos B2B/B2C; la pantalla principal revisada solo solicita `/api/metrics`.

## No confirmado

- No está definida en la documentación revisada la fórmula financiera esperada para beneficio o porcentaje de beneficio; las descritas arriba son las que implementa actualmente el frontend.
- No se confirma que el producto use datos reales, ni se especifican usuarios o público objetivo.
- No se confirma que la pantalla principal ofrezca filtros, comparación, alertas o segmentación B2B/B2C; esas capacidades aparecen como rutas de API, pero no se observó que `App` las consuma.