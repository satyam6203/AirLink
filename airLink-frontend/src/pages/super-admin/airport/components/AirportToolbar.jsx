import React from 'react';
import { Search, Filter, Download, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const AirportToolbar = ({
  searchQuery,
  onSearchChange,
  showFilters,
  onToggleFilters,
  onExport,
  onImport
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white border border-gray-200 rounded-lg">
      {/* Search Bar */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Search airports by name, code, city, or country..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onToggleFilters}
          className={showFilters ? 'bg-blue-50 border-blue-200' : ''}
        >
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onExport}
        >
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onImport}
        >
          <Upload className="w-4 h-4 mr-2" />
          Import
        </Button>
      </div>
    </div>
  );
};

export default AirportToolbar;