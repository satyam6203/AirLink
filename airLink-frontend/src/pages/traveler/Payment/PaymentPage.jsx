import * as React from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard, ExternalLink, ShieldCheck, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PaymentPage = () => {
  const navigate = useNavigate();
  const [checkoutUrl, setCheckoutUrl] = React.useState(null);

  React.useEffect(() => {
    try {
      const details = JSON.parse(
        sessionStorage.getItem("paymentDetails") || "null",
      );
      setCheckoutUrl(details?.checkoutUrl || details?.payment_link_url || null);
    } catch {
      setCheckoutUrl(null);
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              Secure payment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex items-start gap-3 rounded-lg border border-border bg-muted/30 p-4">
              <ShieldCheck className="h-5 w-5 text-emerald-600 mt-0.5" />
              <p className="text-sm text-muted-foreground">
                Payments are processed by our payment gateway. AirLink does not
                collect or store card details, and no payment is ever marked
                successful unless the gateway confirms it.
              </p>
            </div>

            {checkoutUrl ? (
              <>
                <p className="text-sm text-muted-foreground">
                  A payment session is ready. Continue to the gateway to finish
                  your booking.
                </p>
                <Button
                  onClick={() => {
                    window.location.href = checkoutUrl;
                  }}
                  className="w-full sm:w-auto"
                >
                  Continue to payment
                  <ExternalLink className="h-4 w-4 ml-2" />
                </Button>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                No payment session was found. Start a booking from the flight
                search results, and you will be redirected to the payment
                gateway automatically.
              </p>
            )}

            <div className="flex flex-wrap gap-3 pt-2">
              <Button variant="outline" onClick={() => navigate("/bookings")}>
                My bookings
              </Button>
              <Button variant="outline" onClick={() => navigate("/traveler")}>
                Search flights
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentPage;
