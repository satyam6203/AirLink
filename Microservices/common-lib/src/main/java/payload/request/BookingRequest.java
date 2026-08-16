package payload.request;

import embeddable.ContactInfo;
import enums.CabinClassType;
import enums.TripType;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;

import java.util.List;

@Data
@RequiredArgsConstructor
@AllArgsConstructor
@Builder
public class BookingRequest {

    @NotNull(message = "Flight ID is required")
    private Long flightId;

    @NotNull(message = "Flight Instance ID is required")
    private Long flightInstanceId;

    @NotNull(message = "Cabin class is required")
    private CabinClassType cabinClass;

    @NotNull(message = "Fare ID is required")
    private Long fareId;

    @NotNull(message = "At least one passenger is required")
    @Size(min = 1, message = "At least one passenger is required")
    private List<PassengerRequest> passengers;

    private ContactInfo contactInfo;

    private List<Long> ancillaryIds;
    private List<Long> mealIds;

    private List<String> seatNumbers;
}
