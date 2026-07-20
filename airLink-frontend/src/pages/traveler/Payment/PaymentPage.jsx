import * as React from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import {
  ChevronLeft,
  CreditCard,
  CheckCircle,
  Wallet,
  Building2,
  Smartphone,
  Lock,
  Shield,
  Clock,
  User,
  Calendar,
  MapPin,
  Plane,
  AlertCircle,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Get data from location state or URL params
  const { booking, flight, searchData } = location.state || {};
  const bookingReference = searchParams.get("bookingReference");
  const totalAmount = parseFloat(searchParams.get("totalAmount") || "0");
  const currency = searchParams.get("currency") || "USD";

  const [paymentMethod, setPaymentMethod] = React.useState("card");
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [cardDetails, setCardDetails] = React.useState({
    cardNumber: "",
    cardholderName: "",
    expiryDate: "",
    cvv: "",
  });

  // Redirect if no booking data
  React.useEffect(() => {
    if (!bookingReference && !booking) {
      navigate("/");
    }
  }, [bookingReference, booking, navigate]);

  if (!bookingReference && !booking) {
    return null;
  }

  const handlePayment = async () => {
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      // Navigate to success page or booking confirmation
      navigate("/traveler/bookings", {
        state: { bookingReference: bookingReference || booking?.bookingReference }
      });
    }, 2000);
  };

  const formatCardNumber = (value) => {
    const cleaned = value.replace(/\s/g, "");
    const chunks = cleaned.match(/.{1,4}/g);
    return chunks ? chunks.join(" ") : cleaned;
  };

  const handleCardNumberChange = (e) => {
    const value = e.target.value.replace(/\s/g, "");
    if (/^\d*$/.test(value) && value.length <= 16) {
      setCardDetails({ ...cardDetails, cardNumber: formatCardNumber(value) });
    }
  };

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length >= 2) {
      value = value.slice(0, 2) + "/" + value.slice(2, 4);
    }
    if (value.length <= 5) {
      setCardDetails({ ...cardDetails, expiryDate: value });
    }
  };

  const handleCVVChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= 3) {
      setCardDetails({ ...cardDetails, cvv: value });
    }
  };

  const paymentMethods = [
    {
      id: "card",
      name: "Credit/Debit Card",
      icon: CreditCard,
      description: "Visa, Mastercard, Amex",
    },
    {
      id: "upi",
      name: "UPI",
      icon: Smartphone,
      description: "Google Pay, PhonePe, Paytm",
    },
    {
      id: "netbanking",
      name: "Net Banking",
      icon: Building2,
      description: "All major banks",
    },
    {
      id: "wallet",
      name: "Wallets",
      icon: Wallet,
      description: "Paytm, PhonePe, Amazon Pay",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-background border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => navigate(-1)}
                className="p-2"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-foreground flex items-center gap-2">
                  <Lock className="h-5 w-5 text-green-600" />
                  Secure Payment
                </h1>
                <p className="text-sm text-muted-foreground">
                  Booking Ref: {bookingReference || booking?.bookingReference}
                </p>
              </div>
            </div>

            {/* Security Badge */}
            <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="h-4 w-4 text-green-600" />
              <span>256-bit SSL Encrypted</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Payment Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Timer Card */}
            <Card className="border-orange-200 bg-orange-50/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-orange-600" />
                  <div>
                    <p className="font-medium text-orange-900">
                      Complete payment within 15:00 minutes
                    </p>
                    <p className="text-sm text-orange-700">
                      Your booking will be auto-cancelled if payment is not completed
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Methods */}
            <Card>
              <CardHeader>
                <CardTitle>Choose Payment Method</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  {paymentMethods.map((method) => {
                    const Icon = method.icon;
                    return (
                      <div
                        key={method.id}
                        className={cn(
                          "flex items-center space-x-3 rounded-lg border p-4 cursor-pointer transition-all",
                          paymentMethod === method.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        )}
                        onClick={() => setPaymentMethod(method.id)}
                      >
                        <RadioGroupItem value={method.id} id={method.id} />
                        <Icon className="h-5 w-5 text-muted-foreground" />
                        <Label htmlFor={method.id} className="flex-1 cursor-pointer">
                          <div>
                            <p className="font-medium">{method.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {method.description}
                            </p>
                          </div>
                        </Label>
                      </div>
                    );
                  })}
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Payment Details Form */}
            {paymentMethod === "card" && (
              <Card>
                <CardHeader>
                  <CardTitle>Card Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <div className="relative">
                      <Input
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={cardDetails.cardNumber}
                        onChange={handleCardNumberChange}
                        className="mt-1"
                      />
                      <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="cardholderName">Cardholder Name</Label>
                    <Input
                      id="cardholderName"
                      placeholder="JOHN DOE"
                      value={cardDetails.cardholderName}
                      onChange={(e) =>
                        setCardDetails({
                          ...cardDetails,
                          cardholderName: e.target.value.toUpperCase(),
                        })
                      }
                      className="mt-1"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input
                        id="expiry"
                        placeholder="MM/YY"
                        value={cardDetails.expiryDate}
                        onChange={handleExpiryChange}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        type="password"
                        placeholder="123"
                        value={cardDetails.cvv}
                        onChange={handleCVVChange}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
                    <Info className="h-4 w-4 text-blue-600 mt-0.5" />
                    <p className="text-sm text-blue-800">
                      Your card details are encrypted and secure. We do not store your CVV.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {paymentMethod === "upi" && (
              <Card>
                <CardHeader>
                  <CardTitle>UPI Payment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="upiId">Enter UPI ID</Label>
                    <Input
                      id="upiId"
                      placeholder="yourname@upi"
                      className="mt-1"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Or scan the QR code with any UPI app
                  </p>
                  <div className="flex justify-center p-8 bg-muted/50 rounded-lg">
                    <div className="w-48 h-48 bg-white border-2 border-border rounded-lg flex items-center justify-center">
                      <p className="text-muted-foreground">QR Code</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {paymentMethod === "netbanking" && (
              <Card>
                <CardHeader>
                  <CardTitle>Select Your Bank</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {["SBI", "HDFC", "ICICI", "Axis", "Kotak", "PNB"].map(
                      (bank) => (
                        <Button
                          key={bank}
                          variant="outline"
                          className="justify-start"
                        >
                          <Building2 className="h-4 w-4 mr-2" />
                          {bank} Bank
                        </Button>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {paymentMethod === "wallet" && (
              <Card>
                <CardHeader>
                  <CardTitle>Select Wallet</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {["Paytm", "PhonePe", "Amazon Pay", "Google Pay"].map(
                      (wallet) => (
                        <Button
                          key={wallet}
                          variant="outline"
                          className="justify-start"
                        >
                          <Wallet className="h-4 w-4 mr-2" />
                          {wallet}
                        </Button>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Security Info */}
            <Card className="bg-muted/30">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-green-600 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-foreground mb-1">
                      Your payment is secure
                    </p>
                    <ul className="text-muted-foreground space-y-1">
                      <li>• SSL encrypted connection</li>
                      <li>• PCI DSS compliant payment processing</li>
                      <li>• Your data is never stored on our servers</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24 space-y-6">
              {/* Booking Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Booking Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Flight Info */}
                  {flight?.flightInstance && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Plane className="h-4 w-4 text-primary" />
                        <p className="font-medium">
                          {flight.flightInstance.flight?.airline?.name || "Flight"}
                        </p>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div>
                          <p className="font-medium">
                            {flight.flightInstance.flight?.departureAirport?.iataCode}
                          </p>
                          <p className="text-muted-foreground">
                            {new Date(flight.flightInstance.departureTime).toLocaleTimeString(
                              "en-US",
                              { hour: "2-digit", minute: "2-digit" }
                            )}
                          </p>
                        </div>
                        <div className="flex-1 flex items-center justify-center px-2">
                          <div className="h-px bg-border flex-1" />
                          <Plane className="h-3 w-3 mx-2 text-muted-foreground" />
                          <div className="h-px bg-border flex-1" />
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            {flight.flightInstance.flight?.arrivalAirport?.iataCode}
                          </p>
                          <p className="text-muted-foreground">
                            {new Date(flight.flightInstance.arrivalTime).toLocaleTimeString(
                              "en-US",
                              { hour: "2-digit", minute: "2-digit" }
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <Separator />

                  {/* Passenger Info */}
                  {booking?.passengers && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm font-medium">Passengers</p>
                      </div>
                      {booking.passengers.map((passenger, idx) => (
                        <p key={idx} className="text-sm text-muted-foreground pl-6">
                          {passenger.fullName || `${passenger.firstName} ${passenger.lastName}`}
                        </p>
                      ))}
                    </div>
                  )}

                  <Separator />

                  {/* Price Breakdown */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Base Fare</span>
                      <span>{currency} {totalAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Taxes & Fees</span>
                      <span>Included</span>
                    </div>
                  </div>

                  <Separator />

                  {/* Total */}
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-lg font-semibold">Total Amount</span>
                    <span className="text-2xl font-bold text-primary">
                      {currency} {totalAmount.toLocaleString()}
                    </span>
                  </div>

                  {/* Pay Button */}
                  <Button
                    onClick={handlePayment}
                    disabled={isProcessing}
                    className="w-full py-6 text-lg"
                    size="lg"
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Processing Payment...
                      </>
                    ) : (
                      <>
                        <Lock className="h-5 w-5 mr-2" />
                        Pay {currency} {totalAmount.toLocaleString()}
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">
                    By proceeding, you agree to our Terms & Conditions
                  </p>
                </CardContent>
              </Card>

              {/* Help Card */}
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-blue-900 mb-1">
                        Need Help?
                      </p>
                      <p className="text-blue-700">
                        Contact our 24/7 support team at support@airline.com or
                        call 1800-123-4567
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
