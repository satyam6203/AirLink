package payload.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FareRequest {

    @NotBlank(message = "Fare name is required")
    private String name;

    @NotNull(message = "RBD code is required")
    private Character rbdCode;

    @NotNull(message = "Flight ID is required")
    private Long flightId;

    @NotNull(message = "Cabin class ID is required")
    private Long cabinClassId;

    @NotNull(message = "Base fare is required")
    @Positive
    private Double baseFare;

    private Double taxesAndFees;
    private Double airlineFees;
    private Double currentPrice;

    @Size(max = 100)
    private String fareLabel;

    private Boolean extraSeatSpace;
    private Boolean preferredSeatChoice;
    private Boolean advanceSeatSelection;
    private Boolean guaranteedSeatTogether;

    private Boolean priorityBoarding;
    private Boolean priorityChecking;
    private Boolean fastTrackSecurity;

    private Boolean complimentaryMeals;
    private Boolean premiumMealChoice;
    private Boolean inFlightInternet;
    private Boolean inFlightEntertainment;
    private Boolean complimentaryBeverages;

    private Boolean freeDateChange;
    private Boolean partialRefund;
    private Boolean fullRefund;

    private Boolean loungeAccess;
    private Boolean airportTransfer;
}
