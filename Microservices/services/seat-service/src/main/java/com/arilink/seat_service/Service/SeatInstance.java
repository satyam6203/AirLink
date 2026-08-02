package com.arilink.seat_service.Service;

import enums.SeatAvailabilityStatus;
import payload.request.SeatInstanceRequest;
import payload.response.SeatInstanceResponse;

import java.util.List;

public interface SeatInstance {

    SeatInstanceResponse createSeatInstance(SeatInstanceRequest request) throws Exception;
    SeatInstanceResponse getSeatInstanceById(Long id);
    List<SeatInstanceResponse> getSeatInstancesByFlightId(Long flightId);
    List<SeatInstanceResponse> getAvailableSeatsByFlightId(Long flightId);
    List<SeatInstanceResponse> getAllByIds(List<Long> Ids);
    SeatInstanceResponse updateSeatInstanceStatus(Long id, SeatAvailabilityStatus status);
    Long countAvailableByFlightId(Long flightId);
    Double calculateSeatPrice(List<Long> seatInstanceId);
}
