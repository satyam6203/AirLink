import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getBookingStatisticsForSuperAdmin,
  getAirlinePerformanceForSuperAdmin,
  getRoutePerformanceForSuperAdmin,
  getSuperAdminDashboardStats,
} from "@/Redux/booking/bookingThunk";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Users,
  Shield,
  Clock,
  DollarSign,
  Plane,
  Building2,
  Activity,
  TrendingUp,
  TrendingDown,
  MapPin,
  AlertCircle,
  CheckCircle2,
  Cpu,
  Database,
  Wifi,
  ArrowUpRight,
  ArrowDownRight,
  Globe,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const MONTH_ABBR = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

/** Transform API monthlyData → chart-ready array */
function toChartData(monthlyData = []) {
  return monthlyData.map((d) => ({
    month: MONTH_ABBR[parseInt(d.month.split("-")[1], 10) - 1],
    revenue: parseFloat((d.revenue / 1_000_000).toFixed(2)),
    bookings: d.bookingCount,
  }));
}

const BAR_COLORS = ["#3B82F6", "#8B5CF6", "#F59E0B", "#10B981", "#EC4899", "#06B6D4", "#F97316"];

/** Transform AirlineStatistics[] → chart rows with relative booking-share % */
function toAirlineChartData(airlines = []) {
  const top = airlines.slice(0, 7);
  const maxBookings = Math.max(...top.map((a) => a.totalBookings || 0), 1);
  return top.map((a) => ({
    name: a.airlineName?.length > 10 ? a.airlineName.substring(0, 10) + "…" : (a.airlineName || a.airlineCode || "—"),
    fullName: a.airlineName || a.airlineCode,
    bookings: a.totalBookings || 0,
    revenue: parseFloat(((a.totalRevenue || 0) / 1_000_000).toFixed(2)),
    avgRevenue: Math.round(a.averageRevenuePerBooking || 0),
    share: Math.round(((a.totalBookings || 0) / maxBookings) * 100),
  }));
}

/** Transform RouteStatistics[] → display rows */
function toRouteDisplayData(routes = []) {
  const top = routes.slice(0, 5);
  const maxBookings = Math.max(...top.map((r) => r.totalBookings || 0), 1);
  const avgRevPerBooking =
    top.reduce((s, r) => s + (r.averageRevenuePerBooking || 0), 0) / (top.length || 1);
  return top.map((r) => ({
    route: `${r.departureAirportCode} → ${r.arrivalAirportCode}`,
    bookings: r.totalBookings || 0,
    revenue: Math.round(r.totalRevenue || 0),
    avgRevenue: Math.round(r.averageRevenuePerBooking || 0),
    share: Math.round(((r.totalBookings || 0) / maxBookings) * 100),
    trend: (r.averageRevenuePerBooking || 0) >= avgRevPerBooking ? "up" : "down",
  }));
}

const bookingClassData = [
  { name: "Economy", value: 68, color: "#3B82F6" },
  { name: "Business", value: 22, color: "#8B5CF6" },
  { name: "First", value: 10, color: "#F59E0B" },
];

const activityFeed = [
  { icon: Building2, color: "text-purple-500 bg-purple-50", label: "Air India registered new Boeing 787 aircraft", time: "12 min ago", type: "info" },
  { icon: Shield, color: "text-red-500 bg-red-50", label: "Suspicious login attempt blocked on Agent portal", time: "38 min ago", type: "alert" },
  { icon: CheckCircle2, color: "text-green-500 bg-green-50", label: "System backup completed successfully", time: "2h ago", type: "success" },
  { icon: DollarSign, color: "text-orange-500 bg-orange-50", label: "Monthly commission settlement processed — ₹8.9L", time: "4h ago", type: "info" },
  { icon: Plane, color: "text-blue-500 bg-blue-50", label: "IndiGo added 18 new routes for Q1 schedule", time: "6h ago", type: "info" },
  { icon: AlertCircle, color: "text-yellow-500 bg-yellow-50", label: "API rate limit warning on Flight Search endpoint", time: "8h ago", type: "warning" },
];

