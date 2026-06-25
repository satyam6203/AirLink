package payload.request;

import enums.AirLineStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AirLineRequest {

    @NotBlank(message = "iata code is mandatory")
    @Size(min = 2, max = 2, message = "IATA code must be exactly 2 character")
    private String iataCode;

    @NotBlank(message = "ICAO code is mandatory")
    @Size(min = 3, max = 3, message = "ICAO code must be exactly 3 character")
    private String icaoCode;

    @NotBlank(message = "AirLine name is mandatory")
    private String name;

    private String alias;

    private String logoUrl;

    private String website;

    private AirLineStatus status;

    private String alliance;

    private String supportEmail;

    private String supportPhone;

    private String supportHours;

    private Long headquarterCityId;
}
