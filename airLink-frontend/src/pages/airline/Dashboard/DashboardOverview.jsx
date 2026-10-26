import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Users, 
  BarChart3, 
  Plane, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  ShieldCheck, 
  ArrowRight,
  TrendingUp,
  MapPin
} from "lucide-react";
import FlightCard from "./FlightManagment/FlightCard";
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getFlightsByAirline } from "@/Redux/flight/flightThunk";
import { listAllAircrafts } from "@/Redux/aircraft/aircraftThunks";
import { getBookingsByAirline } from "@/Redux/booking/bookingThunk";

const DashboardOverview = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { flights = [] } = useSelector(store => store.flight || {});
  const { aircrafts = [] } = useSelector(store => store.aircraft || {});
  const { bookings = [] } = useSelector(store => store.booking || {});

  React.useEffect(() => {
    dispatch(getFlightsByAirline());
    dispatch(listAllAircrafts());
    dispatch(getBookingsByAirline());
  }, [dispatch]);

  const flightList = Array.isArray(flights) ? flights : [];
  const aircraftList = Array.isArray(aircrafts) ? aircrafts : [];
  const bookingList = Array.isArray(bookings) ? bookings : [];

  // Generate dynamic recent activity based on actual data
  const activities = React.useMemo(() => {
    const list = [];

    // Add recent flights to activity
    flightList.forEach(f => {
      const from = f.departureAirport?.iataCode || 'DEP';
      const to = f.arrivalAirport?.iataCode || 'ARR';
      list.push({
        id: `flight-${f.id}`,
        type: 'flight',
        title: `Flight ${f.flightNumber} (${from} → ${to})`,
        subtitle: `Aircraft ${f.aircraft?.code || 'Assigned'} • Status: ${f.status || 'SCHEDULED'}`,
        color: f.status === 'SCHEDULED' || f.status === 'ACTIVE' ? 'bg-green-500' : 'bg-blue-500',
        date: f.createdAt ? new Date(f.createdAt) : new Date()
      });
    });

    // Add recent aircraft additions
    aircraftList.forEach(a => {
      list.push({
        id: `aircraft-${a.id}`,
        type: 'aircraft',
        title: `Fleet Aircraft Registered: ${a.code}`,
        subtitle: `${a.manufacturer} ${a.model} (${a.seatingCapacity} seats) • ${a.status || 'ACTIVE'}`,
        color: 'bg-purple-500',
        date: a.createdAt ? new Date(a.createdAt) : new Date()
      });
    });

    // Add recent bookings
    bookingList.forEach(b => {
      list.push({
        id: `booking-${b.id}`,
        type: 'booking',
        title: `New Booking Confirmed (PNR: ${b.pnrNumber || b.id})`,
        subtitle: `Amount: ₹${Number(b.totalAmount || 0).toLocaleString('en-IN')} • Status: ${b.status || 'CONFIRMED'}`,
        color: 'bg-indigo-500',
        date: b.createdAt ? new Date(b.createdAt) : new Date()
      });
    });

    // Sort by most recent
    return list.slice(0, 5);
  }, [flightList, aircraftList, bookingList]);

  return (
    <div className="space-y-6">
      {/* Top 2 Columns: Activity & Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Dynamic Recent Activity */}
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                Live Operational Activity
              </CardTitle>
              <CardDescription>Real-time updates from your airline operations</CardDescription>
            </div>
            <Badge variant="outline" className="text-xs">
              {activities.length} Events
            </Badge>
          </CardHeader>
          <CardContent>
            {activities.length > 0 ? (
              <div className="space-y-4">
                {activities.map(act => (
                  <div key={act.id} className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className={`w-2.5 h-2.5 rounded-full mt-1.5 ${act.color} flex-shrink-0 animate-pulse`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{act.title}</p>
                      <p className="text-xs text-muted-foreground">{act.subtitle}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                <Clock className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="text-sm font-medium">No activity recorded yet</p>
                <p className="text-xs">Create flights or register aircraft to see live operational logs.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              Quick Actions
            </CardTitle>
            <CardDescription>Shortcut to key airline management tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button
                className="justify-start h-auto py-3 bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200"
                variant="outline"
                onClick={() => navigate('/airline/flights/new')}
              >
                <Plus className="h-5 w-5 mr-3 text-blue-600 flex-shrink-0" />
                <div className="text-left">
                  <div className="font-semibold text-sm">Create Flight</div>
                  <div className="text-xs text-blue-700/80">Schedule a new flight</div>
                </div>
              </Button>

              <Button
                className="justify-start h-auto py-3 bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200"
                variant="outline"
                onClick={() => navigate('/airline/aircraft/new')}
              >
                <Plus className="h-5 w-5 mr-3 text-purple-600 flex-shrink-0" />
                <div className="text-left">
                  <div className="font-semibold text-sm">Add Aircraft</div>
                  <div className="text-xs text-purple-700/80">Register fleet aircraft</div>
                </div>
              </Button>

              <Button
                className="justify-start h-auto py-3 bg-green-50 hover:bg-green-100 text-green-900 border border-green-200"
                variant="outline"
                onClick={() => navigate('/airline/bookings')}
              >
                <Users className="h-5 w-5 mr-3 text-green-600 flex-shrink-0" />
                <div className="text-left">
                  <div className="font-semibold text-sm">View Bookings</div>
                  <div className="text-xs text-green-700/80">Manage reservations</div>
                </div>
              </Button>

              <Button
                className="justify-start h-auto py-3 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200"
                variant="outline"
                onClick={() => navigate('/airline/reports/sales')}
              >
                <BarChart3 className="h-5 w-5 mr-3 text-amber-600 flex-shrink-0" />
                <div className="text-left">
                  <div className="font-semibold text-sm">Sales Reports</div>
                  <div className="text-xs text-amber-700/80">View revenue analytics</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fleet Overview Section */}
      {aircraftList.length > 0 && (
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Plane className="w-5 h-5 text-indigo-600" />
                Active Fleet Overview
              </CardTitle>
              <CardDescription>Aircraft registered and operational for your airline</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate('/airline/aircraft')} className="text-xs font-semibold text-blue-600">
              Manage Fleet ({aircraftList.length}) <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {aircraftList.slice(0, 3).map(ac => (
                <div key={ac.id} className="p-4 border rounded-xl bg-card hover:border-primary/50 transition-all flex flex-col justify-between">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-bold text-foreground">{ac.code}</h4>
                      <p className="text-sm text-muted-foreground">{ac.manufacturer} {ac.model}</p>
                    </div>
                    <Badge className={ac.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                      {ac.status || 'ACTIVE'}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-2 pt-3 border-t text-xs text-muted-foreground">
                    <div>
                      <span className="block font-semibold text-foreground">{ac.seatingCapacity || 0}</span>
                      Capacity
                    </div>
                    <div>
                      <span className="block font-semibold text-foreground">{ac.economySeats || 0}</span>
                      Economy
                    </div>
                    <div>
                      <span className="block font-semibold text-foreground">{ac.businessSeats || 0}</span>
                      Business
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Scheduled Flights */}
      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Calendar className="w-5 h-5 text-green-600" />
              Scheduled Flights
            </CardTitle>
            <CardDescription>Active routes and flight schedules currently assigned</CardDescription>
          </div>
          {flightList.length > 0 && (
            <Button variant="ghost" size="sm" onClick={() => navigate('/airline/flights')} className="text-xs font-semibold text-blue-600">
              View All Flights ({flightList.length}) <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {flightList.length > 0 ? (
            <div className="space-y-4">
              {flightList.slice(0, 4).map((flight) => (
                <FlightCard
                  key={flight.id}
                  flight={flight}
                  onView={() => navigate('/airline/flights')}
                  onEdit={() => navigate('/airline/flights')}
                  onDelete={() => navigate('/airline/flights')}
                />
              ))}
            </div>
          ) : (
            <div className="py-12 text-center border-2 border-dashed rounded-xl bg-muted/20">
              <Plane className="w-12 h-12 mx-auto text-muted-foreground opacity-40 mb-3" />
              <h3 className="text-base font-bold text-foreground">No Flights Scheduled Yet</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto mt-1 mb-4">
                Your aircraft are ready in your fleet. Schedule your first flight between airports to start receiving passenger bookings.
              </p>
              <Button onClick={() => navigate('/airline/flights/new')} className="bg-primary text-primary-foreground">
                <Plus className="w-4 h-4 mr-2" />
                Schedule Your First Flight
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardOverview;
