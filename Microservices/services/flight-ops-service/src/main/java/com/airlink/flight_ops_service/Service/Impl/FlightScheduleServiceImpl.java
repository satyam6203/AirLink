package com.airlink.flight_ops_service.Service.Impl;

import com.airlink.flight_ops_service.Mapper.FlightInstanceMapper;
import com.airlink.flight_ops_service.Mapper.FlightScheduleMapper;
import com.airlink.flight_ops_service.Model.Flight;
import com.airlink.flight_ops_service.Model.FlightSchedule;
import com.airlink.flight_ops_service.Repository.FlightRepo;
import com.airlink.flight_ops_service.Repository.FlightScheduleRepo;
import com.airlink.flight_ops_service.Service.FlightScheduleService;
import enums.FlightStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import payload.request.FlightInstanceRequest;
import payload.request.FlightScheduleRequest;
import payload.response.FlightScheduleResponse;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FlightScheduleServiceImpl implements FlightScheduleService {

    private final FlightScheduleRepo flightScheduleRepo;
    private final FlightRepo flightRepo;

    @Override
    public FlightScheduleResponse createFlightSchedule(Long userId,
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
            
        }
        return null;
    }

    @Override
    public FlightScheduleResponse getFlightScheduleById(Long id) {
        return null;
    }

    @Override
    public List<FlightScheduleResponse> getFlightScheduleByAirline(Long UserId) {
        return List.of();
    }

    @Override
    public FlightScheduleResponse updateFlightSchedule(Long id, FlightScheduleRequest request) {
        return null;
    }

    @Override
    public void deleteFlightSchedule(Long id) {

    }
}
