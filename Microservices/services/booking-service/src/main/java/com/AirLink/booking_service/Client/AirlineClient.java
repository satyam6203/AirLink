package com.AirLink.booking_service.Client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import payload.response.AirLineResponse;

@FeignClient(name = "airline-core-service")
public interface AirlineClient {

    @GetMapping("/admin")
    AirLineResponse getAirLineByOwner(
            @RequestHeader("X-User-id") Long ownerId
    );
}
