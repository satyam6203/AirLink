import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Users, BarChart3 } from "lucide-react";
import FlightCard from "./FlightManagment/FlightCard";
import { useSelector } from 'react-redux';

const DashboardOverview = ({

  getStatusBadge,
  handleEditFlight,
  handleDeleteFlight,
  setShowFlightForm,
  setEditingFlight
}) => {
  const {flights}=useSelector(store=>store.flight)
  return (
    <div className="space-y-6">
      {/* Quick Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">Flight AI-203 departed on time</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm">New booking: PNR ABCD123</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-sm">Flight 6E-425 delayed by 30 minutes</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button
                className="w-full justify-start"
                variant="outline"
                onClick={() => {
                  setEditingFlight(null)
                  setShowFlightForm(true)
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create New Flight
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Users className="h-4 w-4 mr-2" />
                View Bookings
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <BarChart3 className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Flights */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Flights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {flights.slice(0, 3).map((flight) => (
              <FlightCard
                key={flight.id}
                flight={flight}
                getStatusBadge={getStatusBadge}
                onEdit={handleEditFlight}
                onDelete={handleDeleteFlight}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardOverview;