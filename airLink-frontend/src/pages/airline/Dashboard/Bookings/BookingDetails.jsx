import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  CreditCard,
  Plane,
  User,
  X,
  Calendar,
  Clock,
  MapPin,
  Users,
  Mail,
  Phone,
  Utensils,
  Armchair,
  Ticket,
  Receipt,
  Info,
  Shield,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import React, { useState } from 'react'

const BookingDetails = ({ booking, onClose, getStatusBadge, getPaymentStatusBadge }) => {
  const [expandedAncillary, setExpandedAncillary] = useState(null)

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getCurrency = () => booking.currency || booking.ancillaries?.[0]?.currency || 'INR'

  const toggleAncillary = (id) => {
    setExpandedAncillary(prev => prev === id ? null : id)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Booking Details</h2>
              <p className="text-gray-600 mt-1">Reference: <span className="font-semibold">{booking.bookingReference}</span></p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Status & User Info */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3 flex-wrap">
              {getStatusBadge(booking.status)}
              {getPaymentStatusBadge(booking.paymentStatus)}
              {booking.isPast && <Badge variant="secondary">Past</Badge>}
              {booking.isUpcoming && <Badge className="bg-blue-100 text-blue-800">Upcoming</Badge>}
            </div>
            {(booking.userName || booking.userEmail) && (
              <div className="text-right">
                <p className="text-sm text-gray-600">Booked by</p>
                {booking.userName && <p className="font-semibold text-gray-900">{booking.userName}</p>}
                {booking.userEmail && <p className="text-sm text-gray-500">{booking.userEmail}</p>}
              </div>
            )}
          </div>

          {/* Contact Information */}
          {booking.contactInfo && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-indigo-600" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-gray-600 flex items-center gap-1">
                      <Mail className="h-3 w-3" /> Email
                    </Label>
                    <p className="font-medium mt-1">{booking.contactInfo.email || '—'}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600 flex items-center gap-1">
                      <Phone className="h-3 w-3" /> Phone
                    </Label>
                    <p className="font-medium mt-1">{booking.contactInfo.phone || '—'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Flight Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plane className="h-5 w-5 text-blue-600" />
                Flight Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm text-gray-600">Flight Number</Label>
                    <p className="font-semibold text-lg">{booking.flightNumber}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Flight Name</Label>
                    <p className="font-medium">{booking.flightName}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Duration</Label>
                    <p className="font-medium">{booking.flightDuration}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-sm text-gray-600 flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> Departure
                    </Label>
                    <p className="font-semibold mt-1">{booking.departureAirport}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(booking.departureTime)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="h-3 w-3" />
                      <span>{formatTime(booking.departureTime)}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-sm text-gray-600 flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> Arrival
                    </Label>
                    <p className="font-semibold mt-1">{booking.arrivalAirport}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(booking.arrivalTime)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="h-3 w-3" />
                      <span>{formatTime(booking.arrivalTime)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Passengers Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-green-600" />
                Passenger Information ({booking.totalPassengers} {booking.totalPassengers === 1 ? 'Passenger' : 'Passengers'})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {booking.passengers?.map((passenger, index) => (
                  <div key={passenger.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-lg flex items-center gap-2">
                          {passenger.fullName}
                          {passenger.isAdult ?
                            <Badge variant="secondary" className="text-xs">Adult</Badge> :
                            <Badge variant="secondary" className="text-xs">Child</Badge>
                          }
                        </h4>
                        <p className="text-sm text-gray-600">Passenger {index + 1}</p>
                      </div>
                      {booking.seatInstances?.[index] && (
                        <div className="flex items-center gap-2">
                          <Armchair className="h-4 w-4 text-gray-500" />
                          <span className="font-semibold">{booking.seatInstances[index].seatNumber}</span>
                          <Badge variant="outline" className="text-xs">{booking.seatInstances[index].seatType}</Badge>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <Label className="text-xs text-gray-600">Gender</Label>
                        <p className="font-medium">{passenger.gender}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-gray-600">Date of Birth</Label>
                        <p className="font-medium">{formatDate(passenger.dateOfBirth)}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-gray-600">Age</Label>
                        <p className="font-medium">{passenger.age} years</p>
                      </div>
                      <div>
                        <Label className="text-xs text-gray-600">Nationality</Label>
                        <p className="font-medium">{passenger.nationality}</p>
                      </div>
                      {passenger.email && (
                        <div className="col-span-2">
                          <Label className="text-xs text-gray-600 flex items-center gap-1">
                            <Mail className="h-3 w-3" /> Email
                          </Label>
                          <p className="font-medium">{passenger.email}</p>
                        </div>
                      )}
                      {passenger.phone && (
                        <div className="col-span-2">
                          <Label className="text-xs text-gray-600 flex items-center gap-1">
                            <Phone className="h-3 w-3" /> Phone
                          </Label>
                          <p className="font-medium">{passenger.phone}</p>
                        </div>
                      )}
                    </div>

                    {/* Seat Details */}
                    {booking.seatInstances?.[index] && (
                      <div className="mt-3 pt-3 border-t">
                        <Label className="text-xs text-gray-600 mb-2 block">Seat Details</Label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                          <div>
                            <p className="text-xs text-gray-500">Seat</p>
                            <p className="font-medium">{booking.seatInstances[index].seatPosition}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Type</p>
                            <p className="font-medium capitalize">{booking.seatInstances[index].seat?.seatType?.toLowerCase() || booking.seatInstances[index].seatType}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Status</p>
                            <Badge variant="outline" className="text-xs">{booking.seatInstances[index].status}</Badge>
                          </div>
                          {booking.seatInstances[index].mealPreference && (
                            <div className="flex items-center gap-2">
                              <Utensils className="h-3 w-3 text-gray-500" />
                              <span className="text-xs">{booking.seatInstances[index].mealPreference}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Special Requirements */}
                    {(passenger.requiresWheelchairAssistance || passenger.dietaryPreferences || passenger.medicalConditions) && (
                      <div className="mt-3 pt-3 border-t">
                        <Label className="text-xs text-gray-600 flex items-center gap-1 mb-2">
                          <Info className="h-3 w-3" /> Special Requirements
                        </Label>
                        <div className="space-y-1 text-sm">
                          {passenger.requiresWheelchairAssistance && (
                            <p className="text-gray-700">• Wheelchair assistance required</p>
                          )}
                          {passenger.dietaryPreferences && (
                            <p className="text-gray-700">• Dietary preferences: {passenger.dietaryPreferences}</p>
                          )}
                          {passenger.medicalConditions && (
                            <p className="text-gray-700">• Medical conditions: {passenger.medicalConditions}</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Meals */}
          {booking.meals && booking.meals.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Utensils className="h-5 w-5 text-orange-600" />
                  Meals ({booking.meals.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {booking.meals.map((mealItem) => (
                  <div key={mealItem.id} className="border rounded-lg p-4 flex gap-4">
                    {mealItem.meal?.imageUrl && (
                      <img
                        src={mealItem.meal.imageUrl}
                        alt={mealItem.meal.name}
                        className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-semibold text-sm">{mealItem.meal?.name}</h4>
                        <span className="text-sm font-semibold text-orange-600 flex-shrink-0">
                          {mealItem.price ? `${getCurrency()} ${mealItem.price}` : 'Complimentary'}
                        </span>
                      </div>
                      <Badge variant="outline" className="text-xs mt-1">{mealItem.meal?.mealType}</Badge>
                      {mealItem.meal?.dietaryRestriction && (
                        <p className="text-xs text-gray-600 mt-1">{mealItem.meal.dietaryRestriction}</p>
                      )}
                      {mealItem.meal?.ingredients && (
                        <p className="text-xs text-gray-400 mt-1 truncate">{mealItem.meal.ingredients}</p>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Ancillary Services */}
          {booking.ancillaries && booking.ancillaries.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  Ancillary Services ({booking.ancillaries.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {booking.ancillaries.map((item) => (
                  <div key={item.id} className="border rounded-lg overflow-hidden">
                    {/* Ancillary Header */}
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-semibold text-base">{item.ancillary?.name}</h4>
                            <Badge className="text-xs bg-blue-100 text-blue-800 border-blue-200">
                              {item.ancillary?.type?.replace('_', ' ')}
                            </Badge>
                            {item.ancillary?.rfisc && (
                              <Badge variant="outline" className="text-xs font-mono">{item.ancillary.rfisc}</Badge>
                            )}
                          </div>
                          {item.ancillary?.description && (
                            <p className="text-sm text-gray-600 mt-1">{item.ancillary.description}</p>
                          )}
                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                            <span>Max Qty: {item.maxQuantity}</span>
                            <span className={item.available ? 'text-green-600 font-medium' : 'text-red-500'}>
                              {item.available ? 'Available' : 'Unavailable'}
                            </span>
                            {item.includedInFare && (
                              <Badge variant="secondary" className="text-xs">Included in fare</Badge>
                            )}
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="font-bold text-lg text-blue-700">
                            {item.currency} {item.price?.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      {/* Toggle coverages */}
                      {item.ancillary?.coverages && item.ancillary.coverages.length > 0 && (
                        <button
                          onClick={() => toggleAncillary(item.id)}
                          className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 mt-3 font-medium"
                        >
                          {expandedAncillary === item.id ? (
                            <><ChevronUp className="h-4 w-4" /> Hide {item.ancillary.coverages.length} coverages</>
                          ) : (
                            <><ChevronDown className="h-4 w-4" /> View {item.ancillary.coverages.length} coverages</>
                          )}
                        </button>
                      )}
                    </div>

                    {/* Coverages */}
                    {expandedAncillary === item.id && item.ancillary?.coverages && (
                      <div className="border-t bg-gray-50 p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {item.ancillary.coverages.map((coverage) => (
                            <div key={coverage.id} className="bg-white border rounded-lg p-3">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-semibold">{coverage.name}</p>
                                  <Badge variant="outline" className="text-xs mt-1 font-mono">
                                    {coverage.coverageType?.replace(/_/g, ' ')}
                                  </Badge>
                                </div>
                                {coverage.coverageAmount && (
                                  <span className="text-sm font-bold text-green-600 flex-shrink-0">
                                    {coverage.currency} {coverage.coverageAmount?.toLocaleString()}
                                  </span>
                                )}
                              </div>
                              {coverage.description && (
                                <p className="text-xs text-gray-500 mt-2">{coverage.description}</p>
                              )}
                              {coverage.claimCondition && (
                                <p className="text-xs text-amber-700 bg-amber-50 rounded p-2 mt-2">
                                  <span className="font-medium">Claim: </span>{coverage.claimCondition}
                                </p>
                              )}
                              {coverage.emergencyContact && (
                                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                  <Phone className="h-3 w-3" /> {coverage.emergencyContact}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Fare & Payment Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Fare Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Receipt className="h-5 w-5 text-purple-600" />
                  Fare Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-sm text-gray-600">Fare Type</Label>
                  <p className="font-semibold">{booking.fareName}</p>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <Label className="text-sm text-gray-600">Base Fare</Label>
                  <p className="font-medium">{getCurrency()} {booking.fareBaseFare?.toLocaleString()}</p>
                </div>
                <div className="flex justify-between">
                  <Label className="text-sm text-gray-600">Taxes & Fees</Label>
                  <p className="font-medium">{getCurrency()} {booking.fareTaxesAndFees?.toLocaleString()}</p>
                </div>
                <div className="flex justify-between">
                  <Label className="text-sm text-gray-600">Airline Fees</Label>
                  <p className="font-medium">{getCurrency()} {booking.fareAirlineFees?.toLocaleString()}</p>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <Label className="text-base font-semibold">Total Amount</Label>
                  <p className="font-bold text-xl text-purple-600">{getCurrency()} {booking.totalAmount?.toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>

            {/* Payment & Ticket Information */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-green-600" />
                    Payment Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label className="text-sm text-gray-600">Payment Status</Label>
                    <div className="mt-1">
                      {getPaymentStatusBadge(booking.paymentStatus)}
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Booking Date</Label>
                    <p className="font-medium">{formatDate(booking.bookingDate)}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Last Modified</Label>
                    <p className="font-medium">{formatDate(booking.lastModified)}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Tickets */}
              {booking.tickets && booking.tickets.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Ticket className="h-5 w-5 text-orange-600" />
                      Tickets ({booking.tickets.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {booking.tickets.map((ticket) => (
                      <div key={ticket.id} className="border rounded-lg p-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold text-sm font-mono">{ticket.ticketNumber}</p>
                            <p className="text-xs text-gray-600">
                              {ticket.passengerFirstName} {ticket.passengerLastName}
                            </p>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {ticket.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Issued: {formatDate(ticket.issuedAt)}
                        </p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Special Requests */}
          {booking.specialRequests && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5 text-gray-600" />
                  Special Requests
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700">{booking.specialRequests}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

export default BookingDetails
