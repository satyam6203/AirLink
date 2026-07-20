import React, { useState, useMemo } from "react"
import {
  ArrowLeft,
  Search,
  Filter,
  Users,
  UserCheck,
  UserX,
  DollarSign,
  Edit,
  Lock,
  Unlock,
  Settings,
  Eye,
  Calendar,
  Utensils,
  MapPin
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


const CabinSeatManagement = ({ cabin, flightInstance, onBack }) => {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [seatTypeFilter, setSeatTypeFilter] = useState("all")
  const [selectedSeat, setSelectedSeat] = useState(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  console.log("cabin",cabin)

  // Use real seats data from cabin
  const cabinSeats = useMemo(() => {
    return cabin?.seats || []
  }, [cabin?.seats])

  // Apply filters
  const filteredSeats = useMemo(() => {
    let filtered = [...cabinSeats]

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(seat =>
        seat.seatNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (seat.passengerName && seat.passengerName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (seat.bookingReference && seat.bookingReference.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    // Status filter
    if (statusFilter !== "all") {
      switch (statusFilter) {
        case "available":
          filtered = filtered.filter(seat => seat.status === "AVAILABLE")
          break
        case "booked":
          filtered = filtered.filter(seat => seat.status === "BOOKED")
          break
        case "blocked":
          filtered = filtered.filter(seat => seat.status === "BLOCKED")
          break
      }
    }

    // Seat type filter
    if (seatTypeFilter !== "all") {
      filtered = filtered.filter(seat => seat.seatType.toLowerCase() === seatTypeFilter)
    }

    return filtered
  }, [cabinSeats, searchQuery, statusFilter, seatTypeFilter])

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

  const getCabinStats = () => {
    const available = cabinSeats.filter(seat => seat.status === "AVAILABLE").length
    const booked = cabinSeats.filter(seat => seat.status === "BOOKED").length
    const blocked = cabinSeats.filter(seat => seat.status === "BLOCKED").length

    return { available, booked, blocked }
  }

  const stats = getCabinStats()

  const handleSeatAction = (seat, action) => {
    console.log(`Performing ${action} on seat ${seat.seatNumber}`)
    // Implement seat actions here
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Cabins
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              {cabin?.cabinClass?.name} Class Seats
            </h2>
            <p className="text-muted-foreground">
              Flight {flightInstance.flightNumber} • {cabin.totalSeats} seats
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="h-6 w-6 text-blue-600" />
              <div>
                <div className="text-xl font-bold">{cabin.totalSeats}</div>
                <div className="text-sm text-muted-foreground">Total Seats</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <UserCheck className="h-6 w-6 text-green-600" />
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
              <Users className="h-6 w-6 text-orange-600" />
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
              <UserX className="h-6 w-6 text-red-600" />
              <div>
                <div className="text-xl font-bold">{stats.blocked}</div>
                <div className="text-sm text-muted-foreground">Blocked</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("")
                setStatusFilter("all")
                setSeatTypeFilter("all")
              }}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Clear Filters
            </Button>
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
                          <div className="text-xs text-muted-foreground">ID: {seat.passengerId}</div>
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
                          <Utensils className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{seat.mealPreference.replace('_', ' ')}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{formatCurrency(seat.fare)}</span>
                      </div>
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
                                  {seat.mealPreference && (
                                    <div>
                                      <Label className="text-sm font-medium">Meal Preference</Label>
                                      <div className="mt-1 text-sm">{seat.mealPreference.replace('_', ' ')}</div>
                                    </div>
                                  )}
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

export default CabinSeatManagement