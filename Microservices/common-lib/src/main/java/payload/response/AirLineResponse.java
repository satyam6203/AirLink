package payload.response;

import embeddable.Support;
import enums.AirLineStatus;
import lombok.*;
import payload.dto.UserDTO;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AirLineResponse {

    private Long id;
    private String iataCode;
    private String iacaCode;
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
}
