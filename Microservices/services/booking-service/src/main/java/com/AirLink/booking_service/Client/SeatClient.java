package com.AirLink.booking_service.Client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

@FeignClient(name = "seat-service")
public interface SeatClient {

    @PostMapping("/api/seat-instance/calculate")
    public Double calculateSeatPrice(@RequestBody List<Long> seatInstance);

}
