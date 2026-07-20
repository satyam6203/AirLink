import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AirportForm from "./AirportForm";
import { createAirport } from "@/Redux/airport/airportThunk";
import { getAllCities } from "@/Redux/city/cityThunk";

const CreateAirport = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.airport);
  const { cities } = useSelector((state) => state.city);

  // Load cities on component mount
  useEffect(() => {
    dispatch(getAllCities());
  }, [dispatch]);

  const handleSubmit = async (airportData) => {
    try {
      await dispatch(createAirport(airportData)).unwrap();
      // Navigate back to airport list after successful creation
      navigate("/super-admin/airports");
    } catch (error) {
      console.error("Error creating airport:", error);
      throw error; // Let the form handle the error
    }
  };

  return (
    <AirportForm
      airport={null}
      cities={cities}
      onSubmit={handleSubmit}
      isLoading={loading}
    />
  );
};

export default CreateAirport;
