package com.airlink.flight_ops_service.Service.Impl;

import com.airlink.flight_ops_service.Mapper.FlightInstanceMapper;
import com.airlink.flight_ops_service.Mapper.FlightScheduleMapper;
import com.airlink.flight_ops_service.Model.Flight;
import com.airlink.flight_ops_service.Model.FlightSchedule;
import com.airlink.flight_ops_service.Repository.FlightRepo;
import com.airlink.flight_ops_service.Repository.FlightScheduleRepo;
import com.airlink.flight_ops_service.Service.FlightInstanceService;
import com.airlink.flight_ops_service.Service.FlightScheduleService;
import enums.FlightStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import payload.request.FlightInstanceRequest;
import payload.request.FlightScheduleRequest;
import payload.response.AirLineResponse;
import payload.response.AircraftResponse;
import payload.response.AirportResponse;
import payload.response.FlightScheduleResponse;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FlightScheduleServiceImpl implements FlightScheduleService {

    private final FlightScheduleRepo flightScheduleRepo;
    private final FlightRepo flightRepo;
    private final FlightInstanceService flightInstanceService;

    @Override
    public FlightScheduleResponse createFlightSchedule(Long airlineId,
                                                       FlightScheduleRequest request) throws Exception {
        Flight flight = flightRepo.findById(request.getFlightId()).orElseThrow(
                ()-> new Exception("flight not found with this id")
        );

        if(request.getEndDate().isBefore(request.getStartDate())){
            throw new Exception("End date is before start date");
        }

        FlightSchedule flightSchedule = FlightScheduleMapper.toEntity(request, flight);
        FlightSchedule saved = flightScheduleRepo.save(flightSchedule);

        List<DayOfWeek> operatingDays = saved.getOperationalDays();
        LocalDate startDate = LocalDate.from(saved.getStartDate());
        LocalDate endDate = LocalDate.from(saved.getEndDate());

        FlightInstanceRequest flightInstanceRequest = FlightInstanceRequest.builder()
                .scheduledId(saved.getId())
                .flightId(flight.getId())
                .arrivalAirportId(flight.getArrivalAirportId())
                .departureAirportId(flight.getDepartureAirportId())
                .status(FlightStatus.SCHEDULED)
                .build();

        for(LocalDate date = startDate; !date.isAfter(endDate); date = date.plusDays(1)){
            if(operatingDays.contains(date.getDayOfWeek())){
                flightInstanceRequest.setDepartureDateTime(
                        LocalDateTime.of(date, saved.getDepartureTime())
                );

                flightInstanceRequest.setArrivalDateTime(
                        LocalDateTime.of(date, saved.getArrivalTime())
                );

                flightInstanceService.createFlightInstance(airlineId, flightInstanceRequest);
            }
        }
        return convertToFlightScheduleResponse(saved);
    }

    @Override
    public FlightScheduleResponse getFlightScheduleById(Long id) throws Exception {
        FlightSchedule flightSchedule = flightScheduleRepo.findById(id).orElseThrow(
                ()-> new Exception("Flight schedule not found with id")
        );
        return convertToFlightScheduleResponse(flightSchedule);
    }

    @Override
    public List<FlightScheduleResponse> getFlightScheduleByAirline(Long airlineId) {
        List<FlightSchedule> schedules = flightScheduleRepo.findByFlightAirlineId(airlineId);

        return schedules.stream().map(
                this::convertToFlightScheduleResponse
        ).toList();
    }

    @Override
    public FlightScheduleResponse updateFlightSchedule(Long id, FlightScheduleRequest request) throws Exception {
        FlightSchedule flightSchedule = flightScheduleRepo.findById(id).orElseThrow(
                ()-> new Exception("Flight schedule not found with id")
        );
        FlightScheduleMapper.updateEntity(request, flightSchedule);
        FlightSchedule updated = flightScheduleRepo.save(flightSchedule);
        return convertToFlightScheduleResponse(updated);
    }

    @Override
    public void deleteFlightSchedule(Long id) throws Exception {
        FlightSchedule flightSchedule = flightScheduleRepo.findById(id).orElseThrow(
                ()-> new Exception("Flight schedule not found with id")
        );
        flightScheduleRepo.delete(flightSchedule);
    }

    private FlightScheduleResponse convertToFlightScheduleResponse(
            FlightSchedule flightSchedule
    ){
        AirportResponse departure = AirportResponse.builder()
                .id(flightSchedule.getDepartureAirportId())
                .build();

        AirportResponse arrival = AirportResponse.builder()
                .id(flightSchedule.getArrivalAirportId())
                .build();
        return FlightScheduleMapper.toResponse(
                flightSchedule,
                arrival,
                departure
        );
    }
}
