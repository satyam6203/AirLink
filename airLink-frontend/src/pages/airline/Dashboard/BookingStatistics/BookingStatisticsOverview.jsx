import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { TrendingUp, DollarSign, Calendar, BarChart3 } from "lucide-react";
import RoutePerformance from "../RoutePerformance";
import { getBookingStatisticsForAirline } from "@/Redux/booking/bookingThunk";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts";
import DailyBookingChart from "./DailyBookingChart";
import DailyRevenueChart from "./DailyRevenueChart";
import MonthlyBookingChart from "./MonthlyBookingChart";
import { Month } from "react-day-picker";
import MonthlyRevenueChart from "./MonthlyRevenueChart";
import { formatCurrency } from "@/utils/formateCurrency";

const BookingStatisticsOverview = () => {
  const dispatch = useDispatch();
  const { statistics, loading, error } = useSelector((store) => store.booking);

  useEffect(() => {
    dispatch(getBookingStatisticsForAirline());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        Error loading statistics: {error}
      </div>
    );
  }

  if (!statistics) {
    return null;
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Booking Statistics
        </h1>
        <p className="text-muted-foreground">
          Monitor your booking performance and revenue trends
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Today's Bookings
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statistics.totalBookingsToday}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Bookings made today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Today's Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(statistics.revenueToday)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Revenue generated today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Monthly Bookings
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statistics.totalBookingsThisMonth}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Bookings this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Monthly Revenue
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(statistics.revenueThisMonth)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Revenue this month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Daily Trends - Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Bookings Chart */}
        <DailyBookingChart />

        {/* Daily Revenue Chart */}
        <DailyRevenueChart />
      </div>

      {/* Monthly Charts - Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Bookings Chart */}
        <MonthlyBookingChart />

        {/* Monthly Revenue Chart */}
        <MonthlyRevenueChart />
        {/* Route Performance Section */}
        <RoutePerformance />
      </div>
    </div>
  );
};

export default BookingStatisticsOverview;
