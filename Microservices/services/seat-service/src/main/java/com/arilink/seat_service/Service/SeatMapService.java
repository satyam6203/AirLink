package com.arilink.seat_service.Service;

import payload.request.SeatMapRequest;
import payload.response.SeatMapResponse;

public interface SeatMapService {

    SeatMapResponse createSeatMap(Long airlineId, SeatMapRequest request) throws Exception;
    SeatMapResponse getSeatMapById(Long id) throws Exception;
    SeatMapResponse getSeatMapByCabinClass(Long cabinClassId) throws Exception;
    SeatMapResponse updateSeatMap(Long id, SeatMapRequest request) throws Exception;
    void deleteSeatMap(Long id) throws Exception;

}
