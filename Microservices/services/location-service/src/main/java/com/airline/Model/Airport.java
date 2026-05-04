package com.airline.Model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import embeddable.Address;
import embeddable.GeoCode;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@AllArgsConstructor
@RequiredArgsConstructor
@Builder
public class Airport {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(unique = true, nullable = false, length = 3)
    private String iataCode;

    @Embedded
    private Address address;

    private GeoCode geoCode;

    @Column(name = "time_zone_id", length = 50)
    private String timeZone;

    @JsonIgnore
    @ManyToOne
    private City city;
}
