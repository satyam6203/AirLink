package payload.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BaggagePolicyRequest {

    @NotBlank(message = "Policy name is required")
    private String name;

    @NotNull(message = "fare id is required")
    private Long fareId;

    private String description;

    @PositiveOrZero
    private Double cabinBaggageMaxWeight;

    @PositiveOrZero
    private Integer cabinBaggagePieces;

    @PositiveOrZero
    private Double cabinBaggageWeightPerPrice;

    @PositiveOrZero
    private Double cabinBaggageMaxDimension;

    @PositiveOrZero
    private Integer freeCheckedBagsAllowance;

    @PositiveOrZero
    private Double checkInBaggageMaxWeight;

    @PositiveOrZero
    private Integer checkInBaggagePieces;

    @PositiveOrZero
    private Double checkInBaggageWeightPerPiece;

    private Boolean priorityBaggage;

    private Boolean extraBaggageAllowance;

}
