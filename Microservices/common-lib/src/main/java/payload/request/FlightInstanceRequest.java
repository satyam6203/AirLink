package payload.request;


import enums.FlightStatus;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@RequiredArgsConstructor
@Builder
public class FlightInstanceRequest {
    private Long airlineId;

    @NotNull(message = "Flight ID is required")
    private Long flightId;

    private Long scheduledId;

    private Long departureAirportId;

    private Long arrivalAirportId;

    @NotNull(message = "Departure data-time is required")
    private LocalDateTime departureDateTime;

    @NotNull(message = "Arrival data-time is required")
    private LocalDateTime arrivalDateTime;

    @NotNull(message = "total seats is required")
    @Positive
    private Integer totalSeats;

    @PositiveOrZero
    private Integer availableSeats;

    private FlightStatus status;

    private Integer minAdvanceBookingDays;

    private Integer maxAdvanceBookingDays;

    private Boolean isActive;
}
