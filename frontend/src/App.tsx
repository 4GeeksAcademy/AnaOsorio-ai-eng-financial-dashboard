import { useEffect, useState } from "react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { KPIRow } from "@/components/dashboard/kpi-row";
import { IncomeOutcomeChart } from "@/components/dashboard/income-outcome-chart";
import { ProfitPercentChart } from "@/components/dashboard/profit-percent-chart";
import {
  type FinancialMovement,
  type KPIMetrics,
  type MetricsFacets,
  type MonthlyDataPoint,
} from "@/lib/financial-types";
import { computeKPIs, computeMonthlyData } from "@/lib/financial-utils";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

function isFinancialMovement(value: unknown): value is FinancialMovement {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  return (
    "create_date" in value &&
    typeof value.create_date === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(value.create_date) &&
    "amount" in value &&
    typeof value.amount === "number" &&
    Number.isFinite(value.amount) &&
    "operation_type" in value &&
    (value.operation_type === "income" || value.operation_type === "outcome") &&
    "category" in value &&
    (value.category === "suppliers" ||
      value.category === "sales" ||
      value.category === "operational" ||
      value.category === "administrative" ||
      value.category === "others") &&
    "business_type" in value &&
    (value.business_type === "B2B" || value.business_type === "B2C")
  );
}

function isFinancialMovementList(value: unknown): value is FinancialMovement[] {
  return Array.isArray(value) && value.every(isFinancialMovement);
}

async function fetchFinancialData(
  startDate: string,
  endDate: string,
): Promise<FinancialMovement[]> {
  const params = new URLSearchParams();
  if (startDate) params.set("start_date", startDate);
  if (endDate) params.set("end_date", endDate);
  const query = params.toString();
  const url = `${API_BASE_URL}/api/metrics${query ? `?${query}` : ""}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch financial data: ${response.status}`);
  }

  const payload: unknown = await response.json();
  if (!isFinancialMovementList(payload)) {
    throw new Error("Invalid financial data response");
  }
  return payload;
}

function isMetricsFacets(value: unknown): value is MetricsFacets {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  return (
    "operation_types" in value &&
    Array.isArray(value.operation_types) &&
    value.operation_types.every(
      (type) => type === "income" || type === "outcome",
    ) &&
    "business_types" in value &&
    Array.isArray(value.business_types) &&
    value.business_types.every((type) => type === "B2B" || type === "B2C") &&
    "categories" in value &&
    Array.isArray(value.categories) &&
    value.categories.every((category) =>
      ["suppliers", "sales", "operational", "administrative", "others"].includes(
        category,
      ),
    ) &&
    "min_date" in value &&
    typeof value.min_date === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(value.min_date) &&
    "max_date" in value &&
    typeof value.max_date === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(value.max_date)
  );
}

async function fetchMetricsFacets(): Promise<MetricsFacets> {
  const response = await fetch(`${API_BASE_URL}/api/metrics/facets`);
  if (!response.ok) {
    throw new Error(`Failed to fetch financial facets: ${response.status}`);
  }

  const payload: unknown = await response.json();
  if (!isMetricsFacets(payload)) {
    throw new Error("Invalid financial facets response");
  }
  return payload;
}

function App() {
  const [metrics, setMetrics] = useState<KPIMetrics | null>(null);
  const [monthlyData, setMonthlyData] = useState<MonthlyDataPoint[]>([]);
  const [facets, setFacets] = useState<MetricsFacets | null>(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    Promise.all([
      fetchFinancialData(startDate, endDate),
      fetchMetricsFacets(),
    ])
      .then(([movements, availableFacets]) => {
        if (!active) return;
        setMetrics(computeKPIs(movements));
        setMonthlyData(computeMonthlyData(movements));
        setFacets(availableFacets);
      })
      .catch(() => {
        if (!active) return;
        setMetrics(null);
        setMonthlyData([]);
        setError(
          "No se pudo cargar la informacion financiera. Revisa la API de backend.",
        );
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [startDate, endDate]);

  return (
    <main className="dark min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8">
          <DashboardHeader
            period={
              facets
                ? `${startDate || facets.min_date} - ${endDate || facets.max_date}`
                : ""
            }
            availableDateRange={
              facets
                ? { minDate: facets.min_date, maxDate: facets.max_date }
                : null
            }
          />

          <section
            aria-label="Filtro de fechas"
            className="flex flex-col gap-3 sm:flex-row sm:items-end"
          >
            <label className="flex flex-col gap-1 text-sm text-foreground">
              Fecha de inicio
              <input
                type="date"
                value={startDate}
                onChange={(event) => setStartDate(event.target.value)}
                className="rounded-md border border-border bg-background px-3 py-2 text-sm"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm text-foreground">
              Fecha de fin
              <input
                type="date"
                value={endDate}
                onChange={(event) => setEndDate(event.target.value)}
                className="rounded-md border border-border bg-background px-3 py-2 text-sm"
              />
            </label>
          </section>

          {error ? (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive-foreground">
              {error}
            </div>
          ) : null}

          <section aria-label="Key performance indicators">
            <KPIRow metrics={metrics} loading={loading} />
          </section>

          <section
            aria-label="Financial charts"
            className="grid grid-cols-1 gap-4 xl:grid-cols-2"
          >
            <IncomeOutcomeChart data={monthlyData} loading={loading} />
            <ProfitPercentChart data={monthlyData} loading={loading} />
          </section>
        </div>
      </div>
    </main>
  );
}

export default App;
