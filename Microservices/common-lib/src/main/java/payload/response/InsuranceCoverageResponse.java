package payload.response;

import enums.CoverageType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InsuranceCoverageResponse {
    private Long id;
    private Long ancillaryId;
    private String ancillaryName;
    private CoverageType coverageType;
    private String name;
    private String description;
    private Double coverageAmount;
    private String currency;
    private Boolean isFlat;
    private String claimCondition;
    private String emergencyContact;
    private Integer displayOrder;
    private Boolean active;
}