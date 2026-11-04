# Filtro de rango de fechas

## Objetivo
Permitir filtrar todos los datos del dashboard principal por un rango de fechas opcional y mostrar el rango disponible en el dataset.

## Usuario
Persona que consulta las métricas financieras del dashboard.

## Historias de usuario
- Como usuario, quiero elegir una fecha de inicio y una fecha de fin para consultar las métricas de un período específico.
- Como usuario, quiero conocer las fechas más antigua y más reciente disponibles para elegir un rango informado.
- Como usuario, quiero dejar las fechas vacías para consultar todos los datos históricos.

## Requisitos funcionales
- El dashboard presenta campos opcionales para la fecha de inicio y la fecha de fin.
- El dashboard muestra dinámicamente la fecha más antigua y la más reciente disponibles en el dataset, obtenidas de sus facetas.
- Las fechas seleccionadas se envían a la API exclusivamente con el formato `YYYY-MM-DD`.
- El rango seleccionado filtra todos los datos mostrados en el dashboard principal.
- Si no se selecciona una fecha para uno de los extremos, no se aplica una restricción en ese extremo.

## Criterios de aceptación
1. **Caso de prueba:** al abrir el dashboard, se muestran los dos campos opcionales y las fechas mínima y máxima disponibles como referencia.
2. **Caso de prueba:** con ambos campos vacíos, el dashboard muestra todos los datos históricos sin restricción de fechas.
3. **Caso de prueba:** al seleccionar solo una fecha de inicio, se muestran datos desde esa fecha inclusive, sin límite superior.
4. **Caso de prueba:** al seleccionar solo una fecha de fin, se muestran datos hasta esa fecha inclusive, sin límite inferior.
5. **Caso de prueba:** al seleccionar ambas fechas, se muestran en todo el dashboard únicamente datos dentro del rango, incluidos ambos extremos.
6. **Caso de prueba:** cada fecha seleccionada se envía a la API en formato `YYYY-MM-DD`.
7. **Caso de prueba:** el rango de fechas disponible mostrado corresponde al dataset actual y no a fechas fijas.

## Fuera del alcance
- Añadir filtros distintos del rango de fechas.
- Cambiar la definición o el cálculo de las métricas financieras.
