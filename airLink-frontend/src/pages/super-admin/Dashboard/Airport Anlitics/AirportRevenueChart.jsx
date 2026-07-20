import { formatCurrency } from "@/utils/formateCurrency";
import { formatNumber } from "@/utils/formateNumber";
import React from "react";
import { useSelector } from "react-redux";
import { COLORS } from "../chartColor";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DollarSign } from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

const AirportRevenueChart = () => {
  const { superAdminAirportPerformance } = useSelector(
    (store) => store.booking
  );

  const revenueChartData =
    superAdminAirportPerformance.topAirportsByRevenue.map((airport) => ({
      airport: airport.airportCode,
      bookings: airport.totalBookings,
      revenue: airport.totalRevenue,
    }));

  const chartConfig = {
    bookings: {
      label: "Bookings",
      color: "hsl(var(--chart-1))",
    },
    revenue: {
      label: "Revenue",
      color: "hsl(var(--chart-2))",
    },
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Top Airports by Revenue
        </CardTitle>
        <CardDescription>Revenue generated per airport</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[450px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={revenueChartData}
              margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="airport"
             
                textAnchor="end"
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value, name) => [
                      name === "revenue"
                        ? formatCurrency(value)
                        : formatNumber(value),
                      name === "revenue" ? "Revenue" : "Bookings",
                    ]}
                  />
                }
              />
              <Bar dataKey="revenue" radius={[8, 8, 0, 0]}>
                {revenueChartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default AirportRevenueChart;
