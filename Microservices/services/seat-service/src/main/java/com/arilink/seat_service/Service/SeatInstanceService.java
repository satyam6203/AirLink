package com.arilink.seat_service.Service;

import java.util.List;

import enums.SeatAvailabilityStatus;
import payload.response.SeatInstanceResponse;

public interface SeatInstanceService {

    Double calculateSeatPrice(List<Long> seatInstanceId);
    SeatInstanceResponse updateSeatInstanceStatus(Long seaInstanceId, SeatAvailabilityStatus status);

}
