import * as React from "react"
import { useLocation, useNavigate } from "react-router-dom"
import {
  Plus,
  Search,
  Filter,
  Calendar,
  Bell
} from "lucide-react"
import { Button } from "@/components/ui/button"

import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/theme-toggle"
import AirlineSidebar from "../Sidebar/AirlineSidebar"
import AirlineRoutes from "../routes/AirlineRoutes"
import { useSelector, useDispatch } from "react-redux"
import { getFlightsByAirline } from "@/Redux/flight/flightThunk"
import { listAllAircrafts } from "@/Redux/aircraft/aircraftThunks"
import { getBookingsByAirline } from "@/Redux/booking/bookingThunk"



const AirlineDashboard = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  // Determine active section from URL
  const getActiveSectionFromPath = (pathname) => {
    if (pathname === '/airline' || pathname === '/airline/' || pathname === '/airline/dashboard') return 'overview'
    if (pathname.includes('/aircraft')) return 'aircraft'
    if (pathname.includes('/baggage-polic')) return 'baggagePolicy'
    if (pathname.includes('/fare-rules')) return 'fareRules'
    if (pathname.includes('/fare/')) return 'flights'
    if (pathname.includes('/flight-cabin')) return 'flights'
    if (pathname.includes('/flights')) return 'flights'
    if (pathname.includes('/schedules')) return 'schedules'
    if (pathname.includes('/instances')) return 'instances'
    if (pathname.includes('/insurance-coverages')) return 'insuranceCoverages'
    if (pathname.includes('/ancillaries')) return 'ancillaries'
    if (pathname.includes('/meals')) return 'meals'
    if (pathname.includes('/coupons')) return 'pricing'
    if (pathname.includes('/pricing')) return 'pricing'
    if (pathname.includes('/bookings')) return 'bookings'
    if (pathname.includes('/route-performance')) return 'route-performance'
    if (pathname.includes('/airport-performance')) return 'airport-performance';
    if (pathname.includes('/reports')) return 'reports'
    return 'overview'
  }

  const activeSection = getActiveSectionFromPath(location.pathname)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false)
  
  // Existing flight, aircraft, and booking management state
  const { flights = [] } = useSelector(state => state.flight || {})
  const { aircrafts = [] } = useSelector(state => state.aircraft || {})
  const { bookings = [] } = useSelector(state => state.booking || {})

  const [statusFilter, setStatusFilter] = React.useState("all")
  const [routeFilter, setRouteFilter] = React.useState("all")

  // Load flights, fleet aircraft, and bookings on component mount
  React.useEffect(() => {
    dispatch(getFlightsByAirline());
    dispatch(listAllAircrafts());
    dispatch(getBookingsByAirline());
  }, [dispatch])

  const dashboardStats = React.useMemo(() => {
    const flightList = Array.isArray(flights) ? flights : [];
    const aircraftList = Array.isArray(aircrafts) ? aircrafts : [];
    const bookingList = Array.isArray(bookings) ? bookings : [];

    const totalFlights = flightList.length;
    const activeFlights = flightList.filter(f => {
      const s = String(f.status || "").toUpperCase();
      return !f.status || s === "SCHEDULED" || s === "ACTIVE" || s === "IN_AIR" || s === "BOARDING" || s === "0";
    }).length;
    const totalAircraft = aircraftList.length;
    const totalBookings = bookingList.length;

    // Calculate revenue from bookings
    const revenue = bookingList.reduce((sum, b) => {
      return sum + Number(b.totalAmount || b.totalPrice || b.amount || 0);
    }, 0);

    // Calculate average occupancy
    let totalCap = 0;
    let totalBooked = 0;
    flightList.forEach(f => {
      const cap = Number(f.aircraft?.seatingCapacity || f.aircraft?.totalSeats || 0);
      const avail = Number(f.totalAvailableSeats ?? cap);
      if (cap > 0) {
        totalCap += cap;
        totalBooked += Math.max(0, cap - avail);
      }
    });

    const avgOccupancy = totalCap > 0 ? Math.round((totalBooked / totalCap) * 100) : (totalFlights > 0 ? 75 : 0);

    return {
      totalFlights,
      activeFlights,
      totalAircraft,
      totalBookings,
      avgOccupancy,
      revenue
    };
  }, [flights, aircrafts, bookings])

  // Handle sidebar section changes
  const handleSectionChange = (sectionId) => {
    console.log("Section changed to:", sectionId)
    switch(sectionId) {
      // Dashboard
      case 'overview':
        navigate('/airline/dashboard')
        break

      // Aircraft Management
      case 'aircraft':
        navigate('/airline/aircraft')
        break
      case 'create-aircraft':
        navigate('/airline/aircraft/new')
        break

      // Flight Management
      case 'flights':
        navigate('/airline/flights')
        break
      case 'flights-create':
        navigate('/airline/flights/new')
        break
      case 'flight-cabin-create':
        navigate('/airline/flight-cabin/new')
        break

      // Flight Schedules
      case 'schedules':
        navigate('/airline/schedules')
        break
      case 'schedules-create':
        navigate('/airline/schedules/new')
        break

      // Flight Instances
      case 'instances':
        navigate('/airline/instances')
        break
      case 'instances-create':
        navigate('/airline/instances/new')
        break

      // Fare Management
      case 'fare-create':
        navigate('/airline/fare/new')
        break

      // Baggage Policy
      case 'baggage-policy-create':
        navigate('/airline/baggage-policies/new')
        break
      case 'baggage-policies':
        navigate('/airline/baggage-policies')
        break

      // Fare Rules
      case 'fare-rules':
        navigate('/airline/fare-rules')
        break
      case 'fare-rules-create':
        navigate('/airline/fare-rules/new')
        break
      case 'fare-rules-templates':
        navigate('/airline/fare-rules/templates')
        break

      // Ancillaries
      case 'ancillaries-catalog':
        navigate('/airline/ancillaries')
        break
      case 'ancillaries-create':
        navigate('/airline/ancillaries/create')
        break
      case 'insurance-coverages':
        navigate('/airline/insurance-coverages')
        break

      // Meals
      case 'meals-catalog':
      case 'meals':
        navigate('/airline/meals')
        break

      // Pricing & Discounts
      case 'pricing-base':
        navigate('/airline/pricing/base')
        break
      case 'pricing-dynamic':
        navigate('/airline/pricing/dynamic')
        break
      case 'coupons':
        navigate('/airline/coupons')
        break
      case 'coupons-create':
        navigate('/airline/coupons/new')
        break
      case 'discounts-list':
        navigate('/airline/pricing/discounts')
        break
      case 'discounts-create':
        navigate('/airline/pricing/discounts/create')
        break
      case 'pricing-rules':
        navigate('/airline/pricing/rules')
        break

      // Bookings
      case 'bookings-list':
        navigate('/airline/bookings')
        break
      case 'bookings-payments':
        navigate('/airline/bookings/payments')
        break

      // Reports & Analytics
      case 'reports-sales':
        navigate('/airline/reports/sales')
        break
      case 'reports-occupancy':
        navigate('/airline/reports/occupancy')
        break
      case 'reports-revenue':
        navigate('/airline/reports/revenue')
        break
      case 'reports-performance':
        navigate('/airline/reports/performance')
        break
      case 'route-performance':
        navigate('/airline/route-performance')
        break
      case 'airport-performance':
        navigate('/airline/airport-performance')
        break
      case 'reports-custom':
        navigate('/airline/reports/custom')
        break

      default:
        navigate('/airline/dashboard')
    }
  }

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed)
  }


  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <AirlineSidebar
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={toggleSidebar}
      />

      {/* Main Content Area */}
      <div className={cn(
        "flex-1 transition-all duration-300 ease-in-out",
        isSidebarCollapsed ? "ml-16" : "ml-80"
      )}>
        {/* Header */}
        <div className="bg-background border-b border-border sticky top-0 z-30">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  {activeSection === "overview" ? "Dashboard Overview" :
                   activeSection === "aircraft" ? "Aircraft Management" :
                   activeSection === "flights" ? "Flight Management" :
                   activeSection === "schedules" ? "Flight Schedules" :
                   activeSection === "instances" ? "Flight Instances" :
                   activeSection === "fareRules" ? "Fare Rules" :
                   activeSection === "baggagePolicy" ? "Baggage Policies" :
                   activeSection === "insuranceCoverages" ? "Insurance Coverage Management" :
                   activeSection === "ancillaries" ? "Ancillaries" :
                   activeSection === "meals" ? "Meal Management" :
                   activeSection === "pricing" ? "Pricing & Discounts" :
                   activeSection === "bookings" ? "Booking Management" :
                   activeSection === "route-performance" ? "Route Performance" :
                   activeSection === "reports" ? "Reports & Analytics" :
                   "Dashboard"}
                </h1>
                <p className="text-muted-foreground">
                  {activeSection === "overview" ? "Comprehensive overview of your airline operations" :
                   activeSection === "aircraft" ? "Manage aircraft details and configurations" :
                   activeSection === "flights" ? "Manage your flight schedules and operations" :
                   activeSection === "schedules" ? "Manage recurring flight schedules and templates" :
                   activeSection === "instances" ? "Manage flight instances and cabin configurations" :
                   activeSection === "fareRules" ? "Configure fare rules and restrictions" :
                   activeSection === "baggagePolicy" ? "Configure and manage baggage allowances for your airline" :
                   activeSection === "insuranceCoverages" ? "Manage and configure insurance coverages for your travel protection products" :
                   activeSection === "ancillaries" ? "Manage ancillary services and add-ons" :
                   activeSection === "meals" ? "Manage meal options and catering services" :
                   activeSection === "pricing" ? "Configure pricing and promotional offers" :
                   activeSection === "bookings" ? "View and manage passenger bookings" :
                   activeSection === "route-performance" ? "Analyze your most profitable and popular routes" :
                   activeSection === "reports" ? "Analytics and performance insights" :
                   "Manage your airline operations"}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <ThemeToggle />
                <Button variant="outline" className="flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  Notifications
                  <Badge className="ml-1 bg-red-100 text-red-800">3</Badge>
                </Button>
               
              </div>
            </div>

            {/* Quick Stats - Show on overview */}
            {activeSection === "overview" && (
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/40 dark:to-blue-900/30 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{dashboardStats.totalFlights}</div>
                  <div className="text-sm font-medium text-blue-800 dark:text-blue-300">Total Flights</div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/40 dark:to-green-900/30 p-4 rounded-xl border border-green-200 dark:border-green-800">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">{dashboardStats.activeFlights}</div>
                  <div className="text-sm font-medium text-green-800 dark:text-green-300">Active Flights</div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/40 dark:to-purple-900/30 p-4 rounded-xl border border-purple-200 dark:border-purple-800">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{dashboardStats.totalAircraft}</div>
                  <div className="text-sm font-medium text-purple-800 dark:text-purple-300">Fleet Aircraft</div>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/40 dark:to-orange-900/30 p-4 rounded-xl border border-orange-200 dark:border-orange-800">
                  <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{dashboardStats.avgOccupancy}%</div>
                  <div className="text-sm font-medium text-orange-800 dark:text-orange-300">Avg Occupancy</div>
                </div>
                <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950/40 dark:to-indigo-900/30 p-4 rounded-xl border border-indigo-200 dark:border-indigo-800">
                  <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                    {dashboardStats.revenue >= 100000
                        ? "\u20B9" + ((dashboardStats.revenue || 0) / 100000).toFixed(1) + "L"
                        : "\u20B9" + (dashboardStats.revenue || 0).toLocaleString("en-IN")}
                  </div>
                  <div className="text-sm font-medium text-indigo-800 dark:text-indigo-300">Revenue</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <ScrollArea className="flex-1 p-6">
          <AirlineRoutes
            flights={flights}
            filteredFlights={flights}
            dashboardStats={dashboardStats}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            routeFilter={routeFilter}
            setRouteFilter={setRouteFilter}
          />
        </ScrollArea>
      </div>

      
    </div>
  )
}



export default AirlineDashboard

