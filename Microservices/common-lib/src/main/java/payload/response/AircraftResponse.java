package payload.response;

import enums.AircraftStatus;
import lombok.*;

import java.time.Instant;
import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AircraftResponse {

    private Long id;

    private String code;

    private String model;

    private String manufacturer;

    private Integer seatingCapacity;

    private Integer economySeats;

    private Integer premiumEconomySeats;

    private Integer businessSeats;

    private Integer firstClassSeat;

    private Integer rangeKm;

    private Integer maxAltitudeFt;

    private Integer cruisingSpeedKmh;

    private Integer yearOfManufacture;

    private LocalDateTime registrationDate;

    private LocalDateTime nextMaintenanceDate;

    private AircraftStatus status;

    private Boolean isAvailable;

    private long airlineId;
    private String airlineName;
    private String airlineIataCode;

    private Long currentAirportId;

    private Integer totalSeats;

    private boolean isOperational;

    private String requiresMaintenance;

    private Instant createdAt;
    private Instant updatedAt;
}
