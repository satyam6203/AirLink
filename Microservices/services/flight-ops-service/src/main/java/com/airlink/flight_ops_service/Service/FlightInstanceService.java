package com.airlink.flight_ops_service.Service;

import payload.request.FlightInstanceRequest;
import payload.response.FlightInstanceResponse;

import java.awt.print.Pageable;

public interface FlightInstanceService {

    FlightInstanceResponse createFlightInstance(
            Long airlineId,
            FlightInstanceRequest request
    ) throws Exception;

    FlightInstanceResponse getFlightInstanceBuId(Long id);

    FlightInstanceResponse getFlightInstanceById( Long airlineId,
                                                  Long departureAirportId,
                                                  Long arrivalAirportId,
                                                  Long flightId,
                                                  Long onDate,
                                                  Pageable pageable

    );

    FlightInstanceResponse updateLightInstance(Long id, FlightInstanceRequest request);

    void deleteLightInstance(Long id);

}
