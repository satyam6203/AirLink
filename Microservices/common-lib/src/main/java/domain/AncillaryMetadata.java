package domain;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class AncillaryMetadata {

    private BaggageMetadata baggage;

    private String protectionSummary;

    private String specialServiceDetails;

    private String upgradeDetails;
}
