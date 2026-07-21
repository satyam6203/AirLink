package embeddable;

import jakarta.persistence.Embeddable;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Embeddable
public class SeatsBenefits {

    private Boolean extraSeatsSpace = false;
    private Boolean preferredSeatsChoice = false;
    private Boolean advanceSeatsSelection = false;
    private Boolean guaranteedSeatTogether = false;

}
