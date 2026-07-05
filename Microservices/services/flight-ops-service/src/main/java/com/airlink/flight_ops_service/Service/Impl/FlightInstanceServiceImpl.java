package com.airlink.flight_ops_service.Service.Impl;

import com.airlink.flight_ops_service.Mapper.FlightInstanceMapper;
import com.airlink.flight_ops_service.Model.Flight;
import com.airlink.flight_ops_service.Model.FlightInstance;
import com.airlink.flight_ops_service.Repository.FlightInstanceRepo;
import com.airlink.flight_ops_service.Repository.FlightRepo;
import com.airlink.flight_ops_service.Service.FlightInstanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import payload.request.FlightInstanceRequest;
import payload.response.AirLineResponse;
import payload.response.AircraftResponse;
import payload.response.AirportResponse;
import payload.response.FlightInstanceResponse;

import java.time.LocalDate;
import java.time.LocalDateTime;

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

        AircraftResponse aircraft = AircraftResponse.builder()
                .id(1L)
                .totalSeats(90)
                .build();

        FlightInstance flightInstance = FlightInstanceMapper.toEntity(request, flight);
        flightInstance.setTotalSeats(aircraft.getTotalSeats());
        flightInstance.setAvailableSeats(aircraft.getTotalSeats());
        FlightInstance saved = flightInstanceRepo.save(flightInstance);

        // create here seat instance

        return convertToFlightInstanceResponse(saved);
    }

    @Override
    public FlightInstanceResponse getFlightInstanceBuId(Long id) throws Exception {
        FlightInstance flightInstance = flightInstanceRepo.findById(id).orElseThrow(
                ()-> new Exception("flightInstance not found with this id " + id)
        );
        return convertToFlightInstanceResponse(flightInstance);
    }

    @Override
    public Page<FlightInstanceResponse> getByAirlineId(Long airlineId,
                                                       Long departureAirportId,
                                                       Long arrivalAirportId,
                                                       Long flightId,
                                                       LocalDate onDate,
                                                       Pageable pageable)
    {
//           todo
        LocalDateTime start = onDate != null ? onDate.atStartOfDay(): null;
        LocalDateTime end = onDate != null ? onDate.plusDays(1).atStartOfDay() : null;
        return flightInstanceRepo.findByAirlineId(
                airlineId, departureAirportId, arrivalAirportId, flightId,start, end, pageable
        ).map(this::convertToFlightInstanceResponse);
    }

    @Override
    public FlightInstanceResponse updateLightInstance(Long id, FlightInstanceRequest request) throws Exception {
        FlightInstance existing = flightInstanceRepo.findById(id).orElseThrow(
                ()-> new Exception("flight instance not found")
        );
        FlightInstanceMapper.updateEntity(request, existing);
        return convertToFlightInstanceResponse(flightInstanceRepo.save(existing));
    }

    @Override
    public void deleteLightInstance(Long id) throws Exception {
        FlightInstance existing = flightInstanceRepo.findById(id).orElseThrow(
                ()-> new Exception("flight instance not found")
        );
        flightInstanceRepo.delete(existing);
    }

    private FlightInstanceResponse convertToFlightInstanceResponse(FlightInstance flightInstance){
        AircraftResponse aircraft = AircraftResponse.builder()
                .id(flightInstance.getId())
                .build();

        AirLineResponse airline = AirLineResponse.builder()
                .id(flightInstance.getAirlineId())
                .build();

        AirportResponse arrivalAirport = AirportResponse.builder()
                .id(flightInstance.getArrivalAirportId())
                .build();
        AirportResponse departure = AirportResponse.builder()
                .id(flightInstance.getDepartureAirportId())
                .build();

        return FlightInstanceMapper.toResponse(
                flightInstance,
                aircraft,
                airline,
                departure,
                arrivalAirport
        );
    }
}
