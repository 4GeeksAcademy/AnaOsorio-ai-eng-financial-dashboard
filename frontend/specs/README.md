# Contrato de datos de las funcionalidades del dashboard

Este documento distingue el contrato que expone hoy la API del comportamiento requerido por las specs. Las fechas que envía la interfaz deben ser siempre `YYYY-MM-DD`, aunque FastAPI acepte actualmente valores más amplios para parámetros `date`.

## Tipos compartidos

Los tipos de API se documentan en `api-types.ts` y los parámetros de consulta en `param-types.ts`.

```ts
export type ISODateString = string;
export type OperationType = "income" | "outcome";
export type BusinessType = "B2B" | "B2C";
export type Category =
  | "suppliers"
  | "sales"
  | "operational"
  | "administrative"
  | "others";

export interface DateRangeFilter {
  startDate?: ISODateString;
  endDate?: ISODateString;
}
```

`ISODateString` es un alias de `string`; su formato exacto es una regla del contrato de UI, no una restricción estática de TypeScript. Al serializarlo para la API, `startDate` se convierte en `start_date` y `endDate` en `end_date`.

## 1. Filtro de rango de fechas

### Endpoints

| Endpoint | Uso | Respuesta |
|---|---|---|
| `GET /api/metrics/facets` | Obtener los límites actuales del dataset. No acepta parámetros. | `FacetsResponse` |
| `GET /api/metrics` | Obtener los movimientos que alimentan todos los KPI y gráficos. | `FinancialMovement[]` |

### Tipos de respuesta

```ts
export interface FacetsResponse {
  operation_types: OperationType[];
  business_types: BusinessType[];
  categories: Category[];
  min_date: ISODateString;
  max_date: ISODateString;
}

export interface FinancialMovement {
  create_date: ISODateString;
  amount: number;
  operation_type: OperationType;
  category: Category;
  business_type: BusinessType;
}
```

`FacetsResponse.categories` es la lista global de categorías del dataset. `min_date` y `max_date` son las fechas mínima y máxima de todos los movimientos.

### Parámetros de `GET /api/metrics`

| Parámetro | Tipo API | Valores y restricciones | Uso en esta funcionalidad |
|---|---|---|---|
| `start_date` | `date`, opcional | Fecha inclusiva; la UI envía exclusivamente `YYYY-MM-DD`. | Se envía solo si hay fecha de inicio. |
| `end_date` | `date`, opcional | Fecha inclusiva; la UI envía exclusivamente `YYYY-MM-DD`. | Se envía solo si hay fecha de fin. |
| `category` | `Category`, opcional | `suppliers`, `sales`, `operational`, `administrative`, `others`. | No se usa en el filtro de fechas. |
| `operation_type` | `OperationType`, opcional | `income` o `outcome`. | No se usa en el filtro de fechas. |

El tipo de petición que utiliza el filtro es `DateRangeFilter`; sus extremos opcionales se serializan a los nombres de query `start_date` y `end_date`. Si ambos están vacíos, ambos parámetros se omiten.

### Casos límite y UI

- **Ambos campos vacíos:** se muestran los campos vacíos y la referencia `Rango disponible: {min_date} – {max_date}`. Se consulta el histórico completo; KPI y gráficos reflejan todos los movimientos.
- **Solo inicio o solo fin:** se conserva visible el extremo elegido y el otro queda vacío. Solo se envía el parámetro correspondiente; el límite enviado se incluye y no se aplica límite al extremo omitido.
- **Rango sin movimientos:** la API responde `[]`; los KPI muestran `$0` y `0.0%` donde corresponda. Ambos gráficos permanecen visibles con `No data available to display`.
- **Fallo al cargar métricas o facetas:** se muestra `No se pudo cargar la informacion financiera. Revisa la API de backend.` y no se presentan valores anteriores como si pertenecieran al rango actual.

## 2. Tabla de alertas de anomalías

### Endpoint

`GET /api/metrics/alerts` devuelve directamente una lista `AlertsResponse`.

### Parámetros de consulta

| Parámetro | Tipo | Default | Valores y restricciones |
|---|---|---:|---|
| `threshold` | `number` (`float` en API) | `0.3` | La UI permite ratios de `0.01` a `1.0`, inclusive. La API actual solo exige `>= 0` y no establece máximo; el cliente debe respetar el rango de UI. |
| `group_by` | `string` (`GroupBy` en API) | `month` | `day`, `week` o `month`. La vista del dashboard omite el parámetro y usa `month`. |
| `start_date` | `date`, opcional | ninguno | Límite inclusivo; la UI envía `YYYY-MM-DD`. |
| `end_date` | `date`, opcional | ninguno | Límite inclusivo; la UI envía `YYYY-MM-DD`. |
| `business_type` | `BusinessType`, opcional | ninguno | `B2B` o `B2C`. La tabla global omite este parámetro. |

El tipo de petición usado por el frontend es:

```ts
export interface AlertsParams extends DateRangeFilter {
  threshold: number;
}
```

La interfaz inicializa `threshold` en `0.3`. Serializa las fechas a `start_date`/`end_date`; vacías se omiten. El frontend usa el `group_by=month` por defecto del endpoint y no envía `business_type`.

### Tipo de respuesta

