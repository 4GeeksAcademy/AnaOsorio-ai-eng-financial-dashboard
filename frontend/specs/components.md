# Especificación de componentes del dashboard

## 1. Filtro de rango de fechas

### `DateRangeFilterBar`
Barra de filtros ubicada en la parte superior del dashboard. El rango seleccionado se comparte con las vistas que deben filtrar sus datos.

**Props**
- `value: DateRangeFilter`: rango activo. `startDate` y `endDate` son opcionales y, si existen, usan formato `YYYY-MM-DD`.
- `availableRange: Pick<FacetsResponse, "min_date" | "max_date">`: fechas mínima y máxima disponibles, obtenidas dinámicamente de `/api/metrics/facets`.
- `onChange: (value: DateRangeFilter) => void`: notifica los extremos seleccionados; los extremos vacíos se omiten del rango.

**Reglas de renderizado y comportamiento**
- Muestra dos campos de fecha opcionales: inicio y fin.
- Muestra como referencia el texto «Rango disponible: {min_date} – {max_date}», usando los valores vigentes recibidos de facetas y formato `YYYY-MM-DD`.
- Si ambos campos están vacíos, no aplica restricciones y se muestran todos los datos históricos.
- Si solo se llena el inicio, filtra desde esa fecha inclusive y no aplica límite superior.
- Si solo se llena el fin, filtra hasta esa fecha inclusive y no aplica límite inferior.
- Si se llenan ambos, incluye los dos extremos del rango.
- Los valores enviados a las consultas conservan el formato `YYYY-MM-DD`; los campos vacíos no se envían.

## 2. Tabla de alertas de anomalías

### `AnomaliesAlertsTable`
Tabla situada debajo de los gráficos existentes. Presenta las alertas recibidas para el umbral y rango de fechas activos.

**Props**
- `alerts: AlertsResponse`: alertas a presentar.
- `threshold: number`: umbral activo, como ratio entre `0.01` y `1.0`; valor inicial `0.3`.
- `onThresholdChange: (threshold: number) => void`: comunica el nuevo umbral elegido.

**Control de umbral**
- Incluye un campo numérico con mínimo `0.01`, máximo `1.0` y valor inicial `0.3`.
- El umbral se expresa como ratio: `0.3` corresponde a un incremento del `30 %`.
- Al cambiar el umbral, las alertas presentadas corresponden al valor actual.

**Columnas exactas**
1. Período (`period`).
2. Outcome registrado (`outcome_total`).
3. Media móvil de 3 períodos (`baseline_average`).
4. Incremento porcentual (`increase_ratio`, presentado como porcentaje).

**Reglas de renderizado**
- Cada fila representa una alerta del rango activo y muestra sus cuatro valores.
- Si no hay anomalías para el umbral actual, la tabla permanece en la vista y muestra explícitamente: «No se detectaron anomalías para el umbral actual.»

## 3. Vista comparativa B2B vs B2C

### `BusinessComparisonView`
Contenedor de la vista comparativa. Presenta las secciones B2B y B2C en paralelo y, debajo de ambas, un único gráfico global.

**Props**
- `dateRange: DateRangeFilter`: rango activo compartido con el filtro de fechas; sus extremos opcionales usan formato `YYYY-MM-DD`.
- `categoriesByBusinessType: Record<BusinessType, TopCategoriesResponse>`: categorías y totales devueltos para cada grupo por la consulta de top categorías.
- `availableCategoriesByBusinessType: Record<BusinessType, Category[]>`: categorías de ingreso disponibles para B2B y B2C, obtenidas de las facetas del dataset.
- `totalIncomeByBusinessType: Record<BusinessType, number>`: ingreso total de cada grupo, usado para calcular porcentajes y alimentar el gráfico.

### `BusinessComparisonSection`
Una instancia para B2B y otra para B2C, ambas mostradas en paralelo.

**Props**
- `businessType: BusinessType`: grupo representado (`B2B` o `B2C`).
- `categories: TopCategoriesResponse`: resultados de las cinco categorías de ingreso principales del grupo en el rango activo.
- `availableCategories: Category[]`: categorías del grupo informadas por las facetas.
- `totalIncome: number`: total de ingresos del grupo en el rango activo.

**Contenido de cada tabla**
- Muestra hasta cinco categorías de ingreso principales que estén disponibles para el grupo.
- Cada fila contiene nombre de categoría (`category`), total (`total_amount`) y porcentaje sobre el total de ingresos del mismo grupo.
- El porcentaje corresponde a `total_amount` respecto de `totalIncome` del grupo representado.
- Si el grupo no arroja categorías ni ingresos para el rango seleccionado, la sección muestra explícitamente «Sin datos de ingresos para {businessType} en este rango.» en lugar de una tabla vacía.

### `BusinessComparisonChart`
Un único gráfico comparativo global situado debajo de las dos secciones.

**Props**
- `totalIncomeByBusinessType: Record<BusinessType, number>`: total de ingresos de B2B y B2C, calculados para el rango activo.

**Reglas de renderizado**
- Compara visualmente los totales de ingresos B2B y B2C en el mismo gráfico.
- Al cambiar el rango, refleja los nuevos totales de ambos grupos.
