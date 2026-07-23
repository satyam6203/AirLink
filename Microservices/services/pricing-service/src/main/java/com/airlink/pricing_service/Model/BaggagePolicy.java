package com.airlink.pricing_service.Model;

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
public class BaggagePolicy {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private Fare fare;

    private String name;

    private String description;

    private Double cabinBaggageMaxWeight;

    private Integer cabinBaggagePrice = 1;

    private Double cabinBaggageWeightPerPrice;

    private Double cabinBaggageMaxDimension;

    private Double checkInBaggageMaxWeight;

    private Integer checkInBaggagePrice = 1;

    private Double checkInBaggageWeightPerPrice;

    private Integer freeCheckedBagsAllowance = 0;

    private Boolean priorityBaggage = false;

    private Boolean extraBaggageAllowance = false;

    private Long airlineId;

    @CreationTimestamp
    private Instant createdAt;

    @UpdateTimestamp
    private Instant updatedAt;

}
