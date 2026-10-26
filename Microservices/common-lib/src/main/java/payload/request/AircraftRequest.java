package payload.request;

import enums.AircraftStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.*;
import org.hibernate.validator.constraints.pl.NIP;

import java.time.LocalDate;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AircraftRequest {

    @NotBlank(message = "Aircraft code is required")
    private String code;

    @NotBlank(message = "Aircraft model is required")
    private String model;

    @NotBlank(message = "Manufacturer is required")
    private String manufacturer;

    @NotNull(message = "Seating capacity is required")
    @Positive(message = "Seating capacity must be positive")
    private Integer seatingCapacity;

    @jakarta.validation.constraints.PositiveOrZero(message = "Economy seats must be positive or zero")
    private Integer economySeats;

    @jakarta.validation.constraints.PositiveOrZero(message = "Premium economy seats must be positive or zero")
    private Integer premiumEconomySeats;

    @jakarta.validation.constraints.PositiveOrZero(message = "Business seats must be positive or zero")
    private Integer businessSeats;

    @jakarta.validation.constraints.PositiveOrZero(message = "First class seats must be positive or zero")
    @com.fasterxml.jackson.annotation.JsonAlias({"firstClassSeats"})
    private Integer firstClassSeat;

    @Positive(message = "Range must be positive")
    private Integer rangeKm;

    @Positive(message = "Cruising speed must be positive")
    private Integer cruisingSpeedKmh;

    @Positive(message = "Maximum altitude must be positive")
    private Integer maxAltitudeFt;

    @Positive(message = "Year of manufacture must be positive")
    private Integer yearOfManufacture;

    private LocalDate registrationDate;

    private LocalDate nextMaintenanceDate;

    @NotNull(message = "Status is required")
    private AircraftStatus status;

    @NotNull(message = "Availability status is required")
    private Boolean isAvailable;

    private Long currentAirportId;
}
