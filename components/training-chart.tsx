"use client"

import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

interface TrainingChartProps {
  data: { epoch: number; value: number; validationValue?: number }[]
  yLabel: string
  color: string
  validationColor: string
  showValidation: boolean
}

export function TrainingChart({ data, yLabel, color, validationColor, showValidation }: TrainingChartProps) {
  return (
    <div className="h-full w-full">
      {data.length === 0 ? (
        <div className="flex items-center justify-center h-full text-muted-foreground">
          <p>No training data yet. Start training to see results.</p>
        </div>
      ) : (
        <div className="h-full w-full overflow-hidden">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 30, left: 10, bottom: 30 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis
                dataKey="epoch"
                label={{
                  value: "Epoch",
                  position: "insideBottom",
                  offset: -10,
                  dy: 15,
                }}
                tick={{ fontSize: 11 }}
                tickMargin={10}
                height={40}
              />
              <YAxis
                label={{
                  value: yLabel,
                  angle: -90,
                  position: "insideLeft",
                  dx: -5,
                }}
                domain={yLabel === "Accuracy" ? [0, 1] : ["auto", "auto"]}
                tickFormatter={yLabel === "Accuracy" ? (value) => `${Math.round(value * 100)}%` : undefined}
                tick={{ fontSize: 11 }}
                width={50}
              />
              <Tooltip
                formatter={(value: number) =>
                  yLabel === "Accuracy" ? `${(value * 100).toFixed(2)}%` : value.toFixed(4)
                }
                contentStyle={{ fontSize: "12px" }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke={color}
                fill={color}
                fillOpacity={0.2}
                name="Training"
                isAnimationActive={false}
              />
              {showValidation && (
                <Area
                  type="monotone"
                  dataKey="validationValue"
                  stroke={validationColor}
                  fill={validationColor}
                  fillOpacity={0.2}
                  name="Validation"
                  isAnimationActive={false}
                />
              )}
              <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} verticalAlign="top" height={36} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}

