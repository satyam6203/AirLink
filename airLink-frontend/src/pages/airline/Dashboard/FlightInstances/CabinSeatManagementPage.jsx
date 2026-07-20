import React, { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import {
  ArrowLeft,
  Plane,
  Users,
  Settings,
  Eye,
  Edit,
  Lock,
  Unlock,
  Search,
  Filter,
  Download,
  Upload,
  RefreshCw,
  MapPin,
  Calendar,
  Clock
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

// Mock data for demonstration
const mockFlightInstance = {
  id: 1,
  flightNumber: "AI101",
  flightName: "Air India Express",
  departureAirport: "Delhi (DEL)",
  arrivalAirport: "Mumbai (BOM)",
  departureDateTime: "2024-01-15T06:30:00Z",
  arrivalDateTime: "2024-01-15T08:45:00Z",
  status: "Active"
}

const mockCabin = {
  id: 1,
  name: "Business Class",
  type: "BUSINESS",
  totalSeats: 24,
  bookedSeats: 18,
  availableSeats: 6,
  currentPrice: 14000.00
}

const mockSeats = Array.from({ length: 24 }, (_, i) => ({
  id: i + 1,
  seatNumber: `${Math.floor(i / 3) + 1}${String.fromCharCode(65 + (i % 3))}`,
  seatType: (i % 3) === 1 ? "MIDDLE" : "WINDOW",
  seatPosition: (i % 3) === 0 ? "LEFT_WINDOW" : (i % 3) === 1 ? "MIDDLE" : "RIGHT_WINDOW",
  status: Math.random() > 0.7 ? "BOOKED" : Math.random() > 0.8 ? "BLOCKED" : "AVAILABLE",
  passengerName: Math.random() > 0.7 ? `Passenger ${i + 1}` : null,
  bookingReference: Math.random() > 0.7 ? `PNR${Math.random().toString(36).substr(2, 6).toUpperCase()}` : null,
  mealPreference: Math.random() > 0.5 ? "VEGETARIAN" : Math.random() > 0.5 ? "NON_VEGETARIAN" : null,
  fare: 14000.00,
  seatCharacteristics: Math.random() > 0.5 ? ["EXTRA_LEGROOM"] : ["PRIORITY_BOARDING"],
  isAvailable: Math.random() < 0.3,
  isOccupied: Math.random() > 0.7
}))

const CabinSeatManagementPage = () => {
  const navigate = useNavigate()
  const { id: instanceId, cabinId } = useParams()

  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [seatTypeFilter, setSeatTypeFilter] = useState("all")
  const [selectedSeat, setSelectedSeat] = useState(null)
  const [bulkAction, setBulkAction] = useState("")
  const [selectedSeats, setSelectedSeats] = useState(new Set())

  // Filter seats based on search and filters
  const filteredSeats = React.useMemo(() => {
    let filtered = [...mockSeats]

    if (searchQuery) {
      filtered = filtered.filter(seat =>
        seat.seatNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (seat.passengerName && seat.passengerName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (seat.bookingReference && seat.bookingReference.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(seat => seat.status.toLowerCase() === statusFilter)
    }

    if (seatTypeFilter !== "all") {
      filtered = filtered.filter(seat => seat.seatType.toLowerCase() === seatTypeFilter)
    }

    return filtered
  }, [searchQuery, statusFilter, seatTypeFilter])

  const getStatusBadge = (status) => {
    const statusConfig = {
      "AVAILABLE": { color: "bg-green-100 text-green-800 border-green-200", icon: "✓" },
      "BOOKED": { color: "bg-blue-100 text-blue-800 border-blue-200", icon: "👤" },
      "BLOCKED": { color: "bg-red-100 text-red-800 border-red-200", icon: "🚫" }
    }

    const config = statusConfig[status] || statusConfig["AVAILABLE"]

    return (
      <Badge className={cn("flex items-center gap-1 border", config.color)}>
        <span>{config.icon}</span>
        {status.charAt(0) + status.slice(1).toLowerCase()}
      </Badge>
    )
  }

  const getSeatTypeIcon = (type) => {
    switch (type) {
      case "WINDOW":
        return "🪟"
      case "AISLE":
        return "🚶"
      case "MIDDLE":
      default:
        return "💺"
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount)
  }

  const formatDateTime = (dateTime) => {
    return new Date(dateTime).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleSeatAction = (seat, action) => {
    console.log(`Performing ${action} on seat ${seat.seatNumber}`)
    // Implement seat actions here
  }

  const handleBulkAction = () => {
    if (bulkAction && selectedSeats.size > 0) {
      console.log(`Performing ${bulkAction} on ${selectedSeats.size} seats`)
      // Implement bulk actions here
      setSelectedSeats(new Set())
      setBulkAction("")
    }
  }

  const toggleSeatSelection = (seatId) => {
    const newSelection = new Set(selectedSeats)
    if (newSelection.has(seatId)) {
      newSelection.delete(seatId)
    } else {
      newSelection.add(seatId)
    }
    setSelectedSeats(newSelection)
  }

  const stats = {
    available: mockSeats.filter(seat => seat.status === "AVAILABLE").length,
    booked: mockSeats.filter(seat => seat.status === "BOOKED").length,
    blocked: mockSeats.filter(seat => seat.status === "BLOCKED").length
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate(`/airline/instances/${instanceId}`)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Instance
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <Plane className="h-8 w-8 text-primary" />
              {mockCabin.name} - Seat Management
            </h1>
            <p className="text-muted-foreground">
              {mockFlightInstance.flightNumber} • {mockFlightInstance.departureAirport} → {mockFlightInstance.arrivalAirport}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Import
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Flight Info Card */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Plane className="h-4 w-4" />
                Flight Details
              </div>
              <div className="text-lg font-medium">{mockFlightInstance.flightNumber}</div>
              <div className="text-sm text-muted-foreground">{mockFlightInstance.flightName}</div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                Route
              </div>
              <div className="text-sm font-medium">
                {mockFlightInstance.departureAirport} → {mockFlightInstance.arrivalAirport}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                Schedule
              </div>
              <div className="text-sm">
                <div>Dep: {formatDateTime(mockFlightInstance.departureDateTime)}</div>
                <div>Arr: {formatDateTime(mockFlightInstance.arrivalDateTime)}</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                Cabin Capacity
              </div>
              <div className="text-lg font-medium">{mockCabin.bookedSeats}/{mockCabin.totalSeats}</div>
              <div className="text-sm text-muted-foreground">{mockCabin.availableSeats} available</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="h-6 w-6 text-blue-600" />
              <div>
                <div className="text-xl font-bold">{mockCabin.totalSeats}</div>
                <div className="text-sm text-muted-foreground">Total Seats</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-6 w-6 rounded bg-green-100 flex items-center justify-center text-green-600 text-xs font-bold">✓</div>
              <div>
                <div className="text-xl font-bold">{stats.available}</div>
                <div className="text-sm text-muted-foreground">Available</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-6 w-6 rounded bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold">👤</div>
              <div>
                <div className="text-xl font-bold">{stats.booked}</div>
                <div className="text-sm text-muted-foreground">Booked</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-6 w-6 rounded bg-red-100 flex items-center justify-center text-red-600 text-xs font-bold">🚫</div>
              <div>
                <div className="text-xl font-bold">{stats.blocked}</div>
                <div className="text-sm text-muted-foreground">Blocked</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search seats, passengers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="booked">Booked</SelectItem>
                  <SelectItem value="blocked">Blocked</SelectItem>
                </SelectContent>
              </Select>

              <Select value={seatTypeFilter} onValueChange={setSeatTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="window">Window</SelectItem>
                  <SelectItem value="middle">Middle</SelectItem>
                  <SelectItem value="aisle">Aisle</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Bulk Actions */}
            {selectedSeats.size > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {selectedSeats.size} selected
                </span>
                <Select value={bulkAction} onValueChange={setBulkAction}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Bulk action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="block">Block Seats</SelectItem>
                    <SelectItem value="unblock">Unblock Seats</SelectItem>
                    <SelectItem value="update-fare">Update Fare</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={handleBulkAction} disabled={!bulkAction}>
                  Apply
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Seat Table */}
      <Card>
        <CardHeader>
          <CardTitle>Seat Map ({filteredSeats.length} seats)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <input
                      type="checkbox"
                      checked={selectedSeats.size === filteredSeats.length && filteredSeats.length > 0}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedSeats(new Set(filteredSeats.map(seat => seat.id)))
                        } else {
                          setSelectedSeats(new Set())
                        }
                      }}
                      className="rounded"
                    />
                  </TableHead>
                  <TableHead>Seat</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Passenger</TableHead>
                  <TableHead>PNR</TableHead>
                  <TableHead>Meal</TableHead>
                  <TableHead>Fare</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSeats.map((seat) => (
                  <TableRow key={seat.id} className="hover:bg-muted/50">
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={selectedSeats.has(seat.id)}
                        onChange={() => toggleSeatSelection(seat.id)}
                        className="rounded"
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getSeatTypeIcon(seat.seatType)}</span>
                        {seat.seatNumber}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        {seat.seatType.charAt(0) + seat.seatType.slice(1).toLowerCase()}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(seat.status)}
                    </TableCell>
                    <TableCell>
                      {seat.passengerName ? (
                        <div>
                          <div className="font-medium">{seat.passengerName}</div>
                          <div className="text-xs text-muted-foreground">Passenger</div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {seat.bookingReference ? (
                        <span className="font-mono text-sm">{seat.bookingReference}</span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {seat.mealPreference ? (
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{seat.mealPreference.replace('_', ' ')}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{formatCurrency(seat.fare)}</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="flex items-center gap-1">
                              <Eye className="h-4 w-4" />
                              View
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-md">
                            <DialogHeader>
                              <DialogTitle>Seat {seat.seatNumber} Details</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label className="text-sm font-medium">Status</Label>
                                <div className="mt-1">{getStatusBadge(seat.status)}</div>
                              </div>
                              {seat.passengerName && (
                                <>
                                  <div>
                                    <Label className="text-sm font-medium">Passenger</Label>
                                    <div className="mt-1 text-sm">{seat.passengerName}</div>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">Booking Reference</Label>
                                    <div className="mt-1 text-sm font-mono">{seat.bookingReference}</div>
                                  </div>
                                </>
                              )}
                              <div>
                                <Label className="text-sm font-medium">Seat Characteristics</Label>
                                <div className="mt-1 flex flex-wrap gap-1">
                                  {seat.seatCharacteristics.map((char, index) => (
                                    <Badge key={index} variant="outline" className="text-xs">
                                      {char.replace('_', ' ')}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <Label className="text-sm font-medium">Fare</Label>
                                <div className="mt-1 text-sm font-medium">{formatCurrency(seat.fare)}</div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSeatAction(seat, "edit")}
                          className="flex items-center gap-1"
                        >
                          <Edit className="h-4 w-4" />
                          Edit
                        </Button>

                        {seat.status === "AVAILABLE" ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSeatAction(seat, "block")}
                            className="flex items-center gap-1 text-red-600 hover:text-red-700"
                          >
                            <Lock className="h-4 w-4" />
                            Block
                          </Button>
                        ) : seat.status === "BLOCKED" ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSeatAction(seat, "unblock")}
                            className="flex items-center gap-1 text-green-600 hover:text-green-700"
                          >
                            <Unlock className="h-4 w-4" />
                            Unblock
                          </Button>
                        ) : null}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default CabinSeatManagementPage