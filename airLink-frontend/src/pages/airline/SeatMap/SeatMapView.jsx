import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getCabinClassById } from "@/Redux/cabinClass/cabinClassThunk";
import { getAircraftById } from "@/Redux/aircraft/aircraftThunks";
import SeatMapGrid from "@/components/aircraft/SeatMapGrid";
import SeatConfigDrawer from "@/components/aircraft/SeatConfigDrawer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader } from "@/components/common/Loader";
import { EmptyState } from "@/components/common/EmptyState";
import { ArrowLeft, Grid3X3, Edit } from "lucide-react";
import { getSeatMapsByCabinClass } from "@/Redux/SeatMap/seatMapThunk";

const SeatMapView = () => {
  const { aircraftId, cabinId, seatMapId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { currentAircraft, loading: aircraftLoading } = useSelector(
    (state) => state.aircraft
  );
  const { cabinClass, loading: cabinLoading } = useSelector(
    (state) => state.cabinClass
  );

  const [selectedSeat, setSelectedSeat] = useState(null);
  const [showSeatDrawer, setShowSeatDrawer] = useState(false);

  console.log(
    "SeatMapView - aircraftId:",
    aircraftId,
    "cabinId:",
    cabinId,
    "seatMapId:",
    seatMapId
  );

  useEffect(() => {
    if (aircraftId) {
      dispatch(getAircraftById(aircraftId));
    }
    if (cabinId) {
      dispatch(getCabinClassById(cabinId));
      dispatch(getSeatMapsByCabinClass(cabinId));
    }
  }, [dispatch, aircraftId, cabinId]);

  const handleSeatClick = (seat) => {
    setSelectedSeat(seat);
    setShowSeatDrawer(true);
  };

  const handleSeatSave = async (seatData) => {
    try {
      // Dispatch seat update thunk here
      console.log("Saving seat data:", seatData);
      // await dispatch(updateSeat(seatData));
      setShowSeatDrawer(false);
    } catch (error) {
      console.error("Error saving seat:", error);
    }
  };

  const handleEditSeatMap = () => {
    navigate(
      `/airline/aircraft/${aircraftId}/cabin/${cabinId}/seat-map/${seatMapId}/edit`
    );
  };

  const handleBackToAircraft = () => {
    navigate(`/airline/aircraft/${aircraftId}`);
  };

  if ((aircraftLoading || cabinLoading) && (!currentAircraft || !cabinClass)) {
    return <Loader message="Loading seat map details..." />;
  }

  if (!currentAircraft || !cabinClass) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6">
            <EmptyState
              title="Seat Map Not Found"
              description="The requested seat map could not be found."
              action={handleBackToAircraft}
              actionText="Back to Aircraft"
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check if seat map exists
  const hasSeatMap = cabinClass?.seatMap || cabinClass?.seatMapId;

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Navigation */}
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          onClick={handleBackToAircraft}
          className="flex items-center"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Aircraft
        </Button>
        <div className="text-sm text-gray-500">
          / Aircraft / {currentAircraft?.code} / {cabinClass?.name} / Seat Map
        </div>
      </div>

      {/* Page Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="flex items-center">
              <Grid3X3 className="h-6 w-6 mr-3 text-blue-600" />
              <div>
                <CardTitle className="text-2xl">
                  {cabinClass?.name || "Cabin Class"} Seat Map
                </CardTitle>
                <p className="text-gray-600 mt-1">
                  Interactive seat map for {currentAircraft?.code} -{" "}
                  {cabinClass?.name}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className="bg-blue-100 text-blue-800">
                Interactive Mode
              </Badge>
              {hasSeatMap && (
                <Button onClick={handleEditSeatMap} size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Seat Map
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Aircraft</p>
              <p className="font-medium">
                {currentAircraft?.code || "Unknown"}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Cabin Class</p>
              <p className="font-medium">{cabinClass?.name}</p>
            </div>
            <div>
              <p className="text-gray-500">Cabin Code</p>
              <p className="font-medium">{cabinClass?.code}</p>
            </div>
            <div>
              <p className="text-gray-500">Seat Map ID</p>
              <p className="font-medium">{seatMapId || "N/A"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Seat Map Display */}
      {!hasSeatMap ? (
        <Card>
          <CardContent className="pt-6">
            <EmptyState
              icon={Grid3X3}
              title="No Seat Map Available"
              description="This cabin class doesn't have a seat map configured yet."
              action={() =>
                navigate(
                  `/airline/aircraft/${aircraftId}/cabin/${cabinId}/seat-map/create`
                )
              }
              actionText="Create Seat Map"
            />
          </CardContent>
        </Card>
      ) : (
        <SeatMapGrid
          cabin={cabinClass}
          seats={cabinClass?.seatMap?.seats || []}
          onSeatClick={handleSeatClick}
          selectedSeat={selectedSeat}
          className="border-0 shadow-lg"
        />
      )}

      {/* Seat Configuration Drawer */}
      <SeatConfigDrawer
        isOpen={showSeatDrawer}
        onClose={() => setShowSeatDrawer(false)}
        seat={selectedSeat}
        onSave={handleSeatSave}
      />

      {/* Quick Stats */}
      {hasSeatMap && cabinClass?.seatMap && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold">
                  {cabinClass.seatMap.totalSeats ||
                    cabinClass.seatMap.seats?.length ||
                    0}
                </p>
                <p className="text-sm text-gray-600">Total Seats</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold">
                  {cabinClass.seatMap.availableSeats ||
                    cabinClass.seatMap.seats?.filter((s) => s.isAvailable)
                      ?.length ||
                    0}
                </p>
                <p className="text-sm text-gray-600">Available</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold">
                  {cabinClass.seatMap.seats?.filter((s) => s.isPremiumSeat)
                    ?.length || 0}
                </p>
                <p className="text-sm text-gray-600">Premium Seats</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold">
                  {cabinClass.seatMap.totalRows || 0}
                </p>
                <p className="text-sm text-gray-600">Total Rows</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default SeatMapView;
