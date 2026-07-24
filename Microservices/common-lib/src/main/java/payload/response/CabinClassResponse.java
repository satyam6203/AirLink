package payload.response;

import lombok.*;

import java.time.Instant;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CabinClassResponse {

    private Long id;
    private String name;
    private String code;
    private String description;
    private Long aircraftId;
    private Integer displayOrder;
    private Boolean isActive;
    private Boolean isBookable;
    private Integer typicalSeatPitch;
    private Integer typicalSeatWidth;
    private String seatType;
    private Instant createdAt;
    private Instant updatedAt;
    private SeatMapResponse seatMap;

}
