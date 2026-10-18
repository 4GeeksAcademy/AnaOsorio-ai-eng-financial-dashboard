## Objetivo
Comparar los ingresos de las líneas de negocio B2B y B2C en una vista del dashboard.

## Usuario
Persona que consulta y compara el rendimiento financiero de los dos grupos de negocio.

## Historias de usuario
- Como usuario, quiero comparar las principales categorías de ingresos de B2B y B2C.
- Como usuario, quiero contrastar el total de ingresos de ambos grupos en un mismo gráfico.
- Como usuario, quiero limitar la comparación a un rango de fechas.

## Requisitos funcionales
- La vista presenta dos secciones en paralelo, una para B2B y otra para B2C.
- Cada sección muestra una tabla con las cinco categorías de ingreso principales, el total por categoría y su porcentaje sobre el total de ingresos del grupo.
- Las categorías disponibles se corresponden con las categorías de ingreso informadas por las facetas del dataset.
- Bajo las dos secciones, la vista muestra un único gráfico que compara el total de ingresos B2B y B2C.
- El usuario puede filtrar la comparación por un rango de fechas; las fechas se expresan como `YYYY-MM-DD`.

## Criterios de aceptación
1. **Caso de prueba:** la vista muestra en paralelo las secciones B2B y B2C.
2. **Caso de prueba:** cada sección presenta una tabla con las cinco categorías de ingreso principales y su total.
3. **Caso de prueba:** el porcentaje de cada categoría se calcula respecto al total de ingresos de su propio grupo.
4. **Caso de prueba:** las categorías mostradas corresponden a las categorías de ingreso disponibles en las facetas del dataset.
5. **Caso de prueba:** debajo de ambas secciones aparece un único gráfico que compara los ingresos totales de B2B y B2C.
6. **Caso de prueba:** al seleccionar un rango, las tablas y el gráfico reflejan la comparación para esas fechas.
7. **Caso de prueba:** las fechas del rango se expresan en formato `YYYY-MM-DD`.

## Fuera del alcance
- Comparar métricas distintas de los ingresos.
