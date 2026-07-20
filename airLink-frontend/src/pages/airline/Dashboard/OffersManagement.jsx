import * as React from "react"
import { 
  Plus,
  Search,
  Filter,
  Tag,
  Calendar,
  TrendingUp,
  Users,
  DollarSign,
  Eye,
  Edit,
  Trash2,
  Copy,
  MoreVertical,
  Gift,
  Percent,
  Clock,
  Target,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

// Mock offers data
const mockOffers = [
  {
    id: "OFF001",
    code: "WELCOME50",
    title: "Welcome Offer",
    description: "Get 50% off on your first booking",
    type: "percentage",
    value: 50,
    maxDiscount: 2000,
    minBooking: 3000,
    validFrom: "2024-01-01",
    validTill: "2024-03-31",
    usageLimit: 1000,
    usedCount: 245,
    status: "Active",
    applicableRoutes: ["All"],
    applicableClasses: ["Economy", "Business"],
    userType: "New",
    createdBy: "admin_001",
    createdAt: "2024-01-01"
  },
  {
    id: "OFF002",
    code: "SAVE20",
    title: "Save More",
    description: "Flat ₹20 discount on domestic flights",
    type: "fixed",
    value: 20,
    maxDiscount: 20,
    minBooking: 1000,
    validFrom: "2024-02-01",
    validTill: "2024-02-29",
    usageLimit: 5000,
    usedCount: 1823,
    status: "Active",
    applicableRoutes: ["DEL-BOM", "BLR-DEL", "BOM-BLR"],
    applicableClasses: ["Economy"],
    userType: "All",
    createdBy: "admin_002",
    createdAt: "2024-01-15"
  },
  {
    id: "OFF003",
    code: "FESTIVE30",
    title: "Festival Special",
    description: "30% off on all flights during festival season",
    type: "percentage",
    value: 30,
    maxDiscount: 5000,
    minBooking: 5000,
    validFrom: "2024-03-01",
    validTill: "2024-03-15",
    usageLimit: 500,
    usedCount: 478,
    status: "Inactive",
    applicableRoutes: ["All"],
    applicableClasses: ["Economy", "Business", "First"],
    userType: "All",
    createdBy: "admin_001",
    createdAt: "2024-02-20"
  },
  {
    id: "OFF004",
    code: "BUSINESS100",
    title: "Business Class Deal",
    description: "₹100 off on business class bookings",
    type: "fixed",
    value: 100,
    maxDiscount: 100,
    minBooking: 8000,
    validFrom: "2024-02-10",
    validTill: "2024-04-10",
    usageLimit: 200,
    usedCount: 67,
    status: "Active",
    applicableRoutes: ["All"],
    applicableClasses: ["Business"],
    userType: "All",
    createdBy: "admin_003",
    createdAt: "2024-02-10"
  }
]

const OffersManagement = () => {
  const [offers, setOffers] = React.useState(mockOffers)
  const [filteredOffers, setFilteredOffers] = React.useState(mockOffers)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState("all")
  const [typeFilter, setTypeFilter] = React.useState("all")
  const [showOfferForm, setShowOfferForm] = React.useState(false)
  const [editingOffer, setEditingOffer] = React.useState(null)

  // Filter offers
  React.useEffect(() => {
    let filtered = [...offers]

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(offer => 
        offer.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        offer.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        offer.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(offer => offer.status.toLowerCase() === statusFilter)
    }

    // Type filter
    if (typeFilter !== "all") {
      filtered = filtered.filter(offer => offer.type === typeFilter)
    }

    setFilteredOffers(filtered)
  }, [offers, searchQuery, statusFilter, typeFilter])

  const getStatusBadge = (status) => {
    const statusConfig = {
      "Active": { color: "bg-green-100 text-green-800", icon: CheckCircle },
      "Inactive": { color: "bg-gray-100 text-gray-800", icon: XCircle },
      "Expired": { color: "bg-red-100 text-red-800", icon: AlertCircle }
    }
    
    const config = statusConfig[status] || statusConfig["Active"]
    const Icon = config.icon
    
    return (
      <Badge className={cn("flex items-center gap-1", config.color)}>
        <Icon className="h-3 w-3" />
        {status}
      </Badge>
    )
  }

  const getTypeIcon = (type) => {
    return type === "percentage" ? Percent : DollarSign
  }

  const handleEditOffer = (offer) => {
    setEditingOffer(offer)
    setShowOfferForm(true)
  }

  const handleDeleteOffer = (offerId) => {
    if (window.confirm("Are you sure you want to delete this offer?")) {
      setOffers(offers.filter(o => o.id !== offerId))
    }
  }

  const handleDuplicateOffer = (offer) => {
    const newOffer = {
      ...offer,
      id: `OFF${String(offers.length + 1).padStart(3, '0')}`,
      code: `${offer.code}_COPY`,
      title: `${offer.title} (Copy)`,
      usedCount: 0,
      createdAt: new Date().toISOString().split('T')[0]
    }
    setOffers([...offers, newOffer])
  }

  const handleToggleStatus = (offerId) => {
    setOffers(offers.map(offer => 
      offer.id === offerId 
        ? { ...offer, status: offer.status === "Active" ? "Inactive" : "Active" }
        : offer
    ))
  }

  const offersStats = {
    total: offers.length,
    active: offers.filter(o => o.status === "Active").length,
    totalUsage: offers.reduce((sum, o) => sum + o.usedCount, 0),
    totalSavings: offers.reduce((sum, o) => sum + (o.usedCount * (o.type === "percentage" ? o.maxDiscount : o.value)), 0)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Offers & Discounts</h2>
          <p className="text-gray-600">Manage promotional offers and discount codes</p>
        </div>
        <Button 
          onClick={() => {
            setEditingOffer(null)
            setShowOfferForm(true)
          }}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Create Offer
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Offers</p>
                <p className="text-2xl font-bold text-gray-900">{offersStats.total}</p>
              </div>
              <Tag className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Offers</p>
                <p className="text-2xl font-bold text-green-600">{offersStats.active}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Usage</p>
                <p className="text-2xl font-bold text-purple-600">{offersStats.totalUsage.toLocaleString()}</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Savings</p>
                <p className="text-2xl font-bold text-orange-600">₹{(offersStats.totalSavings / 100000).toFixed(1)}L</p>
              </div>
              <Gift className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Manage Offers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search offers..."
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
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Discount Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="percentage">Percentage</SelectItem>
                <SelectItem value="fixed">Fixed Amount</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Offers List */}
          <div className="space-y-4">
            {filteredOffers.map((offer) => (
              <OfferCard
                key={offer.id}
                offer={offer}
                getStatusBadge={getStatusBadge}
                getTypeIcon={getTypeIcon}
                onEdit={handleEditOffer}
                onDelete={handleDeleteOffer}
                onDuplicate={handleDuplicateOffer}
                onToggleStatus={handleToggleStatus}
              />
            ))}
            
            {filteredOffers.length === 0 && (
              <div className="text-center py-12">
                <Tag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No offers found</h3>
                <p className="text-gray-600">Try adjusting your search criteria</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Offer Form Modal */}
      {showOfferForm && (
        <OfferForm
          offer={editingOffer}
          offers={offers}
          onSave={(offerData) => {
            if (editingOffer) {
              setOffers(offers.map(o => o.id === editingOffer.id ? { ...offerData, id: editingOffer.id } : o))
            } else {
              const newOffer = {
                ...offerData,
                id: `OFF${String(offers.length + 1).padStart(3, '0')}`,
                usedCount: 0,
                createdBy: "current_admin",
                createdAt: new Date().toISOString().split('T')[0]
              }
              setOffers([...offers, newOffer])
            }
            setShowOfferForm(false)
            setEditingOffer(null)
          }}
          onClose={() => {
            setShowOfferForm(false)
            setEditingOffer(null)
          }}
        />
      )}
    </div>
  )
}

const OfferCard = ({ offer, getStatusBadge, getTypeIcon, onEdit, onDelete, onDuplicate, onToggleStatus }) => {
  const TypeIcon = getTypeIcon(offer.type)
  const usagePercentage = Math.round((offer.usedCount / offer.usageLimit) * 100)
  const isExpired = new Date(offer.validTill) < new Date()
  const isExpiringSoon = new Date(offer.validTill) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-br from-purple-100 to-pink-100 p-3 rounded-lg">
            <TypeIcon className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{offer.title}</h3>
            <p className="text-sm text-gray-600">{offer.description}</p>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="text-xs">
                {offer.code}
              </Badge>
              {isExpiringSoon && !isExpired && (
                <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                  <Clock className="h-3 w-3 mr-1" />
                  Expiring Soon
                </Badge>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {getStatusBadge(isExpired ? "Expired" : offer.status)}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        {/* Discount Value */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Target className="h-4 w-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Discount</span>
          </div>
          <div className="text-sm">
            <div className="font-medium">
              {offer.type === "percentage" ? `${offer.value}%` : `₹${offer.value}`}
            </div>
            <div className="text-gray-600">
              {offer.type === "percentage" && `Max ₹${offer.maxDiscount}`}
            </div>
          </div>
        </div>

        {/* Validity */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-4 w-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Validity</span>
          </div>
          <div className="text-sm">
            <div className="font-medium">{new Date(offer.validFrom).toLocaleDateString()}</div>
            <div className="text-gray-600">to {new Date(offer.validTill).toLocaleDateString()}</div>
          </div>
        </div>

        {/* Usage */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-4 w-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Usage</span>
          </div>
          <div className="text-sm">
            <div className="font-medium">{offer.usedCount} / {offer.usageLimit}</div>
            <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
              <div 
                className="bg-blue-500 h-1 rounded-full" 
                style={{ width: `${Math.min(usagePercentage, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Conditions */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="h-4 w-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Min Booking</span>
          </div>
          <div className="text-sm">
            <div className="font-medium">₹{offer.minBooking}</div>
            <div className="text-gray-600">{offer.userType} users</div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="text-sm text-gray-500">
          Created: {new Date(offer.createdAt).toLocaleDateString()}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => onEdit(offer)}>
            <Edit className="h-3 w-3 mr-1" />
            Edit
          </Button>
          <Button variant="outline" size="sm" onClick={() => onDuplicate(offer)}>
            <Copy className="h-3 w-3 mr-1" />
            Duplicate
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onToggleStatus(offer.id)}
            className={offer.status === "Active" ? "text-red-600 hover:text-red-700" : "text-green-600 hover:text-green-700"}
          >
            {offer.status === "Active" ? "Deactivate" : "Activate"}
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onDelete(offer.id)}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-3 w-3 mr-1" />
            Delete
          </Button>
        </div>
      </div>
    </div>
  )
}

const OfferForm = ({ offer, offers, onSave, onClose }) => {
  const [formData, setFormData] = React.useState({
    code: "",
    title: "",
    description: "",
    type: "percentage",
    value: "",
    maxDiscount: "",
    minBooking: "",
    validFrom: "",
    validTill: "",
    usageLimit: "",
    status: "Active",
    applicableRoutes: [],
    applicableClasses: [],
    userType: "All"
  })

  const [errors, setErrors] = React.useState({})

  React.useEffect(() => {
    if (offer) {
      setFormData(offer)
    }
  }, [offer])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.code) newErrors.code = "Offer code is required"
    if (!formData.title) newErrors.title = "Title is required"
    if (!formData.description) newErrors.description = "Description is required"
    if (!formData.value) newErrors.value = "Discount value is required"
    if (formData.type === "percentage" && !formData.maxDiscount) {
      newErrors.maxDiscount = "Max discount is required for percentage offers"
    }
    if (!formData.minBooking) newErrors.minBooking = "Minimum booking amount is required"
    if (!formData.validFrom) newErrors.validFrom = "Valid from date is required"
    if (!formData.validTill) newErrors.validTill = "Valid till date is required"
    if (!formData.usageLimit) newErrors.usageLimit = "Usage limit is required"
    
    // Check if offer code already exists
    if (!offer && offers.some(o => o.code === formData.code)) {
      newErrors.code = "Offer code already exists"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      onSave(formData)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {offer ? "Edit Offer" : "Create New Offer"}
              </h2>
              <p className="text-gray-600">Set up promotional offers and discount codes</p>
            </div>
            <Button variant="ghost" onClick={onClose}>
              <MoreVertical className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="code">Offer Code *</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => handleInputChange('code', e.target.value.toUpperCase())}
                placeholder="e.g., WELCOME50"
                className={errors.code ? "border-red-300" : ""}
              />
              {errors.code && <p className="text-red-600 text-xs mt-1">{errors.code}</p>}
            </div>
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="e.g., Welcome Offer"
                className={errors.title ? "border-red-300" : ""}
              />
              {errors.title && <p className="text-red-600 text-xs mt-1">{errors.title}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe the offer..."
              className={errors.description ? "border-red-300" : ""}
            />
            {errors.description && <p className="text-red-600 text-xs mt-1">{errors.description}</p>}
          </div>

          {/* Discount Details */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="type">Discount Type</Label>
              <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Percentage (%)</SelectItem>
                  <SelectItem value="fixed">Fixed Amount (₹)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="value">Discount Value *</Label>
              <Input
                id="value"
                type="number"
                value={formData.value}
                onChange={(e) => handleInputChange('value', parseInt(e.target.value))}
                placeholder={formData.type === "percentage" ? "e.g., 50" : "e.g., 500"}
                className={errors.value ? "border-red-300" : ""}
              />
              {errors.value && <p className="text-red-600 text-xs mt-1">{errors.value}</p>}
            </div>
            {formData.type === "percentage" && (
              <div>
                <Label htmlFor="maxDiscount">Max Discount (₹) *</Label>
                <Input
                  id="maxDiscount"
                  type="number"
                  value={formData.maxDiscount}
                  onChange={(e) => handleInputChange('maxDiscount', parseInt(e.target.value))}
                  placeholder="e.g., 2000"
                  className={errors.maxDiscount ? "border-red-300" : ""}
                />
                {errors.maxDiscount && <p className="text-red-600 text-xs mt-1">{errors.maxDiscount}</p>}
              </div>
            )}
            <div>
              <Label htmlFor="minBooking">Min Booking (₹) *</Label>
              <Input
                id="minBooking"
                type="number"
                value={formData.minBooking}
                onChange={(e) => handleInputChange('minBooking', parseInt(e.target.value))}
                placeholder="e.g., 3000"
                className={errors.minBooking ? "border-red-300" : ""}
              />
              {errors.minBooking && <p className="text-red-600 text-xs mt-1">{errors.minBooking}</p>}
            </div>
          </div>

          {/* Validity */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="validFrom">Valid From *</Label>
              <Input
                id="validFrom"
                type="date"
                value={formData.validFrom}
                onChange={(e) => handleInputChange('validFrom', e.target.value)}
                className={errors.validFrom ? "border-red-300" : ""}
              />
              {errors.validFrom && <p className="text-red-600 text-xs mt-1">{errors.validFrom}</p>}
            </div>
            <div>
              <Label htmlFor="validTill">Valid Till *</Label>
              <Input
                id="validTill"
                type="date"
                value={formData.validTill}
                onChange={(e) => handleInputChange('validTill', e.target.value)}
                className={errors.validTill ? "border-red-300" : ""}
              />
              {errors.validTill && <p className="text-red-600 text-xs mt-1">{errors.validTill}</p>}
            </div>
            <div>
              <Label htmlFor="usageLimit">Usage Limit *</Label>
              <Input
                id="usageLimit"
                type="number"
                value={formData.usageLimit}
                onChange={(e) => handleInputChange('usageLimit', parseInt(e.target.value))}
                placeholder="e.g., 1000"
                className={errors.usageLimit ? "border-red-300" : ""}
              />
              {errors.usageLimit && <p className="text-red-600 text-xs mt-1">{errors.usageLimit}</p>}
            </div>
          </div>

          {/* Applicability */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label className="text-base font-medium">Applicable Classes</Label>
              <div className="grid grid-cols-1 gap-3 mt-2">
                {["Economy", "Business", "First"].map(class_type => (
                  <div key={class_type} className="flex items-center space-x-2">
                    <Checkbox
                      id={`class-${class_type}`}
                      checked={formData.applicableClasses.includes(class_type)}
                      onCheckedChange={(checked) => {
                        const newClasses = checked
                          ? [...formData.applicableClasses, class_type]
                          : formData.applicableClasses.filter(c => c !== class_type)
                        handleInputChange('applicableClasses', newClasses)
                      }}
                    />
                    <Label htmlFor={`class-${class_type}`}>{class_type}</Label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="userType">User Type</Label>
              <Select value={formData.userType} onValueChange={(value) => handleInputChange('userType', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Users</SelectItem>
                  <SelectItem value="New">New Users Only</SelectItem>
                  <SelectItem value="Existing">Existing Users Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Status */}
          <div>
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {offer ? "Update Offer" : "Create Offer"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default OffersManagement

