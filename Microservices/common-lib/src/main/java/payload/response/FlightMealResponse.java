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
    private String currency;
    private Integer maxQuantity;
    private String serviceClassRestriction;
    private Integer displayOrder;
    private Boolean complimentary;
    private String notes;
}

