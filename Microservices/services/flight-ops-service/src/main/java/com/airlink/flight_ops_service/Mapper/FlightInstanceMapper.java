package com.airlink.flight_ops_service.Mapper;

import com.airlink.flight_ops_service.Model.Flight;
import com.airlink.flight_ops_service.Model.FlightInstance;
import payload.request.FlightInstanceRequest;
import payload.request.FlightRequest;
import payload.response.AirLineResponse;
import payload.response.AircraftResponse;
import payload.response.AirportResponse;
import payload.response.FlightInstanceResponse;

public class FlightInstanceMapper {

    public static FlightInstance toEntity(FlightInstanceRequest request, Flight flight){
        if(flight == null) return null;

        return FlightInstance.builder()
                .flight(flight)
                .airlineId(flight.getAirlineId())
                .scheduleId(request.getScheduledId())
                .departureAirportId(
                        request.getDepartureAirportId() != null ? request.getDepartureAirportId() : null
                )
                .arrivalAirportId(
                        request.getArrivalAirportId() != null ? request.getArrivalAirportId() : null
                )
                .departureDateTime(request.getDepartureDateTime())
                .arrivalDateTime(request.getArrivalDateTime())
                .status(request.getStatus())
                .minAdvanceBookingDays(request.getMinAdvanceBookingDays())
                .maxAdvanceBookingDays(request.getMaxAdvanceBookingDays())
                .isActive(request.getIsActive())
                .build();
    }

    public static FlightInstanceResponse toResponse(FlightInstance flightInstance,
                                                    AircraftResponse aircraftResponse,
                                                    AirLineResponse airline,
                                                    AirportResponse arrivalAirport,
                                                    AirportResponse departureAirport

    ){
        if(flightInstance == null) return null;
        return FlightInstanceResponse.builder()
                .id(flightInstance.getId())
                .flightId(flightInstance.getFlight() != null ? flightInstance.getFlight().getId() : null)
                .flightNumber(flightInstance.getFlight() != null ? flightInstance.getFlight().getFlightNumber() : null)
                .aircraftId(flightInstance.getFlight().getAircraftId())
                .aircraftModel(aircraftResponse.getModel())
                .aircraftCode(aircraftResponse.getCode())
                .airlineId(flightInstance.getAirlineId())
                .airlineName(airline.getName())
                .airlineLogo(airline.getLogoUrl())
                .departureAirport(departureAirport)
                .arrivalAirport(arrivalAirport)
                .departureDateTime(flightInstance.getDepartureDateTime())
                .arrivalDateTime(flightInstance.getArrivalDateTime())
                .formattedDuration(flightInstance.getFormatedDuration())
                .totalSeats(flightInstance.getTotalSeats())
                .availableSeats(flightInstance.getAvailableSeats())
                .status(flightInstance.getStatus())
                .minAdvanceBookingDays(flightInstance.getMinAdvanceBookingDays())
                .maxAdvanceBookingDays(flightInstance.getMaxAdvanceBookingDays())
                .isActive(flightInstance.getIsActive())
                .build();
    }

    public static void updateEntity(FlightInstanceRequest request, FlightInstance existing) {
        if (request == null || existing == null) return;
        if (request.getDepartureAirportId() != null)
            existing.setDepartureAirportId(request.getDepartureAirportId());

        if (request.getArrivalAirportId() != null)
            existing.setArrivalAirportId(request.getArrivalAirportId());

        if (request.getDepartureDateTime() != null)
            existing.setDepartureDateTime(request.getDepartureDateTime());

        if (request.getArrivalDateTime() != null)
            existing.setArrivalDateTime(request.getArrivalDateTime());

        if (request.getAvailableSeats() != null)
            existing.setAvailableSeats(request.getAvailableSeats());

        if (request.getStatus() != null)
            existing.setStatus(request.getStatus());

        if (request.getMinAdvanceBookingDays() != null)
            existing.setMinAdvanceBookingDays(request.getMinAdvanceBookingDays());

        if (request.getMaxAdvanceBookingDays() != null)
            existing.setMaxAdvanceBookingDays(request.getMaxAdvanceBookingDays());

        if (request.getIsActive() != null)
            existing.setIsActive(request.getIsActive());
    }
}
