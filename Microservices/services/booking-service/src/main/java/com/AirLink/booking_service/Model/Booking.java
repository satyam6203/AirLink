package com.AirLink.booking_service.Model;

import embeddable.ContactInfo;
import enums.BookingStatus;
import enums.CabinClassType;
import enums.TripType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@EntityListeners(AuditingEntityListener.class)
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String bookingReference;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private Long flightId;

    @Column(nullable = false)
    private Long flightInstanceId;

    @Column(nullable = false)
    private Long airlineId;

    private TripType tripType = TripType.ONE_WAY;

    @Enumerated(EnumType.STRING)
    private CabinClassType cabinClass = CabinClassType.ECONOMY;

    @Column(nullable = false)
    private Long fareId;

    private boolean flexibleTicket;
    private LocalDateTime ticketTimeLimit;

    @OneToMany(mappedBy = "booking", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Passenger> passengers = new HashSet<>();

    @ElementCollection
    @Column(nullable = false)
    private List<Long> seatInstanceIds;

    @ElementCollection
    @Column(nullable = false)
    private List<Long> ancillaryIds;

    @ElementCollection
    @Column(nullable = false)
    private List<Long> mealIds;

    @OneToMany(mappedBy = "booking", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Ticket> tickets=new HashSet<>();

    private Long paymentId;

    @Enumerated(EnumType.STRING)
    private BookingStatus status;

    @CreatedDate
    private LocalDateTime bookingDate;

    @UpdateTimestamp
    private LocalDateTime lastModified;

    private boolean ticketIssued;

    private ContactInfo contactInfo;
}
