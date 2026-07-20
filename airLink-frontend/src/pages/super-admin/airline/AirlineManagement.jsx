import * as React from "react"
import { useDispatch, useSelector } from "react-redux"
import {
  Building2,
  Plus,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Eye,
  Edit,
  Ban,
  UserCheck,
  DollarSign,
  FileText,
  Phone,
  Mail,
  Globe,
  MapPin,
  Users,
  Plane,
  Download,
  Upload
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  getAllAirlines,
  approveAirline,
  suspendAirline,
  banAirline,
  deleteAirline
} from "@/Redux/airline/airlineThunks"
import { toast } from "sonner"
import AirlineCard from "./AirineCard"



const AirlineManagement = ({ activeSection }) => {
  const dispatch = useDispatch()

  // Redux state
  const { airlines, loading, error } = useSelector(state => state.airline)

  // Local state
  const [filteredAirlines, setFilteredAirlines] = React.useState([])
  const [searchQuery, setSearchQuery] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState("all")
  const [complianceFilter, setComplianceFilter] = React.useState("all")


  // Load airlines on mount
  React.useEffect(() => {
    dispatch(getAllAirlines({ page: 0, size: 100 }))
  }, [dispatch])

  // Filter airlines
  React.useEffect(() => {
    if (!airlines || airlines.length === 0) {
      setFilteredAirlines([])
      return
    }

    let filtered = [...airlines]

    if (searchQuery) {
      filtered = filtered.filter(airline =>
        airline.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        airline.iataCode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        airline.icaoCode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        airline.country?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(airline => airline.status?.toLowerCase() === statusFilter.toLowerCase())
    }

    setFilteredAirlines(filtered)
  }, [airlines, searchQuery, statusFilter, complianceFilter])

  const getStatusBadge = (status) => {
    const statusConfig = {
      "ACTIVE": { color: "bg-green-100 text-green-800", icon: CheckCircle, label: "Active" },
      "INACTIVE": { color: "bg-yellow-100 text-yellow-800", icon: Clock, label: "Inactive" },
      "BANNED": { color: "bg-red-100 text-red-800", icon: XCircle, label: "Banned" },
      "PENDING": { color: "bg-blue-100 text-blue-800", icon: AlertTriangle, label: "Pending" }
    }

    const config = statusConfig[status?.toUpperCase()] || statusConfig["PENDING"]
    const Icon = config.icon

    return (
      <Badge className={cn("flex items-center gap-1", config.color)}>
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    )
  }

  const getComplianceBadge = (airline) => {
    // For now, return a default badge since compliance data structure may differ
    return <Badge className="bg-green-100 text-green-800">Compliant</Badge>
  }

  const handleApprove = async (airlineId) => {
    try {
      await dispatch(approveAirline(airlineId)).unwrap()
      toast.success("Airline approved successfully")
    } catch (err) {
      toast.error(err || "Failed to approve airline")
    }
  }

  const handleReject = async (airlineId) => {
    if (window.confirm("Are you sure you want to reject this airline application?")) {
      try {
        await dispatch(deleteAirline(airlineId)).unwrap()
        toast.success("Airline rejected and deleted successfully")
      } catch (err) {
        toast.error(err || "Failed to reject airline")
      }
    }
  }

  const handleSuspend = async (airlineId) => {
    if (window.confirm("Are you sure you want to suspend this airline?")) {
      try {
        await dispatch(suspendAirline(airlineId)).unwrap()
        toast.success("Airline suspended successfully")
      } catch (err) {
        toast.error(err || "Failed to suspend airline")
      }
    }
  }

  const handleBan = async (airlineId) => {
    if (window.confirm("Are you sure you want to ban this airline?")) {
      try {
        await dispatch(banAirline(airlineId)).unwrap()
        toast.success("Airline banned successfully")
      } catch (err) {
        toast.error(err || "Failed to ban airline")
      }
    }
  }

 

  const renderContent = () => {
    switch (activeSection) {
      case "airlines-list":
        return <AirlinesList />
      case "airlines-pending":
        return <PendingAirlines />
      case "airlines-suspended":
        return <SuspendedAirlines />
      case "airlines-compliance":
        return <ComplianceOverview />
      case "airlines-commission":
        return <CommissionRules />
      default:
        return <AirlinesOverview />
    }
  }

  const AirlinesOverview = () => {
    const totalAirlines = airlines?.length || 0
    const activeAirlines = airlines?.filter(a => a.status === "ACTIVE")?.length || 0
    const inactiveAirlines = airlines?.filter(a => a.status === "INACTIVE")?.length || 0
    const bannedAirlines = airlines?.filter(a => a.status === "BANNED")?.length || 0

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Airlines</p>
                  <p className="text-2xl font-bold text-gray-900">{totalAirlines}</p>
                </div>
                <Building2 className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Airlines</p>
                  <p className="text-2xl font-bold text-green-600">{activeAirlines}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Inactive</p>
                  <p className="text-2xl font-bold text-yellow-600">{inactiveAirlines}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Banned</p>
                  <p className="text-2xl font-bold text-red-600">{bannedAirlines}</p>
                </div>
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <AirlinesList />
      </div>
    )
  }

  const AirlinesList = () => (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>All Airlines</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-1" />
              Import
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search airlines..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="banned">Banned</SelectItem>
            </SelectContent>
          </Select>
       
          
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <p className="mt-2 text-gray-600">Loading airlines...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600">Error: {error}</p>
          </div>
        ) : filteredAirlines.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No airlines found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAirlines.map((airline) => (
              <AirlineCard
                key={airline.id}
                airline={airline}
                getStatusBadge={getStatusBadge}
                getComplianceBadge={getComplianceBadge}
                onApprove={handleApprove}
                onReject={handleReject}
                onSuspend={handleSuspend}
                onBan={handleBan}
                
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )

  const PendingAirlines = () => {
    const pendingAirlines = airlines?.filter(a => a.status === "INACTIVE") || []

    return (
      <Card>
        <CardHeader>
          <CardTitle>Pending Airline Approvals</CardTitle>
        </CardHeader>
        <CardContent>
          {pendingAirlines.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No pending airlines</p>
          ) : (
            <div className="space-y-4">
              {pendingAirlines.map((airline) => (
                <AirlineCard
                  key={airline.id}
                  airline={airline}
                  getStatusBadge={getStatusBadge}
                  getComplianceBadge={getComplianceBadge}
                  onApprove={handleApprove}
                  onReject={handleReject}
                  onSuspend={handleSuspend}
                  onBan={handleBan}
                  
                  showApprovalActions={true}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  const SuspendedAirlines = () => {
    const suspendedAirlines = airlines?.filter(a => a.status === "BANNED") || []

    return (
      <Card>
        <CardHeader>
          <CardTitle>Suspended/Banned Airlines</CardTitle>
        </CardHeader>
        <CardContent>
          {suspendedAirlines.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No suspended airlines</p>
          ) : (
            <div className="space-y-4">
              {suspendedAirlines.map((airline) => (
                <AirlineCard
                  key={airline.id}
                  airline={airline}
                  getStatusBadge={getStatusBadge}
                  getComplianceBadge={getComplianceBadge}
                  onApprove={handleApprove}
                  onReject={handleReject}
                  onSuspend={handleSuspend}
                  onBan={handleBan}
                 
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  const ComplianceOverview = () => (
    <Card>
      <CardHeader>
        <CardTitle>Compliance Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-4">Monitor airline compliance status and documentation.</p>
        {airlines?.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No airlines found</p>
        ) : (
          <div className="space-y-4">
            {airlines?.map((airline) => (
              <div key={airline.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">✈️</div>
                    <div>
                      <h4 className="font-medium">{airline.name}</h4>
                      <p className="text-sm text-gray-600">{airline.iataCode}</p>
                    </div>
                  </div>
                  {getComplianceBadge(airline)}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <span className="text-xs text-gray-500">IATA Code</span>
                    <p className="text-sm font-medium">{airline.iataCode}</p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">ICAO Code</span>
                    <p className="text-sm font-medium">{airline.icaoCode}</p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">Country</span>
                    <p className="text-sm font-medium">{airline.country}</p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">Status</span>
                    <p className="text-sm font-medium">{airline.status}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )

  const CommissionRules = () => (
    <Card>
      <CardHeader>
        <CardTitle>Commission Rules Management</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-4">Configure commission rates and GDS fees for airlines.</p>
        {airlines?.filter(a => a.status === "ACTIVE").length === 0 ? (
          <p className="text-gray-500 text-center py-8">No active airlines found</p>
        ) : (
          <div className="space-y-4">
            {airlines?.filter(a => a.status === "ACTIVE").map((airline) => (
              <div key={airline.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">✈️</div>
                    <div>
                      <h4 className="font-medium">{airline.name}</h4>
                      <p className="text-sm text-gray-600">{airline.country}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Commission Rate</p>
                      <p className="text-lg font-bold text-green-600">2.5%</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )

  return <div className="space-y-6">{renderContent()}</div>
}



export default AirlineManagement
