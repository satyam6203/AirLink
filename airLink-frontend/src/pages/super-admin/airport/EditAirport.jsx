import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import AirportForm from "./AirportForm";
import { updateAirport, getAirportById } from "@/Redux/airport/airportThunk";
import { getAllCities } from "@/Redux/city/cityThunk";

const EditAirport = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { airportId } = useParams();
  const { airports, loading } = useSelector((state) => state.airport);
  const { cities } = useSelector((state) => state.city);

  // Find the airport from the list or fetch it
  const airport = airports?.find((a) => a.id === parseInt(airportId));

  // Load cities and airport data on component mount
  useEffect(() => {
    dispatch(getAllCities());
    if (!airport && airportId) {
      dispatch(getAirportById(airportId));
    }
  }, [dispatch, airport, airportId]);

  const handleSubmit = async (airportData) => {
    try {
      await dispatch(
        updateAirport({
          airportId: parseInt(airportId),
          airportData,
        })
      ).unwrap();
      // Navigate back to airport list after successful update
      navigate("/super-admin/airports");
    } catch (error) {
      console.error("Error updating airport:", error);
      throw error; // Let the form handle the error
    }
  };

  if (!airport && loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-lg text-gray-600">Loading airport data...</p>
        </div>
      </div>
    );
  }

  if (!airport && !loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Airport Not Found</h2>
          <p className="text-gray-600 mb-4">
            The airport you're trying to edit doesn't exist.
          </p>
          <button
            onClick={() => navigate("/super-admin/airports")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Airports
          </button>
        </div>
      </div>
    );
  }

  return (
    <AirportForm
      airport={airport}
      cities={cities}
      onSubmit={handleSubmit}
      isLoading={loading}
    />
  );
};

export default EditAirport;
