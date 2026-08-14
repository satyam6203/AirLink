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

    @ManyToOne
    private Ancillary ancillary;

    @Column(nullable = false)
    private CoverageType coverageType;

    @Column(nullable = false, length = 200)
    private String name;

    @Column(length = 1000)
    private String description;

    @Column(nullable = false)
    private Double coverageAmount;

    @Builder.Default
    private boolean isFlat = true;

    private String claimCondition;

    @Column(length = 100)
    private String emergencyContact;

    private Integer displayOrder;

    private boolean active = true;
}
