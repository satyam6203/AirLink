package com.airline.ancillary_service.service;

import jakarta.persistence.AttributeConverter;

public class AncillaryMetadataConverter implements AttributeConverter {

    @Override
    public Object convertToDatabaseColumn(Object attribute) {
//        if()
        return null;
    }

    @Override
    public Object convertToEntityAttribute(Object dbData) {
        return null;
    }
}
