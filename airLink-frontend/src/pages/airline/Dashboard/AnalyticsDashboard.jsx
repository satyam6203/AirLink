import * as React from "react"
import { 
  TrendingUp,
  TrendingDown,
  Users,
  Plane,
  DollarSign,
  Calendar,
  BarChart3,
  PieChart,
  Target,
  Clock,
  MapPin,
  Star
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const AnalyticsDashboard = ({ flights }) => {
  const [dateRange, setDateRange] = React.useState("7days")
  const [selectedMetric, setSelectedMetric] = React.useState("revenue")

  // Calculate analytics data
  const analytics = React.useMemo(() => {
    const totalFlights = flights.length
    const activeFlights = flights.filter(f => f.status === "Active").length
    const totalBookings = flights.reduce((sum, f) => sum + f.bookings, 0)
    const totalCapacity = flights.reduce((sum, f) => sum + f.aircraft.capacity, 0)
    const totalRevenue = flights.reduce((sum, f) => sum + (f.bookings * f.pricing.economy), 0)
    const avgOccupancy = totalCapacity > 0 ? Math.round((totalBookings / totalCapacity) * 100) : 0
    const onTimeFlights = flights.filter(f => f.realTimeStatus === "On-time").length
    const delayedFlights = flights.filter(f => f.realTimeStatus === "Delayed").length
    const cancelledFlights = flights.filter(f => f.realTimeStatus === "Cancelled").length

    // Route performance
    const routeStats = {}
    flights.forEach(flight => {
      const route = `${flight.route.departure.airport}-${flight.route.arrival.airport}`
      if (!routeStats[route]) {
        routeStats[route] = {
          route: route,
          flights: 0,
          bookings: 0,
          revenue: 0,
          capacity: 0,
          cities: `${flight.route.departure.city} → ${flight.route.arrival.city}`
        }
      }
      routeStats[route].flights += 1
      routeStats[route].bookings += flight.bookings
      routeStats[route].revenue += flight.bookings * flight.pricing.economy
      routeStats[route].capacity += flight.aircraft.capacity
    })

    const topRoutes = Object.values(routeStats)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5)

    // Aircraft performance
    const aircraftStats = {}
    flights.forEach(flight => {
      if (!aircraftStats[flight.aircraft.type]) {
        aircraftStats[flight.aircraft.type] = {
          type: flight.aircraft.type,
          flights: 0,
          bookings: 0,
          revenue: 0,
          capacity: 0
        }
      }
      aircraftStats[flight.aircraft.type].flights += 1
      aircraftStats[flight.aircraft.type].bookings += flight.bookings
      aircraftStats[flight.aircraft.type].revenue += flight.bookings * flight.pricing.economy
      aircraftStats[flight.aircraft.type].capacity += flight.aircraft.capacity
    })

    const topAircraft = Object.values(aircraftStats)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5)

    return {
      totalFlights,
      activeFlights,
      totalBookings,
      totalCapacity,
      totalRevenue,
      avgOccupancy,
      onTimeFlights,
      delayedFlights,
      cancelledFlights,
      topRoutes,
      topAircraft,
      onTimePercentage: totalFlights > 0 ? Math.round((onTimeFlights / totalFlights) * 100) : 0,
      revenuePerFlight: totalFlights > 0 ? Math.round(totalRevenue / totalFlights) : 0
    }
  }, [flights])

  const kpiCards = [
    {
      title: "Total Revenue",
      value: `₹${(analytics.totalRevenue / 100000).toFixed(1)}L`,
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
      color: "text-green-600"
    },
    {
      title: "Total Bookings",
      value: analytics.totalBookings.toLocaleString(),
      change: "+8.3%",
      trend: "up", 
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Average Occupancy",
      value: `${analytics.avgOccupancy}%`,
      change: "+5.2%",
      trend: "up",
      icon: Target,
      color: "text-purple-600"
    },
    {
      title: "On-Time Performance",
      value: `${analytics.onTimePercentage}%`,
      change: "-2.1%",
      trend: "down",
      icon: Clock,
      color: "text-orange-600"
    },
    {
      title: "Revenue per Flight",
      value: `₹${(analytics.revenuePerFlight / 1000).toFixed(0)}K`,
      change: "+15.7%",
      trend: "up",
      icon: TrendingUp,
      color: "text-indigo-600"
    },
    {
      title: "Fleet Utilization",
      value: `${Math.round((analytics.activeFlights / analytics.totalFlights) * 100)}%`,
      change: "+3.4%",
      trend: "up",
      icon: Plane,
      color: "text-teal-600"
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
          <p className="text-gray-600">Performance insights and business metrics</p>
        </div>
        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7days">Last 7 days</SelectItem>
            <SelectItem value="30days">Last 30 days</SelectItem>
            <SelectItem value="90days">Last 90 days</SelectItem>
            <SelectItem value="1year">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kpiCards.map((kpi, index) => {
          const Icon = kpi.icon
          const TrendIcon = kpi.trend === "up" ? TrendingUp : TrendingDown
          
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{kpi.title}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{kpi.value}</p>
                    <div className="flex items-center mt-2">
                      <TrendIcon className={cn("h-3 w-3 mr-1", 
                        kpi.trend === "up" ? "text-green-600" : "text-red-600"
                      )} />
                      <span className={cn("text-xs font-medium", 
                        kpi.trend === "up" ? "text-green-600" : "text-red-600"
                      )}>
                        {kpi.change}
                      </span>
                      <span className="text-xs text-gray-500 ml-1">vs last period</span>
                    </div>
                  </div>
                  <div className={cn("p-3 rounded-lg", 
                    kpi.color === "text-green-600" ? "bg-green-100" :
                    kpi.color === "text-blue-600" ? "bg-blue-100" :
                    kpi.color === "text-purple-600" ? "bg-purple-100" :
                    kpi.color === "text-orange-600" ? "bg-orange-100" :
                    kpi.color === "text-indigo-600" ? "bg-indigo-100" :
                    "bg-teal-100"
                  )}>
                    <Icon className={cn("h-6 w-6", kpi.color)} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Flight Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-blue-600" />
              Flight Status Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">On-time</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{analytics.onTimeFlights}</span>
                  <Badge className="bg-green-100 text-green-800">
                    {analytics.onTimePercentage}%
                  </Badge>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Delayed</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{analytics.delayedFlights}</span>
                  <Badge className="bg-yellow-100 text-yellow-800">
                    {Math.round((analytics.delayedFlights / analytics.totalFlights) * 100)}%
                  </Badge>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Cancelled</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{analytics.cancelledFlights}</span>
                  <Badge className="bg-red-100 text-red-800">
                    {Math.round((analytics.cancelledFlights / analytics.totalFlights) * 100)}%
                  </Badge>
                </div>
              </div>
            </div>
            
            {/* Visual Progress Bars */}
            <div className="mt-6 space-y-3">
              <div>
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Performance Overview</span>
                  <span>{analytics.totalFlights} total flights</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-l-full" 
                    style={{ width: `${analytics.onTimePercentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Occupancy Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-purple-600" />
              Occupancy by Aircraft
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.topAircraft.map((aircraft, index) => {
                const occupancyRate = Math.round((aircraft.bookings / aircraft.capacity) * 100)
                return (
                  <div key={aircraft.type}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900">{aircraft.type}</span>
                      <span className="text-sm text-gray-600">{occupancyRate}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={cn("h-2 rounded-full",
                          occupancyRate >= 90 ? "bg-green-500" :
                          occupancyRate >= 70 ? "bg-yellow-500" :
                          "bg-red-500"
                        )} 
                        style={{ width: `${occupancyRate}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>{aircraft.bookings} bookings</span>
                      <span>₹{(aircraft.revenue / 100000).toFixed(1)}L revenue</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Routes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-green-600" />
              Top Performing Routes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.topRoutes.map((route, index) => (
                <div key={route.route} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-blue-600">#{index + 1}</span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{route.route}</div>
                      <div className="text-sm text-gray-600">{route.cities}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">₹{(route.revenue / 100000).toFixed(1)}L</div>
                    <div className="text-sm text-gray-600">{route.bookings} bookings</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Fleet Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-600" />
              Fleet Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.topAircraft.map((aircraft, index) => {
                const efficiency = Math.round((aircraft.revenue / aircraft.flights) / 1000)
                return (
                  <div key={aircraft.type} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <Plane className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{aircraft.type}</div>
                        <div className="text-sm text-gray-600">{aircraft.flights} flights</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">₹{efficiency}K</div>
                      <div className="text-sm text-gray-600">per flight</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Key Insights & Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Revenue Growth</h4>
              <p className="text-sm text-blue-800">
                Your revenue has increased by 12.5% this period. The {analytics.topRoutes[0]?.route} route is your highest performer.
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-900 mb-2">Occupancy Rate</h4>
              <p className="text-sm text-green-800">
                Average occupancy of {analytics.avgOccupancy}% is {analytics.avgOccupancy >= 80 ? 'excellent' : 'good'}. Consider adjusting capacity on underperforming routes.
              </p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <h4 className="font-medium text-orange-900 mb-2">On-Time Performance</h4>
              <p className="text-sm text-orange-800">
                {analytics.onTimePercentage}% on-time rate. Focus on improving operational efficiency to reduce delays.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default AnalyticsDashboard

