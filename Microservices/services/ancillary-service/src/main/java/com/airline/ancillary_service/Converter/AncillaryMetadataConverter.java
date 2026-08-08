package com.airline.ancillary_service.Converter;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import domain.AncillaryMetadata;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import lombok.extern.slf4j.Slf4j;

@Converter
@Slf4j
public class AncillaryMetadataConverter implements AttributeConverter<AncillaryMetadata, String> {

    private static final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public String convertToDatabaseColumn(AncillaryMetadata metadata) {
        if (metadata == null) {
            return null;
        }
        try {
            return objectMapper.writeValueAsString(metadata);
        } catch (JsonProcessingException e) {
            log.error("Error converting AncillaryMetadata to JSON", e);
            throw new IllegalArgumentException("Error converting metadata to JSON", e);
        }
    }

    @Override
    public AncillaryMetadata convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.trim().isEmpty()) {
            return null;
        }
        try {
            return objectMapper.readValue(dbData, AncillaryMetadata.class);
        } catch (JsonProcessingException e) {
            log.error("Error converting JSON to AncillaryMetadata", e);
            throw new IllegalArgumentException("Error converting JSON to metadata", e);
        }
    }
}
