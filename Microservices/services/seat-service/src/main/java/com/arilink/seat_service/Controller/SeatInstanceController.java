package com.arilink.seat_service.Controller;

import com.arilink.seat_service.Model.Seat;
import com.arilink.seat_service.Service.SeatInstanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/seat-instance")
@RequiredArgsConstructor
public class SeatInstanceController {

    private final SeatInstanceService seatInstanceService;

    @PostMapping("/calculate")
    public Double calculateSeatPrice(@RequestBody List<Long> seatInstance){
        return seatInstanceService.calculateSeatPrice(seatInstance);
    }
}
