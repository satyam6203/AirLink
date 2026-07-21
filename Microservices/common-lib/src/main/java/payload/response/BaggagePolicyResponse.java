package payload.response;

import lombok.*;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BaggagePolicyResponse {

    private Long id;
    private String name;
    private String description;

    // Cabin baggage
    private Double cabinBaggageMaxWeight;
    private Integer cabinBaggagePieces;
    private Double cabinBaggageWeightPerPiece;
    private Double cabinBaggageMaxDimension;

    // Check-in baggage
    private Double checkInBaggageMaxWeight;
    private Integer checkInBaggagePieces;
    private Double checkInBaggageWeightPerPiece;
    private Integer freeCheckedBagsAllowance;

    // Benefits
    private Boolean priorityBaggage;
    private Boolean extraBaggageAllowance;

    // Relationships
    private Long airlineId;
    private Long fareId;

    // Audit
    private Instant createdAt;
    private Instant updatedAt;
}
