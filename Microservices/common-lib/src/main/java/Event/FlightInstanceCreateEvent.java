package Event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Getter 
@Setter 
@AllArgsConstructor 
@RequiredArgsConstructor 
@Builder 
public class FlightInstanceCreateEvent {
    private Long flightInstanceId;
    private Long aircraftId;
    private Long flightId;
}