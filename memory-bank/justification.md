# Justificación de mejoras

## Performance optimization

### Motivo

La carga inicial del dashboard consultaba en paralelo `/api/metrics` y `/api/metrics/facets`. Ambas rutas generaban el mismo conjunto simulado de 360 movimientos, mientras que la respuesta de facets solo aportaba las fechas mínima y máxima que el dashboard mostraba.

### Decisión

Se eliminó la petición de facets desde el frontend y se derivaron las fechas mínima y máxima del primer y último movimiento de `/api/metrics`, cuya respuesta está ordenada cronológicamente. La equivalencia de ambos límites se comprobó contra la respuesta de facets. El cambio reduce una solicitud HTTP y una generación completa por carga inicial, sin modificar el backend ni el diseño.

### Evidencia

En cinco muestras locales, `GET /api/metrics` devolvió 41,683 bytes y tardó entre 3.4 y 6.2 ms; `GET /api/metrics/facets` devolvió 194 bytes y tardó entre 3.1 y 4.2 ms. La latencia de las rutas era baja; la justificación principal es retirar la solicitud y el trabajo duplicados, no afirmar una mejora perceptible de velocidad.

Se consideró usar `GET /api/metrics/summary`, que devolvió 884 bytes. La comparación paralela con `/api/metrics` no coincidió; una comparación secuencial sí. No se adoptó el resumen porque no se pudo garantizar equivalencia bajo concurrencia. El backend usa `random.seed(42)` global al generar cada conjunto, por lo que la concurrencia puede interferir con la reproducibilidad. Resolver esa causa requiere un cambio backend y queda fuera del alcance de la optimización frontend.

### Verificación

El rango derivado coincidió con `min_date` y `max_date` de facets. `npm run build`, `npm run lint` y `npm test` pasaron; las pruebas frontend existentes reportaron 6 casos aprobados. El bundle final fue de 176.19 kB gzip, por debajo del presupuesto orientativo de 200 kB de la skill. La variación de bundle respecto al build anterior no se considera por sí sola una mejora.

## SEO/GEO

### Motivo

El HTML inicial ya declaraba español y tenía favicon, pero el título era genérico y faltaban una descripción para buscadores y metadatos sociales para compartir la página.

### Decisión

Se actualizó únicamente `frontend/index.html` con un título descriptivo en español, una meta description y metadatos Open Graph/Twitter consistentes. El cambio no altera la interfaz visual.

### Límites pendientes

No se añadieron canonical ni `og:url` porque el dominio de despliegue no está definido. Tampoco se añadieron reglas `robots.txt`, sitemap ni JSON-LD: primero hay que decidir si el dashboard debe ser indexable públicamente y confirmar la identidad y afirmaciones del producto. No se hizo keyword research ni se afirma que la aplicación esté indexada.

### Verificación

El build del frontend pasó. El HTML final contiene las nuevas etiquetas estáticas; no se validó indexación en Google/Bing ni metadatos de una URL de producción.
