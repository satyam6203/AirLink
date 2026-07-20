import * as React from "react"
import { 
  Download,
  Plane,
  Calendar,
  Clock,
  MapPin,
  User,
  CreditCard,
  Phone,
  Mail,
  Utensils,
  Luggage,
  CheckCircle,
  QrCode,
  ArrowRight,
  Info,
  Wifi,
  Car,
  ArrowLeft
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { generateTicketPDF } from "./TicketPDF"
import { useParams, useNavigate } from "react-router-dom"

const ETicket = ({ ticketData }) => {
  const { pnr } = useParams()
  const navigate = useNavigate()

  // Mock ticket data if none provided
  const defaultTicketData = {
    pnr: "ABCD123",
    eTicketNumber: "125-2587413690",
    bookingReference: "SKYBOOK-001",
    airline: {
      name: "IndiGo",
      code: "6E",
      logo: "🔵"
    },
    flight: {
      number: "6E 123",
      aircraft: "Airbus A320",
      class: "Economy",
      duration: "2h 35m"
    },
    departure: {
      airport: "DEL",
      airportName: "Indira Gandhi International Airport",
      city: "New Delhi",
      terminal: "T3",
      gate: "A12",
      date: "2024-02-15",
      time: "14:30"
    },
    arrival: {
      airport: "BLR",
      airportName: "Kempegowda International Airport",
      city: "Bengaluru",
      terminal: "T1",
      gate: "B7",
      date: "2024-02-15",
      time: "17:05"
    },
    passengers: [
      {
        id: 1,
        name: "John Doe",
        type: "Adult",
        seatNumber: "12A",
        frequentFlyer: "6E123456789"
      },
      {
        id: 2,
        name: "Jane Doe", 
        type: "Adult",
        seatNumber: "12B",
        frequentFlyer: null
      }
    ],
    contact: {
      email: "john.doe@email.com",
      phone: "+91 98765 43210"
    },
    fare: {
      baseFare: 6540,
      taxes: 1240,
      fees: 760,
      total: 8540,
      currency: "INR"
    },
    baggage: {
      checkin: "15 kg",
      cabin: "7 kg"
    },
    services: {
      meal: "Vegetarian Meal",
      wheelchair: false,
      extraLegroom: true,
      priorityBoarding: false
    },
    paymentMethod: "UPI",
    bookingDate: "2024-01-20T10:30:00Z",
    status: "Confirmed"
  }

  const ticket = ticketData || { ...defaultTicketData, pnr: pnr || defaultTicketData.pnr }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })
  }

  const handleDownloadPDF = async () => {
    try {
      await generateTicketPDF(ticket)
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Error generating PDF. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Bookings
            </Button>
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">E-Ticket Confirmation</h1>
            <p className="text-gray-600">Your booking has been confirmed. Please arrive at the airport 2 hours before departure.</p>
          </div>
        </div>

        {/* Main Ticket */}
        <Card className="overflow-hidden shadow-2xl border-0 bg-white">
          {/* Ticket Header */}
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-4">
                <div className="text-4xl">{ticket.airline.logo}</div>
                <div>
                  <h2 className="text-2xl font-bold">{ticket.airline.name}</h2>
                  <p className="text-blue-100">Flight {ticket.flight.number}</p>
                </div>
              </div>
              <div className="text-right">
                <Badge className="bg-green-500 text-white mb-2">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  {ticket.status}
                </Badge>
                <Button 
                  onClick={handleDownloadPDF}
                  className="bg-white text-blue-600 hover:bg-blue-50 flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download PDF
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {/* Flight Route */}
            <div className="p-6 bg-gray-50 border-b">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                {/* Departure */}
                <div className="text-center md:text-left">
                  <div className="text-3xl font-bold text-gray-900 mb-1">{formatTime(ticket.departure.time)}</div>
                  <div className="text-xl font-semibold text-gray-700">{ticket.departure.airport}</div>
                  <div className="text-sm text-gray-600">{ticket.departure.airportName}</div>
                  <div className="text-sm text-gray-600">{ticket.departure.city}</div>
                  <div className="text-sm text-blue-600 font-medium mt-1">
                    Terminal {ticket.departure.terminal} • Gate {ticket.departure.gate}
                  </div>
                </div>

                {/* Flight Info */}
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="w-4 h-4 border-2 border-blue-400 rounded-full"></div>
                    <div className="flex-1 h-px bg-blue-300 relative">
                      <Plane className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-5 w-5 text-blue-500" />
                    </div>
                    <div className="w-4 h-4 bg-blue-400 rounded-full"></div>
                  </div>
                  <div className="text-sm text-gray-600">{ticket.flight.duration}</div>
                  <div className="text-sm text-gray-500">{ticket.flight.aircraft}</div>
                  <div className="text-lg font-semibold text-gray-800 mt-1">{formatDate(ticket.departure.date)}</div>
                </div>

                {/* Arrival */}
                <div className="text-center md:text-right">
                  <div className="text-3xl font-bold text-gray-900 mb-1">{formatTime(ticket.arrival.time)}</div>
                  <div className="text-xl font-semibold text-gray-700">{ticket.arrival.airport}</div>
                  <div className="text-sm text-gray-600">{ticket.arrival.airportName}</div>
                  <div className="text-sm text-gray-600">{ticket.arrival.city}</div>
                  <div className="text-sm text-blue-600 font-medium mt-1">
                    Terminal {ticket.arrival.terminal} • Gate {ticket.arrival.gate}
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Details */}
            <div className="p-6 border-b">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">PNR</h3>
                  <p className="text-lg font-bold text-gray-900">{ticket.pnr}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">E-Ticket Number</h3>
                  <p className="text-lg font-bold text-gray-900">{ticket.eTicketNumber}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">Class</h3>
                  <p className="text-lg font-bold text-gray-900">{ticket.flight.class}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">Booking Date</h3>
                  <p className="text-lg font-bold text-gray-900">
                    {new Date(ticket.bookingDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Passengers */}
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <User className="h-5 w-5" />
                Passenger Details
              </h3>
              <div className="space-y-4">
                {ticket.passengers.map((passenger, index) => (
                  <div key={passenger.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-semibold text-gray-900">{passenger.name}</h4>
                      <p className="text-sm text-gray-600">{passenger.type}</p>
                      {passenger.frequentFlyer && (
                        <p className="text-sm text-blue-600">FF: {passenger.frequentFlyer}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-blue-600">Seat {passenger.seatNumber}</div>
                      <div className="text-sm text-gray-600">{ticket.flight.class}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Services & Baggage */}
            <div className="p-6 border-b">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Services */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Utensils className="h-5 w-5" />
                    Special Services
                  </h3>
                  <div className="space-y-2">
                    {ticket.services.meal && (
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Meal: {ticket.services.meal}</span>
                      </div>
                    )}
                    {ticket.services.extraLegroom && (
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Extra Legroom</span>
                      </div>
                    )}
                    {ticket.services.priorityBoarding && (
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Priority Boarding</span>
                      </div>
                    )}
                    {ticket.services.wheelchair && (
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Wheelchair Assistance</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Baggage */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Luggage className="h-5 w-5" />
                    Baggage Allowance
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Check-in Baggage:</span>
                      <span className="text-sm font-medium">{ticket.baggage.checkin}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Cabin Baggage:</span>
                      <span className="text-sm font-medium">{ticket.baggage.cabin}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Fare Breakdown */}
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Fare Details
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Base Fare:</span>
                  <span className="text-sm">₹{ticket.fare.baseFare.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Taxes & Fees:</span>
                  <span className="text-sm">₹{ticket.fare.taxes.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Other Charges:</span>
                  <span className="text-sm">₹{ticket.fare.fees.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="font-semibold text-gray-900">Total Amount:</span>
                  <span className="font-bold text-lg text-green-600">₹{ticket.fare.total.toLocaleString()}</span>
                </div>
                <div className="text-sm text-gray-500">
                  Payment Method: {ticket.paymentMethod}
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Contact Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{ticket.contact.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{ticket.contact.phone}</span>
                </div>
              </div>
            </div>

            {/* Important Information */}
            <div className="p-6 bg-amber-50 border-amber-200">
              <h3 className="text-lg font-semibold text-amber-900 mb-4 flex items-center gap-2">
                <Info className="h-5 w-5" />
                Important Information
              </h3>
              <div className="space-y-2 text-sm text-amber-800">
                <p>• Please arrive at the airport at least 2 hours before domestic flights and 3 hours before international flights.</p>
                <p>• Carry a valid photo ID (Aadhaar, Passport, Driving License, Voter ID) for security check.</p>
                <p>• Web check-in opens 48 hours before departure and closes 2 hours before departure.</p>
                <p>• Boarding closes 25 minutes before departure for domestic flights.</p>
                <p>• This is an electronic ticket. No need to print, but recommended for airport reference.</p>
              </div>
            </div>

            {/* QR Code Section */}
            <div className="p-6 text-center bg-gray-50">
              <div className="flex items-center justify-center gap-4">
                <div className="w-16 h-16 bg-gray-300 rounded-lg flex items-center justify-center">
                  <QrCode className="h-8 w-8 text-gray-600" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900">Quick Check-in</p>
                  <p className="text-xs text-gray-600">Scan this QR code at the airport for faster check-in</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Actions */}
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <Button variant="outline" className="flex items-center gap-2">
            <Wifi className="h-4 w-4" />
            Web Check-in
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Car className="h-4 w-4" />
            Book Cab
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            Customer Support
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ETicket