```ts
export interface AlertEntry {
  period: string;
  outcome_total: number;
  baseline_average: number;
  increase_ratio: number;
}

export type AlertsResponse = AlertEntry[];
```

`increase_ratio` es un ratio: `0.3` se presenta como `30 %`. La tabla conserva las columnas `period`, `outcome_total`, `baseline_average` e `increase_ratio`.

**Desfase backend conocido:** la spec requiere una media móvil de los tres períodos anteriores. El endpoint actual calcula la media de todos los períodos anteriores. `baseline_average` mantiene el tipo y nombre de campo, pero el cálculo debe alinearse antes de presentar el dato como media de tres períodos.

### Casos límite y UI

- **Respuesta sin alertas para el umbral y rango actuales:** la tabla no desaparece; conserva encabezados y muestra en su cuerpo `No se detectaron anomalías para el umbral actual.`
- **El rango activo no contiene alertas:** se conserva el rango seleccionado y se muestra el mismo estado vacío: `No se detectaron anomalías para el umbral actual.` No se muestran alertas de fechas externas al rango.
- **No existen tres períodos previos para calcular la media requerida:** esos períodos no pueden producir una alerta basada en una media de tres períodos. Si no quedan otras alertas, se mantiene la tabla y se muestra el estado vacío explícito anterior.
- **Umbral en un extremo válido (`0.01` o `1.0`):** el control conserva el valor y la tabla refleja la respuesta para ese ratio; el incremento se presenta como porcentaje multiplicando `increase_ratio` por 100.

## 3. Vista comparativa B2B vs B2C

### Endpoints

| Endpoint | Uso | Respuesta |
|---|---|---|
| `GET /api/metrics/facets` | Obtener las categorías disponibles y los grupos. | `FacetsResponse` |
| `GET /api/metrics/categories/top` | Obtener el top 5 de ingresos de cada grupo. Se consulta una vez con `business_type=B2B` y otra con `business_type=B2C`. | `TopCategoriesResponse` por grupo |
| `GET /api/metrics` | Obtener ingresos para calcular el denominador exacto por grupo y el total del gráfico. | `FinancialMovement[]` |

### Parámetros de `GET /api/metrics/categories/top`

| Parámetro | Tipo | Default API | Valores y restricciones para la vista |
|---|---|---:|---|
| `operation_type` | `OperationType` | `outcome` | En ambas solicitudes se envía `income`. Valores API: `income`, `outcome`. |
| `limit` | `integer` | `5` | Entero entre `1` y `20`; la vista envía `5`. |
| `start_date` | `date`, opcional | ninguno | Fecha inclusiva, enviada como `YYYY-MM-DD` cuando está definida. |
| `end_date` | `date`, opcional | ninguno | Fecha inclusiva, enviada como `YYYY-MM-DD` cuando está definida. |
| `business_type` | `BusinessType`, opcional | ninguno | Enviar `B2B` o `B2C`, una consulta por grupo. |

`TopCategoriesParams` extiende `DateRangeFilter` y añade `operation_type`, `limit` y `business_type?`. En el dashboard sus valores son `income`, `5` y el grupo consultado.

### Tipos de respuesta

```ts
export interface CategoryEntry {
  category: Category;
  operation_type: OperationType;
  total_amount: number;
}

export type TopCategoriesResponse = CategoryEntry[];
```

La respuesta no incluye porcentaje ni total del grupo. `total_amount` es el importe por categoría. Para obtener el denominador y el total del gráfico sin depender de que las categorías top cubran todo el ingreso, se solicita `/api/metrics` con `operation_type=income` y el mismo rango; se suman los importes agrupando por `business_type`.

### Contrato de facetas: limitación actual

El `FacetsResponse` actual devuelve `categories: Category[]` globales, no categorías separadas por grupo. Esto no satisface por sí solo el requisito de obtener las categorías disponibles para cada negocio. La respuesta debe ampliarse antes de implementar esa parte; el shape requerido es:

```ts
export type CategoriesByBusinessType = Record<BusinessType, Category[]>;

export interface ComparativeFacetsResponse extends FacetsResponse {
  categories_by_business_type: CategoriesByBusinessType;
}
```

`categories_by_business_type` es una extensión requerida, no un campo que `/api/metrics/facets` devuelva hoy.

### Casos límite y UI

- **Un grupo no tiene ingresos en el rango y el otro sí:** la sección vacía muestra exactamente `Sin datos de ingresos para B2B en este rango.` o `Sin datos de ingresos para B2C en este rango.`, según corresponda. La otra tabla permanece normal y el gráfico único compara el grupo vacío como `0` con el total del otro.
- **Ningún grupo tiene ingresos en el rango:** cada sección muestra su mensaje `Sin datos de ingresos para {businessType} en este rango.`; el gráfico comparativo permanece visible con total `0` para B2B y B2C.
- **Un grupo tiene menos de cinco categorías con ingresos:** se muestran únicamente las categorías devueltas disponibles, sin filas ficticias ni categorías de outcome; la sección no se trata como vacía si tiene al menos una categoría.
- **Rango parcial o vacío:** se envía solo el límite definido, o ninguno si ambos están vacíos. Las dos tablas y ambos totales del gráfico usan el mismo rango; toda fecha enviada conserva `YYYY-MM-DD`.