const systemMetrics = [
  { label: "CPU Usage", value: 42, icon: Cpu, color: "bg-blue-500", status: "normal" },
  { label: "Memory", value: 61, icon: Database, color: "bg-purple-500", status: "normal" },
  { label: "API Latency", value: 23, icon: Wifi, color: "bg-green-500", status: "good", display: "23ms avg" },
  { label: "DB Connections", value: 78, icon: Database, color: "bg-orange-500", status: "warning" },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

const StatCard = ({ title, value, subtitle, icon: Icon, gradient, trend, trendValue }) => (
  <div className={`${gradient} p-4 rounded-xl border`}>
    <div className="flex items-center justify-between">
      <div>
        <div className="text-2xl font-bold">{value}</div>
        <div className="text-sm font-medium mt-0.5">{title}</div>
      </div>
      <Icon className="h-8 w-8 opacity-80" />
    </div>
    <div className="flex items-center mt-2 gap-1">
      {trend === "up" ? (
        <TrendingUp className="h-3 w-3 text-green-600" />
      ) : trend === "down" ? (
        <TrendingDown className="h-3 w-3 text-red-500" />
      ) : (
        <CheckCircle2 className="h-3 w-3 text-green-600" />
      )}
      <span className="text-xs">{subtitle}</span>
    </div>
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border border-border rounded-lg p-3 shadow-lg text-sm">
        <p className="font-semibold mb-1">{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }}>
            {p.name}: {p.name === "revenue" ? `₹${p.value}M` : p.value.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// ─── Main component ───────────────────────────────────────────────────────────

const PlatformOverview = ({ platformStats }) => {
  const dispatch = useDispatch();
  const {
    superAdminStatistics,
    superAdminStatisticsLoading,
    superAdminAirlinePerformance,
    superAdminAirlinePerformanceLoading,
    superAdminRoutePerformance,
    superAdminRoutePerformanceLoading,
    superAdminDashboardStats,
    superAdminDashboardStatsLoading,
  } = useSelector((store) => store.booking);

  useEffect(() => {
    dispatch(getBookingStatisticsForSuperAdmin());
    dispatch(getAirlinePerformanceForSuperAdmin());
    dispatch(getRoutePerformanceForSuperAdmin());
    dispatch(getSuperAdminDashboardStats());
  }, [dispatch]);

  // Derived chart/display data
  const airlineChartData = superAdminAirlinePerformance?.topAirlinesByBookings?.length
    ? toAirlineChartData(superAdminAirlinePerformance.topAirlinesByBookings)
    : [];

  const routeDisplayData = superAdminRoutePerformance?.topRoutesByBookings?.length
    ? toRouteDisplayData(superAdminRoutePerformance.topRoutesByBookings)
    : [];

  // Build chart data: use live API data when available, fall back to empty array
  const revenueData = superAdminStatistics?.monthlyData?.length
    ? toChartData(superAdminStatistics.monthlyData)
    : [];

  // Live KPI overrides from API
  const todayBookings = superAdminStatistics?.totalBookingsToday ?? null;
  const monthBookings = superAdminStatistics?.totalBookingsThisMonth ?? null;
  const monthRevenue  = superAdminStatistics?.revenueThisMonth ?? null;

  // Dashboard stats card values — prefer live API data, fall back to platformStats mock
  const ds = superAdminDashboardStats;
  const stats = platformStats || {};
  const kpi = {
    totalAirlines: ds?.totalAirlines ?? stats.totalAirlines ?? 24,
    newAirlinesThisMonth: ds?.newAirlinesThisMonth ?? 2,
    totalFlights: ds?.totalFlights ?? stats.totalFlights ?? 1247,
    liveFlightsToday: ds?.liveFlightsToday ?? stats.activeFlights ?? 89,
    totalBookings: ds?.totalBookings ?? stats.totalBookings ?? 15643,
    weeklyBookingGrowthPercent: ds?.weeklyBookingGrowthPercent ?? 12,
    totalRevenue: ds?.totalRevenue ?? stats.systemRevenue ?? 12450000,
    monthlyRevenueGrowthPercent: ds?.monthlyRevenueGrowthPercent ?? 18,
    systemUptime: ds?.systemUptime ?? stats.systemUptime ?? 99.97,
    securityAlerts: ds?.securityAlerts ?? stats.securityAlerts ?? 3,
  };

  return (
    <div className="space-y-6 pb-6">

      {/* ── Row 1: KPI Cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          title="Total Airlines"
          value={superAdminDashboardStatsLoading ? "…" : kpi.totalAirlines.toLocaleString()}
          icon={Building2}
          gradient="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 text-purple-700"
          trend="up"
          subtitle={`+${kpi.newAirlinesThisMonth} this month`}
        />
        <StatCard
          title="Active Flights"
          value={superAdminDashboardStatsLoading ? "…" : kpi.totalFlights.toLocaleString()}
          icon={Plane}
          gradient="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 text-blue-700"
          trend="up"
          subtitle={`${kpi.liveFlightsToday} live now`}
        />
        <StatCard
          title="Total Bookings"
          value={superAdminDashboardStatsLoading ? "…" : kpi.totalBookings >= 1000 ? `${(kpi.totalBookings / 1000).toFixed(1)}K` : kpi.totalBookings.toLocaleString()}
          icon={Users}
          gradient="bg-gradient-to-br from-green-50 to-green-100 border-green-200 text-green-700"
          trend="up"
          subtitle={`+${kpi.weeklyBookingGrowthPercent}% this week`}
        />
        <StatCard
          title="System Revenue"
          value={superAdminDashboardStatsLoading ? "…" : `₹${(kpi.totalRevenue / 1000000).toFixed(1)}M`}
          icon={DollarSign}
          gradient="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 text-orange-700"
          trend="up"
          subtitle={`+${kpi.monthlyRevenueGrowthPercent}% vs last month`}
        />
        <StatCard
          title="System Uptime"
          value={`${kpi.systemUptime}%`}
          icon={Activity}
          gradient="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200 text-indigo-700"
          trend="stable"
          subtitle="All systems operational"
        />
        <StatCard
          title="Security Alerts"
          value={superAdminDashboardStatsLoading ? "…" : kpi.securityAlerts}
          icon={Shield}
          gradient="bg-gradient-to-br from-red-50 to-red-100 border-red-200 text-red-700"
          trend="down"
          subtitle="Requires attention"
        />
      </div>

      {/* ── Row 2: Revenue Trend + Booking Class Breakdown ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Revenue & Bookings Area Chart — 2/3 width */}
        <Card className="xl:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <TrendingUp className="h-4 w-4 text-blue-600" />
                Revenue & Bookings Trend
              </CardTitle>
              <div className="flex items-center gap-2">
                {monthBookings !== null && (
                  <Badge variant="outline" className="text-xs text-purple-600 border-purple-200 bg-purple-50">
                    {monthBookings.toLocaleString()} this month
                  </Badge>
                )}
                {monthRevenue !== null && (
                  <Badge variant="outline" className="text-xs text-green-600 border-green-200 bg-green-50">
                    ₹{(monthRevenue / 1_000_000).toFixed(2)}M revenue
                  </Badge>
                )}
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Last 12 months platform performance
              {todayBookings !== null && (
                <span className="ml-2 text-blue-600 font-medium">
                  · {todayBookings} bookings today
                </span>
              )}
            </p>
          </CardHeader>
          <CardContent>
            {superAdminStatisticsLoading ? (
              <div className="flex items-center justify-center h-[220px]">
                <div className="flex flex-col items-center gap-2">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
                  <p className="text-xs text-muted-foreground">Loading chart data…</p>
                </div>
              </div>
            ) : revenueData.length === 0 ? (
              <div className="flex items-center justify-center h-[220px]">
                <p className="text-sm text-muted-foreground">No data available yet</p>
              </div>
            ) : (
              <>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={revenueData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="bookingsGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                    <YAxis yAxisId="rev" orientation="left" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v}M`} />
                    <YAxis yAxisId="bk" orientation="right" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area yAxisId="rev" type="monotone" dataKey="revenue" name="revenue" stroke="#3B82F6" strokeWidth={2} fill="url(#revenueGrad)" />
                    <Area yAxisId="bk" type="monotone" dataKey="bookings" name="bookings" stroke="#8B5CF6" strokeWidth={2} fill="url(#bookingsGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
                <div className="flex gap-4 mt-2 justify-end">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <span className="w-3 h-0.5 bg-blue-500 inline-block rounded" />Revenue
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <span className="w-3 h-0.5 bg-purple-500 inline-block rounded" />Bookings
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Booking Class Breakdown — 1/3 width */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Globe className="h-4 w-4 text-purple-600" />
              Booking Class Split
            </CardTitle>
            <p className="text-xs text-muted-foreground">Current month distribution</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie
                  data={bookingClassData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {bookingClassData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => `${v}%`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-1">
              {bookingClassData.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: item.color }} />
                    <span className="text-muted-foreground">{item.name}</span>
                  </div>
                  <span className="font-semibold">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Row 3: Airline Performance + Top Routes ── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* Airline Performance Bar Chart */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <Building2 className="h-4 w-4 text-orange-600" />
                Airline Performance
              </CardTitle>
              {superAdminAirlinePerformance && (
                <Badge variant="outline" className="text-xs">
                  {superAdminAirlinePerformance.topAirlinesByBookings?.length || 0} airlines
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground">Total bookings by airline — all time</p>
          </CardHeader>
          <CardContent>
            {superAdminAirlinePerformanceLoading ? (
              <div className="flex items-center justify-center h-[280px]">
                <div className="flex flex-col items-center gap-2">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" />
                  <p className="text-xs text-muted-foreground">Loading airline data…</p>
                </div>
              </div>
            ) : airlineChartData.length === 0 ? (
              <div className="flex items-center justify-center h-[280px]">
                <p className="text-sm text-muted-foreground">No airline data available</p>
              </div>
            ) : (
              <>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart
                    data={airlineChartData}
                    layout="vertical"
                    margin={{ top: 0, right: 20, left: 10, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" />
                    <XAxis type="number" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={(v) => v >= 1000 ? `${(v/1000).toFixed(0)}K` : v} />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} width={70} />
                    <Tooltip
                      formatter={(v, name) =>
                        name === "bookings" ? [v.toLocaleString(), "Bookings"] : [v, name]
                      }
                      labelFormatter={(label, payload) => payload?.[0]?.payload?.fullName || label}
                    />
                    <Bar dataKey="bookings" name="Bookings" radius={[0, 4, 4, 0]}>
                      {airlineChartData.map((_, i) => (
                        <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                {/* Booking share bars */}
                <div className="mt-3 space-y-1.5">
                  {airlineChartData.map((a, i) => (
                    <div key={a.name} className="flex items-center gap-2 text-xs">
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: BAR_COLORS[i % BAR_COLORS.length] }}
                      />
                      <span className="w-[68px] text-muted-foreground truncate shrink-0" title={a.fullName}>{a.name}</span>
                      <Progress value={a.share} className="h-1.5 flex-1" />
                      <span className="w-10 text-right font-medium shrink-0">
                        {a.bookings >= 1000 ? `${(a.bookings / 1000).toFixed(1)}K` : a.bookings}
                      </span>
                    </div>
                  ))}
                  <p className="text-xs text-muted-foreground pt-1">Booking share relative to top airline</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Top Routes */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <MapPin className="h-4 w-4 text-green-600" />
                Top Routes
              </CardTitle>
              {superAdminRoutePerformance && (
                <Badge variant="outline" className="text-xs">
                  by bookings
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground">Highest traffic routes — all time</p>
          </CardHeader>
          <CardContent>
            {superAdminRoutePerformanceLoading ? (
              <div className="flex items-center justify-center h-[280px]">
                <div className="flex flex-col items-center gap-2">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500" />
                  <p className="text-xs text-muted-foreground">Loading route data…</p>
                </div>
              </div>
            ) : routeDisplayData.length === 0 ? (
              <div className="flex items-center justify-center h-[280px]">
                <p className="text-sm text-muted-foreground">No route data available</p>
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  {routeDisplayData.map((r, i) => (
                    <div key={r.route} className="flex items-center gap-3">
                      <span className="text-xs font-bold text-muted-foreground w-4 shrink-0">{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-semibold">{r.route}</span>
                          <div className="flex items-center gap-1.5">
                            {r.trend === "up" ? (
                              <ArrowUpRight className="h-3 w-3 text-green-500" />
                            ) : (
                              <ArrowDownRight className="h-3 w-3 text-red-400" />
                            )}
                            <span className="text-xs text-muted-foreground">
                              {r.bookings.toLocaleString()} bookings
                            </span>
                            <Badge
                              variant="outline"
                              className={`text-xs px-1.5 py-0 ${
                                r.share >= 85
                                  ? "border-green-200 bg-green-50 text-green-700"
                                  : r.share >= 50
                                  ? "border-yellow-200 bg-yellow-50 text-yellow-700"
                                  : "border-slate-200 bg-slate-50 text-slate-600"
                              }`}
                            >
                              {r.share}%
                            </Badge>
                          </div>
                        </div>
                        <Progress value={r.share} className="h-1.5" />
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Avg ₹{r.avgRevenue.toLocaleString()} / booking
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-3 border-t border-border pt-2">
                  Share relative to highest-traffic route · ↑ above-avg revenue · ↓ below-avg revenue
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ── Row 4: System Health + Activity Feed ── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* System Health */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <Activity className="h-4 w-4 text-indigo-600" />
                System Health
              </CardTitle>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse inline-block" />
                <span className="text-xs text-green-600 font-medium">All Operational</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {systemMetrics.map((m) => (
              <div key={m.label}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <m.icon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{m.label}</span>
                  </div>
                  <span className={`text-sm font-bold ${m.status === "warning" ? "text-orange-600" : m.status === "good" ? "text-green-600" : "text-foreground"}`}>
                    {m.display || `${m.value}%`}
                  </span>
                </div>
                <Progress
                  value={m.value}
                  className={`h-2 ${m.status === "warning" ? "[&>div]:bg-orange-500" : m.status === "good" ? "[&>div]:bg-green-500" : ""}`}
                />
              </div>
            ))}
            <div className="grid grid-cols-3 gap-3 pt-2 border-t border-border">
              <div className="text-center">
                <p className="text-lg font-bold text-green-600">99.97%</p>
                <p className="text-xs text-muted-foreground">Uptime</p>
              </div>
              <div className="text-center border-x border-border">
                <p className="text-lg font-bold text-blue-600">23ms</p>
                <p className="text-xs text-muted-foreground">Avg Response</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-purple-600">1.2K</p>
                <p className="text-xs text-muted-foreground">Req / min</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Activity Feed */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Clock className="h-4 w-4 text-green-600" />
              Recent Activity
            </CardTitle>
            <p className="text-xs text-muted-foreground">Platform-wide events feed</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activityFeed.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={`p-1.5 rounded-lg shrink-0 ${item.color}`}>
                    <item.icon className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm leading-snug">{item.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PlatformOverview;
