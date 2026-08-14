package payload.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FlightMealResponse {
    private Long id;
    private Long flightId;
    private MealResponse meal;
    private Boolean available;
    private Double price;
    private Integer displayOrder;
    private String notes;
}

