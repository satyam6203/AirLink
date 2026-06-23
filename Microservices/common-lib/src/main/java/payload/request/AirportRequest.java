package payload.request;

import java.time.ZoneId;

import embeddable.Address;
import embeddable.GeoCode;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@AllArgsConstructor
@RequiredArgsConstructor
@Builder
public class AirportRequest {

    @NotBlank(message = "Airport name is Required")
    private String name;

    @NotBlank(message = "IATA code is required")
    @Size(min = 3, max = 3, message = "IATA code must be exactly 3 character")
    private String iataCode;

    @Valid
    private Address address;

    @NotNull(message = "City Id is mandatory")
    private long cityId;

    private ZoneId timeZone;

    @Valid
    private GeoCode geoCode;
}
