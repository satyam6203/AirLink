package embeddable;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Embeddable
public class BoardingBenefits {

    @Column(name = "priority_boarding", nullable = false)
    @Builder.Default
    private Boolean priorityBoarding = false;

    @Column(name = "priority_checking", nullable = false)
    @Builder.Default
    private Boolean priorityChecking = false;

    @Column(name = "fast_track_security", nullable = false)
    @Builder.Default
    private Boolean fastTrackSecurity = false;
}
