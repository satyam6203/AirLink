package com.airlink.flight_ops_service.Mapper;

import com.airlink.flight_ops_service.Model.Flight;
import payload.request.FlightRequest;
import payload.response.AirLineResponse;
import payload.response.AircraftResponse;
import payload.response.AirportResponse;
import payload.response.FlightResponse;

public class FlightMapper {

    public static Flight toEntity(FlightRequest request){
        if(request == null) return null;
        return Flight.builder()
                .flightNumber(request.getFlightNumber())
                .aircraftId(request.getAircraftId())
                .departureAirportId(request.getDepartureAirportId())
                .arrivalAirportId(request.getArrivalAirportId())
                .build();
    }

    public static FlightResponse response(Flight flight,
                                          AircraftResponse aircraft,
                                          AirLineResponse airLineResponse,
                                          AirportResponse departureAirport,
                                          AirportResponse arrivalAirport
    ){
        if(flight == null) return null;
        return FlightResponse.builder()
                .id(flight.getId())
                .flightNumber(flight.getFlightNumber())
                .aircraft(aircraft)
                .airline(airLineResponse)
                .departureAirport(departureAirport)
                .arrivalAirport(arrivalAirport)
                .status(flight.getStatus())
                .createdAt(flight.getCreatedAt())
                .updatedAt(flight.getUpdatedAt())
                .build();
    }

    public static void updateEntity(FlightRequest request, Flight existing){
        if(request == null || existing == null) return;
        if(request.getFlightNumber() != null) existing.setFlightNumber(request.getFlightNumber());
        if(request.getAircraftId() != null) existing.setAircraftId(request.getAircraftId());
        if(request.getDepartureAirportId() != null) existing.setDepartureAirportId(request.getDepartureAirportId());
        if(request.getArrivalAirportId() != null) existing.setArrivalAirportId(request.getArrivalAirportId());
        if(request.getStatus() != null) existing.setStatus(request.getStatus());
    }
}
