package com.AirLink.booking_service.Client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import payload.response.FareResponse;

@FeignClient(name = "pricing-service")
public interface PricingClient {

    @GetMapping("/api/fares/{id}")
    FareResponse getFareById(@PathVariable Long id);

}
