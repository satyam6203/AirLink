import React from 'react';
import { Routes, Route } from 'react-router-dom';
import {
  Building2,
  Plane,
  Users,
  DollarSign,
  Shield,
  Activity,
  Plus,
  Settings,
  BarChart3,
  Bell,
  Clock,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AirlineManagement from '../airline/AirlineManagement';
import AirportManagementNew from '../airport/AirportManagementNew';
import CreateAirport from '../airport/CreateAirport';
import EditAirport from '../airport/EditAirport';
import FlightInventory from '../Dashboard/FlightInventory';

import UserManagement from '../Dashboard/UserManagement';
import FinancialManagement from '../Dashboard/FinancialManagement';
import ReportsAnalytics from '../Dashboard/ReportsAnalytics';
import SystemConfiguration from '../Dashboard/SystemConfiguration';
import NotificationsManagement from '../Dashboard/NotificationsManagement';
import AirportPerformancePage from "../Dashboard/AirportPerformancePage";
import RoutePerformancePage from "../Dashboard/RoutePerformancePage";
import AirlinePerformancePage from "../Dashboard/Airport Anlitics/AirlinePerformancePage";
import SecurityCompliance from '../Dashboard/SecurityCompliance';
import CityManagement from '../city/CityManagement';
import PlatformOverview from '../Dashboard/PlateformOverview';

// Platform Overview Component


const SuperAdminRoutes = ({ platformStats }) => {
  return (
    <Routes>
      {/* Platform Overview */}
      <Route path="/" element={<PlatformOverview platformStats={platformStats} />} />
      <Route path="/dashboard" element={<PlatformOverview platformStats={platformStats} />} />
      <Route path="/overview" element={<PlatformOverview platformStats={platformStats} />} />

      {/* Airline Management */}
      <Route path="/airlines" element={<AirlineManagement />} />
      <Route path="/airlines/pending" element={<AirlineManagement activeSection={"airlines-pending"} />} />
      <Route path="/airlines/suspended" element={<AirlineManagement activeSection={"airlines-suspended"} />} />
      <Route path="/airlines/compliance" element={<AirlineManagement activeSection={"airlines-compliance"} />} />
      <Route path="/airlines/commission" element={<AirlineManagement activeSection={"airlines-commission"} />} />
    

      {/* Airport Management */}
      <Route path="/airports" element={<AirportManagementNew />} />
      <Route path="/airports/new" element={<CreateAirport />} />
      <Route path="/airports/:airportId/edit" element={<EditAirport />} />
      <Route path="/airports/:airportId" element={<AirportManagementNew />} />

      {/* City Management - Multiple route paths */}
      <Route path="/cities" element={<CityManagement />} />
      <Route path="/airports/cities" element={<CityManagement />} />
      <Route path="/cities/:cityId" element={<CityManagement />} />
      <Route path="/cities/:cityId/edit" element={<CityManagement />} />
      <Route path="/cities/new" element={<CityManagement />} />

      {/* Flight Management */}
      <Route path="/flights" element={<FlightInventory />} />
      <Route path="/flights/:flightId" element={<FlightInventory />} />
  

      {/* User Management */}
      <Route path="/users" element={<UserManagement />} />
      <Route path="/users/:userId" element={<UserManagement />} />
      <Route path="/agents" element={<UserManagement />} />

      {/* Financial Management */}
      <Route path="/financial" element={<FinancialManagement />} />

      {/* Reports & Analytics */}
      <Route path="/reports" element={<ReportsAnalytics />} />
      <Route path="/reports/platform" element={<ReportsAnalytics />} />
      <Route path="/reports/airline/:airlineId" element={<ReportsAnalytics />} />
      <Route path="/analytics" element={<ReportsAnalytics />} />

      {/* System Configuration */}
      <Route path="/system" element={<SystemConfiguration />} />

      {/* Notifications */}
      <Route path="/notifications" element={<NotificationsManagement />} />

      {/* Security & Compliance */}
      <Route path="/security" element={<SecurityCompliance />} />
      <Route path="/security/audit" element={<SecurityCompliance />} />
n      {/* Performance Analytics */}
      <Route path="/airport-performance" element={<AirportPerformancePage />} />
      <Route path="/route-performance" element={<RoutePerformancePage />} />
      <Route path="/airline-performance" element={<AirlinePerformancePage />} />

      {/* Catch-all route */}
      <Route path="*" element={
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h2>
            <p className="text-gray-600">The requested page does not exist in Super Admin panel.</p>
          </div>
        </div>
      } />
    </Routes>
  );
};

export default SuperAdminRoutes;