package com.airline.ancillary_service.service.Impl;

import com.airline.ancillary_service.Mapper.MealMapper;
import com.airline.ancillary_service.Model.Meal;
import com.airline.ancillary_service.Repo.MealRepository;
import com.airline.ancillary_service.service.MealService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import payload.request.MealRequest;
import payload.response.MealResponse;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class MealServiceImpl implements MealService {

    private  final MealRepository mealRepository;

    @Override
    public MealResponse create(Long airlineId, MealRequest request) throws Exception {
        if(mealRepository.existsByCodeAndAirlineId(request.getCode(), airlineId)){
            throw new Exception("meal code already exists");
        }

        Meal meal = Meal.builder()
                .code(request.getCode())
                .name(request.getName())
                .mealType(request.getMealType())
                .dietaryRestriction(request.getDietaryRestriction())
                .ingredients(request.getIngredients())
                .imageUrl(request.getImageUrl())
                .requiredAdvanceBooking(request.getRequiresAdvanceBooking() != null
                        ? request.getRequiresAdvanceBooking() : false)
                .advanceBookingHours(request.getAdvanceBookingHours())
                .displayOrder(request.getDisplayOrder())
                .airlineId(airlineId)
                .build();

        Meal saved = mealRepository.save(meal);
        return MealMapper.toResponse(saved);
    }

    @Override
    public MealResponse getById(Long id) throws Exception {
        Meal meal = mealRepository.findById(id).orElseThrow(
                () -> new Exception("Meal not found with id")
        );
        return MealMapper.toResponse(meal);
    }

    @Override
    public List<MealResponse> getByAirlineId(Long airlineId) {
        return mealRepository.findByAirlineId(airlineId)
                .stream()
                .map(MealMapper :: toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public MealResponse update(Long airlineId, Long id, MealRequest request) throws Exception {
        Meal meal = mealRepository.findById(id).orElseThrow(
                () -> new Exception("Meal not found with id")
        );

        if(request.getCode() != null && mealRepository.existsByAirlineIdAndCodeAndIdNot(airlineId,
                request.getCode(), meal.getId())){
            throw new Exception("meal code already exists");
        }

        meal.setCode(request.getCode());
        meal.setName(request.getName());
        meal.setMealType(request.getMealType());
        meal.setDietaryRestriction(request.getDietaryRestriction());
        meal.setIngredients(request.getIngredients());
        meal.setImageUrl(request.getImageUrl());
        meal.setRequiredAdvanceBooking(request.getRequiresAdvanceBooking());
        meal.setRequiredAdvanceBooking(request.getRequiresAdvanceBooking());
        meal.setDisplayOrder(request.getDisplayOrder());

        Meal saved = mealRepository.save(meal);
        return MealMapper.toResponse(saved);
    }

    @Override
    public void delete(Long id) throws Exception {
        Meal meal = mealRepository.findById(id).orElseThrow(
                () -> new Exception("Meal not found with id")
        );
        mealRepository.delete(meal);
    }

    @Override
    public MealResponse updateAvailability(Long id, Boolean available) throws Exception {
        Meal meal = mealRepository.findById(id).orElseThrow(
                () -> new Exception("Meal not found with id")
        );
        meal.setAvailable(available);
        Meal updated = mealRepository.save(meal);
        return MealMapper.toResponse(updated);
    }
}
