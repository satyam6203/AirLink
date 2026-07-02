package com.airlink.airline_core_service.Service.Impl;

import com.airlink.airline_core_service.Mapper.AircraftMapper;
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

        Aircraft aircraft = AircraftMapper.toEntity(request, airline);

        if(aircraftRepo.existsByCode(aircraft.getCode())){
            throw  new Exception("Code exist with another aircraft");
        }

        if(aircraft.getSeatingCapacity() < aircraft.getTotalSeats()){
            throw new Exception("Seating capacity can,t exceed to total seat");
        }

        return AircraftMapper.toResponse(aircraftRepo.save(aircraft));
    }

    @Override
    public AircraftResponse updateAircraft(Long id, AircraftRequest request, Long ownerId) throws Exception {

        Airline airline = airLineRepo.findByOwnerId(ownerId).orElseThrow(
                () -> new Exception("this owner don,t have airline")
        );

        Aircraft aircraft = aircraftRepo.findByIdAndAirlineId(id, airline.getId());

        if(aircraft == null){
            throw new Exception("Aircraft not exist with id");
        }

        if( request.getCode() != null &&
                !aircraft.getCode().equals(request.getCode()) &&
                aircraftRepo.existsByCode(request.getCode())
        ){
            throw  new Exception("Code exist with another aircraft");
        }

        AircraftMapper.updateEntity(aircraft, request);
        return AircraftMapper.toResponse(aircraftRepo.save(aircraft));
    }

    @Override
    public AircraftResponse getAircraftById(Long id) throws Exception {

        Aircraft aircraft =  aircraftRepo.findById(id).orElseThrow(
                () -> new Exception("Aircraft not exist with id")
        );

        return AircraftMapper.toResponse(aircraft);
    }

    @Override
    public List<AircraftResponse> listAllAircraftByOwner(Long ownerId) throws Exception {

        Airline airline = airLineRepo.findByOwnerId(ownerId).orElseThrow(
                () -> new Exception("this owner don,t have airline")
        );

        return aircraftRepo.findByAirlineId(airline.getId())
                .stream().map(AircraftMapper :: toResponse).toList();
    }

    @Override
    public void deleteAircraft(Long ownerId, Long id) throws Exception {

        Airline airline = airLineRepo.findByOwnerId(ownerId).orElseThrow(
                () -> new Exception("this owner don,t have airline")
        );

        Aircraft aircraft = aircraftRepo.findByIdAndAirlineId(id, airline.getId());

        if(aircraft == null){
            throw new Exception("Aircraft not exist with id");
        }

        aircraftRepo.delete(aircraft);
    }
}
