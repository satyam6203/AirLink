package payload.request;

import enums.CabinClassType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CabinClassRequest {

    @NotBlank(message = "Name is required")
    private CabinClassType name;

    @NotBlank(message = "code is required")
    private String code;

    @Size(max = 500)
    private String description;

    @NotNull(message = "Aircraft id required")
    private Long aircraftId;

    private Integer displayOrder;
    private Boolean isActive;
    private Boolean isBookable;
    private Integer typicalSeatPitch;
    private Integer typicalSeatWidth;
    private String seatType;
}

