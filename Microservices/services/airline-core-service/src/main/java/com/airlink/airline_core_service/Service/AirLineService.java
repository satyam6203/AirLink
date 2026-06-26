package com.airlink.airline_core_service.Service;

import enums.AirLineStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import payload.request.AirLineRequest;
import payload.response.AirLineDropdownItem;
import payload.response.AirLineResponse;

import java.util.List;

public interface AirLineService {

    AirLineResponse createAirLine(AirLineRequest request, Long ownerId);
    AirLineResponse getAirLineByOwner(Long ownerId) throws Exception;
    AirLineResponse getAirLineById(Long id) throws Exception;
    AirLineResponse updateAirLine(AirLineRequest request, Long ownerId) throws Exception;
    Page<AirLineResponse> getAllAirLines(Pageable pageable);
    void deleteAirLine(Long id, Long ownerId) throws Exception;
    AirLineResponse changeStatus(Long airlineId, AirLineStatus status) throws Exception;
    List<AirLineDropdownItem> getAirLineDropDown();
}
