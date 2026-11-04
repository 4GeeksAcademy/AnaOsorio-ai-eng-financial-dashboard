import { LayoutDashboard } from 'lucide-react'

interface DashboardHeaderProps {
  period?: string
  availableDateRange?: { minDate: string; maxDate: string } | null
}

export function DashboardHeader({
  period = '2024 — Año completo',
  availableDateRange,
}: DashboardHeaderProps) {
  return (
    <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <LayoutDashboard size={18} aria-hidden="true" />
        </span>
        <div>
          <h1 className="text-xl font-semibold text-foreground tracking-tight">Resumen financiero</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Panel ejecutivo de métricas</p>
        </div>
      </div>
      <div role="group" aria-label="Rango de fechas" className="flex items-center gap-2">
        {availableDateRange ? (
          <span className="text-xs text-muted-foreground">
            Disponible: {availableDateRange.minDate} – {availableDateRange.maxDate}
          </span>
        ) : null}
        {period ? (
          <span className="inline-flex items-center rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
            {period}
          </span>
        ) : null}
      </div>
    </header>
  )
}
