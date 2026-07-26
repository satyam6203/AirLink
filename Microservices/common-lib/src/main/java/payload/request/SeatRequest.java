package payload.request;

import enums.SeatType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SeatRequest {

    @NotBlank(message = "Seat number is required")
    @Size(min = 2, max = 10)
    private String seatNumber;

    @NotNull(message = "Seat row is required")
    @Positive
    private Integer seatRow;

    private Character columnLetter;

    @NotNull(message = "Seat type is required")
    private SeatType seatType;

    @NotNull(message = "Seat map ID is required")
    private Long seatMapId;

    private Long cabinClassId;

    private Boolean isAvailable;
    private Boolean isBlocked;
    private Boolean isEmergencyExit;
    private Boolean isActive;

    private Double basePrice;
    private Double premiumSurcharge;

    private Boolean hasExtraLegroom;
    private Boolean hasBassinet;
    private Boolean isNearLavatory;
    private Boolean isNearGalley;
    private Boolean hasPowerOutlet;
    private Boolean hasTvScreen;
    private Boolean isWheelchairAccessible;
    private Boolean hasExtraWidth;

    private Integer seatPitch;
    private Integer seatWidth;
    private Integer reclineAngle;
}
