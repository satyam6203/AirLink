package com.arilink.seat_service.Controller;

import com.arilink.seat_service.Service.SeatService;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import payload.response.SeatResponse;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/seats")
public class SeatController {

    private final SeatService seatService;

    @GetMapping("/all-seats")
    public ResponseEntity<List<SeatResponse>> getAllSeats(){
        return ResponseEntity.ok(seatService.getAll());
    }
}
