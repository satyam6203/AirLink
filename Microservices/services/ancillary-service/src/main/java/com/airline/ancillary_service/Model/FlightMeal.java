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

    @ManyToOne
    private Meal meal;

    @Column(nullable = false)
    private Boolean isAvailable = true;

    private Double price;

    private Integer displayOrder = 0;
}
