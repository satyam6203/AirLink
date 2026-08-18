package com.arilink.seat_service.Service;

import java.util.List;

public interface SeatInstanceService {

    Double calculateSeatPrice(List<Long> seatInstanceId);

}
