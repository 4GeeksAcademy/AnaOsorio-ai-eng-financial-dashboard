# Reglas de frontend

## Objetivo

Evitar que los cálculos y periodos mostrados en el dashboard se desalineen de los movimientos financieros recibidos.

## Justificación

`App.tsx` muestra el periodo fijo `2024 - Full Year`, aunque el backend genera movimientos con fechas relativas a la fecha actual. Además, `financial-utils.ts` convierte fechas ISO a `Date` y agrupa con getters locales, lo que puede cambiar el mes según la zona horaria. Los tipos TypeScript tampoco validan en ejecución la respuesta de `response.json()`.

## Reglas

- Deriva el periodo visible de los datos o filtros activos; no lo fijes en la interfaz.
- Agrupa fechas ISO sin convertirlas a fechas locales. Añade casos de prueba para límites de mes y año.
- Mantén los cálculos en `src/lib/financial-utils.ts` y cubre sus cambios en `financial-utils.test.ts`.
- Valida la forma de la respuesta HTTP antes de usarla, o cubre el contrato con una prueba de integración; los tipos TypeScript por sí solos no validan JSON en ejecución.

## Ejemplo correcto e incorrecto

Con `create_date` en formato ISO `YYYY-MM-DD`, conserva año y mes directamente:

```ts
const yearMonthKey = m.create_date.slice(0, 7);
```

No agrupes convirtiendo la fecha ISO a una fecha local. Este patrón del código actual puede desplazar el día al mes anterior en algunas zonas horarias:

```ts
const yearMonthKey = toYearMonthKey(new Date(m.create_date));
```

Referencia: `frontend/src/lib/financial-utils.ts`, `frontend/src/lib/financial-types.ts` y `frontend/src/lib/financial-utils.test.ts`.