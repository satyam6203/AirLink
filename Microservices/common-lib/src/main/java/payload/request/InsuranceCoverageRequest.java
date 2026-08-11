package payload.request;

import enums.CoverageType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InsuranceCoverageRequest {

    @NotNull(message = "Ancillary ID is required")
    private Long ancillaryId;

    @NotNull(message = "Coverage type is required")
    private CoverageType coverageType;

    @NotBlank(message = "Coverage name is required")
    private String name;

    private String description;

    @NotNull(message = "Coverage amount is required")
    @PositiveOrZero(message = "Coverage amount must be zero or positive")
    private Double coverageAmount;

    private String currency;

    private Boolean isFlat;

    private String claimCondition;

    private String emergencyContact;

    private Integer displayOrder;

    private Boolean active;
}
