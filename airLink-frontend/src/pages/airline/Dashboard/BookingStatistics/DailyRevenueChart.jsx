import { formatCurrency } from "@/utils/formateCurrency";

import React from "react";
import { useSelector } from "react-redux";

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
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { formatDate } from "@/utils/formateDate";

const DailyRevenueChart = () => {
  const { statistics } = useSelector((store) => store.booking);

  const dailyRevenueChartConfig = {
    revenue: {
      label: "Revenue",
      color: "hsl(var(--chart-2))",
    },
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Revenue Trend</CardTitle>
        <CardDescription>Last 30 days revenue</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={dailyRevenueChartConfig}
          className="h-[300px] w-full"
        >
          <LineChart
            data={statistics.dailyTrend}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
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
                  labelFormatter={formatDate}
                  formatter={(value) => [formatCurrency(value), "Revenue"]}
                  indicator="line"
                />
              }
            />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="var(--color-revenue)"
              strokeWidth={2}
              dot={{
                fill: "var(--color-revenue)",
              }}
              activeDot={{
                r: 6,
              }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default DailyRevenueChart;
