package payload.response;

import embeddable.Support;
import enums.AirLineStatus;
import lombok.*;
import payload.dto.UserDTO;

import java.time.Instant;
import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AirLineResponse {

    private Long id;
    private String iataCode;
    private String icaoCode;
    private String name;
    private String alias;
    private String logoUrl;
    private String website;
    private AirLineStatus status;
    private String alliance;

    private Long ownerId;
    private UserDTO owner;
    private Long updatedById;
    private CityResponse headquartersCity;
    private Support support;
    private Instant createdAt;
    private Instant updatedAt;
}
