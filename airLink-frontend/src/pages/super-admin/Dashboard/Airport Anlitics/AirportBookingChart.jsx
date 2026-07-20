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
import { formatCurrency } from "@/utils/formateCurrency";
import { formatNumber } from "@/utils/formateNumber";
import { BarChart3 } from "lucide-react";
import React from "react";
import { useSelector } from "react-redux";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { COLORS } from "../chartColor";

const AirportBookingChart = () => {
  const { superAdminAirportPerformance } =
    useSelector((store) => store.booking);

  const bookingsChartData =
    superAdminAirportPerformance.topAirportsByBookings.map((airport) => ({
      airport: airport.airportCode,
      bookings: airport.totalBookings,
      revenue: airport.totalRevenue,
    }));

  const chartConfig = {
    bookings: {
      label: "Bookings",
      color: "hsl(var(--chart-1))",
    },
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Top Airports by Bookings
        </CardTitle>
        <CardDescription>Number of bookings per airport</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[450px] w-full">
          <ResponsiveContainer width="100%">
            <BarChart
              data={bookingsChartData}
              margin={{ top: 20, right: 20, bottom: 0, left: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="airport"
                
                axisLine={false}
                tickLine={false}
              />
              <YAxis tickLine={false} axisLine={false} />
              <ChartTooltip
              cursor={false}
                content={
                  <ChartTooltipContent
                  indicator="line"
                    formatter={(value, name) => [
                      name === "bookings"
                        ? formatNumber(value)
                        : formatCurrency(value),
                      name === "bookings" ? "Bookings" : "Revenue",
                    ]}
                  />
                }
              />
              <Bar dataKey="bookings" radius={[8, 8, 0, 0]}>
                {bookingsChartData.map((entry, index) => (
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

export default AirportBookingChart;
