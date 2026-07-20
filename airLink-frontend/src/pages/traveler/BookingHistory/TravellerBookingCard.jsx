import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import {
  Plane,
  MapPin,
  Clock,
  Calendar,
  User,
  Users,
  Mail,
  Phone,
  CreditCard,
  Download,
  Eye,
  ChevronDown,
  ChevronUp,
  Armchair,
  Utensils,
  CheckCircle2,
  AlertCircle,
  XCircle,
  RefreshCw,
  Star,
  Receipt,
  Loader2,
  Info,
  ArrowRight,
  Ticket
} from 'lucide-react'

const TravellerBookingCard = ({ booking, navigate }) => {
  const [showDetails, setShowDetails] = React.useState(false)
  const [downloadingPDF, setDownloadingPDF] = React.useState(false)

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  const formatTime = (dateTimeString) => {
    return new Date(dateTimeString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })
  }

  const formatDateShort = (dateTimeString) => {
    return new Date(dateTimeString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
  }

  const handleDownloadTicket = async () => {
    if (!booking) {
      alert('No booking data available')
      return
    }

    try {
      setDownloadingPDF(true)
      const result = await generateTicketPDF(booking)
      console.log('PDF downloaded successfully:', result.fileName)

      // Show success toast
      const toast = document.createElement('div')
      toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2 animate-in slide-in-from-top'
      toast.innerHTML = `
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
        </svg>
        <span>E-Ticket downloaded successfully!</span>
      `
      document.body.appendChild(toast)
      setTimeout(() => {
        toast.remove()
      }, 3000)
    } catch (error) {
      console.error('Error downloading ticket:', error)

      // Show error toast
      const toast = document.createElement('div')
      toast.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2 animate-in slide-in-from-top'
      toast.innerHTML = `
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
        </svg>
        <span>Failed to download ticket. Please try again.</span>
      `
      document.body.appendChild(toast)
      setTimeout(() => {
        toast.remove()
      }, 3000)
    } finally {
      setDownloadingPDF(false)
    }
  }

  const getStatusBadge = (status) => {
    const statusLower = status?.toLowerCase()
    switch (statusLower) {
      case 'confirmed':
        return (
          <Badge className="bg-green-100 text-green-800 border-green-300 flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" />
            Confirmed
          </Badge>
        )
      case 'pending':
      case 'pending_payment':
        return (
          <Badge className="bg-amber-100 text-amber-800 border-amber-300 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            Pending Payment
          </Badge>
        )
      case 'cancelled':
        return (
          <Badge className="bg-red-100 text-red-800 border-red-300 flex items-center gap-1">
            <XCircle className="h-3 w-3" />
            Cancelled
          </Badge>
        )
      case 'completed':
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-300 flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" />
            Completed
          </Badge>
        )
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 border-gray-300">
            {status}
          </Badge>
        )
    }
  }

  const getPaymentStatusBadge = (paymentStatus) => {
    if (!paymentStatus) return null

    switch (paymentStatus?.toLowerCase()) {
      case 'success':
      case 'paid':
        return (
          <div className="flex items-center gap-1.5 text-green-700 bg-green-50 px-3 py-1.5 rounded-full border border-green-200">
            <CheckCircle2 className="h-4 w-4" />
            <span className="text-xs font-semibold">Paid</span>
          </div>
        )
      case 'pending':
        return (
          <div className="flex items-center gap-1.5 text-amber-700 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200">
            <AlertCircle className="h-4 w-4" />
            <span className="text-xs font-semibold">Pending</span>
          </div>
        )
      case 'failed':
        return (
          <div className="flex items-center gap-1.5 text-red-700 bg-red-50 px-3 py-1.5 rounded-full border border-red-200">
            <XCircle className="h-4 w-4" />
            <span className="text-xs font-semibold">Failed</span>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-300 border-border">
      <CardContent className="p-0">
        {/* Gradient Header */}
        
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-6 text-white">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl border border-white/30 shadow-lg">
                <Plane className="h-7 w-7 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-1">{booking.flightName +" ("+ booking.flightNumber+")" || 'N/A'}</h3>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                    <Ticket className="h-3.5 w-3.5" />
                    <span className="text-sm font-semibold">{booking.bookingReference || 'N/A'}</span>
                  </div>
                  {booking.isUpcoming && (
                    <Badge className="bg-yellow-400 text-yellow-900 border-0 font-semibold">
                      Upcoming
                    </Badge>
                  )}
                  {booking.isPast && (
                    <Badge className="bg-gray-400 text-gray-900 border-0 font-semibold">
                      Past
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            {getStatusBadge(booking.status)}
          </div>

          {/* Flight Route */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl">
            <div className="grid grid-cols-3 gap-4 items-center">
              {/* Departure */}
              <div className="text-left">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-4 w-4 text-blue-200" />
                  <span className="text-xs font-medium text-blue-100 uppercase tracking-wide">Departure</span>
                </div>
                <div className="text-4xl font-bold mb-1">{formatTime(booking.departureTime)}</div>
                <div className="text-lg font-semibold mb-1">{booking.departureAirport || 'N/A'}</div>
                <div className="text-sm text-blue-100">{formatDateShort(booking.departureTime)}</div>
              </div>

              {/* Duration */}
              <div className="flex flex-col items-center">
                <div className="relative w-full flex items-center mb-2">
                  <div className="w-3 h-3 rounded-full bg-white shadow-lg"></div>
                  <div className="flex-1 relative">
                    <div className="h-1 bg-white/30 w-full rounded-full"></div>
                    <div className="h-1 bg-white w-2/3 rounded-full absolute top-0 left-0 animate-pulse"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-lg">
                      <Plane className="h-4 w-4 text-blue-600 rotate-90" />
                    </div>
                  </div>
                  <div className="w-3 h-3 rounded-full bg-white shadow-lg"></div>
                </div>

                <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30 mt-3">
                  <Clock className="h-4 w-4" />
                  <span className="font-semibold text-sm">{booking.flightDuration || 'N/A'}</span>
                </div>
              </div>

              {/* Arrival */}
              <div className="text-right">
                <div className="flex items-center justify-end gap-2 mb-2">
                  <span className="text-xs font-medium text-blue-100 uppercase tracking-wide">Arrival</span>
                  <MapPin className="h-4 w-4 text-blue-200" />
                </div>
                <div className="text-4xl font-bold mb-1">{formatTime(booking.arrivalTime)}</div>
                <div className="text-lg font-semibold mb-1">{booking.arrivalAirport || 'N/A'}</div>
                <div className="text-sm text-blue-100">{formatDateShort(booking.arrivalTime)}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Information Grid */}
        <div className="p-6 bg-gradient-to-br from-gray-50 to-white">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Passenger Info */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">Passengers</span>
              </div>
              <div className="space-y-2">
                {booking.passengers?.slice(0, 2).map((passenger, idx) => (
                  <div key={idx}>
                    <div className="font-bold text-gray-900">{passenger.fullName || `${passenger.firstName} ${passenger.lastName}`}</div>
                    <div className="text-xs text-gray-500">
                      {passenger.gender} • Age {passenger.age}
                    </div>
                  </div>
                ))}
                {booking.passengers?.length > 2 && (
                  <div className="text-xs text-blue-600 font-semibold pt-2 border-t border-gray-200">
                    +{booking.passengers.length - 2} more passenger(s)
                  </div>
                )}
              </div>
              <div className="mt-3 pt-3 border-t border-gray-200">
                <span className="text-xs text-gray-500">Total: </span>
                <span className="font-bold text-gray-900">{booking.totalPassengers} passenger(s)</span>
              </div>
            </div>

            {/* Contact Details */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <User className="h-5 w-5 text-green-600" />
                </div>
                <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">Contact</span>
              </div>
              <div className="space-y-2">
                <div>
                  <div className="font-bold text-gray-900 mb-1">{booking?.contactInfo?.email || 'N/A'}</div>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Mail className="h-3.5 w-3.5 text-gray-400" />
                    <span className="truncate">{booking?.contactInfo?.phone || 'N/A'}</span>
                  </div>
                </div>
                {booking.passengers?.[0]?.phone && (
                  <div className="flex items-center gap-2 text-xs text-gray-600 pt-2">
                    <Phone className="h-3.5 w-3.5 text-gray-400" />
                    <span>{booking.passengers[0].phone}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Seat Information */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-3">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <Armchair className="h-5 w-5 text-purple-600" />
                </div>
                <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">Seats</span>
              </div>
              {booking.seatInstances && booking.seatInstances.length > 0 ? (
                <div className="space-y-2">
                  {booking.seatInstances.map((seat, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div>
                        <div className="font-bold text-2xl text-gray-900">{seat.seatNumber}</div>
                        <div className="text-xs text-gray-500 capitalize">{seat.seatType?.toLowerCase()}</div>
                      </div>
                      {seat.mealPreference && (
                        <div className="flex items-center gap-1 text-xs text-gray-600 bg-orange-50 px-2 py-1 rounded-lg border border-orange-200">
                          <Utensils className="h-3 w-3 text-orange-600" />
                          <span className="font-medium">Meal</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-gray-500">No seat assigned</div>
              )}
            </div>

            {/* Fare Details */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <CreditCard className="h-5 w-5 text-green-600" />
                </div>
                <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">Fare</span>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  ₹{booking.totalAmount?.toLocaleString() || '0'}
                </div>
                {getPaymentStatusBadge(booking.paymentStatus)}
                {booking.fareBaseFare && (
                  <div className="mt-3 pt-3 border-t border-green-200 space-y-1 text-xs">
                    <div className="flex justify-between text-gray-600">
                      <span>Base Fare:</span>
                      <span className="font-semibold">₹{booking.fareBaseFare}</span>
                    </div>
                    {booking.fareTaxesAndFees && (
                      <div className="flex justify-between text-gray-600">
                        <span>Taxes:</span>
                        <span className="font-semibold">₹{booking.fareTaxesAndFees}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span className="font-medium">Booked on {formatDate(booking.bookingDate)}</span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate && navigate(`/view-ticket/${booking.id}`)}
                className=""
              >
                <Eye className="h-4 w-4 mr-1.5" />
                View Ticket
              </Button>

              {/* View Details Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate && navigate(`/booking-success/${booking.id}`)}
                className="hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700"
              >
                <Eye className="h-4 w-4 mr-1.5" />
                View Details
              </Button>

              {/* View Ticket Button */}
              {(booking.paymentStatus?.toLowerCase() === "paid" || booking.paymentStatus?.toLowerCase() === "success") && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate && navigate(`/view-ticket/${booking.id}`)}
                  className="hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-700"
                >
                  <Ticket className="h-4 w-4 mr-1.5" />
                  View Ticket
                </Button>
              )}

              {/* Download Ticket Button - for confirmed/completed bookings */}
              {(booking.paymentStatus?.toLowerCase() === "paid" || booking.paymentStatus?.toLowerCase() == "success") && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadTicket}
                  disabled={downloadingPDF}
                  className="hover:bg-green-50 hover:border-green-300 hover:text-green-700"
                >
                  {downloadingPDF ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
                      Downloading...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-1.5" />
                      Download Ticket
                    </>
                  )}
                </Button>
              )}

              {/* Complete Payment Button - for pending bookings */}
              {(booking.paymentStatus?.toLowerCase() === "pending") && (
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                >
                  <CreditCard className="h-4 w-4 mr-1.5" />
                  Complete Payment
                </Button>
              )}

              {/* Past Booking Actions */}
              {booking.isPast && booking.status?.toLowerCase() === "completed" && (
                <>
                  <Button variant="outline" size="sm" className="hover:bg-purple-50 hover:border-purple-300 hover:text-purple-700">
                    <RefreshCw className="h-4 w-4 mr-1.5" />
                    Rebook
                  </Button>
                  <Button variant="outline" size="sm" className="hover:bg-yellow-50 hover:border-yellow-300 hover:text-yellow-700">
                    <Star className="h-4 w-4 mr-1.5" />
                    Rate Flight
                  </Button>
                </>
              )}

              {/* Expand Details Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDetails(!showDetails)}
                className="ml-2"
              >
                {showDetails ? (
                  <>
                    Hide Details
                    <ChevronUp className="h-4 w-4 ml-1.5" />
                  </>
                ) : (
                  <>
                    More Details
                    <ChevronDown className="h-4 w-4 ml-1.5" />
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Expandable Details Section */}
          {showDetails && (
            <div className="mt-6 pt-6 border-t border-gray-200 animate-in slide-in-from-top-2 duration-300">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* All Passenger Details */}
                <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    All Passengers
                  </h4>
                  <div className="space-y-3">
                    {booking.passengers?.map((passenger, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <div className="font-bold text-gray-900">{passenger.fullName}</div>
                            <div className="text-xs text-gray-500 mt-1">
                              {passenger.gender} • {passenger.age} years • {passenger.isAdult ? 'Adult' : 'Child'}
                            </div>
                          </div>
                        </div>
                        <Separator className="my-2" />
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          {passenger.email && (
                            <div className="flex items-center gap-1 text-gray-600">
                              <Mail className="h-3 w-3" />
                              <span className="truncate">{passenger.email}</span>
                            </div>
                          )}
                          {passenger.phone && (
                            <div className="flex items-center gap-1 text-gray-600">
                              <Phone className="h-3 w-3" />
                              <span>{passenger.phone}</span>
                            </div>
                          )}
                          {passenger.nationality && (
                            <div className="text-gray-600">
                              <span className="font-medium">Nationality:</span> {passenger.nationality}
                            </div>
                          )}
                          {passenger.dateOfBirth && (
                            <div className="text-gray-600">
                              <span className="font-medium">DOB:</span> {formatDateShort(passenger.dateOfBirth)}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Booking & Flight Details */}
                <div className="space-y-4">
                  {/* Flight Information */}
                  <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                    <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Plane className="h-5 w-5 text-indigo-600" />
                      Flight Information
                    </h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Flight Number:</span>
                        <span className="font-semibold text-gray-900">{booking.flightNumber || booking.flightName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Flight ID:</span>
                        <span className="font-semibold text-gray-900">#{booking.flightId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Duration:</span>
                        <span className="font-semibold text-gray-900">{booking.flightDuration}</span>
                      </div>
                      {booking.fareName && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Fare Type:</span>
                          <span className="font-semibold text-gray-900">{booking.fareName}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Payment Information */}
                  <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                    <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-green-600" />
                      Payment Information
                    </h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Payment Status:</span>
                        {getPaymentStatusBadge(booking.paymentStatus) || <span className="font-semibold text-gray-500">Not Available</span>}
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Booking Status:</span>
                        {getStatusBadge(booking.status)}
                      </div>
                      <Separator />
                      {booking.fareBaseFare && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Base Fare:</span>
                          <span className="font-semibold text-gray-900">₹{booking.fareBaseFare}</span>
                        </div>
                      )}
                      {booking.fareTaxesAndFees && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Taxes & Fees:</span>
                          <span className="font-semibold text-gray-900">₹{booking.fareTaxesAndFees}</span>
                        </div>
                      )}
                      {booking.fareAirlineFees && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Airline Fees:</span>
                          <span className="font-semibold text-gray-900">₹{booking.fareAirlineFees}</span>
                        </div>
                      )}
                      <Separator />
                      <div className="flex justify-between text-base">
                        <span className="font-bold text-gray-900">Total Amount:</span>
                        <span className="font-bold text-green-600 text-xl">₹{booking.totalAmount?.toLocaleString() || '0'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Help Section */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5">
                    <div className="flex items-start gap-3">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <Info className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h5 className="font-bold text-gray-900 mb-1">Need Assistance?</h5>
                        <p className="text-sm text-gray-600 mb-3">
                          Our support team is here to help you with any questions about your booking.
                        </p>
                        <Button size="sm" variant="default" className="bg-blue-600 hover:bg-blue-700">
                          <Phone className="h-3.5 w-3.5 mr-1.5" />
                          Contact Support
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default TravellerBookingCard

