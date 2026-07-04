package com.airlink.flight_ops_service.Service.Impl;

import com.airlink.flight_ops_service.Model.Flight;
import com.airlink.flight_ops_service.Repository.FlightInstanceRepo;
import com.airlink.flight_ops_service.Repository.FlightRepo;
import com.airlink.flight_ops_service.Service.FlightInstanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import payload.request.FlightInstanceRequest;
import payload.response.FlightInstanceResponse;

import java.awt.print.Pageable;

@Service
@RequiredArgsConstructor
public class FlightInstanceServiceImpl implements FlightInstanceService {

    private final FlightInstanceRepo flightInstanceRepo;
    private final FlightRepo flightRepo;

    @Override
    public FlightInstanceResponse createFlightInstance(Long airlineId, FlightInstanceRequest request) throws Exception {
        Flight flight = flightRepo.findById(request.getFlightId()).orElseThrow(
                ()-> new  Exception("Flight not found")
        );
        return null;
    }

    @Override
    public FlightInstanceResponse getFlightInstanceBuId(Long id) {
        return null;
    }

    @Override
    public FlightInstanceResponse getFlightInstanceById(Long airlineId, Long departureAirportId, Long arrivalAirportId, Long flightId, Long onDate, Pageable pageable) {
        return null;
    }

    @Override
    public FlightInstanceResponse updateLightInstance(Long id, FlightInstanceRequest request) {
        return null;
    }

    @Override
    public void deleteLightInstance(Long id) {

    }
}
