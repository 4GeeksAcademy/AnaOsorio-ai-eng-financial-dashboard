# Tabla de alertas de anomalías

## Objetivo
Destacar en el dashboard los períodos en los que el gasto aumentó de forma inesperada.

## Usuario
Persona que consulta las métricas financieras del dashboard.

## Historias de usuario
- Como usuario, quiero identificar los períodos con aumentos inusuales del gasto.
- Como usuario, quiero ajustar el umbral de alerta para controlar qué aumentos se destacan.
- Como usuario, quiero consultar alertas dentro del rango de fechas seleccionado.

## Requisitos funcionales
- El dashboard muestra, bajo los gráficos existentes, una tabla con período, outcome registrado, media de los tres períodos anteriores e incremento porcentual.
- El usuario puede configurar el umbral con un valor numérico entre 0.01 y 1.0; el valor inicial es 0.3.
- La tabla respeta el rango de fechas activo de la Funcionalidad 1.
- Si no hay anomalías para el umbral actual, la tabla muestra un mensaje explícito de estado vacío.

## Criterios de aceptación
1. **Caso de prueba:** la tabla aparece bajo los gráficos y presenta las cuatro columnas requeridas.
2. **Caso de prueba:** el control del umbral muestra inicialmente `0.3` y solo admite valores entre `0.01` y `1.0`.
3. **Caso de prueba:** al cambiar el umbral, la tabla refleja las anomalías correspondientes al nuevo valor.
4. **Caso de prueba:** cada alerta muestra el período, el outcome registrado, la media de los tres períodos anteriores y el incremento expresado como porcentaje.
5. **Caso de prueba:** si ningún período supera el umbral actual, se muestra un mensaje explícito indicando que no hay anomalías.
6. **Caso de prueba:** con un rango de fechas activo, las alertas mostradas corresponden a ese rango.
7. **Caso de prueba:** sin rango de fechas activo, las alertas no se restringen por fecha.

## Fuera del alcance
- Modificar los gráficos existentes o cambiar otras métricas del dashboard.
