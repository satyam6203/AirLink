import * as React from "react"
import {
  Search,
  Filter,
  Download,
  Calendar,
  Clock,
  MapPin,
  Plane,
  User,
  CreditCard,
  Phone,
  Mail,
  MoreVertical,
  ArrowRight,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader,
  Star,
  RefreshCw,
  Receipt,
  Eye,
  Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { useEffect } from "react"

import { getBookingsByUser } from "@/Redux/booking/bookingThunk"


import { useSelector } from "react-redux"
import TravellerBookingCard from "./TravellerBookingCard"

// Mock booking data


const BookingHistory = () => {
  const {bookings}=useSelector(state=>state.booking)
  const navigate = useNavigate()
  const [filteredBookings, setFilteredBookings] = React.useState(bookings)

  const [activeTab, setActiveTab] = React.useState("all")
  const dispatch=useDispatch();

  useEffect(()=>{
    dispatch(getBookingsByUser())
  },[])

  // Filter and sort logic
  React.useEffect(() => {
    let filtered = [...bookings]

  

    // Tab filter
    if (activeTab !== "all") {
      if (activeTab === "upcoming") {
        filtered = filtered.filter(booking => booking.isUpcoming)
      } else if (activeTab === "past") {
        filtered = filtered.filter(booking => booking.isPast)
      } else if (activeTab === "cancelled") {
        filtered = filtered.filter(booking => booking.status?.toLowerCase() === "cancelled")
      }
    }

    

    

    setFilteredBookings(filtered)
  }, [bookings, activeTab])

  const getStatusBadge = (status) => {
    const statusConfig = {
      confirmed: { label: "Confirmed", variant: "default", icon: CheckCircle, color: "bg-green-100 text-green-800" },
      pending: { label: "Pending", variant: "secondary", icon: AlertCircle, color: "bg-yellow-100 text-yellow-800" },
      pending_payment: { label: "Pending Payment", variant: "secondary", icon: AlertCircle, color: "bg-yellow-100 text-yellow-800" },
      cancelled: { label: "Cancelled", variant: "destructive", icon: XCircle, color: "bg-red-100 text-red-800" },
      completed: { label: "Completed", variant: "default", icon: CheckCircle, color: "bg-blue-100 text-blue-800" },
      refund_initiated: { label: "Refund Initiated", variant: "secondary", icon: Loader, color: "bg-purple-100 text-purple-800" }
    }

    const config = statusConfig[status?.toLowerCase()] || statusConfig.confirmed
    const Icon = config.icon

    return (
      <Badge className={cn("flex items-center gap-1", config.color)}>
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    )
  }

  const getAirlineLogo = (code) => {
    const logos = {
      "6E": "🔵", // IndiGo
      "AI": "🔴", // Air India
      "SG": "🟡", // SpiceJet
      "UK": "🟣", // Vistara
      "G8": "🟠", // GoAir
      "I5": "🟢"  // AirAsia
    }
    return logos[code] || "✈️"
  }


  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-background border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground">My Bookings</h1>
                <p className="text-muted-foreground">Manage your flight bookings and travel history</p>
              </div>
              <Button className="flex items-center gap-2">
                <Plane className="h-4 w-4" />
                Book New Flight
              </Button>
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 bg-muted rounded-lg p-1 w-fit">
              {[
                { id: "all", label: "All Bookings" },
                { id: "upcoming", label: "Upcoming" },
                { id: "past", label: "Past" },
                { id: "cancelled", label: "Cancelled" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "px-4 py-2 rounded-md text-sm font-medium transition-all",
                    activeTab === tab.id
                      ? "bg-background text-primary shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="">
          

          {/* Main Content */}
          <div className="">
            <div className="space-y-4">
              {filteredBookings.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Plane className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">No bookings found</h3>
                    <p className="text-muted-foreground">Try adjusting your filters or search criteria</p>
                  </CardContent>
                </Card>
              ) : (
                filteredBookings.map((booking) => (
                  <TravellerBookingCard key={booking.id} booking={booking} getStatusBadge={getStatusBadge} getAirlineLogo={getAirlineLogo} navigate={navigate} />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}



export default BookingHistory
