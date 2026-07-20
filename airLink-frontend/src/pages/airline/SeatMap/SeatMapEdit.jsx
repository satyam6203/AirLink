import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import SeatMapForm from "@/components/seatMap/SeatMapForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Grid3X3 } from "lucide-react";
import { useDispatch } from "react-redux";
import { getSeatMapsByCabinClass } from "@/Redux/SeatMap/seatMapThunk";
import { EmptyState } from "@/components/common/EmptyState";
import { getCabinClassById } from "@/Redux/cabinClass/cabinClassThunk";

const SeatMapEdit = () => {
  const { aircraftId, cabinId, seatMapId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { currentAircraft } = useSelector((state) => state.aircraft);
    const { cabinClass } = useSelector((state) => state.cabinClass);
    const {seatMap}= useSelector(state => state.seatMap);
  // const { cabinClass, loading: cabinLoading } = useSelector(state => state.cabinClass);

  console.log(
    "SeatMapView - aircraftId:",
    aircraftId,
    "cabinId:",
    cabinId,
    "seatMapId:",
    seatMapId
  );

  useEffect(() => {
    if (cabinId) {
      dispatch(getSeatMapsByCabinClass(cabinId));
      dispatch(getCabinClassById(cabinId));
    }
  }, [dispatch, aircraftId, cabinId]);





  const handleSuccess = (result) => {
    console.log("Seat map updated successfully:", result);
    // Navigate back to seat map view page
    navigate(
      `/airline/aircraft/${aircraftId}/cabin/${cabinId}/seat-map/${seatMapId}`
    );
  };

  const handleCancel = () => {
    navigate(
      `/airline/aircraft/${aircraftId}/cabin/${cabinId}/seat-map/${seatMapId}`
    );
  };

  if (!seatMap) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6">
            <EmptyState
              title="Cabin Not Found"
              description="The requested cabin could not be found."
              action={() => navigate(`/airline/aircraft/${aircraftId}`)}
              actionText="Back to Aircraft"
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Navigation */}
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          onClick={() =>
            navigate(
              `/airline/aircraft/${aircraftId}/cabin/${cabinId}/seat-map/${seatMapId}`
            )
          }
          className="flex items-center"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Seat Map
        </Button>
        <div className="text-sm text-gray-500">
          / Aircraft / {currentAircraft?.code} / {cabinClass?.name} / Edit Seat Map
        </div>
      </div>

      {/* Page Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center">
            <Grid3X3 className="h-6 w-6 mr-3 text-blue-600" />
            <div>
              <CardTitle className="text-2xl">Edit Seat Map</CardTitle>
              <p className="text-gray-600 mt-1">
                Update the seat layout configuration for{" "}
                <span className="font-medium">{cabinClass?.name}</span> cabin class
              </p>
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
              <p className="font-medium">{seatMapId}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Seat Map Form */}
      <SeatMapForm
        isEdit={true}
        seatMapId={seatMapId}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default SeatMapEdit;
