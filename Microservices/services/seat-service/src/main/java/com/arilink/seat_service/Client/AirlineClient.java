package com.arilink.seat_service.Client;


import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import payload.response.AirLineResponse;

@FeignClient
public interface AirlineClient {

    @GetMapping("/admin")
    AirLineResponse getAirLineByOwner(
            @RequestHeader("X-User-id") Long ownerId
    );
}
