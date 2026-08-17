package com.airlink.flight_ops_service.Integration;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import payload.response.AirLineResponse;

@Service
@RequiredArgsConstructor
public class AirlineIntegrationServiceImpl {

    private final RestTemplate restTemplate;

    public AirLineResponse getByAirlineId(Long id) {
        String url = "http://localhost:8003/api/airlines/"+id;
        return restTemplate.getForObject(url, AirLineResponse.class);
    }
}
