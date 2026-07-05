package com.airlink.flight_ops_service.Controller;

import com.airlink.flight_ops_service.Service.FlightInstanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/instance")
public class FlightInstanceController {

    private final FlightInstanceService flightInstanceService;


}
