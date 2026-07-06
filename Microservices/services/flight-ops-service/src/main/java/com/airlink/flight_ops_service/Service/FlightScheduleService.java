package com.airlink.flight_ops_service.Service;

import payload.request.FlightScheduleRequest;
import payload.response.FlightInstanceResponse;
import payload.response.FlightScheduleResponse;

import java.util.List;

public interface FlightScheduleService {

    FlightScheduleResponse createFlightSchedule(Long airlineId,
                                                FlightScheduleRequest request
    ) throws Exception;

    FlightScheduleResponse getFlightScheduleById(Long id) throws Exception;
    List<FlightScheduleResponse> getFlightScheduleByAirline(Long UserId);
    FlightScheduleResponse updateFlightSchedule(Long id,
                                                FlightScheduleRequest request
    ) throws Exception;
    void deleteFlightSchedule(Long id) throws Exception;

}
