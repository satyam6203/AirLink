package payload.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MealRequest {

    @NotBlank(message = "Meal code is required")
    private String code;

    @NotBlank(message = "Meal name is required")
    private String name;

    @NotBlank(message = "Meal type is required")
    private String mealType;

    @Size(max = 100, message = "Dietary restriction must not exceed 100 characters")
    private String dietaryRestriction;

    @Size(max = 2000, message = "Ingredients list must not exceed 2000 characters")
    private String ingredients;

    @Size(max = 500, message = "Image URL must not exceed 500 characters")
    private String imageUrl;

    @NotNull(message = "Availability status is required")
    private Boolean available;

    private Boolean requiresAdvanceBooking;

    private Integer advanceBookingHours;

    private Integer displayOrder;
}
