# Reglas de backend

## Objetivo

Mantener explícitos y comprobables los contratos y filtros de la API, y evitar efectos compartidos al generar datos reproducibles.

## Justificación

`backend/app/routes.py` define modelos Pydantic, tipos `Literal` y modelos de respuesta. Los filtros se aplican en varios endpoints; `business_type` se procesa aparte y no forma parte de `filter_movements`. La generación con `random.seed()` modifica el generador aleatorio global. `backend/tests/test_routes.py` comprueba respuestas, filtros y datos generados.

## Reglas

- Conserva modelos de respuesta y tipos restringidos para parámetros y valores admitidos. Actualiza las pruebas de rutas cuando cambie una respuesta o consulta.
- Al añadir o cambiar un filtro, revisa los endpoints relacionados y prueba las combinaciones pertinentes; no asumas que todos los endpoints comparten los mismos filtros.
- Mantén reproducibles los datos de prueba sin modificar el estado aleatorio global; usa un generador local y pásalo a las funciones que generan valores.

## Ejemplo correcto e incorrecto

Usa una instancia local para las operaciones aleatorias de la generación:

```python
rng = random.Random(seed)
amount = round(rng.uniform(500, 9000), 2)
```

No reinicies el generador global para obtener datos repetibles; este es el patrón actual de `generate_mock_movements`:

```python
random.seed(seed)
amount = round(random.uniform(500, 9000), 2)
```

Referencia: `backend/app/routes.py` y `backend/tests/test_routes.py`.