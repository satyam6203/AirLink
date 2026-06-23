package payload.request;

import jakarta.persistence.Entity;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CityRequest {

    private String name;

    @NotBlank(message = "City Name is required")
    @Size(max = 10)
    private String cityCode;

    @NotBlank(message = "Country code is required")
    @Size(max = 5)
    private String countryCode;

    @NotBlank(message = "Country Name is required")
    @Size(max = 100)
    private String countryName;

    @Size(max = 10)
    private String regionCode;

    @Size(max = 10)
    private String timeZoneOffset;
}
