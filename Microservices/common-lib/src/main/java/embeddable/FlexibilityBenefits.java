package embeddable;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.*;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FlexibilityBenefits {

    @Column(name = "free_date_change", nullable = false)
    @Builder.Default
    private Boolean freeDateChange = false;

    @Column(name = "partial_refund", nullable = false)
    @Builder.Default
    private Boolean partialRefund = false;

    @Column(name = "full_refund", nullable = false)
    @Builder.Default
    private Boolean fullRefund = false;
}
