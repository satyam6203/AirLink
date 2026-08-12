package com.airline.ancillary_service.Model;

import enums.CoverageType;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.Id;

@Entity
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class InsuranceCoverage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    private Ancillary ancillary;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CoverageType coverageType;

    @Column(nullable = false, length = 200)
    private String name;

    @Column(length = 1000)
    private String description;

    @Column(nullable = false)
    private Double coverageAmount;

    @Column(length = 3)
    @Builder.Default
    private String currency = "INR";

    @Builder.Default
    private boolean isFlat = true;

    @Column(length = 500)
    private String claimCondition;

    @Column(length = 100)
    private String emergencyContact;

    private Integer displayOrder;

    @Builder.Default
    private boolean active = true;
}
