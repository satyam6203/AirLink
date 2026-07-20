import React from "react";
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
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { useSelector } from "react-redux";
import { formatDate } from "@/utils/formateDate";
const DailyBookingChart = () => {
  const { statistics } = useSelector((store) => store.booking);

  // Chart configurations
  const dailyBookingsChartConfig = {
    bookingCount: {
      label: "Bookings",
      color: "hsl(var(--chart-1))",
    },
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Bookings Trend</CardTitle>
        <CardDescription>Last 30 days booking count</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={dailyBookingsChartConfig}
          className="h-[300px] w-full"
        >
          <AreaChart
            data={statistics.dailyTrend}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="fillBookingCount" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-bookingCount)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-bookingCount)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
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
              tickFormatter={(value) => value.toLocaleString()}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={formatDate}
                  indicator="line"
                />
              }
            />
            <Area
              type="monotone"
              dataKey="bookingCount"
              stroke="var(--color-bookingCount)"
              fill="url(#fillBookingCount)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default DailyBookingChart;
