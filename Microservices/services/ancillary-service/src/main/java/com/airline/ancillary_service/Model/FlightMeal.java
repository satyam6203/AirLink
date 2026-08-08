package com.airline.ancillary_service.Model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FlightMeal {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(nullable = false)
    private Long flightId;

    @OneToMany(fetch = FetchType.LAZY)
    private Meal meal;

    @Builder.Default
    @Column(nullable = false)
    private Boolean isAvailable = false;

    private Double price;

    @Builder.Default
    private Integer displayOrder = 0;
}
