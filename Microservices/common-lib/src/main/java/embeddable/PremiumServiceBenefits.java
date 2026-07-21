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
public class PremiumServiceBenefits {

    @Column(name = "lounge_access", nullable = false)
    @Builder.Default
    private Boolean loungeAccess = false;

    @Column(name = "airport_transfer", nullable = false)
    @Builder.Default
    private Boolean airportTransfer = false;
}
