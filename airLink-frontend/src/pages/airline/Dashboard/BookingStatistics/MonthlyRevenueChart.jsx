import { formatCurrency } from '@/utils/formateCurrency'
import { formatMonth } from '@/utils/formateMonth'
import React from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import {
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { useSelector } from 'react-redux';

const MonthlyRevenueChart = () => {
    const { statistics } = useSelector((store) => store.booking);
    const monthlyRevenueChartConfig = {
    revenue: {
      label: "Revenue",
      color: "hsl(var(--chart-4))",
    },
  };
  return (
    <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue</CardTitle>
            <CardDescription>Last 12 months revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={monthlyRevenueChartConfig} className="h-[350px] w-full">
              <BarChart
                data={statistics.monthlyData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="month"
                  tickFormatter={formatMonth}
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                />
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      labelFormatter={formatMonth}
                      formatter={(value) => [formatCurrency(value), 'Revenue']}
                      indicator="line"
                    />
                  }
                />
                <Bar
                  dataKey="revenue"
                  fill="var(--color-revenue)"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
  )
}

export default MonthlyRevenueChart