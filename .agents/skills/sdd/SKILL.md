---
name: sdd
description: "Use when implementing or updating a feature from frontend/specs, working through plan.md, spec.md, or tasks.md, changing financial API contracts, or keeping FastAPI and React behavior aligned."
---

# Spec-Driven Financial Feature Workflow

Use this workflow for features that span the dashboard frontend, financial calculations, or the FastAPI API. The goal is to implement the behavior in the spec without allowing the API, UI, and verification criteria to drift apart.

## 1. Establish the source of truth

- Read the feature's `spec.md`, `plan.md`, and `tasks.md` when present. Read only the relevant project instructions and nearby implementation/tests.
- Check `frontend/specs/README.md` and `verification.md` for the documented API contract, known mismatches, and edge cases before assuming a spec matches current behavior.
- Separate acceptance criteria from implementation suggestions. Record ambiguities or contradictions; do not silently choose a financial definition or change the contract.

## 2. Map the vertical slice

Before editing, identify the affected pieces and their current contract:

| Concern | Project location |
|---|---|
| API models, query constraints, filtering, calculations, routes | `backend/app/routes.py` |
| API route and behavior tests | `backend/tests/test_routes.py` |
| Shared frontend response and domain types | `frontend/src/lib/financial-types.ts` and `frontend/specs/api-types.ts` |
| Query parameter types | `frontend/specs/param-types.ts` |
| Fetching, runtime response validation, loading/error state | `frontend/src/App.tsx` or the owning feature component |
| Financial calculations and formatters | `frontend/src/lib/financial-utils.ts` |
| Calculation tests | `frontend/src/lib/financial-utils.test.ts` |
| User-visible acceptance criteria | `frontend/specs/<feature>/spec.md` |

A feature may not need every layer. Change only the owners required by its acceptance criteria, but trace every changed contract to its consumers.

## 3. Keep the financial contract aligned

- Match Pydantic models, query parameter names/defaults/bounds, response shape, frontend types, runtime validation, and UI usage. Treat a JSON response as `unknown` until validated at runtime.
- Keep date inputs and API query values in `YYYY-MM-DD`; document whether range endpoints are inclusive. Preserve ISO year/month when grouping dates; avoid local-time conversions that can move a date across a month boundary.
- Check empty ranges, one-sided ranges, boundary dates, and filters combined together. Keep loading, error, and empty states distinct.
- Verify grouping (`day`, `week`, `month`), sorting, units, and ratio-versus-percentage conversion end to end.
- Do not infer the intended definition of profit, margin, baseline, comparison period, or other financial metric from its label. If product intent is unclear, surface the question and avoid asserting the current formula as authoritative.
- For B2B/B2C comparisons, verify that both groups use the same date/filter scope and that percentages use the correct group denominator, not only the returned top categories.

## 4. Implement in dependency order

1. Resolve contract or acceptance-criteria conflicts before broad edits.
2. Update the backend contract and behavior when the feature requires it.
3. Update matching frontend types, fetch parameters, runtime validation, and calculation logic.
4. Add or update the UI, including loading, error, no-data, and boundary states required by the spec.
5. Update the existing nearby test suites and mark a task complete only after its acceptance criterion has been verified. Do not mark planned or unverified work complete.

Keep changes local to the feature and preserve public contracts unless the spec requires a contract change. If a necessary test has no suitable existing home, explain the gap before introducing a new test file.

## 5. Verify the behavior, not just compilation

- Run focused backend tests for changed routes and calculations. The project commonly uses `pytest backend/tests/test_routes.py` from the repository root.
- In `frontend/`, run the relevant existing tests, then `npm run lint` and `npm run build` when the change affects the React app or shared types.
- Check acceptance criteria individually: request query values, response shape, boundary behavior, empty state, error state, and consistency across all affected KPI/tables/charts.
- Report commands and actual outcomes. Distinguish an unavailable check from a failed check; do not claim a full feature is verified when only build or type checking passed.

## 6. Close the spec loop

Summarize the contract changes, affected frontend/backend files, verification results, remaining ambiguities, and any known discrepancy left unresolved. Update `tasks.md` only for work actually completed and verified. Do not edit unrelated known issues as part of the feature.
