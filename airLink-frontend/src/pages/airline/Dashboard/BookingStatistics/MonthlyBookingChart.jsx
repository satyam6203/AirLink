import { formatMonth } from "@/utils/formateMonth";
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
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

const MonthlyBookingChart = () => {
  const { statistics } = useSelector((store) => store.booking);
  const monthlyBookingsChartConfig = {
    bookingCount: {
      label: "Bookings",
      color: "hsl(var(--chart-3))",
    },
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Bookings</CardTitle>
        <CardDescription>Last 12 months booking count</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={monthlyBookingsChartConfig}
          className="h-[350px] w-full"
        >
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
              tickFormatter={(value) => value.toLocaleString()}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={formatMonth}
                  indicator="line"
                />
              }
            />
            <Bar
              dataKey="bookingCount"
              fill="var(--color-bookingCount)"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default MonthlyBookingChart;
