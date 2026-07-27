package com.arilink.seat_service.Service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import payload.request.FlightInstanceCabinRequest;
import payload.response.FlightInstanceCabinResponse;

public interface FlightInstanceService {
    FlightInstanceCabinResponse createFlightInstanceCabin(FlightInstanceCabinRequest request) throws Exception;
    FlightInstanceCabinResponse getFlightInstanceCabinById(Long id) throws Exception;
    Page<FlightInstanceCabinResponse> getByFlightInstanceId(Long id, Pageable pageable);
    FlightInstanceCabinResponse getByFlightInstanceIdAndCabinClassId(Long id, Long cabinClassId);
    FlightInstanceCabinResponse updateFlightInstanceCabin(Long id, FlightInstanceCabinRequest request) throws Exception;
    void deleteFlightInstanceCabin(Long id) throws Exception;
}
