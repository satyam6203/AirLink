import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getBookingById } from "@/Redux/booking/bookingThunk";
import { verifyPayment } from "@/Redux/payment/paymentThunk";
import {
  CheckCircle2,
  Download,
  Mail,
  Plane,
  Calendar,
  MapPin,
  User,
  Clock,
  ArrowRight,
  Ticket,
  Utensils,
  Package,
  Loader2,
  Home,
  FileText,
  Luggage,
  ShieldCheck,
  Info,
  CheckCircle,
  XCircle,
  AlertCircle,
  DollarSign,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { generateTicketPDF } from "@/pages/traveler/Ticket/TicketPDF";

const BookingSuccess = () => {
  const { bookingId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { booking, loading, error } = useSelector((state) => state.booking);
  const { callbackResponse, loading: paymentLoading } = useSelector(
    (state) => state.payment
  );
  const [emailSent, setEmailSent] = useState(false);
  const [downloadingPDF, setDownloadingPDF] = useState(false);

  const processPayment = async () => {
    const razorpayPaymentId = searchParams.get("razorpay_payment_id");
    const paymentLinkId = searchParams.get("razorpay_payment_link_id");
    const signature = searchParams.get("razorpay_signature");

    console.log("Payment callback params:", {
      razorpayPaymentId,
      paymentLinkId,
      signature,
    });

    if (razorpayPaymentId && paymentLinkId && signature) {
      console.log("Processing payment callback...");
      try {
        const res = await dispatch(
          verifyPayment({ razorpayPaymentId, paymentLinkId, signature })
        ).unwrap();

        console.log("Payment callback response:", res);

        if (res.message == "Booking Got Confirmed") {
          dispatch(getBookingById(bookingId));
        }
      } catch (error) {
        console.error("Error processing Razorpay callback:", error);
      }
    }
  };
  // Handle payment callback from Razorpay
  useEffect(() => {
    processPayment();
  }, [searchParams, dispatch]);

  // Fetch booking details
  useEffect(() => {
    if (bookingId) {
      dispatch(getBookingById(bookingId));
    }
  }, [bookingId, dispatch]);

  const handleDownloadTicket = async () => {
    if (!booking) {
      alert("No booking data available");
      return;
    }

    try {
      setDownloadingPDF(true);
      const result = await generateTicketPDF(booking);
      console.log("PDF downloaded successfully:", result.fileName);

      // Show success message
      const successMsg = document.createElement("div");
      successMsg.className =
        "fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50";
      successMsg.innerHTML = `
        <div class="flex items-center gap-2">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
          </svg>
          <span>E-Ticket downloaded successfully!</span>
        </div>
      `;
      document.body.appendChild(successMsg);
      setTimeout(() => {
        successMsg.remove();
      }, 3000);
    } catch (error) {
      console.error("Error downloading ticket:", error);
      alert("Failed to download ticket. Please try again.");
    } finally {
      setDownloadingPDF(false);
    }
  };

  const handleSendEmail = () => {
    // TODO: Implement email sending
    setEmailSent(true);
    setTimeout(() => setEmailSent(false), 3000);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const calculateDuration = (departure, arrival) => {
    if (!departure || !arrival) return "N/A";
    const diff = new Date(arrival) - new Date(departure);
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  if (loading || paymentLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-lg text-gray-600">
            {paymentLoading
              ? "Processing payment..."
              : "Loading your booking details..."}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Booking Not Found
            </h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button onClick={() => navigate("/")} className="w-full">
              <Home className="mr-2 h-4 w-4" />
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!booking) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Success Header */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-6 shadow-lg animate-bounce">
            <CheckCircle2 className="h-12 w-12 text-green-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Booking Confirmed!
          </h1>
          <p className="text-xl md:text-2xl mb-2">
            Your flight is booked successfully
          </p>
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full">
            <Ticket className="h-5 w-5" />
            <span className="font-mono text-lg font-semibold">
              {booking.bookingReference}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 ">
        {/* Action Buttons */}
        <Card className="mb-6 shadow-xl">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                onClick={handleDownloadTicket}
                className="w-full "
                size="lg"
                disabled={downloadingPDF}
              >
                {downloadingPDF ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Generating PDF...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-5 w-5" />
                    Download E-Ticket
                  </>
                )}
              </Button>
              <Button
                onClick={handleSendEmail}
                variant="outline"
                className="w-full"
                size="lg"
                disabled={emailSent}
              >
                <Mail className="mr-2 h-5 w-5" />
                {emailSent ? "Email Sent!" : "Email Confirmation"}
              </Button>
              <Button
                onClick={() => navigate("/bookings")}
                variant="outline"
                className="w-full"
                size="lg"
              >
                <FileText className="mr-2 h-5 w-5" />
                View All Bookings
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Flight Details Card */}
            <Card className="shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3">
                <CardTitle className="flex items-center gap-2">
                  <Plane className="h-6 w-6" />
                  Flight Details
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* Flight Route */}
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="h-5 w-5 text-blue-600" />
                        <span className="text-2xl font-bold">
                          {booking.departureAirport}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {formatDate(booking.departureTime)}
                      </div>
                      <div className="text-lg font-semibold text-blue-600">
                        {formatTime(booking.departureTime)}
                      </div>
                    </div>

                    <div className="flex-1 flex flex-col items-center px-4">
                      <div className="text-sm text-gray-500 mb-2">
                        {booking.flightDuration ||
                          calculateDuration(
                            booking.departureTime,
                            booking.arrivalTime
                          )}
                      </div>
                      <div className="w-full h-0.5 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 relative">
                        <Plane className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-purple-600 rotate-90" />
                      </div>
                      <div className="text-xs text-gray-500 mt-2">Non-stop</div>
                    </div>

                    <div className="flex-1 text-right">
                      <div className="flex items-center justify-end gap-2 mb-2">
                        <span className="text-2xl font-bold">
                          {booking.arrivalAirport}
                        </span>
                        <MapPin className="h-5 w-5 text-purple-600" />
                      </div>
                      <div className="text-sm text-gray-600">
                        {formatDate(booking.arrivalTime)}
                      </div>
                      <div className="text-lg font-semibold text-purple-600">
                        {formatTime(booking.arrivalTime)}
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Flight Info */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <div className="text-sm text-gray-500 mb-1">
                        Flight Number
                      </div>
                      <div className="font-semibold">
                        {booking.flightNumber}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">
                        Flight Name
                      </div>
                      <div className="font-semibold">
                        {booking.flightName || "N/A"}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Duration</div>
                      <div className="font-semibold">
                        {booking.flightDuration ||
                          calculateDuration(
                            booking.departureTime,
                            booking.arrivalTime
                          )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Passenger Details */}
            <Card className="shadow-lg">
              <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3">
                <CardTitle className="flex items-center gap-2">
                  <User className="h-6 w-6" />
                  Passenger Details (
                  {booking.totalPassengers || booking.passengers?.length || 0})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {booking.passengers && booking.passengers.length > 0 ? (
                    booking.passengers.map((passenger, index) => (
                      <div
                        key={passenger.id || index}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                            {index + 1}
                          </div>
                          <div>
                            <div className="font-semibold text-lg">
                              {passenger.fullName ||
                                `${passenger.firstName} ${passenger.lastName}`}
                            </div>
                            <div className="text-sm text-gray-600 space-y-1">
                              <div>{passenger.email}</div>
                              {passenger.phone && (
                                <div>📞 {passenger.phone}</div>
                              )}
                              {passenger.nationality && (
                                <div>🌍 {passenger.nationality}</div>
                              )}
                            </div>
                          </div>
                        </div>
                        <Badge
                          variant="outline"
                          className="bg-purple-50 text-purple-700 border-purple-200"
                        >
                          {passenger.isAdult ? "Adult" : "Child"}
                        </Badge>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-gray-500 py-4">
                      No passenger details available
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Seat Details */}
            {booking.seatInstances && booking.seatInstances.length > 0 && (
              <Card className="shadow-lg">
                <CardHeader className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-3">
                  <CardTitle className="flex items-center gap-2">
                    <Ticket className="h-6 w-6" />
                    Seat Assignments
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {booking.seatInstances.map((seat, index) => (
                      <div
                        key={seat.id || index}
                        className="p-4 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg border-2 border-indigo-200"
                      >
                        <div className="text-2xl font-bold text-indigo-600 text-center">
                          {seat.seatNumber || seat.seatPosition}
                        </div>
                        <div className="text-xs text-gray-600 mt-1 text-center">
                          {seat.flightCabinClassType ||
                            seat.seatType ||
                            "Economy"}
                        </div>
                        {seat.passengerName && (
                          <div className="text-xs text-gray-500 mt-2 text-center truncate">
                            {seat.passengerName}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Meals */}
            {booking.meals?.length > 0 && (
              <Card className="shadow-lg">
                <CardHeader className="bg-gradient-to-r from-emerald-600 to-green-600 text-white py-3">
                  <CardTitle className="flex items-center gap-2">
                    <Utensils className="h-6 w-6" />
                    In-Flight Meals ({booking.meals.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {booking.meals.map((mealItem, index) => {
                      const meal = mealItem.meal;
                      const isComplimentary = mealItem.complimentary || mealItem.price === 0;

                      return (
                        <div
                          key={mealItem.id || index}
                          className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border-2 border-green-200 overflow-hidden hover:shadow-lg transition-shadow"
                        >
                          {/* Meal Image */}
                          {meal?.imageUrl && (
                            <div className="relative h-40 w-full overflow-hidden bg-gray-200">
                              <img
                                src={meal.imageUrl}
                                alt={meal.name || "Meal"}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                }}
                              />
                              {isComplimentary && (
                                <div className="absolute top-2 right-2">
                                  <Badge className="bg-green-600 text-white shadow-lg">
                                    Complimentary
                                  </Badge>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Meal Details */}
                          <div className="p-4">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <h5 className="font-bold text-gray-900 text-lg">
                                  {meal?.name || "Meal"}
                                </h5>
                                {meal?.code && (
                                  <p className="text-xs text-gray-500 font-mono">
                                    {meal.code}
                                  </p>
                                )}
                              </div>
                              {!isComplimentary && mealItem.price > 0 && (
                                <div className="text-right ml-2">
                                  <div className="text-lg font-bold text-green-700">
                                    ₹{mealItem.price?.toLocaleString()}
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Meal Type and Dietary Restriction */}
                            <div className="flex flex-wrap gap-2 mb-3">
                              {meal?.mealType && (
                                <Badge variant="outline" className="bg-emerald-100 text-emerald-800 text-xs">
                                  {meal.mealType.replace(/_/g, ' ')}
                                </Badge>
                              )}
                              {meal?.dietaryRestriction && (
                                <Badge variant="outline" className="bg-green-100 text-green-800 text-xs">
                                  {meal.dietaryRestriction.replace(/_/g, ' ')}
                                </Badge>
                              )}
                            </div>

                            {/* Description */}
                            {meal?.description && (
                              <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                                {meal.description}
                              </p>
                            )}

                            {/* Ingredients */}
                            {meal?.ingredients && (
                              <div className="mb-2">
                                <p className="text-xs font-semibold text-gray-700 mb-1">
                                  Ingredients:
                                </p>
                                <p className="text-xs text-gray-600 line-clamp-2">
                                  {meal.ingredients}
                                </p>
                              </div>
                            )}

                            {/* Allergens */}
                            {meal?.allergens && (
                              <div className="mb-2 p-2 bg-red-50 border border-red-200 rounded">
                                <p className="text-xs font-semibold text-red-800 flex items-center gap-1">
                                  <AlertCircle className="h-3 w-3" />
                                  Allergens:
                                </p>
                                <p className="text-xs text-red-700">
                                  {meal.allergens}
                                </p>
                              </div>
                            )}

                            {/* Nutritional Info */}
                            {meal?.nutritionalInfo && (
                              <div className="mb-2">
                                <p className="text-xs font-semibold text-gray-700 mb-1">
                                  Nutritional Info:
                                </p>
                                <p className="text-xs text-gray-600">
                                  {meal.nutritionalInfo}
                                </p>
                              </div>
                            )}

                            {/* Additional Info */}
                            <div className="space-y-1 mt-3 pt-3 border-t border-green-200">
                              {meal?.airline && (
                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                  <Plane className="h-3 w-3" />
                                  <span>{meal.airline.name}</span>
                                </div>
                              )}
                              {mealItem.available !== undefined && (
                                <div className="flex items-center gap-2 text-xs">
                                  {mealItem.available ? (
                                    <>
                                      <CheckCircle className="h-3 w-3 text-green-600" />
                                      <span className="text-green-700 font-medium">Available</span>
                                    </>
                                  ) : (
                                    <>
                                      <XCircle className="h-3 w-3 text-red-600" />
                                      <span className="text-red-700 font-medium">Unavailable</span>
                                    </>
                                  )}
                                </div>
                              )}
                              {meal?.requiresAdvanceBooking && (
                                <div className="flex items-center gap-2 text-xs text-amber-700">
                                  <Clock className="h-3 w-3" />
                                  <span>
                                    Requires {meal.advanceBookingHours || 24}h advance booking
                                  </span>
                                </div>
                              )}
                              {mealItem.maxQuantity && (
                                <div className="text-xs text-gray-600">
                                  Max Quantity: {mealItem.maxQuantity}
                                </div>
                              )}
                              {mealItem.notes && (
                                <div className="text-xs text-gray-600 italic">
                                  Note: {mealItem.notes}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Meal Summary */}
                  <div className="mt-6 pt-4 border-t border-green-200">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700 font-semibold">
                        Total Meals: {booking.meals.length}
                      </span>
                      <div className="text-right">
                        <div className="text-sm text-gray-600">Meal Charges</div>
                        <div className="text-xl font-bold text-green-700">
                          ₹{booking.meals
                            .filter(m => !m.complimentary && m.price > 0)
                            .reduce((sum, m) => sum + (m.price || 0), 0)
                            .toLocaleString()}
                        </div>
                        {booking.meals.some(m => m.complimentary || m.price === 0) && (
                          <div className="text-xs text-green-600">
                            + {booking.meals.filter(m => m.complimentary || m.price === 0).length} Complimentary
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Ancillaries & Services */}
            {booking.ancillaries?.length > 0 && (
              <Card className="shadow-lg">
                <CardHeader className="bg-gradient-to-r from-orange-600 to-amber-600 text-white py-3">
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-6 w-6" />
                    Add-ons & Services ({booking.ancillaries.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    {booking.ancillaries.map((item, index) => {
                      const ancillary = item.ancillary;
                      const isTravellProtection = ancillary?.type === "TRAVEL_PROTECTION";
                      const isBaggage = ancillary?.type === "BAGGAGE";

                      return (
                        <div key={item.id || index}>
                          {/* Ancillary Header */}
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-start gap-3 flex-1">
                              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                {isTravellProtection ? (
                                  <ShieldCheck className="h-6 w-6 text-white" />
                                ) : isBaggage ? (
                                  <Luggage className="h-6 w-6 text-white" />
                                ) : (
                                  <Package className="h-6 w-6 text-white" />
                                )}
                              </div>
                              <div className="flex-1">
                                <h4 className="font-bold text-lg text-gray-900">
                                  {ancillary?.name || "Service"}
                                </h4>
                                {ancillary?.description && (
                                  <p className="text-sm text-gray-600 mt-1">
                                    {ancillary.description}
                                  </p>
                                )}
                                <div className="flex flex-wrap gap-2 mt-2">
                                  <Badge variant="outline" className="text-xs">
                                    {ancillary?.type?.replace(/_/g, ' ')}
                                  </Badge>
                                  {ancillary?.subType && (
                                    <Badge variant="outline" className="text-xs bg-orange-50">
                                      {ancillary.subType}
                                    </Badge>
                                  )}
                                  {ancillary?.rfisc && (
                                    <Badge variant="outline" className="text-xs bg-gray-50">
                                      RFISC: {ancillary.rfisc}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="text-right ml-4">
                              <div className="text-2xl font-bold text-orange-600">
                                ₹{item.price?.toLocaleString()}
                              </div>
                              {item.available !== undefined && (
                                <Badge className={item.available ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                                  {item.available ? "Available" : "Unavailable"}
                                </Badge>
                              )}
                            </div>
                          </div>

                          {/* Travel Insurance Coverages */}
                          {isTravellProtection && ancillary?.coverages && ancillary.coverages.length > 0 && (
                            <div className="mt-4 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                              <h5 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                                <ShieldCheck className="h-5 w-5" />
                                Coverage Details
                              </h5>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {ancillary.coverages
                                  .filter(c => c.active)
                                  .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
                                  .map((coverage) => (
                                    <div
                                      key={coverage.id}
                                      className="bg-white p-3 rounded-lg border border-blue-100 hover:border-blue-300 transition-colors"
                                    >
                                      <div className="flex items-start gap-2">
                                        <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                                        <div className="flex-1 min-w-0">
                                          <div className="font-semibold text-sm text-gray-900">
                                            {coverage.name}
                                          </div>
                                          {coverage.coverageAmount > 0 && (
                                            <div className="text-xs text-blue-700 font-medium mt-1">
                                              Coverage: {coverage.currency || "₹"} {coverage.coverageAmount.toLocaleString()}
                                              {coverage.isFlat && " (Flat)"}
                                            </div>
                                          )}
                                          {coverage.description && (
                                            <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                                              {coverage.description}
                                            </p>
                                          )}
                                          {coverage.claimCondition && (
                                            <p className="text-xs text-amber-700 mt-1 italic">
                                              {coverage.claimCondition}
                                            </p>
                                          )}
                                          {coverage.emergencyContact && (
                                            <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                              <Mail className="h-3 w-3" />
                                              {coverage.emergencyContact}
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                              </div>
                            </div>
                          )}

                          {/* Baggage Metadata */}
                          {isBaggage && ancillary?.metadata?.baggage && (
                            <div className="mt-4 p-4 bg-gradient-to-br from-purple-50 to-violet-50 rounded-lg border border-purple-200">
                              <h5 className="font-semibold text-purple-900 mb-3 flex items-center gap-2">
                                <Luggage className="h-5 w-5" />
                                Baggage Details
                              </h5>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {ancillary.metadata.baggage.weight && (
                                  <div className="bg-white p-3 rounded-lg">
                                    <div className="text-xs text-gray-600 mb-1">Weight</div>
                                    <div className="font-bold text-purple-700">
                                      {ancillary.metadata.baggage.weight} {ancillary.metadata.baggage.unit || "KG"}
                                    </div>
                                  </div>
                                )}
                                {ancillary.metadata.baggage.pieces && (
                                  <div className="bg-white p-3 rounded-lg">
                                    <div className="text-xs text-gray-600 mb-1">Pieces</div>
                                    <div className="font-bold text-purple-700">
                                      {ancillary.metadata.baggage.pieces}
                                    </div>
                                  </div>
                                )}
                                {ancillary.metadata.baggage.category && (
                                  <div className="bg-white p-3 rounded-lg">
                                    <div className="text-xs text-gray-600 mb-1">Category</div>
                                    <div className="font-bold text-purple-700">
                                      {ancillary.metadata.baggage.category}
                                    </div>
                                  </div>
                                )}
                                {ancillary.metadata.baggage.dimensions && (
                                  <div className="bg-white p-3 rounded-lg">
                                    <div className="text-xs text-gray-600 mb-1">Dimensions</div>
                                    <div className="font-bold text-purple-700">
                                      {ancillary.metadata.baggage.dimensions} cm
                                    </div>
                                  </div>
                                )}
                              </div>
                              {ancillary.metadata.baggage.notes && (
                                <div className="mt-3 text-sm text-gray-600 bg-white p-2 rounded">
                                  <Info className="h-4 w-4 inline mr-1" />
                                  {ancillary.metadata.baggage.notes}
                                </div>
                              )}
                            </div>
                          )}

                          {/* Separator between ancillaries */}
                          {index < booking.ancillaries.length - 1 && (
                            <Separator className="mt-6" />
                          )}
                        </div>
                      );
                    })}

                    {/* Special Requests */}
                    {(booking.requiresSpecialMeals || booking.requiresWheelchairAssistance) && (
                      <>
                        <Separator />
                        <div className="space-y-3">
                          <h5 className="font-semibold text-gray-900">Special Requests</h5>
                          {booking.requiresSpecialMeals && (
                            <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                              <Utensils className="h-5 w-5 text-orange-600" />
                              <span className="font-medium">Special Meal Requested</span>
                            </div>
                          )}
                          {booking.requiresWheelchairAssistance && (
                            <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                              <User className="h-5 w-5 text-orange-600" />
                              <span className="font-medium">Wheelchair Assistance</span>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Fare Details */}
            {booking.fare && (
              <Card className="shadow-lg">
                <CardHeader className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white py-3">
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-6 w-6" />
                    Fare Details - {booking.fare.fareLabel || 'Standard'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Fare Breakdown */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="p-3 bg-teal-50 rounded-lg">
                        <div className="text-sm text-gray-600 mb-1">Base Fare</div>
                        <div className="text-lg font-bold text-teal-700">
                          ₹{booking.fare.baseFare?.toLocaleString() || '0'}
                        </div>
                      </div>
                      <div className="p-3 bg-teal-50 rounded-lg">
                        <div className="text-sm text-gray-600 mb-1">Current Price</div>
                        <div className="text-lg font-bold text-teal-700">
                          ₹{booking.fare.currentPrice?.toLocaleString() || '0'}
                        </div>
                      </div>
                      <div className="p-3 bg-teal-50 rounded-lg">
                        <div className="text-sm text-gray-600 mb-1">Cabin Class</div>
                        <div className="text-lg font-bold text-teal-700">
                          {booking.fare.cabinClass || 'Economy'}
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Fare Benefits */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-teal-600" />
                        Included Benefits
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {booking.fare.complimentaryMeals !== null && (
                          <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                            {booking.fare.complimentaryMeals ? (
                              <>
                                <CheckCircle className="h-4 w-4 text-green-600" />
                                <span className="text-sm">Complimentary Meals</span>
                              </>
                            ) : (
                              <>
                                <XCircle className="h-4 w-4 text-red-500" />
                                <span className="text-sm text-gray-500">No Complimentary Meals</span>
                              </>
                            )}
                          </div>
                        )}
                        {booking.fare.complimentaryBeverages !== null && (
                          <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                            {booking.fare.complimentaryBeverages ? (
                              <>
                                <CheckCircle className="h-4 w-4 text-green-600" />
                                <span className="text-sm">Complimentary Beverages</span>
                              </>
                            ) : (
                              <>
                                <XCircle className="h-4 w-4 text-red-500" />
                                <span className="text-sm text-gray-500">No Complimentary Beverages</span>
                              </>
                            )}
                          </div>
                        )}
                        {booking.fare.extraSeatSpace !== null && (
                          <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                            {booking.fare.extraSeatSpace ? (
                              <>
                                <CheckCircle className="h-4 w-4 text-green-600" />
                                <span className="text-sm">Extra Seat Space</span>
                              </>
                            ) : (
                              <>
                                <XCircle className="h-4 w-4 text-red-500" />
                                <span className="text-sm text-gray-500">Standard Seat Space</span>
                              </>
                            )}
                          </div>
                        )}
                        {booking.fare.advanceSeatSelection !== null && (
                          <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                            {booking.fare.advanceSeatSelection ? (
                              <>
                                <CheckCircle className="h-4 w-4 text-green-600" />
                                <span className="text-sm">Advance Seat Selection</span>
                              </>
                            ) : (
                              <>
                                <XCircle className="h-4 w-4 text-red-500" />
                                <span className="text-sm text-gray-500">No Advance Seat Selection</span>
                              </>
                            )}
                          </div>
                        )}
                        {booking.fare.airportTransfer !== null && (
                          <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                            {booking.fare.airportTransfer ? (
                              <>
                                <CheckCircle className="h-4 w-4 text-green-600" />
                                <span className="text-sm">Airport Transfer</span>
                              </>
                            ) : (
                              <>
                                <XCircle className="h-4 w-4 text-red-500" />
                                <span className="text-sm text-gray-500">No Airport Transfer</span>
                              </>
                            )}
                          </div>
                        )}
                        {booking.fare.airlineFees > 0 && (
                          <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                            <Info className="h-4 w-4 text-blue-600" />
                            <span className="text-sm">Airline Fees: ₹{booking.fare.airlineFees}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Baggage Policy */}
            {booking.fare?.baggagePolicy && (
              <Card className="shadow-lg">
                <CardHeader className="bg-gradient-to-r from-violet-600 to-purple-600 text-white py-3">
                  <CardTitle className="flex items-center gap-2">
                    <Luggage className="h-6 w-6" />
                    Baggage Policy
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Policy Name and Description */}
                    <div className="mb-4">
                      <h4 className="font-semibold text-lg text-gray-900 mb-1">
                        {booking.fare.baggagePolicy.name || 'Standard Baggage Policy'}
                      </h4>
                      {booking.fare.baggagePolicy.description && (
                        <p className="text-sm text-gray-600">
                          {booking.fare.baggagePolicy.description}
                        </p>
                      )}
                    </div>

                    <Separator />

                    {/* Cabin Baggage */}
                    <div className="bg-violet-50 p-4 rounded-lg">
                      <h5 className="font-semibold text-violet-900 mb-3 flex items-center gap-2">
                        <Package className="h-5 w-5" />
                        Cabin Baggage
                      </h5>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        <div>
                          <div className="text-xs text-gray-600 mb-1">Pieces Allowed</div>
                          <div className="font-semibold text-violet-700">
                            {booking.fare.baggagePolicy.cabinBaggagePieces || 1}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-600 mb-1">Max Weight</div>
                          <div className="font-semibold text-violet-700">
                            {booking.fare.baggagePolicy.cabinBaggageMaxWeight || 7} kg
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-600 mb-1">Weight per Piece</div>
                          <div className="font-semibold text-violet-700">
                            {booking.fare.baggagePolicy.cabinBaggageWeightPerPiece || 7} kg
                          </div>
                        </div>
                        <div className="md:col-span-3">
                          <div className="text-xs text-gray-600 mb-1">Max Dimensions</div>
                          <div className="font-semibold text-violet-700">
                            {booking.fare.baggagePolicy.cabinBaggageMaxDimension || 115} cm (L + W + H)
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Check-in Baggage */}
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h5 className="font-semibold text-purple-900 mb-3 flex items-center gap-2">
                        <Luggage className="h-5 w-5" />
                        Check-in Baggage
                      </h5>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        <div>
                          <div className="text-xs text-gray-600 mb-1">Pieces Allowed</div>
                          <div className="font-semibold text-purple-700">
                            {booking.fare.baggagePolicy.checkInBaggagePieces || 1}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-600 mb-1">Max Weight</div>
                          <div className="font-semibold text-purple-700">
                            {booking.fare.baggagePolicy.checkInBaggageMaxWeight || 20} kg
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-600 mb-1">Weight per Piece</div>
                          <div className="font-semibold text-purple-700">
                            {booking.fare.baggagePolicy.checkInBaggageWeightPerPiece || 20} kg
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-600 mb-1">Free Checked Bags</div>
                          <div className="font-semibold text-purple-700">
                            {booking.fare.baggagePolicy.freeCheckedBagsAllowance || 0}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Additional Benefits */}
                    <div className="flex flex-wrap gap-2">
                      {booking.fare.baggagePolicy.extraBaggageAllowance && (
                        <Badge className="bg-green-100 text-green-800 border-green-300">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Extra Baggage Allowance
                        </Badge>
                      )}
                      {booking.fare.baggagePolicy.priorityBaggage && (
                        <Badge className="bg-blue-100 text-blue-800 border-blue-300">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Priority Baggage
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Fare Rules */}
            {booking.fare?.fareRules && (
              <Card className="shadow-lg">
                <CardHeader className="bg-gradient-to-r from-rose-600 to-pink-600 text-white py-3">
                  <CardTitle className="flex items-center gap-2">
                    <ShieldCheck className="h-6 w-6" />
                    Fare Rules & Policies
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Rule Name */}
                    {booking.fare.fareRules.ruleName && (
                      <div className="mb-4">
                        <h4 className="font-semibold text-lg text-gray-900">
                          {booking.fare.fareRules.ruleName}
                        </h4>
                        {booking.fare.fareRules.airlineName && (
                          <p className="text-sm text-gray-600">
                            {booking.fare.fareRules.airlineName}
                          </p>
                        )}
                      </div>
                    )}

                    <Separator />

                    {/* Refund & Change Policies */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Refund Policy */}
                      <div className="p-4 rounded-lg border-2 border-gray-200">
                        <div className="flex items-center gap-2 mb-3">
                          {booking.fare.fareRules.isRefundable ? (
                            <>
                              <CheckCircle className="h-5 w-5 text-green-600" />
                              <span className="font-semibold text-green-700">Refundable</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="h-5 w-5 text-red-600" />
                              <span className="font-semibold text-red-700">Non-Refundable</span>
                            </>
                          )}
                        </div>
                        {booking.fare.fareRules.isRefundable && (
                          <div className="space-y-2 text-sm">
                            {booking.fare.fareRules.cancellationFee !== null && (
                              <div className="flex justify-between">
                                <span className="text-gray-600">Cancellation Fee:</span>
                                <span className="font-semibold text-gray-900">
                                  ₹{booking.fare.fareRules.cancellationFee?.toLocaleString()}
                                </span>
                              </div>
                            )}
                            {booking.fare.fareRules.refundDeadlineDays !== null && (
                              <div className="flex justify-between">
                                <span className="text-gray-600">Refund Deadline:</span>
                                <span className="font-semibold text-gray-900">
                                  {booking.fare.fareRules.refundDeadlineDays} days before
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Change Policy */}
                      <div className="p-4 rounded-lg border-2 border-gray-200">
                        <div className="flex items-center gap-2 mb-3">
                          {booking.fare.fareRules.isChangeable || booking.fare.fareRules.changeFee !== null ? (
                            <>
                              <CheckCircle className="h-5 w-5 text-green-600" />
                              <span className="font-semibold text-green-700">Changeable</span>
                            </>
                          ) : (
                            <>
                              <AlertCircle className="h-5 w-5 text-orange-600" />
                              <span className="font-semibold text-orange-700">Change Restrictions Apply</span>
                            </>
                          )}
                        </div>
                        <div className="space-y-2 text-sm">
                          {booking.fare.fareRules.changeFee !== null && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Change Fee:</span>
                              <span className="font-semibold text-gray-900">
                                ₹{booking.fare.fareRules.changeFee?.toLocaleString()}
                              </span>
                            </div>
                          )}
                          {booking.fare.fareRules.changeDeadlineHours !== null && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Change Deadline:</span>
                              <span className="font-semibold text-gray-900">
                                {booking.fare.fareRules.changeDeadlineHours} hours before
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Important Notice */}
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                      <div className="flex gap-3">
                        <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div className="space-y-1 text-sm text-amber-900">
                          <p className="font-semibold">Important Information:</p>
                          <ul className="list-disc list-inside space-y-1 text-amber-800">
                            <li>All fees are subject to fare difference charges</li>
                            <li>Refunds and changes must be requested within the specified deadlines</li>
                            <li>Fees shown are per passenger, per segment</li>
                            <li>Contact customer support for assistance with changes or cancellations</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Booking Summary */}
            <Card className="">
              <CardHeader className="bg-gradient-to-r from-green-600 to-teal-600 text-white py-3">
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Booking Reference</span>
                  <span className="font-mono font-bold text-green-600">
                    {booking.bookingReference}
                  </span>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Status</span>
                  <Badge
                    className={cn(
                      "font-semibold",
                      booking.status === "CONFIRMED"
                        ? "bg-green-100 text-green-800"
                        : booking.status === "PENDING"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                    )}
                  >
                    {booking.status}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Payment Status</span>
                  <Badge
                    className={cn(
                      "font-semibold",
                      booking.paymentStatus === "COMPLETED" ||
                      booking.paymentStatus === "SUCCESS" ||
                        booking.paymentStatus === "PAID"
                        ? "bg-green-100 text-green-800"
                        : booking.paymentStatus === "PENDING"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    )}
                  >
                    {booking.paymentStatus || "PENDING"}
                  </Badge>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Base Fare</span>
                    <span className="font-medium">
                      {booking.currency || "₹"}{" "}
                      {booking.fare?.baseFare?.toFixed(2) || "0.00"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Taxes & Fees</span>
                    <span className="font-medium">
                      {booking.currency || "₹"}{" "}
                      {((booking.totalAmount || 0) - (booking.fare?.baseFare || 0) - (booking.fare?.airlineFees || 0))?.toFixed(2) || "0.00"}
                    </span>
                  </div>
                  {booking.fare?.airlineFees > 0 && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Airline Fees</span>
                      <span className="font-medium">
                        {booking.currency || "₹"}{" "}
                        {booking.fare?.airlineFees?.toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>

                <Separator />

                <div className="flex items-center justify-between text-lg font-bold">
                  <span>Total Amount</span>
                  <span className="text-green-600">
                    {booking.currency || "₹"}{" "}
                    {booking.totalAmount?.toFixed(2) || "0.00"}
                  </span>
                </div>

                <Separator />

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>Booked on {formatDate(booking.bookingDate)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <User className="h-4 w-4" />
                    <span>{booking.userName || "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="h-4 w-4" />
                    <span className="truncate">
                      {booking.userEmail || "N/A"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Important Information */}
            <Card className="shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3">
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Important Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex gap-2">
                    <ArrowRight className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>
                      Please arrive at the airport at least 2 hours before
                      departure
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <ArrowRight className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>
                      Carry a valid photo ID and printed/digital boarding pass
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <ArrowRight className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>
                      Check baggage allowance and restrictions before packing
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <ArrowRight className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>
                      Confirmation email has been sent to{" "}
                      {booking.userEmail?.split("@")[0]}...
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="shadow-lg">
              <CardContent className="p-4 space-y-2">
                <Button
                  onClick={() => navigate("/")}
                  variant="outline"
                  className="w-full justify-start"
                >
                  <Home className="mr-2 h-4 w-4" />
                  Back to Home
                </Button>
                <Button
                  onClick={() => navigate("/flights")}
                  variant="outline"
                  className="w-full justify-start"
                >
                  <Plane className="mr-2 h-4 w-4" />
                  Book Another Flight
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer Message */}
        <Card className="mt-8 shadow-lg bg-gradient-to-r from-blue-50 to-purple-50">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Thank you for choosing us! ✨
            </h3>
            <p className="text-gray-600 mb-4">
              Have a wonderful journey! For any assistance, contact our 24/7
              customer support.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>support@airline.com</span>
              </div>
              <div className="flex items-center gap-2">
                <span>•</span>
              </div>
              <div className="flex items-center gap-2">
                <span>📞 1800-123-4567</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BookingSuccess;
