package com.airlink.flight_ops_service.Service;

import payload.request.FlightScheduleRequest;
import payload.response.FlightInstanceResponse;
import payload.response.FlightScheduleResponse;

import java.util.List;

public interface FlightScheduleService {

    FlightScheduleResponse createFlightSchedule(Long userId,
                                                FlightScheduleRequest request
    ) throws Exception;

    FlightScheduleResponse getFlightScheduleById(Long id);
    List<FlightScheduleResponse> getFlightScheduleByAirline(Long UserId);
    FlightScheduleResponse updateFlightSchedule(Long id,
                                                FlightScheduleRequest request
    );
    void deleteFlightSchedule(Long id);

}
