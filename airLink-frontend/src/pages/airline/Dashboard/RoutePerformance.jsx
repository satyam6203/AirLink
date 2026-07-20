import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, TrendingUp, DollarSign, Users } from "lucide-react";
import { getRoutePerformanceForAirline } from '@/Redux/booking/bookingThunk';

const RoutePerformance = () => {
  const dispatch = useDispatch();
  const { routePerformance, routePerformanceLoading } = useSelector((store) => store.booking);

  useEffect(() => {
    // Only fetch if we don't have data yet and we're not currently loading

      dispatch(getRoutePerformanceForAirline());
    
  }, [dispatch]);

  if (routePerformanceLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Routes by Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Loading...</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Top Routes by Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Loading...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!routePerformance) {
    return null;
  }

  const RouteCard = ({ route, index }) => (
    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
      <div className="flex items-start gap-3 flex-1">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold">
          {index + 1}
        </div>
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="font-semibold">{route.route}</span>
          </div>
          <p className="text-sm text-muted-foreground">
            {route.departureAirportName} → {route.arrivalAirportName}
          </p>
          <div className="flex flex-wrap gap-2 mt-2">
            <Badge variant="outline" className="gap-1">
              <Users className="h-3 w-3" />
              {route.totalBookings} bookings
            </Badge>
            <Badge variant="outline" className="gap-1">
              <DollarSign className="h-3 w-3" />
              ${route.totalRevenue?.toFixed(2) || '0.00'}
            </Badge>
            <Badge variant="outline" className="gap-1">
              <TrendingUp className="h-3 w-3" />
              Avg: ${route.averageRevenuePerBooking?.toFixed(2) || '0.00'}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Top Routes by Bookings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Top Routes by Bookings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {routePerformance.topRoutesByBookings && routePerformance.topRoutesByBookings.length > 0 ? (
              routePerformance.topRoutesByBookings.map((route, index) => (
                <RouteCard key={`bookings-${index}`} route={route} index={index} />
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No data available</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Top Routes by Revenue */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Top Routes by Revenue
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {routePerformance.topRoutesByRevenue && routePerformance.topRoutesByRevenue.length > 0 ? (
              routePerformance.topRoutesByRevenue.map((route, index) => (
                <RouteCard key={`revenue-${index}`} route={route} index={index} />
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No data available</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RoutePerformance;
