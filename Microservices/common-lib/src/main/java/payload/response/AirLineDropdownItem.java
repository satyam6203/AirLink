package payload.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AirLineDropdownItem {
    private Long id;
    private String name;
    private String iataCode;
    private String icaoCode;
    private String logoUrl;
    private String country;
}
