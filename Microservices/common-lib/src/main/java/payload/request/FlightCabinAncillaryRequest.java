package payload.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class FlightCabinAncillaryRequest {

    @NotNull(message = "Flight ID is required")
    private Long flightId;

    @NotNull(message = "Cabin Class ID is required")
    private Long cabinClassId;

    @NotNull(message = "Ancillary ID is required")
    private Long ancillaryId;

    @NotNull(message = "Availability status is required")
    private Boolean available;

    private Integer maxQuantity;

    private Double price;

    private String currency;

    @NotNull(message = "Included in fare status is required")
    private Boolean includedInFare;

}
