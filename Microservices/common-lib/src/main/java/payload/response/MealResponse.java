package payload.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MealResponse {
    private Long id;
    private String code;
    private String name;
    private String description;
    private String mealType;
    private String dietaryRestriction;
    private String ingredients;
    private String allergens;
    private String nutritionalInfo;
    private String imageUrl;
    private Double price;
    private String currency;
    private Boolean available;
    private Boolean requiresAdvanceBooking;
    private Integer advanceBookingHours;
    private Integer displayOrder;
    private Long airlineId;
    private Instant createdAt;
    private Instant updatedAt;
}
