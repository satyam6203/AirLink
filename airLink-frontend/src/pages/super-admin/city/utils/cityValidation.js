/**
 * City Management Validation Utilities
 *
 * Contains validation functions for city data with API integration support
 */

export const validateCityForm = (formData) => {
  const errors = {};

  // City name validation
  if (!formData.name?.trim()) {
    errors.name = 'City name is required';
  } else if (formData.name.length > 100) {
    errors.name = 'City name must be 100 characters or less';
  } else if (formData.name.length < 2) {
    errors.name = 'City name must be at least 2 characters';
  }

  // City code validation
  if (!formData.cityCode?.trim()) {
    errors.cityCode = 'City code is required';
  } else if (formData.cityCode.length > 10) {
    errors.cityCode = 'City code must be 10 characters or less';
  } else if (formData.cityCode.length < 2) {
    errors.cityCode = 'City code must be at least 2 characters';
  } else if (!/^[A-Z0-9]+$/.test(formData.cityCode)) {
    errors.cityCode = 'City code must contain only uppercase letters and numbers';
  }

  // Country name validation
  if (!formData.countryName?.trim()) {
    errors.countryName = 'Country name is required';
  } else if (formData.countryName.length > 100) {
    errors.countryName = 'Country name must be 100 characters or less';
  } else if (formData.countryName.length < 2) {
    errors.countryName = 'Country name must be at least 2 characters';
  }

  // Country code validation
  if (!formData.countryCode?.trim()) {
    errors.countryCode = 'Country code is required';
  } else if (formData.countryCode.length > 5) {
    errors.countryCode = 'Country code must be 5 characters or less';
  } else if (formData.countryCode.length < 2) {
    errors.countryCode = 'Country code must be at least 2 characters';
  } else if (!/^[A-Z]{2,5}$/.test(formData.countryCode)) {
    errors.countryCode = 'Country code must be 2-5 uppercase letters';
  }

  // Region code validation (optional)
  if (formData.regionCode) {
    if (formData.regionCode.length > 10) {
      errors.regionCode = 'Region code must be 10 characters or less';
    } else if (!/^[A-Z0-9]*$/.test(formData.regionCode)) {
      errors.regionCode = 'Region code must contain only uppercase letters and numbers';
    }
  }

  // Timezone offset validation (optional)
  if (formData.timezoneOffset) {
    if (!/^UTC[+-]\d{1,2}(:\d{2})?$/.test(formData.timezoneOffset)) {
      errors.timezoneOffset = 'Timezone format should be UTC±H or UTC±HH:MM (e.g., UTC+5:30)';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Async validation with API integration
export const validateCityFormAsync = async (formData, checkCityCodeExists, currentCityId = null) => {
  // First run synchronous validation
  const syncValidation = validateCityForm(formData);
  if (!syncValidation.isValid) {
    return syncValidation;
  }

  const errors = {};

  // Check if city code already exists (async)
  if (formData.cityCode && checkCityCodeExists) {
    try {
      const codeCheck = await checkCityCodeExists(formData.cityCode, currentCityId);
      if (codeCheck.exists) {
        errors.cityCode = codeCheck.error || 'City code already exists';
      }
    } catch (error) {
      console.warn('Failed to check city code existence:', error);
      // Don't block form submission if API check fails
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateCityCode = (cityCode, existingCities, currentCityId = null) => {
  if (!cityCode) return { isValid: false, error: 'City code is required' };

  // Basic format validation
  if (!/^[A-Z0-9]+$/.test(cityCode)) {
    return { isValid: false, error: 'City code must contain only uppercase letters and numbers' };
  }

  if (cityCode.length < 2 || cityCode.length > 10) {
    return { isValid: false, error: 'City code must be between 2 and 10 characters' };
  }

  // Check for duplicates in local data (fallback)
  if (existingCities && Array.isArray(existingCities)) {
    const duplicateCity = existingCities.find(
      city => city.cityCode === cityCode && city.id !== currentCityId
    );

    if (duplicateCity) {
      return { isValid: false, error: 'City code already exists' };
    }
  }

  return { isValid: true };
};

export const sanitizeCityData = (formData) => {
  return {
    name: formData.name?.trim() || '',
    cityCode: formData.cityCode?.trim().toUpperCase() || '',
    countryName: formData.countryName?.trim() || '',
    countryCode: formData.countryCode?.trim().toUpperCase() || '',
    regionCode: formData.regionCode?.trim().toUpperCase() || '',
    timezoneOffset: formData.timezoneOffset?.trim() || ''
  };
};

// Validate city data for API submission
export const validateForAPISubmission = (cityData) => {
  const errors = [];

  // Required fields check
  const requiredFields = ['name', 'cityCode', 'countryName', 'countryCode'];
  requiredFields.forEach(field => {
    if (!cityData[field]) {
      errors.push(`${field} is required`);
    }
  });

  // Length validations
  if (cityData.name && cityData.name.length > 100) {
    errors.push('City name is too long');
  }
  if (cityData.cityCode && cityData.cityCode.length > 10) {
    errors.push('City code is too long');
  }
  if (cityData.countryName && cityData.countryName.length > 100) {
    errors.push('Country name is too long');
  }
  if (cityData.countryCode && cityData.countryCode.length > 5) {
    errors.push('Country code is too long');
  }
  if (cityData.regionCode && cityData.regionCode.length > 10) {
    errors.push('Region code is too long');
  }

  // Format validations
  if (cityData.cityCode && !/^[A-Z0-9]+$/.test(cityData.cityCode)) {
    errors.push('City code format is invalid');
  }
  if (cityData.countryCode && !/^[A-Z]{2,5}$/.test(cityData.countryCode)) {
    errors.push('Country code format is invalid');
  }
  if (cityData.regionCode && !/^[A-Z0-9]*$/.test(cityData.regionCode)) {
    errors.push('Region code format is invalid');
  }
  if (cityData.timezoneOffset && !/^UTC[+-]\d{1,2}(:\d{2})?$/.test(cityData.timezoneOffset)) {
    errors.push('Timezone offset format is invalid');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Transform form data for API compatibility
export const transformForAPI = (formData) => {
  const sanitized = sanitizeCityData(formData);

  return {
    name: sanitized.name,
    cityCode: sanitized.cityCode,
    countryName: sanitized.countryName,
    countryCode: sanitized.countryCode,
    regionCode: sanitized.regionCode || null, // Send null instead of empty string
    timezoneOffset: sanitized.timezoneOffset || null // Send null instead of empty string
  };
};

// Validate bulk city data (for import functionality)
export const validateBulkCityData = (citiesArray) => {
  const results = [];
  const cityCodeSet = new Set();

  citiesArray.forEach((city, index) => {
    const validation = validateCityForm(city);
    const result = {
      index,
      city,
      isValid: validation.isValid,
      errors: validation.errors
    };

    // Check for duplicate city codes within the batch
    if (city.cityCode) {
      if (cityCodeSet.has(city.cityCode)) {
        result.isValid = false;
        result.errors.cityCode = 'Duplicate city code in batch';
      } else {
        cityCodeSet.add(city.cityCode);
      }
    }

    results.push(result);
  });

  const validCities = results.filter(r => r.isValid);
  const invalidCities = results.filter(r => !r.isValid);

  return {
    totalCities: citiesArray.length,
    validCities: validCities.length,
    invalidCities: invalidCities.length,
    results,
    validData: validCities.map(r => r.city),
    invalidData: invalidCities
  };
};