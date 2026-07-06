package com.airlink.flight_ops_service.Mapper;

import com.airlink.flight_ops_service.Model.Flight;
import com.airlink.flight_ops_service.Model.FlightSchedule;
import payload.request.FlightScheduleRequest;
import payload.response.AirportResponse;
import payload.response.FlightScheduleResponse;

import java.time.LocalTime;

public class FlightScheduleMapper {

    public static FlightSchedule toEntity(FlightScheduleRequest request,
                                          Flight flight
    ){
        if(request == null || flight == null) return null;
        return FlightSchedule.builder()
                .flight(flight)
                .departureAirportId(flight.getDepartureAirportId())
                .arrivalAirportId(flight.getArrivalAirportId())
                .departureTime(request.getDepartureTime())
                .arrivalTime(request.getArrivalTime())
                .operationalDays(request.getOperatingDays())
                .startDate(LocalTime.from(request.getStartDate()))
                .endDate(LocalTime.from(request.getEndDate()))
                .isActive(request.getIsActive() != null ? request.getIsActive() : true)
                .build();
    }

    public static FlightScheduleResponse toResponse(
            FlightSchedule fs,
            AirportResponse arrival,
            AirportResponse departure) {

        if (fs == null) return null;

        return FlightScheduleResponse.builder()
                .id(fs.getId())
                .flightId(fs.getFlight() != null ? fs.getFlight().getId() : null)
                .flightNumber(fs.getFlight() != null ? fs.getFlight().getFlightNumber() : null)
                .departureAirport(departure)
                .arrivalAirport(arrival)
                .departureTime(fs.getDepartureTime())
                .arrivalTime(fs.getArrivalTime())
                .startDate(fs.getStartDate())
                .endDate(fs.getEndDate())
                .operationalDays(fs.getOperationalDays())
                .isActive(fs.isActive())
                .build();
    }

    public static void updateEntity(FlightScheduleRequest request, FlightSchedule existing) {
        if (request == null || existing == null) return;

        if (request.getDepartureTime() != null)
            existing.setDepartureTime(request.getDepartureTime());

        if (request.getArrivalTime() != null)
            existing.setArrivalTime(request.getArrivalTime());

        if (request.getOperatingDays() != null)
            existing.setOperationalDays(request.getOperatingDays());

        if(request.getStartDate() != null)
            existing.setStartDate(LocalTime.from(request.getStartDate()));

        if(request.getEndDate() != null)
            existing.setEndDate(LocalTime.from(request.getEndDate()));

        if (request.getIsActive() != null)
            existing.setActive(request.getIsActive());
    }
}
