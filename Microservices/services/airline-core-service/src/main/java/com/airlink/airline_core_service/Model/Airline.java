package com.airlink.airline_core_service.Model;

import embeddable.Support;
import enums.AirLineStatus;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.Instant;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
public class Airline {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String iataCode;

    @Column(unique = true, nullable = false)
    private String icaoCode;

    @Column(nullable = false)
    private String name;

    private String alias;

    @Column(unique = true, nullable = false)
    private Long ownerId;
    private String logoUrl;
    private String website;

    @Enumerated(EnumType.STRING)
    private AirLineStatus status = AirLineStatus.ACTIVE;

    private String alliance;

    private Long headquarterCityId;

    @Embedded
    private Support support;

    private Long updatedById;

    @CreatedDate
    @Column(updatable = false, nullable = false)
    private Instant createdAt;

    @LastModifiedDate
    @Column(nullable = false)
    private Instant updatedAt;
}
