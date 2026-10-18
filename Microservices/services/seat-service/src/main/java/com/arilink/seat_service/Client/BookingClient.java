package com.arilink.seat_service.Client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import payload.response.BookingResponse;

@FeignClient(name = "booking-service")
public interface BookingClient {

    @GetMapping("/api/bookings/{id}")
    BookingResponse getBookingById(@PathVariable Long id);
}
