package embeddable;

import jakarta.persistence.Embeddable;
import lombok.*;

@Data
@Embeddable
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ContactInfo {

    private String email;
    private String phone;


}
