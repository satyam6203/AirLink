package com.airlink.flight_ops_service.Service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import payload.request.FlightInstanceRequest;
import payload.response.FlightInstanceResponse;

import java.time.LocalDate;

public interface FlightInstanceService {

    FlightInstanceResponse createFlightInstance(
            Long airlineId,
            FlightInstanceRequest request
    ) throws Exception;

    FlightInstanceResponse getFlightInstanceBuId(Long id) throws Exception;

    Page<FlightInstanceResponse> getByAirlineId(Long airlineId,
                                                Long departureAirportId,
                                                Long arrivalAirportId,
                                                Long flightId,
                                                LocalDate onDate,
                                                Pageable pageable

    );

    FlightInstanceResponse updateLightInstance(Long id, FlightInstanceRequest request) throws Exception;

    void deleteLightInstance(Long id) throws Exception;

}
