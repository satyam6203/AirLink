package payload.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@AllArgsConstructor
@RequiredArgsConstructor
@Builder
public class SeatMapRequest {

    @NotBlank(message = "Seat map name is required")
    private String name;

    @NotNull(message = "Total rows is required")
    @Positive
    private Integer totalRows;

    @NotNull(message = "Left seats per row is required")
    @Positive
    private Integer leftSeatsPerRow;

    @NotNull(message = "Right seats per row is required")
    @Positive
    private Integer rightSeatsPerRow;

    private Long cabinClassId;
}
