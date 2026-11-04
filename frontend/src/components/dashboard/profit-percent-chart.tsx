import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { type MonthlyDataPoint } from '@/lib/financial-types'
import { formatPercent } from '@/lib/financial-utils'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts'

interface ProfitPercentChartProps {
  data: MonthlyDataPoint[]
  loading?: boolean
}

interface TooltipPayload {
  name: string
  value: number
  color: string
}

interface CustomTooltipProps {
  active?: boolean
  payload?: TooltipPayload[]
  label?: string
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null
  const value = payload[0]?.value ?? 0
  return (
    <div className="rounded-lg border border-border bg-card px-4 py-3 shadow-lg text-sm">
      <p className="font-semibold text-foreground mb-1">{label}</p>
      <div className="flex items-center gap-2">
        <span
          className="inline-block h-2 w-2 rounded-full"
          style={{ backgroundColor: 'var(--chart-profit)' }}
        />
        <span className="text-muted-foreground">Margen de beneficio:</span>
        <span className="font-medium text-foreground ml-auto pl-4">{formatPercent(value)}</span>
      </div>
    </div>
  )
}

export function ProfitPercentChart({ data, loading }: ProfitPercentChartProps) {
  if (loading) {
    return (
      <Card className="border-border/60">
        <CardHeader className="pb-4">
          <Skeleton className="h-5 w-52" />
          <Skeleton className="h-3 w-64 mt-1" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[280px] w-full rounded-lg" />
        </CardContent>
      </Card>
    )
  }

  const hasData = data.length > 0

  return (
    <Card className="border-border/60">
      <CardHeader className="pb-4">
        <CardTitle id="profit-percent-title" className="text-base font-semibold">Margen de beneficio</CardTitle>
        <CardDescription id="profit-percent-description">Beneficio mensual como porcentaje de los ingresos</CardDescription>
      </CardHeader>
      <CardContent>
        {!hasData ? (
          <div className="flex h-[280px] items-center justify-center text-muted-foreground text-sm">
            No hay datos disponibles para mostrar
          </div>
        ) : (
          <>
            <div aria-hidden="true">
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" strokeOpacity={0.6} />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: 'var(--color-muted-foreground)' }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value) => `${new Intl.NumberFormat('es-ES', { maximumFractionDigits: 0 }).format(value)}%`}
                    width={40}
                    domain={['auto', 'auto']}
                  />
                  <ReferenceLine y={0} stroke="var(--color-border)" strokeDasharray="4 4" />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="profitPercent"
                    name="Margen de beneficio"
                    stroke="var(--chart-profit)"
                    strokeWidth={2}
                    dot={{ r: 3, fill: 'var(--chart-profit)', strokeWidth: 0 }}
                    activeDot={{ r: 5, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <table aria-describedby="profit-percent-description" className="sr-only">
              <caption>Margen de beneficio mensual</caption>
              <thead>
                <tr>
                  <th scope="col">Mes</th>
                  <th scope="col">Margen de beneficio</th>
                </tr>
              </thead>
              <tbody>
                {data.map((point) => (
                  <tr key={point.month}>
                    <th scope="row">{point.month}</th>
                    <td>{formatPercent(point.profitPercent)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </CardContent>
    </Card>
  )
}
