package com.airlink.pricing_service.Model;

import embeddable.*;
import enums.CabinClassType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.Instant;


@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
public class Fare {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private Character rbdCode;

    @Column(nullable = false)
    private Long flightId;

    @Column(nullable = false)
    private Long cabinClassId;

    @Enumerated(EnumType.STRING)
    private CabinClassType cabinClassType;

    @Column(nullable = false)
    private Double baseFare;

    private Double basePrice;

    private double texesAndFees;
    private Double airlineFees;

    private Double currentPrice;

    private String fareLabel;

    @OneToOne(mappedBy = "fare", cascade = CascadeType.ALL,orphanRemoval = true)
    private BaggagePolicy baggagePolicy;

    @OneToOne(mappedBy = "fare", cascade = CascadeType.ALL, orphanRemoval = true)
    private FareRules fareRules;

    @Embedded
    private SeatsBenefits seatsBenefits = new SeatsBenefits();

    @Embedded
    private BoardingBenefits boardingBenefits = new BoardingBenefits();

    @Embedded
    @Builder.Default
    private InFlightBenefits inFlightBenefits = new InFlightBenefits();

    @Embedded
    @Builder.Default
    private FlexibilityBenefits flexibilityBenefits = new FlexibilityBenefits();

    @Embedded
    @Builder.Default
    private PremiumServiceBenefits premiumServiceBenefits = new PremiumServiceBenefits();

    @CreationTimestamp
    private Instant createdAt;

    @UpdateTimestamp
    private Instant updatedAt;

    public Double getTotalPrice(){
        return baseFare + texesAndFees + airlineFees + currentPrice;
    }
}
