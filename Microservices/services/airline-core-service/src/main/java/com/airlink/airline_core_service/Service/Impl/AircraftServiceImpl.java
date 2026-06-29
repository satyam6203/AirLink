package com.airlink.airline_core_service.Service.Impl;

import com.airlink.airline_core_service.Model.Aircraft;
import com.airlink.airline_core_service.Model.Airline;
import com.airlink.airline_core_service.Repository.AirLineRepo;
import com.airlink.airline_core_service.Repository.AircraftRepo;
import com.airlink.airline_core_service.Service.AircraftService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import payload.request.AircraftRequest;
import payload.response.AircraftResponse;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AircraftServiceImpl implements AircraftService {

    private final AircraftRepo aircraftRepo;
    private final AirLineRepo airLineRepo;

    @Override
    public AircraftResponse createAircraft(AircraftRequest request, Long ownerId) throws Exception {
        Airline airline = airLineRepo.findById(ownerId).orElseThrow(
                () -> new Exception("Airline not found for this ownerId")
        );

//        Aircraft aircraft = new Aircraft()
        return null;
    }

    @Override
    public AircraftResponse updateAircraft(AircraftRequest request, Long ownerId) {
        return null;
    }

    @Override
    public AircraftResponse getById(Long id) {
        return null;
    }

    @Override
    public List<AircraftResponse> listAllAircraftByOwner(Long ownerId) {
        return List.of();
    }

    @Override
    public void deleteAircraft(Long ownerId, Long id) {

    }
}
