package com.airline.ancillary_service.Model;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.Id;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FlightCabinAncillary {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long flightId;

    @Column(nullable = false)
    private Long cabinClassId;

    @ManyToOne(fetch = FetchType.LAZY)
    private Ancillary ancillary;

    @Column(nullable = false)
    @Builder.Default
    private Boolean available = true;

    private Integer maxQuantity;

    private Double price;

    private String currency;

    @Column(nullable = false)
    @Builder.Default
    private Boolean includedInFare = false;

}
