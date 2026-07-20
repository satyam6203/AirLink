import React from "react";
import { Routes, Route } from "react-router-dom";
import DashboardOverview from "../Dashboard/DashboardOverview";
import FlightForm from "../Dashboard/FlightManagment/FlightForm";
import AnalyticsDashboard from "../Dashboard/AnalyticsDashboard";
import BookingManagement from "../Dashboard/Bookings/BookingManagement";
import OffersManagement from "../Dashboard/OffersManagement";

import SeatManagement from "../Dashboard/SeatManagement";

import FlightManagement from "../Dashboard/FlightManagment/FlightManagement";
import AircraftListPage from "../Dashboard/AircraftManagement/AircraftListPage";
import AircraftDetail from "../Dashboard/AircraftManagement/AircraftDetail";
import CabinClassCreate from "../Dashboard/CabinClassCreate";
import CabinClassEdit from "../Dashboard/CabinClassEdit";
import { SeatMapCreate, SeatMapView, SeatMapEdit } from "../SeatMap";
import AircraftForm from "../Dashboard/AircraftManagement/AircraftForm";

import FlightInstanceDetail from "../Dashboard/FlightInstances/FlightInstanceDetail";
import FlightInstanceForm from "../Dashboard/FlightInstances/FlightInstanceForm";
import FlightScheduleForm from "../Dashboard/FlightSchedules/FlightScheduleForm";
import FlightScheduleTable from "../Dashboard/FlightSchedules/FlightScheduleTable";
import FlightScheduleDetail from "../Dashboard/FlightSchedules/FlightScheduleDetail";
import CabinSeatManagementPage from "../Dashboard/FlightInstances/CabinSeatManagementPage";

// import FlightCabinSeatPage from "../Dashboard/FlightCabins/FlightInstanceCabinSeatPage";
import FlightDetail from "../Dashboard/FlightManagment/FlightDetail";
import FareRulesManagement from "../Dashboard/FareRules/FareRulesManagement";
import FareRulesForm from "../Dashboard/FareRules/FareRulesForm";
import FareRulesDetail from "../Dashboard/FareRules/FareRulesDetail";
import BagagePolicyForm from "../Dashboard/BaggagePolicy/BaggagePolicyForm";
import BaggagePolicyPage from "../Dashboard/BaggagePolicy/BaggagePolicyPage";
import FareManagementForm from "../Dashboard/Fare/FareManagementForm";


import CabinSeatManagement from "../Dashboard/FlightInstances/CabinSeatManagement";
import FlightInstanceTable from "../Dashboard/FlightInstances/FlightInstanceTable";

import AncillaryList from "../Dashboard/Ancillaries/AncillaryList";
import AncillaryForm from "../Dashboard/Ancillaries/AncillaryForm";


import FlightCabinAncillaryForm from "../Dashboard/FlightCabinAncillaries/FlightCabinAncillaryForm";
import MealManagement from "../Dashboard/Meals/MealManagement";
import MealFormPage from "../Dashboard/Meals/MealFormPage";

import FlightMealFormPage from "../Dashboard/FlightMeals/FlightMealFormPage";
import InsuranceCoverageManagement from "../Dashboard/InsuranceCoverage/InsuranceCoverageManagement";
import TransactionsManagement from "../Dashboard/Transactions/TransactionsManagement";
import BookingStatisticsOverview from "../Dashboard/BookingStatistics/BookingStatisticsOverview";
import RoutePerformancePage from "../Dashboard/RoutePerformance/RoutePerformancePage";
import AirportPerformancePage from "../Dashboard/AirportPerformance/AirportPerformancePage";
import CouponTable from "../Dashboard/Coupons/CouponTable";
import CouponForm from "../Dashboard/Coupons/CouponForm";

import AirlineAdminProfile from "../Airline Admin Profile/AirlineAdminProfile";
import FlightInstanceCabinSeatManagement from "@/components/seats/FlightInstanceCabinSeatManagement";
import FlightInstanceCabinDetails from "../Dashboard/FlightInstances/FlightInstanceCabinDetails";

