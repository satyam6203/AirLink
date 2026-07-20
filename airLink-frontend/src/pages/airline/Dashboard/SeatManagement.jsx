import * as React from "react"
import { 
  Armchair,
  Plus,
  Search,
  Settings,
  Target,
  Eye,
  Edit,
  Grid3X3,
  Users,
  DollarSign,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

// Mock seat data
const mockSeatMaps = [
  {
    id: "SM001",
    flightNumber: "AI-203",
    aircraftType: "Boeing 737-800",
    totalSeats: 180,
    layout: "3-3",
    classes: {
      economy: { seats: 156, price: 0 },
      business: { seats: 24, price: 500 },
      first: { seats: 0, price: 0 }
    },
    availability: {
      available: 89,
      occupied: 67,
      blocked: 24
    },
    lastUpdated: "2024-02-10"
  },
  {
    id: "SM002",
    flightNumber: "6E-425",
    aircraftType: "Airbus A320",
    totalSeats: 180,
    layout: "3-3",
    classes: {
      economy: { seats: 180, price: 0 },
      business: { seats: 0, price: 0 },
      first: { seats: 0, price: 0 }
    },
    availability: {
      available: 95,
      occupied: 74,
      blocked: 11
    },
    lastUpdated: "2024-02-12"
  }
]

const mockSeatClasses = [
  {
    id: "SC001",
    name: "Economy",
    code: "Y",
    color: "#3B82F6",
    features: ["Standard seat", "Meal included", "15kg baggage"],
    extraPrice: 0,
    pitchMin: 30,
    pitchMax: 32,
    widthMin: 17,
    widthMax: 18
  },
  {
    id: "SC002",
    name: "Premium Economy",
    code: "W",
    color: "#8B5CF6",
    features: ["Extra legroom", "Premium meal", "20kg baggage", "Priority boarding"],
    extraPrice: 300,
    pitchMin: 34,
    pitchMax: 36,
    widthMin: 18,
    widthMax: 19
  },
  {
    id: "SC003",
    name: "Business",
    code: "C",
    color: "#F59E0B",
    features: ["Lie-flat seat", "Gourmet dining", "30kg baggage", "Lounge access"],
    extraPrice: 800,
    pitchMin: 60,
    pitchMax: 78,
    widthMin: 20,
    widthMax: 22
  }
]

const SeatManagement = ({ activeSection }) => {
  const [seatMaps, setSeatMaps] = React.useState(mockSeatMaps)
  const [seatClasses, setSeatClasses] = React.useState(mockSeatClasses)
  const [searchQuery, setSearchQuery] = React.useState("")

  const renderContent = () => {
    switch (activeSection) {
      case "seats-map":
        return <SeatMapsList seatMaps={seatMaps} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      case "seats-config":
        return <SeatConfiguration />
      case "seats-classes":
        return <SeatClasses seatClasses={seatClasses} />
      case "seats-availability":
        return <SeatAvailability seatMaps={seatMaps} />
      default:
        return <SeatOverview seatMaps={seatMaps} seatClasses={seatClasses} />
    }
  }

  return <div className="space-y-6">{renderContent()}</div>
}

const SeatMapsList = ({ seatMaps, searchQuery, setSearchQuery }) => {
  const filteredMaps = seatMaps.filter(map => 
    map.flightNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    map.aircraftType.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Seat Maps</CardTitle>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create Seat Map
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search seat maps..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="space-y-4">
          {filteredMaps.map((seatMap) => (
            <SeatMapCard key={seatMap.id} seatMap={seatMap} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

const SeatMapCard = ({ seatMap }) => {
  const occupancyRate = Math.round((seatMap.availability.occupied / seatMap.totalSeats) * 100)
  
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="bg-purple-100 p-3 rounded-lg">
            <Armchair className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{seatMap.flightNumber}</h3>
            <p className="text-sm text-gray-600">{seatMap.aircraftType} • {seatMap.layout} layout</p>
          </div>
        </div>
        <Badge className="bg-blue-100 text-blue-800">
          {seatMap.totalSeats} seats
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Grid3X3 className="h-4 w-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Layout</span>
          </div>
          <div className="text-sm">
            <div className="font-medium">{seatMap.layout}</div>
            <div className="text-gray-600">{seatMap.totalSeats} total seats</div>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span className="text-sm font-medium text-gray-700">Available</span>
          </div>
          <div className="text-sm">
            <div className="font-medium text-green-600">{seatMap.availability.available}</div>
            <div className="text-gray-600">seats free</div>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-4 w-4 text-blue-500" />
            <span className="text-sm font-medium text-gray-700">Occupied</span>
          </div>
          <div className="text-sm">
            <div className="font-medium text-blue-600">{seatMap.availability.occupied}</div>
            <div className="text-gray-600">{occupancyRate}% full</div>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <XCircle className="h-4 w-4 text-red-500" />
            <span className="text-sm font-medium text-gray-700">Blocked</span>
          </div>
          <div className="text-sm">
            <div className="font-medium text-red-600">{seatMap.availability.blocked}</div>
            <div className="text-gray-600">maintenance</div>
          </div>
        </div>
      </div>

      {/* Seat Classes */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Class Distribution</h4>
        <div className="flex gap-4">
          {seatMap.classes.economy.seats > 0 && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm">Economy: {seatMap.classes.economy.seats}</span>
            </div>
          )}
          {seatMap.classes.business.seats > 0 && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
              <span className="text-sm">Business: {seatMap.classes.business.seats}</span>
            </div>
          )}
          {seatMap.classes.first.seats > 0 && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span className="text-sm">First: {seatMap.classes.first.seats}</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="text-sm text-gray-500">
          Last updated: {new Date(seatMap.lastUpdated).toLocaleDateString()}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Eye className="h-3 w-3 mr-1" />
            View Map
          </Button>
          <Button variant="outline" size="sm">
            <Edit className="h-3 w-3 mr-1" />
            Edit
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-3 w-3 mr-1" />
            Configure
          </Button>
        </div>
      </div>
    </div>
  )
}

const SeatConfiguration = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Seat Configuration</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Aircraft Type
              </label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select aircraft" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="boeing737">Boeing 737-800</SelectItem>
                  <SelectItem value="airbusa320">Airbus A320</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Seat Layout
              </label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select layout" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3-3">3-3 (Economy)</SelectItem>
                  <SelectItem value="2-2">2-2 (Business)</SelectItem>
                  <SelectItem value="1-2-1">1-2-1 (Premium)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button>Save Configuration</Button>
        </div>
      </CardContent>
    </Card>
  )
}

const SeatClasses = ({ seatClasses }) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Seat Classes</CardTitle>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Class
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {seatClasses.map((seatClass) => (
            <SeatClassCard key={seatClass.id} seatClass={seatClass} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

const SeatClassCard = ({ seatClass }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <div 
            className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold"
            style={{ backgroundColor: seatClass.color }}
          >
            {seatClass.code}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{seatClass.name}</h3>
            <p className="text-sm text-gray-600">Class code: {seatClass.code}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-gray-900">
            {seatClass.extraPrice > 0 ? `+₹${seatClass.extraPrice}` : "Base fare"}
          </div>
          <div className="text-sm text-gray-600">Extra charge</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Seat Dimensions</h4>
          <div className="text-sm space-y-1">
            <div>Pitch: {seatClass.pitchMin}-{seatClass.pitchMax} inches</div>
            <div>Width: {seatClass.widthMin}-{seatClass.widthMax} inches</div>
          </div>
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Features</h4>
          <div className="flex flex-wrap gap-1">
            {seatClass.features.map((feature, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {feature}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-100">
        <Button variant="outline" size="sm">
          <Edit className="h-3 w-3 mr-1" />
          Edit
        </Button>
        <Button variant="outline" size="sm">
          <Settings className="h-3 w-3 mr-1" />
          Configure
        </Button>
      </div>
    </div>
  )
}

const SeatAvailability = ({ seatMaps }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Seat Availability Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {seatMaps.map((map) => {
            const totalSeats = map.totalSeats
            const available = map.availability.available
            const occupied = map.availability.occupied
            const blocked = map.availability.blocked
            const occupancyRate = Math.round((occupied / totalSeats) * 100)

            return (
              <div key={map.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-gray-900">{map.flightNumber}</h4>
                    <p className="text-sm text-gray-600">{map.aircraftType}</p>
                  </div>
                  <Badge className={cn(
                    occupancyRate >= 90 ? "bg-red-100 text-red-800" :
                    occupancyRate >= 70 ? "bg-yellow-100 text-yellow-800" :
                    "bg-green-100 text-green-800"
                  )}>
                    {occupancyRate}% occupied
                  </Badge>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                  <div className="flex h-3 rounded-full overflow-hidden">
                    <div 
                      className="bg-blue-500" 
                      style={{ width: `${(occupied / totalSeats) * 100}%` }}
                    />
                    <div 
                      className="bg-red-500" 
                      style={{ width: `${(blocked / totalSeats) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-green-600">{available} available</span>
                  <span className="text-blue-600">{occupied} occupied</span>
                  <span className="text-red-600">{blocked} blocked</span>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

const SeatOverview = ({ seatMaps, seatClasses }) => {
  const totalSeats = seatMaps.reduce((sum, map) => sum + map.totalSeats, 0)
  const totalAvailable = seatMaps.reduce((sum, map) => sum + map.availability.available, 0)
  const totalOccupied = seatMaps.reduce((sum, map) => sum + map.availability.occupied, 0)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Seats</p>
                <p className="text-2xl font-bold text-gray-900">{totalSeats}</p>
              </div>
              <Armchair className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Available</p>
                <p className="text-2xl font-bold text-green-600">{totalAvailable}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Occupied</p>
                <p className="text-2xl font-bold text-blue-600">{totalOccupied}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Seat Classes</p>
                <p className="text-2xl font-bold text-purple-600">{seatClasses.length}</p>
              </div>
              <Target className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default SeatManagement
