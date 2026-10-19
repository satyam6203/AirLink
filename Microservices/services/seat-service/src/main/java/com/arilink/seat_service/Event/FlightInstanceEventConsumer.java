package com.arilink.seat_service.Event;

import com.arilink.seat_service.Repo.SeatInstanceRepo;
import java.util.List;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import com.arilink.seat_service.Model.CabinClass;
import com.arilink.seat_service.Model.FlightInstanceCabin;
import com.arilink.seat_service.Model.Seat;
import com.arilink.seat_service.Model.SeatInstance;
import com.arilink.seat_service.Repo.CabinClassRepo;
import com.arilink.seat_service.Repo.FlightInstanceCabinRepo;
import com.arilink.seat_service.Repo.SeatRepo;

import Event.FlightInstanceCreateEvent;
import enums.SeatAvailabilityStatus;
import enums.SeatType;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service 
@RequiredArgsConstructor 
public class FlightInstanceEventConsumer {

    private final CabinClassRepo cabinClassRepo;
    private final SeatRepo seatRepo;
    private final FlightInstanceCabinRepo flightInstanceCabinRepo;
    private final SeatInstanceRepo seatInstanceRepo;

    @KafkaListener(topics = "flight-instance-created", groupId = "seat-service-group")
    @Transactional 
    public void handelFlightInstanceCreated(FlightInstanceCreateEvent event) {

        List<CabinClass> cabinClasses = cabinClassRepo.findByAircraftId(event.getAircraftId());
        int totalSeatInstance = 0;
        for(CabinClass cabinClass : cabinClasses) {
            List<Seat> seats = cabinClass.getSeatMap() != null 
                ? seatRepo.findBySeatMapId(cabinClass.getSeatMap().getId()) : List.of();
            
            FlightInstanceCabin fic = FlightInstanceCabin.builder()
                .flightInstanceId(event.getFlightInstanceId())
                .cabinClass(cabinClass)
                .totalSeats(seats.size())
                .bookedSeats(0)
                .build();
            
            FlightInstanceCabin savedFic = flightInstanceCabinRepo.save(fic);

            List<SeatInstance> seatInstances = seats.stream().map(
                seat -> SeatInstance
                    .builder()
                    .flightId(event.getFlightId())
                    .flightInstanceId(event.getFlightInstanceId())
                    .flightInstanceCabin(savedFic)
                    .seat(seat)
                    .status(SeatAvailabilityStatus.AVAILABLE)
                    .isBooked(false)
                    .isAvailable(true)
                    .premiumSurcharge(getPremiumSuperCharge(seat.getSeatType(), 1000.0, 500.0))
                    .build()
            ).toList();

            seatInstanceRepo.saveAll(seatInstances);
            totalSeatInstance += seatInstances.size();
        }

    }

    private Double getPremiumSuperCharge(SeatType seatType,
                                         Double windowSuperCharge,
                                         Double aisleSuperCharge){
        if(seatType == null) return 0.0;
        return switch (seatType){
            case AISLE -> aisleSuperCharge;
            case WINDOW -> windowSuperCharge;
            default -> 0.0;
        };
    }
}
