import React from 'react';
import { ChevronDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

const CityFilters = ({
  isVisible,
  filters,
  onFiltersChange,
  onReset,
  countries = [],
  timezones = [],
  regions = []
}) => {
  if (!isVisible) return null;

  const handleFilterChange = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value === 'all' ? '' : value
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <ChevronDown className="w-4 h-4" />
            Advanced Filters
          </span>
          <Button variant="ghost" size="sm" onClick={onReset}>
            Reset
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Country Filter */}
          <div>
            <Label>Country</Label>
            <Select
              value={filters.country || 'all'}
              onValueChange={(value) => handleFilterChange('country', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Countries" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Countries</SelectItem>
                {countries.map((country) => (
                  <SelectItem key={country.code} value={country.code}>
                    {country.name} ({country.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Timezone Filter */}
          <div>
            <Label>Timezone</Label>
            <Select
              value={filters.timezone || 'all'}
              onValueChange={(value) => handleFilterChange('timezone', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Timezones" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Timezones</SelectItem>
                {timezones.map((timezone) => (
                  <SelectItem key={timezone} value={timezone}>
                    {timezone}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Region Filter */}
          <div>
            <Label>Region</Label>
            <Select
              value={filters.region || 'all'}
              onValueChange={(value) => handleFilterChange('region', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Regions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Regions</SelectItem>
                {regions.map((region) => (
                  <SelectItem key={region} value={region}>
                    {region}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Filter Summary */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>Active filters:</span>
          {Object.entries(filters).filter(([key, value]) => value).length === 0 ? (
            <span className="text-gray-400">None</span>
          ) : (
            <div className="flex gap-1">
              {Object.entries(filters)
                .filter(([key, value]) => value)
                .map(([key, value]) => (
                  <span
                    key={key}
                    className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs"
                  >
                    {key}: {value}
                  </span>
                ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CityFilters;