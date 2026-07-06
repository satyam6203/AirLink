package payload.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class FlightScheduleResponse {

    private Long id;
    private Long flightId;
    private String flightNumber;

    private AirportResponse departureAirport;
    private AirportResponse arrivalAirport;
    private LocalTime departureTime;
    private LocalTime arrivalTime;
    private LocalTime startDate;
    private LocalTime endDate;

    private List<DayOfWeek> operationalDays;
    private boolean isActive;
}
