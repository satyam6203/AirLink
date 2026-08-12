package com.airline.ancillary_service.Model;

import com.airline.ancillary_service.Converter.AncillaryMetadataConverter;
import domain.AncillaryMetadata;
import enums.AncillaryType;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@RequiredArgsConstructor
@Builder
@Entity
public class Ancillary {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Enumerated(EnumType.STRING)
    private AncillaryType type;

    private String subType;

    private String rfisc;

    @Column(nullable = false)
    private String name;

    private String description;

    @Convert(converter = AncillaryMetadataConverter.class)
    private AncillaryMetadata metadata;

    private Integer displayOrder;

    @Column(name = "airline_id", nullable = false)
    private Long airlineId;

}
