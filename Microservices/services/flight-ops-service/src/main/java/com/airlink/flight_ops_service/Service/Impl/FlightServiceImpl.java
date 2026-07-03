package com.airlink.flight_ops_service.Service.Impl;

import com.airlink.flight_ops_service.Mapper.FlightMapper;
import com.airlink.flight_ops_service.Model.Flight;
import com.airlink.flight_ops_service.Repository.FlightRepo;
import com.airlink.flight_ops_service.Service.FlightService;
import enums.FlightStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import payload.request.FlightRequest;
import payload.response.AirLineResponse;
import payload.response.AircraftResponse;
import payload.response.AirportResponse;
import payload.response.FlightResponse;


@Service
@RequiredArgsConstructor
public class FlightServiceImpl implements FlightService {

    private final FlightRepo flightRepo;

    @Override
    public FlightResponse createFLight(Long airlineId, FlightRequest request) throws Exception {
        if(flightRepo.existsByFlightNumber(request.getFlightNumber())){
            throw new Exception("Flight already exist by this flightNumber");
        }
        Flight flight = FlightMapper.toEntity(request);
        flight.setAirlineId(airlineId);
        Flight saved = flightRepo.save(flight);
        return convertFlightResponse(saved);
    }

    @Override
    public Page<FlightResponse> getFlightByAirline(Long airLineId, Long departureAirportId, Long arrivalAirportId, Pageable pageable) {

        return flightRepo.findByAirlineId(airLineId, departureAirportId, arrivalAirportId, pageable)
                .map(this::convertFlightResponse);
    }

    @Override
    public FlightResponse getFlightById(Long id) throws Exception {
        Flight flight = flightRepo.findById(id).orElseThrow(
                () -> new Exception("Flight not found with this id")
        );
        return convertFlightResponse(flight);
    }

    @Override
    public FlightResponse updateFlight(Long id, FlightRequest request) throws Exception {
        Flight exists = flightRepo.findById(id).orElseThrow(
                () -> new Exception("Flight not found with this id")
        );

        if (request.getFlightNumber() != null &&
                flightRepo.existsByFlightNumberAndIdNot(request.getFlightNumber(), id)
        ) {
            throw new Exception("Flight with already exists");
        }

        FlightMapper.updateEntity(request, exists);
        Flight update = FlightMapper.toEntity(request);
        return convertFlightResponse(update);
    }

    @Override
    public FlightResponse changeStatus(Long id, FlightStatus status) throws Exception {
        Flight exists = flightRepo.findById(id).orElseThrow(
                () -> new Exception("Flight not found with this id")
        );
        exists.setStatus(status);
        Flight update = flightRepo.save(exists);
        return convertFlightResponse(update);
    }

    @Override
    public void deleteFlight(Long id, Long airLineId) throws Exception {
        Flight exists = flightRepo.findByAirlineIdAndId(id, airLineId).orElseThrow(
                () -> new Exception("Flight not found with this id")
        );
        flightRepo.delete(exists);
    }

    public FlightResponse convertFlightResponse(Flight flight){
        AircraftResponse aircraft = AircraftResponse.builder()
                .id(flight.getId())
                .build();

        AirLineResponse airline = AirLineResponse.builder()
                .id(flight.getAirlineId())
                .build();

        AirportResponse arrivalAirport = AirportResponse.builder()
                .id(flight.getArrivalAirportId())
                .build();
        AirportResponse departure = AirportResponse.builder()
                .id(flight.getDepartureAirportId())
                .build();
        return FlightMapper.response(
                flight,
                aircraft,
                airline,
                departure,
                arrivalAirport
        );
    }
}
