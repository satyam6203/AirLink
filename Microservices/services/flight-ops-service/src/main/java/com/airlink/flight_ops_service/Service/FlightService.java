package com.airlink.flight_ops_service.Service;

import enums.FlightStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import payload.request.FlightRequest;
import payload.response.FlightResponse;


public interface FlightService {

    FlightResponse createFLight(Long userId, FlightRequest request) throws Exception;
    Page<FlightResponse> getFlightByAirline(Long airLineId,
                                            Long departureAirportId,
                                            Long arrivalAirportId,
                                            Pageable pageable
    );
    FlightResponse getFlightById(Long id) throws Exception;
    FlightResponse updateFlight(Long id, FlightRequest request) throws Exception;
    FlightResponse changeStatus(Long id, FlightStatus status) throws Exception;
    void deleteFlight(Long id, Long airlineId) throws Exception;
}
