package domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BaggageMetadata {

    private Integer weight;

    private String unit;

    private Integer pieces;

    private String category;

    private String dimensions;

    private String notes;
}

