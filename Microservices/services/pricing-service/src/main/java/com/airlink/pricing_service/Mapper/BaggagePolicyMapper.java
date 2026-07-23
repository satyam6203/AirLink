package com.airlink.pricing_service.Mapper;

import com.airlink.pricing_service.Model.BaggagePolicy;
import com.airlink.pricing_service.Model.Fare;
import payload.request.BaggagePolicyRequest;
import payload.response.BaggagePolicyResponse;

public class BaggagePolicyMapper {

    public static BaggagePolicy toEntity(BaggagePolicyRequest request, Fare fare){
        if(request == null) return null;

        return BaggagePolicy.builder()
                .fare(fare)
                .name(request.getName())
                .description(request.getDescription())
                .cabinBaggageMaxWeight(request.getCabinBaggageMaxWeight())
                .cabinBaggagePieces(request.getCheckInBaggagePieces() != null ? request.getCheckInBaggagePieces() : null)
                .cabinBaggageWeightPerPrice(request.getCabinBaggageWeightPerPrice())
                .cabinBaggageMaxDimension(request.getCabinBaggageMaxDimension())
                .cabinBaggageMaxWeight(request.getCabinBaggageMaxWeight())
                .checkInBaggagePieces(request.getCheckInBaggagePieces() != null ? request.getCheckInBaggagePieces() : null)
                .checkInBaggageWeightPerPrice(request.getCabinBaggageWeightPerPrice())
                .freeCheckedBagsAllowance(request.getCheckInBaggagePieces() != null ? request.getCheckInBaggagePieces() : null)
                .priorityBaggage(request.getPriorityBaggage() != null ? request.getPriorityBaggage() : false)
                .extraBaggageAllowance(request.getExtraBaggageAllowance() != null ? request.getExtraBaggageAllowance() : false)
                .build();
    }

    public static BaggagePolicyResponse toResponse(BaggagePolicy policy){
        if(policy == null) return null;

        return BaggagePolicyResponse.builder()
                .id(policy.getId())
                .name(policy.getName())
                .description(policy.getDescription())
                .cabinBaggageMaxWeight(policy.getCabinBaggageMaxWeight())
                .cabinBaggagePieces(policy.getCabinBaggagePieces())
                .cabinBaggageWeightPerPiece(policy.getCabinBaggageWeightPerPrice())
                .cabinBaggageMaxDimension(policy.getCabinBaggageMaxDimension())
                .cabinBaggageMaxWeight(policy.getCheckInBaggageMaxWeight())
                .checkInBaggageWeightPerPiece(policy.getCheckInBaggageWeightPerPrice())
                .checkInBaggageMaxWeight(policy.getCheckInBaggageMaxWeight())
                .checkInBaggageWeightPerPiece(policy.getCheckInBaggageWeightPerPrice())
                .freeCheckedBagsAllowance(policy.getFreeCheckedBagsAllowance())
                .priorityBaggage(policy.getPriorityBaggage())
                .extraBaggageAllowance(policy.getExtraBaggageAllowance())
                .airlineId(policy.getAirlineId())
                .fareId(policy.getFare() != null ? policy.getFare().getId() : null)
                .createdAt(policy.getCreatedAt())
                .updatedAt(policy.getUpdatedAt())
                .build();
    }

    public static void updateEntity(BaggagePolicyRequest request, BaggagePolicy existing) {
        if (request == null || existing == null) return;
        if (request.getName() != null) existing.setName(request.getName());
        if (request.getDescription() != null) existing.setDescription(request.getDescription());
        if (request.getCabinBaggageMaxWeight() != null) existing.setCabinBaggageMaxWeight(request.getCabinBaggageMaxWeight());
        if (request.getCabinBaggagePieces() != null) existing.setCabinBaggagePieces(request.getCabinBaggagePieces());
        if (request.getCabinBaggageWeightPerPrice() != null) existing.setCabinBaggageWeightPerPrice(request.getCabinBaggageWeightPerPrice());
        if (request.getCabinBaggageMaxDimension() != null) existing.setCabinBaggageMaxDimension(request.getCabinBaggageMaxDimension());
        if (request.getCheckInBaggageMaxWeight() != null) existing.setCheckInBaggageMaxWeight(request.getCheckInBaggageMaxWeight());
        if (request.getCheckInBaggagePieces() != null) existing.setCheckInBaggagePieces(request.getCheckInBaggagePieces());
        if (request.getCheckInBaggageWeightPerPiece() != null) existing.setCabinBaggageWeightPerPrice(request.getCheckInBaggageWeightPerPiece());
        if (request.getFreeCheckedBagsAllowance() != null) existing.setFreeCheckedBagsAllowance(request.getFreeCheckedBagsAllowance());
        if (request.getPriorityBaggage() != null) existing.setPriorityBaggage(request.getPriorityBaggage());
        if (request.getExtraBaggageAllowance() != null) existing.setExtraBaggageAllowance(request.getExtraBaggageAllowance());

    }
}
