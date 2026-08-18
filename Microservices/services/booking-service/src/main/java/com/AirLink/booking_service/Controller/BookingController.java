package com.AirLink.booking_service.Controller;

import com.AirLink.booking_service.Service.BookingService;
import enums.BookingStatus;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import payload.request.BookingRequest;
import payload.response.BookingResponse;
import payload.response.PaymentInitiateResponse;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/booking")
public class BookingController {

    private final BookingService bookingService;

    @PostMapping("/create")
    public ResponseEntity<PaymentInitiateResponse> createBooking(
            @RequestHeader("X-User-Id") Long userId,
            @Valid @RequestBody BookingRequest request
    ) throws Exception {
       return ResponseEntity.status(HttpStatus.CREATED)
               .body(
                       bookingService.createBooking(request, userId)
               );
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookingResponse> getBookingById(
            @PathVariable Long id) throws Exception {
        BookingResponse response = bookingService.getBookingById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/airline")
    public ResponseEntity<List<BookingResponse>> getBookingsByAirline(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) BookingStatus status,
            @RequestParam(required = false) Long flightInstanceId,
            @RequestParam(defaultValue = "DESC") String sortDirection,
            @RequestHeader("X-User-Id") Long userId
    ) {
        List<BookingResponse> responses = bookingService.getAllBookingsByAirline(
                userId,
                search,
                status,
                flightInstanceId,
                sortDirection
        );
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/user/history")
    public ResponseEntity<List<BookingResponse>> getBookingsByUser(
            @RequestHeader("X-User-Id") Long userId) {
        List<BookingResponse> responses = bookingService.getBookingByUser(userId);
        return ResponseEntity.ok(responses);
    }

    @PatchMapping("/{id}/cancel")
    public ResponseEntity<BookingResponse> cancelBooking(
            @PathVariable Long id,
            @RequestHeader("X-User-Id") Long userId) throws Exception {
        BookingResponse response = bookingService.cancelBooking(id);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteBooking(
            @PathVariable Long id,
            @RequestHeader("X-User-Id") Long userId) throws Exception {
        bookingService.deleteBooking(id);
        return ResponseEntity.noContent().build();
    }
}
