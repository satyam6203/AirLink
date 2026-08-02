package com.arilink.seat_service.Model;

import enums.SeatAvailabilityStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.context.annotation.EnableAspectJAutoProxy;
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
public class SeatInstance {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private Long flightId;

    private FlightInstanceCabin flightInstanceCabin;
    private Long flightInstanceId;

    private Seat seat;
    private Boolean isBooked = true;
    private Boolean isAvailable = true;

    private String mealPreference;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SeatAvailabilityStatus status = SeatAvailabilityStatus.AVAILABLE;

    private Double fare;
    private Double premiumSurcharge;
    @Version
    private Long version;

    @CreatedDate
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;


    @PrePersist
    public void preCreate(){
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
    }
    
    @PreUpdate
    public void preUpdate(){
        this.updatedAt = Instant.now();
    }
}
