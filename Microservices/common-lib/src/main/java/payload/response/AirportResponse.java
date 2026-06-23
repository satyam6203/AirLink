package payload.response;

import java.time.ZoneId;

import com.fasterxml.jackson.annotation.JsonIgnore;
import embeddable.Address;
import embeddable.GeoCode;
import jakarta.persistence.Column;
import jakarta.persistence.Embedded;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
@AllArgsConstructor
@Builder
public class AirportResponse {
    private long id;

    private String name;

    private String iataCode;

    private Address address;

    private GeoCode geoCode;

    private String detailedName;

    private ZoneId timeZone;

    private CityResponse city;
}
