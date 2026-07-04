package com.airlink.flight_ops_service.Model;

import enums.FlightStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.Duration;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@AllArgsConstructor
@RequiredArgsConstructor
@Builder
public class FlightInstance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long airlineId;

    @ManyToOne
    private Flight flight;

    @Column(nullable = false)
    private Long departureAirportId;

    @Column(nullable = false)
    private Long arrivalAirportId;

    @Column(nullable = false)
    private Long scheduleId;

    private LocalDateTime departureDateTime;

    private LocalDateTime arrivalDateTime;

    @Column(nullable = false)
    private Integer totalSeats;

    @Column(nullable = false)
    private Integer availableSeats;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private FlightStatus status;

    private Integer minAdvanceBookingDays;
    private Integer maxAdvanceBookingDays;

    private Boolean isActive = true;

    @Transient
    public String getFormatedDuration(){
        if(departureDateTime == null || arrivalDateTime == null){
            return null;
        }
        Duration duration = Duration.between(
                departureDateTime, arrivalDateTime
        );
        long hours = duration.toHours();
        long min = duration.toMinutesPart();

        StringBuilder sb = new StringBuilder();
        if(hours > 0) sb.append("h ");
        if(min > 0) sb.append("min");
        return sb.toString().trim();
    }
}
