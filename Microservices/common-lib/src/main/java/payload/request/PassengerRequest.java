package payload.request;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import enums.Gender;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class PassengerRequest {

    @NotBlank(message = "First name is required")
    private String firstName;

    @NotBlank(message = "Last name is required")
    private String lastName;

    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    private String email;

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^(\\+)?[0-9]{7,15}$", message = "Phone number should be valid")
    private String phone;

    @NotNull(message = "Date of birth is required")
    @Past(message = "Date of birth must be in the past")
    private LocalDate dateOfBirth;

    @NotNull(message = "Gender is required")
    private Gender gender;

    private Object seatInstanceId;

    private String seatNumber;

    private String nationality;

    public Long getSeatInstanceId() {
        if (seatInstanceId == null) {
            return null;
        }
        if (seatInstanceId instanceof Number num) {
            return num.longValue();
        }
        try {
            return Long.parseLong(seatInstanceId.toString().trim());
        } catch (NumberFormatException e) {
            return null;
        }
    }

    public void setSeatInstanceId(Object seatInstanceId) {
        this.seatInstanceId = seatInstanceId;
    }

    public String getSeatNumber() {
        if (seatNumber != null && !seatNumber.isBlank()) {
            return seatNumber;
        }
        if (seatInstanceId != null) {
            String str = seatInstanceId.toString().trim();
            if (str.startsWith("seat_")) {
                return str.substring(5);
            }
        }
        return null;
    }
}