const AirlineRoutes = ({
  flights,
  filteredFlights,
  dashboardStats,
  statusFilter,
  setStatusFilter,
  routeFilter,
  setRouteFilter,
 
  editingFlight,

}) => {
  return (
    <Routes>
      {/* Dashboard Overview */}
      <Route
        path="/"
        element={
          <DashboardOverview
            flights={filteredFlights}
            dashboardStats={dashboardStats}
          />
        }
      />

       <Route
        path="/dashboard"
        element={
          <DashboardOverview
            flights={filteredFlights}
            dashboardStats={dashboardStats}
          />
        }
      />

      {/* Aircraft Management Routes */}
      <Route path="/aircraft" element={<AircraftListPage />} />
      <Route path="/aircraft/:aircraftId" element={<AircraftDetail />} />
      <Route
        path="/aircraft/:aircraftId/edit"
        element={<div>Aircraft Edit Form (To be implemented)</div>}
      />
      <Route path="/aircraft/new" element={<AircraftForm />} />

      {/* Cabin Class Management Routes */}
      <Route
        path="/aircraft/:aircraftId/cabin/new"
        element={<CabinClassCreate />}
      />
      <Route
        path="/aircraft/:aircraftId/cabin/:cabinId/edit"
        element={<CabinClassEdit />}
      />

      {/* Seat Map Management Routes */}
      <Route
        path="/aircraft/:aircraftId/cabin/:cabinId/seat-map/:seatMapId"
        element={<SeatMapView />}
      />
      <Route
        path="/aircraft/:aircraftId/cabin/:cabinId/seat-map/:seatMapId/edit"
        element={<SeatMapEdit />}
      />
      <Route
        path="/aircraft/:aircraftId/cabin/:cabinId/seat-map/create"
        element={<SeatMapCreate />}
      />

      {/* Flight Management Routes */}
      <Route
        path="/flights"
        element={
          <FlightManagement
            flights={filteredFlights}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            routeFilter={routeFilter}
            setRouteFilter={setRouteFilter}
            
          />
        }
      />

      <Route
        path="/flights/new"
        element={<FlightForm flight={editingFlight} />}
      />

      <Route path="/flights/:id" element={<FlightDetail />} />

      <Route
        path="/flights/:flightId/edit"
        element={<FlightForm flight={editingFlight} />}
      />

      

      {/* Meal Management Routes */}
      <Route path="/meals" element={<MealManagement />} />
      <Route path="/meals/new" element={<MealFormPage />} />
      <Route path="/meals/:id/edit" element={<MealFormPage />} />

      {/* Flight Meal Management Routes */}
      <Route path="/flights/:flightId/meals/assign" element={<FlightMealFormPage />} />


      {/* Flight Instance Management Routes */}
      <Route path="/instances" element={<FlightInstanceTable />} />
      <Route path="/instances/:id" element={<FlightInstanceDetail />} />
      <Route path="/instances/:id/edit" element={<FlightInstanceForm />} />
      <Route path="/instances/new" element={<FlightInstanceForm />} />
      

      {/* Flight Schedule Management Routes */}
      <Route path="/schedules" element={<FlightScheduleTable />} />
      <Route path="/schedules/:id" element={<FlightScheduleDetail />} />
      <Route path="/schedules/:id/edit" element={<FlightScheduleForm />} />
      <Route path="/schedules/new" element={<FlightScheduleForm />} />

      {/* Flight Instance Cabin Management Routes (Instance Level) */}

      <Route
        path="/instances/:flightInstanceId/cabins/:cabinId"
        element={<FlightInstanceCabinDetails />}
      />

    
      {/* Master Ancillary Management Routes */}
      <Route path="/ancillaries" element={<AncillaryList />} />
      <Route path="/ancillaries/create" element={<AncillaryForm />} />
      <Route path="/ancillaries/edit/:id" element={<AncillaryForm />} />

      {/* Insurance Coverage Management Routes */}
      <Route path="/insurance-coverages" element={<InsuranceCoverageManagement />} />

      {/* Flight Cabin Ancillary Management Routes */}
      <Route path="/cabin-ancillaries/new" element={<FlightCabinAncillaryForm />} />

      {/* Fare Rules Management Routes */}
      <Route path="/fare-rules" element={<FareRulesManagement />} />
      <Route path="/fare-rules/new" element={<FareRulesForm />} />
      <Route path="/fare-rules/:id" element={<FareRulesDetail />} />
      <Route path="/fare-rules/:id/edit" element={<FareRulesForm />} />

      {/* Fare Management Routes */}
      <Route path="/fare/new" element={<FareManagementForm />} />
      <Route path="/fare/:id/edit" element={<FareManagementForm />} />

      {/* Baggage Policy Management Routes */}
      <Route path="/baggage-policies" element={<BaggagePolicyPage />} />
      <Route path="/baggage-policies/new" element={<BagagePolicyForm />} />
      <Route path="/baggage-policies/:id" element={<div>Baggage Policy Detail (To be implemented)</div>} />
      <Route path="/baggage-policies/:id/edit" element={<BagagePolicyForm />} />

      {/* Coupon Management Routes */}
      <Route path="/coupons" element={<CouponTable />} />
      <Route path="/coupons/new" element={<CouponForm />} />
      <Route path="/coupons/:id/edit" element={<CouponForm />} />

      
      <Route path="/seats" element={<SeatManagement activeSection="seats" />} />
      <Route path="/pricing" element={<OffersManagement />} />
      <Route path="/offers" element={<OffersManagement />} />
      <Route
        path="/bookings"
        element={<BookingManagement  />}
      />
      <Route
        path="/bookings/statistics"
        element={<BookingStatisticsOverview />}
      />
      <Route
        path="/route-performance"
        element={<RoutePerformancePage />}
      />
      <Route
        path="/airport-performance"
        element={<AirportPerformancePage />}
      />
    
      
      <Route
        path="/transactions"
        element={<TransactionsManagement />}
      />
      <Route
        path="/reports"
        element={<AnalyticsDashboard flights={flights} />}
      />
      <Route
        path="/analytics"
        element={<AnalyticsDashboard flights={flights} />}
      />

      {/* Settings Routes */}
      <Route
        path="/profile"
        element={<AirlineAdminProfile  />}
      />
      

      {/* Catch-all route */}
      <Route
        path="*"
        element={
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Page Not Found
              </h2>
              <p className="text-gray-600">
                The requested page does not exist.
              </p>
            </div>
          </div>
        }
      />
    </Routes>
  );
};

export default AirlineRoutes;
