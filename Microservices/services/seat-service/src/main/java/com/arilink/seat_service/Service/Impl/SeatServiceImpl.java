package com.arilink.seat_service.Service.Impl;

import com.arilink.seat_service.Model.Seat;
import com.arilink.seat_service.Model.SeatMap;
import com.arilink.seat_service.Repo.SeatMapRepo;
import com.arilink.seat_service.Repo.SeatRepo;
import com.arilink.seat_service.Service.SeatService;
import enums.SeatType;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import payload.request.SeatMapRequest;
import payload.response.SeatResponse;

import java.lang.invoke.CallSite;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SeatServiceImpl implements SeatService {

    private final SeatRepo seatRepo;
    private final SeatMapRepo seatMapRepo;

    @Override
    public void generateSeats(Long seaMapId) throws Exception {
        boolean exists = seatRepo.existsBySeatMapId(seaMapId);
        if(exists){
            throw new Exception("seats already created for seat map");
        }
        SeatMap seatMap = seatMapRepo.findById(seaMapId).orElseThrow(
                ()->new Exception("seat map not found")
        );

        int leftSeatsPerRow = seatMap.getLeftSeatsPerRow();
        int rightSeatsPerRow = seatMap.getRightSeatsPerRow();
        int rows = seatMap.getTotalRows();
        int seatsPerRow = leftSeatsPerRow + rightSeatsPerRow;

        List<Seat> seats = new ArrayList<>();

        for(int row = 1; row <= rows; row++){
            for(int col = 0; col < seatsPerRow; col++){
                String seatNumber = row + getSeatLetter(col);
                SeatType type = getSeatType(col, leftSeatsPerRow, rightSeatsPerRow);
                Seat seat = Seat.builder()
                        
                        .build();
            }
        }
    }
    private String getSeatLetter(int col){
        return "";
    }

    private String getSeatType(int col, int leftSeatsPerRow, int rightSeatsPerRow){
        return "";
    }

    @Override
    public SeatResponse updateSeat(Long seatId, SeatMapRequest request) {
        return null;
    }

    @Override
    public List<SeatResponse> getAll() {
        return List.of();
    }
}
