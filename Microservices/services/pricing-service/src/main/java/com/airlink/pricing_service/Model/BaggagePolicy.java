package com.airlink.pricing_service.Model;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

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


}
