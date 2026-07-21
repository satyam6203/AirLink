package payload.response;

import enums.CabinClassType;
import lombok.*;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FareResponse {

    private Long id;
    private String name;
    private Character rbdCode;
    private Long flightId;
    private Long cabinClassId;
    private CabinClassType cabinClass;

    private Double baseFare;
    private Double taxesAndFees;
    private Double airlineFees;
    private Double currentPrice;
    private Double totalPrice;
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

    private Long fareRulesId;
    private FareRulesResponse fareRules;
    private BaggagePolicyResponse baggagePolicy;

    private Instant createdAt;
    private Instant updatedAt;
}
