package com.airlink.flight_ops_service.Controller;

import com.airlink.flight_ops_service.Service.FlightScheduleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import payload.request.FlightScheduleRequest;
import payload.response.FlightScheduleResponse;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/schedule")
public class FlightScheduleController {

    private final FlightScheduleService scheduleService;

    @PostMapping("/create")
    public ResponseEntity<FlightScheduleResponse> createFlightSchedule(
            @RequestHeader("X-User-Id") Long userId,
            @Valid @RequestBody FlightScheduleRequest request
    ) throws Exception {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(scheduleService.createFlightSchedule(
                        userId, request
                ));
    }

    @GetMapping("/{id}")
    public ResponseEntity<FlightScheduleResponse> getFlightScheduleById(
            @PathVariable Long id
    ) throws Exception {
        return ResponseEntity.ok(scheduleService.getFlightScheduleById(id));
    }

    @GetMapping
    public ResponseEntity<?> getFlightSchedule(
            @RequestHeader("X-User-Id") Long userId
    ){
        return ResponseEntity.ok(
                scheduleService.getFlightScheduleByAirline(userId)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<FlightScheduleResponse> updateFlightSchedule(
            @PathVariable Long id,
            @RequestBody FlightScheduleRequest request
    ) throws Exception {
        return ResponseEntity.ok(scheduleService.updateFlightSchedule(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFlightSchedule(
            @PathVariable Long id
    ) throws Exception {
        scheduleService.deleteFlightSchedule(id);
        return ResponseEntity.noContent().build();
    }
}
