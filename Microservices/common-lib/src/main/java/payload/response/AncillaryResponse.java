package payload.response;

import domain.AncillaryMetadata;
import enums.AncillaryType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AncillaryResponse {
    private Long id;
    private AncillaryType type;
    private String subType;
    private String rfisc;
    private String name;
    private String description;
    private String categoryDisplayName;
    private String categoryIcon;
    private String iconUrl;
    private AncillaryMetadata metadata;
//    private List<InsuranceCoverageResponse> coverages;
    private Integer displayOrder;
    private Long airlineId;
}
