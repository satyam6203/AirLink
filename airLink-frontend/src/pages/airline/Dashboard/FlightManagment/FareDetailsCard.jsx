import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { formatCurrency } from '@/utils/formateCurrency'
import { 
  AlertCircle, 
  CheckCircle, 
  Edit, 
  DollarSign,
  Armchair,
  Zap,
  Plane,
  Coffee,
  Wifi,
  Calendar,
  Shield,
  Clock,
  Users,
  Sparkles,
  Info,
  TrendingUp,
  X,
  Ban,
  RefreshCw,
  AlertTriangle,
  FileText,
  CircleDollarSign,
  Timer,
  CalendarClock,
  Luggage,
  Package,
  Briefcase,
  Weight,
  Ruler,
  PackageCheck,
  Star,
  Trash2
} from 'lucide-react'
import React from 'react'
import { useNavigate } from "react-router-dom"
import { motion } from 'framer-motion'
import { deleteFare } from '@/Redux/fare/fareThunk'
import { useDispatch } from 'react-redux'

const FareDetailsCard = ({ fare }) => {
  const navigate = useNavigate()
  const dispatch=useDispatch();

  // const handleDelete = () => {
  //   if (onDelete) {
  //     onDelete(fare.id)
  //   }
  // }

  const handleFareDelete=()=>{
    dispatch(deleteFare(fare.id))
  }

  // Helper function to get benefit status badge
  const getBenefitIcon = (value) => {
    return value ? (
      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
    ) : (
      <X className="h-4 w-4 text-gray-300 flex-shrink-0" />
    )
  }

  // Calculate savings or markup
  const priceDifference = fare.totalPrice - fare.baseFare
  const isDiscounted = fare.currentPrice < fare.baseFare

  // Helper to get icon container classes
  const getIconContainerClass = (color) => {
    const colorMap = {
      blue: "bg-blue-100 text-blue-700",
      purple: "bg-purple-100 text-purple-700",
      orange: "bg-orange-100 text-orange-700",
      green: "bg-green-100 text-green-700",
      pink: "bg-pink-100 text-pink-700",
    }
    return colorMap[color] || "bg-gray-100 text-gray-700"
  }

  // Benefit groups with icons
  const benefitGroups = [
    {
      title: "Seat Benefits",
      icon: <Armchair className="h-4 w-4" />,
      color: "blue",
      benefits: [
        { label: "Extra Seat Space", value: fare.extraSeatSpace, tooltip: "Additional legroom and seat width" },
        { label: "Preferred Seat Choice", value: fare.preferredSeatChoice, tooltip: "Choose your preferred seat location" },
        { label: "Advance Seat Selection", value: fare.advanceSeatSelection, tooltip: "Select seats during booking" },
        { label: "Guaranteed Seat Together", value: fare.guaranteedSeatTogether, tooltip: "Seats together for group bookings" },
      ],
    },
    {
      title: "Boarding & Check-in",
      icon: <Zap className="h-4 w-4" />,
      color: "purple",
      benefits: [
        { label: "Priority Boarding", value: fare.priorityBoarding, tooltip: "Board the aircraft before general passengers" },
        { label: "Priority Check-in", value: fare.priorityCheckin, tooltip: "Dedicated check-in counters" },
        { label: "Fast Track Security", value: fare.fastTrackSecurity, tooltip: "Skip long security queues" },
      ],
    },
    {
      title: "In-Flight Services",
      icon: <Plane className="h-4 w-4" />,
      color: "orange",
      benefits: [
        { label: "Complimentary Meals", value: fare.complimentaryMeals, tooltip: "Free meals during the flight" },
        { label: "Premium Meal Choice", value: fare.premiumMealChoice, tooltip: "Select from premium menu options" },
        { label: "Complimentary Beverages", value: fare.complimentaryBeverages, tooltip: "Free drinks including alcoholic beverages" },
        { label: "In-Flight Internet", value: fare.inFlightInternet, tooltip: "WiFi connectivity during flight" },
        { label: "In-Flight Entertainment", value: fare.inFlightEntertainment, tooltip: "Personal entertainment system" },
      ],
    },
    {
      title: "Flexibility & Refunds",
      icon: <Shield className="h-4 w-4" />,
      color: "green",
      benefits: [
        { label: "Free Date Change", value: fare.freeDateChange, tooltip: "Change travel dates without penalty" },
        { label: "Partial Refund", value: fare.partialRefund, tooltip: "Get partial refund on cancellation" },
        { label: "Full Refund", value: fare.fullRefund, tooltip: "100% refund on cancellation" },
      ],
    },
    {
      title: "Premium Services",
      icon: <Sparkles className="h-4 w-4" />,
      color: "pink",
      benefits: [
        { label: "Lounge Access", value: fare.loungeAccess, tooltip: "Access to premium airport lounges" },
        { label: "Airport Transfer", value: fare.airportTransfer, tooltip: "Complimentary airport transportation" },
      ],
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="hover:shadow-xl transition-all duration-300 border-border overflow-hidden">
        <CardHeader className="bg-gradient-to-br from-primary/5 via-primary/3 to-transparent pb-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4 flex-1">
              <div className="bg-gradient-to-br from-primary to-primary/80 p-3 rounded-xl shadow-lg">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <CardTitle className="text-xl font-bold">{fare.name}</CardTitle>
                  {isDiscounted && (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Deal
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge className="bg-primary/10 text-primary border-primary/20">
                    {fare.fareLabel || "Standard Fare"}
                  </Badge>
                  {fare.rbdCode && (
                    <Badge variant="outline" className="text-xs">
                      RBD: {fare.rbdCode} 
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/airline/fares/${fare.id}/edit`)}
                className="gap-2 hover:bg-primary hover:text-white transition-colors"
              >
                <Edit className="h-4 w-4" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleFareDelete}
                className="gap-2 hover:bg-destructive hover:text-white transition-colors"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 pt-6">
          {/* Pricing Section with Enhanced Design */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="h-5 w-5 text-primary" />
              <h4 className="font-semibold text-base">Pricing Breakdown</h4>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl border border-blue-200/50 hover:shadow-md transition-shadow cursor-help">
                      <div className="text-xs font-medium text-blue-700 mb-1">Base Fare</div>
                      <div className="text-lg font-bold text-blue-900">{formatCurrency(fare.baseFare || 0)}</div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Core ticket price before taxes and fees</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-xl border border-orange-200/50 hover:shadow-md transition-shadow cursor-help">
                      <div className="text-xs font-medium text-orange-700 mb-1">Taxes & Fees</div>
                      <div className="text-lg font-bold text-orange-900">{formatCurrency(fare.taxesAndFees || 0)}</div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Government taxes and airport fees</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl border border-purple-200/50 hover:shadow-md transition-shadow cursor-help">
                      <div className="text-xs font-medium text-purple-700 mb-1">Airline Fees</div>
                      <div className="text-lg font-bold text-purple-900">{formatCurrency(fare.airlineFees || 0)}</div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Additional airline service charges</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="p-4 bg-gradient-to-br from-yellow-50 to-yellow-100/50 rounded-xl border border-yellow-200/50 hover:shadow-md transition-shadow cursor-help">
                      <div className="text-xs font-medium text-yellow-700 mb-1">Current Price</div>
                      <div className="text-lg font-bold text-yellow-900">{formatCurrency(fare.currentPrice || 0)}</div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Price after any applicable discounts</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="p-4 bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl border border-green-200/50 hover:shadow-md transition-shadow cursor-help col-span-2 md:col-span-1">
                      <div className="text-xs font-medium text-green-700 mb-1">Total Price</div>
                      <div className="text-xl font-bold text-green-900">{formatCurrency(fare.totalPrice || 0)}</div>
                      {priceDifference > 0 && (
                        <div className="text-xs text-green-600 mt-1">
                          +{formatCurrency(priceDifference)} from base
                        </div>
                      )}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Final amount payable by passenger</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          <Separator />

          {/* Benefits Grid with Enhanced Design */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-primary" />
              <h4 className="font-semibold text-base">Fare Benefits & Services</h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {benefitGroups.map((group, idx) => (
                <motion.div
                  key={group.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  className="p-4 rounded-xl border border-border bg-card hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`p-1.5 rounded-lg ${getIconContainerClass(group.color)}`}>
                      {group.icon}
                    </div>
                    <h5 className="font-semibold text-sm">{group.title}</h5>
                  </div>
                  <div className="space-y-2">
                    {group.benefits.map((benefit) => (
                      <TooltipProvider key={benefit.label}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center gap-2 text-sm group cursor-help">
                              {getBenefitIcon(benefit.value)}
                              <span className={benefit.value ? "text-foreground font-medium" : "text-muted-foreground"}>
                                {benefit.label}
                              </span>
                              {benefit.tooltip && (
                                <Info className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity ml-auto" />
                              )}
                            </div>
                          </TooltipTrigger>
                          {benefit.tooltip && (
                            <TooltipContent side="right" className="max-w-xs">
                              <p>{benefit.tooltip}</p>
                            </TooltipContent>
                          )}
                        </Tooltip>
                      </TooltipProvider>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Fare Rules Section - Enhanced */}
          {fare.fareRules && (
            <>
              <Separator />
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="h-5 w-5 text-primary" />
                  <h4 className="font-semibold text-base">Fare Rules & Policies</h4>
                </div>

                <div className="space-y-4">
                  {/* Rule Name and Status */}
                  <div className="p-4 bg-gradient-to-br from-primary/5 via-primary/3 to-transparent rounded-xl border border-primary/20">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <h5 className="font-semibold text-lg text-foreground mb-1">
                          {fare.fareRules.ruleName || 'Fare Rules'}
                        </h5>
                        <p className="text-xs text-muted-foreground">Rule ID: #{fare.fareRules.id}</p>
                      </div>
                      <div className="flex gap-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Badge 
                                variant={fare.fareRules.isRefundable ? "default" : "secondary"}
                                className={fare.fareRules.isRefundable ? "bg-green-500 hover:bg-green-600" : "bg-gray-400"}
                              >
                                {fare.fareRules.isRefundable ? (
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                ) : (
                                  <Ban className="h-3 w-3 mr-1" />
                                )}
                                {fare.fareRules.isRefundable ? "Refundable" : "Non-Refundable"}
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{fare.fareRules.isRefundable ? "This fare can be refunded with applicable fees" : "This fare cannot be refunded"}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Badge 
                                variant={fare.fareRules.isChangeable ? "default" : "secondary"}
                                className={fare.fareRules.isChangeable ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-400"}
                              >
                                {fare.fareRules.isChangeable ? (
                                  <RefreshCw className="h-3 w-3 mr-1" />
                                ) : (
                                  <Ban className="h-3 w-3 mr-1" />
                                )}
                                {fare.fareRules.isChangeable ? "Changeable" : "Non-Changeable"}
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{fare.fareRules.isChangeable ? "Flight dates can be changed with applicable fees" : "Flight dates cannot be changed"}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                  </div>

                  {/* Fees and Deadlines Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Cancellation Policy */}
                    {fare.fareRules.isRefundable && (
                      <div className="p-4 rounded-xl border border-border bg-card hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="p-2 rounded-lg bg-red-100 text-red-700">
                            <Ban className="h-4 w-4" />
                          </div>
                          <h6 className="font-semibold text-sm">Cancellation Policy</h6>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-2">
                              <CircleDollarSign className="h-4 w-4 text-muted-foreground mt-0.5" />
                              <div>
                                <p className="text-xs text-muted-foreground">Cancellation Fee</p>
                                <p className="text-lg font-bold text-red-700">
                                  {formatCurrency(fare.fareRules.cancellationFee || 0)}
                                </p>
                              </div>
                            </div>
                          </div>
                          <Separator />
                          <div className="flex items-start gap-2">
                            <CalendarClock className="h-4 w-4 text-muted-foreground mt-0.5" />
                            <div>
                              <p className="text-xs text-muted-foreground">Refund Deadline</p>
                              <p className="text-sm font-semibold text-foreground">
                                {fare.fareRules.refundDeadlineDays} days before departure
                              </p>
                            </div>
                          </div>
                          <div className="mt-2 p-2 bg-amber-50 rounded-lg border border-amber-200">
                            <div className="flex items-start gap-2">
                              <AlertTriangle className="h-3.5 w-3.5 text-amber-700 mt-0.5 flex-shrink-0" />
                              <p className="text-xs text-amber-800">
                                Refund requests must be made at least {fare.fareRules.refundDeadlineDays} day{fare.fareRules.refundDeadlineDays !== 1 ? 's' : ''} before scheduled departure
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Change Policy */}
                    {fare.fareRules.isChangeable && (
                      <div className="p-4 rounded-xl border border-border bg-card hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="p-2 rounded-lg bg-blue-100 text-blue-700">
                            <RefreshCw className="h-4 w-4" />
                          </div>
                          <h6 className="font-semibold text-sm">Change Policy</h6>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-2">
                              <CircleDollarSign className="h-4 w-4 text-muted-foreground mt-0.5" />
                              <div>
                                <p className="text-xs text-muted-foreground">Change Fee</p>
                                <p className="text-lg font-bold text-blue-700">
                                  {formatCurrency(fare.fareRules.changeFee || 0)}
                                </p>
                              </div>
                            </div>
                          </div>
                          <Separator />
                          <div className="flex items-start gap-2">
                            <Timer className="h-4 w-4 text-muted-foreground mt-0.5" />
                            <div>
                              <p className="text-xs text-muted-foreground">Change Deadline</p>
                              <p className="text-sm font-semibold text-foreground">
                                {fare.fareRules.changeDeadlineHours} hours before departure
                              </p>
                            </div>
                          </div>
                          <div className="mt-2 p-2 bg-blue-50 rounded-lg border border-blue-200">
                            <div className="flex items-start gap-2">
                              <Info className="h-3.5 w-3.5 text-blue-700 mt-0.5 flex-shrink-0" />
                              <p className="text-xs text-blue-800">
                                Date changes allowed up to {fare.fareRules.changeDeadlineHours} hour{fare.fareRules.changeDeadlineHours !== 1 ? 's' : ''} before scheduled departure
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Non-Refundable Warning */}
                    {!fare.fareRules.isRefundable && (
                      <div className="p-4 rounded-xl border border-red-200 bg-red-50">
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-lg bg-red-200">
                            <Ban className="h-5 w-5 text-red-700" />
                          </div>
                          <div className="flex-1">
                            <h6 className="font-semibold text-sm text-red-900 mb-1">Non-Refundable Fare</h6>
                            <p className="text-xs text-red-700">
                              This fare cannot be refunded under any circumstances. Please ensure your travel dates are confirmed before booking.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Non-Changeable Warning */}
                    {!fare.fareRules.isChangeable && (
                      <div className="p-4 rounded-xl border border-orange-200 bg-orange-50">
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-lg bg-orange-200">
                            <AlertCircle className="h-5 w-5 text-orange-700" />
                          </div>
                          <div className="flex-1">
                            <h6 className="font-semibold text-sm text-orange-900 mb-1">Non-Changeable Fare</h6>
                            <p className="text-xs text-orange-700">
                              Flight dates and times cannot be modified after booking. Please double-check your travel plans.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Baggage Policy Section - Enhanced */}
          {fare.baggagePolicy && (
            <>
              <Separator />
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Luggage className="h-5 w-5 text-primary" />
                  <h4 className="font-semibold text-base">Baggage Policy</h4>
                </div>

                <div className="space-y-4">
                  {/* Policy Name and Description */}
                  <div className="p-4 bg-gradient-to-br from-indigo-50 via-indigo-50/50 to-transparent rounded-xl border border-indigo-200">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex-1">
                        <h5 className="font-semibold text-lg text-foreground mb-1">
                          {fare.baggagePolicy.name || 'Baggage Allowance'}
                        </h5>
                        {fare.baggagePolicy.description && (
                          <p className="text-sm text-muted-foreground">
                            {fare.baggagePolicy.description}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col gap-2">
                        {fare.baggagePolicy.priorityBaggage && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Badge className="bg-amber-500 hover:bg-amber-600">
                                  <Star className="h-3 w-3 mr-1" />
                                  Priority
                                </Badge>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Your baggage will be prioritized for handling</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                        {fare.baggagePolicy.extraBaggageAllowance && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Badge className="bg-green-500 hover:bg-green-600">
                                  <PackageCheck className="h-3 w-3 mr-1" />
                                  Extra Allowed
                                </Badge>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Additional baggage allowance included</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Baggage Allowance Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Cabin Baggage */}
                    <div className="p-5 rounded-xl border border-border bg-card hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="p-2 rounded-lg bg-blue-100 text-blue-700">
                          <Briefcase className="h-5 w-5" />
                        </div>
                        <h6 className="font-semibold text-base">Cabin Baggage</h6>
                      </div>
                      
                      <div className="space-y-3">
                        {/* Pieces */}
                        <div className="flex items-center justify-between p-3 bg-blue-50/50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Package className="h-4 w-4 text-blue-700" />
                            <span className="text-sm font-medium text-foreground">Pieces</span>
                          </div>
                          <span className="text-lg font-bold text-blue-700">
                            {fare.baggagePolicy.cabinBaggagePieces || 0}
                          </span>
                        </div>

                        {/* Weight per piece */}
                        <div className="flex items-center justify-between p-3 bg-blue-50/50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Weight className="h-4 w-4 text-blue-700" />
                            <span className="text-sm font-medium text-foreground">Weight per Piece</span>
                          </div>
                          <span className="text-lg font-bold text-blue-700">
                            {fare.baggagePolicy.cabinBaggageWeightPerPiece || 0} kg
                          </span>
                        </div>

                        {/* Max total weight */}
                        <div className="flex items-center justify-between p-3 bg-blue-50/50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Weight className="h-4 w-4 text-blue-700" />
                            <span className="text-sm font-medium text-foreground">Max Total Weight</span>
                          </div>
                          <span className="text-lg font-bold text-blue-700">
                            {fare.baggagePolicy.cabinBaggageMaxWeight || 0} kg
                          </span>
                        </div>

                        {/* Max dimension */}
                        <div className="flex items-center justify-between p-3 bg-blue-50/50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Ruler className="h-4 w-4 text-blue-700" />
                            <span className="text-sm font-medium text-foreground">Max Dimension</span>
                          </div>
                          <span className="text-lg font-bold text-blue-700">
                            {fare.baggagePolicy.cabinBaggageMaxDimension || 0} cm
                          </span>
                        </div>

                        <div className="mt-3 p-2 bg-blue-100/50 rounded-lg border border-blue-200">
                          <div className="flex items-start gap-2">
                            <Info className="h-3.5 w-3.5 text-blue-700 mt-0.5 flex-shrink-0" />
                            <p className="text-xs text-blue-800">
                              Hand baggage to be carried in the cabin during flight
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Checked Baggage */}
                    <div className="p-5 rounded-xl border border-border bg-card hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="p-2 rounded-lg bg-purple-100 text-purple-700">
                          <Luggage className="h-5 w-5" />
                        </div>
                        <h6 className="font-semibold text-base">Checked Baggage</h6>
                      </div>
                      
                      <div className="space-y-3">
                        {/* Pieces */}
                        <div className="flex items-center justify-between p-3 bg-purple-50/50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Package className="h-4 w-4 text-purple-700" />
                            <span className="text-sm font-medium text-foreground">Pieces</span>
                          </div>
                          <span className="text-lg font-bold text-purple-700">
                            {fare.baggagePolicy.checkInBaggagePieces || 0}
                          </span>
                        </div>

                        {/* Weight per piece */}
                        <div className="flex items-center justify-between p-3 bg-purple-50/50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Weight className="h-4 w-4 text-purple-700" />
                            <span className="text-sm font-medium text-foreground">Weight per Piece</span>
                          </div>
                          <span className="text-lg font-bold text-purple-700">
                            {fare.baggagePolicy.checkInBaggageWeightPerPiece || 0} kg
                          </span>
                        </div>

                        {/* Max total weight */}
                        <div className="flex items-center justify-between p-3 bg-purple-50/50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Weight className="h-4 w-4 text-purple-700" />
                            <span className="text-sm font-medium text-foreground">Max Total Weight</span>
                          </div>
                          <span className="text-lg font-bold text-purple-700">
                            {fare.baggagePolicy.checkInBaggageMaxWeight || 0} kg
                          </span>
                        </div>

                        {/* Free checked bags */}
                        <div className="flex items-center justify-between p-3 bg-purple-50/50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <PackageCheck className="h-4 w-4 text-purple-700" />
                            <span className="text-sm font-medium text-foreground">Free Allowance</span>
                          </div>
                          <span className="text-lg font-bold text-purple-700">
                            {fare.baggagePolicy.freeCheckedBagsAllowance || 0}
                          </span>
                        </div>

                        <div className="mt-3 p-2 bg-purple-100/50 rounded-lg border border-purple-200">
                          <div className="flex items-start gap-2">
                            <Info className="h-3.5 w-3.5 text-purple-700 mt-0.5 flex-shrink-0" />
                            <p className="text-xs text-purple-800">
                              Baggage to be checked in and collected at destination
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Summary Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="p-4 rounded-xl border border-border bg-gradient-to-br from-green-50 to-green-100/30 hover:shadow-md transition-shadow cursor-help">
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-lg bg-green-200">
                                <PackageCheck className="h-5 w-5 text-green-800" />
                              </div>
                              <div>
                                <p className="text-xs text-green-700 font-medium">Total Free Bags</p>
                                <p className="text-2xl font-bold text-green-900">
                                  {fare.baggagePolicy.freeCheckedBagsAllowance || 0}
                                </p>
                              </div>
                            </div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Number of free checked baggage pieces included</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="p-4 rounded-xl border border-border bg-gradient-to-br from-blue-50 to-blue-100/30 hover:shadow-md transition-shadow cursor-help">
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-lg bg-blue-200">
                                <Weight className="h-5 w-5 text-blue-800" />
                              </div>
                              <div>
                                <p className="text-xs text-blue-700 font-medium">Total Allowance</p>
                                <p className="text-2xl font-bold text-blue-900">
                                  {(fare.baggagePolicy.cabinBaggageMaxWeight || 0) + 
                                   (fare.baggagePolicy.checkInBaggageMaxWeight || 0)} kg
                                </p>
                              </div>
                            </div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Combined weight of cabin and checked baggage</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="p-4 rounded-xl border border-border bg-gradient-to-br from-purple-50 to-purple-100/30 hover:shadow-md transition-shadow cursor-help">
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-lg bg-purple-200">
                                <Package className="h-5 w-5 text-purple-800" />
                              </div>
                              <div>
                                <p className="text-xs text-purple-700 font-medium">Total Pieces</p>
                                <p className="text-2xl font-bold text-purple-900">
                                  {(fare.baggagePolicy.cabinBaggagePieces || 0) + 
                                   (fare.baggagePolicy.checkInBaggagePieces || 0)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Total number of baggage pieces allowed</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  {/* Important Notice */}
                  {!fare.baggagePolicy.extraBaggageAllowance && (
                    <div className="p-4 rounded-xl border border-amber-200 bg-amber-50">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="h-5 w-5 text-amber-700 flex-shrink-0 mt-0.5" />
                        <div>
                          <h6 className="font-semibold text-sm text-amber-900 mb-1">Additional Baggage Charges Apply</h6>
                          <p className="text-xs text-amber-800">
                            Exceeding the allowance will incur extra charges. Please check with the airline for excess baggage fees.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Metadata Footer */}
          <div className="pt-2">
            <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
              {fare.createdAt && (
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  <span>Created: {new Date(fare.createdAt).toLocaleDateString()}</span>
                </div>
              )}
              {fare.updatedAt && (
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>Updated: {new Date(fare.updatedAt).toLocaleDateString()}</span>
                </div>
              )}
              <div className="flex items-center gap-1.5 ml-auto">
                <span className="font-medium">ID:</span>
                <span className="font-mono">{fare.id}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default FareDetailsCard
