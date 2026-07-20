/**
 * City Management Helper Functions
 *
 * Contains utility functions for filtering, sorting, and data manipulation
 */

export const filterCities = (cities, searchQuery, filters = {}) => {
  if (!searchQuery && !Object.keys(filters).length) return cities;

  return cities.filter(city => {
    // Search query filtering
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = [
        city.name,
        city.cityCode,
        city.countryName,
        city.countryCode,
        city.regionCode
      ].some(field => field?.toLowerCase().includes(searchLower));

      if (!matchesSearch) return false;
    }

    // Additional filters
    if (filters.country && city.countryCode !== filters.country) return false;
    if (filters.timezone && city.timezoneOffset !== filters.timezone) return false;
    if (filters.region && city.regionCode !== filters.region) return false;

    return true;
  });
};

export const sortCities = (cities, sortField, sortDirection) => {
  return [...cities].sort((a, b) => {
    const aVal = a[sortField] || '';
    const bVal = b[sortField] || '';

    if (sortDirection === 'asc') {
      return aVal > bVal ? 1 : -1;
    }
    return aVal < bVal ? 1 : -1;
  });
};

export const paginateCities = (cities, currentPage, itemsPerPage) => {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  return {
    paginatedCities: cities.slice(startIndex, endIndex),
    totalPages: Math.ceil(cities.length / itemsPerPage),
    totalItems: cities.length
  };
};

export const getUniqueCountries = (cities) => {
  const countries = new Set();
  cities.forEach(city => {
    if (city.countryName && city.countryCode) {
      countries.add(JSON.stringify({
        name: city.countryName,
        code: city.countryCode
      }));
    }
  });

  return Array.from(countries).map(country => JSON.parse(country));
};

export const getUniqueTimezones = (cities) => {
  return [...new Set(cities.map(city => city.timezoneOffset))].filter(Boolean);
};

export const getUniqueRegions = (cities) => {
  return [...new Set(cities.map(city => city.regionCode))].filter(Boolean);
};

export const formatTimezone = (timezone) => {
  if (!timezone) return '';
  return timezone.replace('UTC', 'UTC ');
};

export const exportCitiesToCSV = (cities) => {
  const headers = ['ID', 'Name', 'City Code', 'Country Name', 'Country Code', 'Region Code', 'Timezone Offset'];
  const csvContent = [
    headers.join(','),
    ...cities.map(city => [
      city.id,
      `"${city.name}"`,
      city.cityCode,
      `"${city.countryName}"`,
      city.countryCode,
      city.regionCode || '',
      city.timezoneOffset || ''
    ].join(','))
  ].join('\n');

  return csvContent;
};

export const downloadCSV = (csvContent, filename = 'cities.csv') => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};