package com.arilink.seat_service.Service;

import payload.request.SeatMapRequest;
import payload.response.SeatResponse;

import java.util.List;

public interface SeatService {

    void generateSeats(Long seaMapId) throws Exception;
    SeatResponse updateSeat(Long seatId, SeatMapRequest request);
    List<SeatResponse> getAll();
}
