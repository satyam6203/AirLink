package com.airlink.flight_ops_service.Integration;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import payload.response.AircraftResponse;

@Service
@RequiredArgsConstructor
public class AircraftIntegrationService {

    private final RestTemplate restTemplate;

    public AircraftResponse getAircraftId(Long id){
        String url = "http://localhost:8003/api/aircraft/" + id;
        return restTemplate.getForObject(url, AircraftResponse.class);
    }
}
