import React from 'react';
import { Search, Filter, Download, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

const CityToolbar = ({
  searchQuery,
  onSearchChange,
  showFilters,
  onToggleFilters,
  onExport,
  onImport,
  showInactive,
  onToggleInactive,
  lastUpdated = '2 hours ago'
}) => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-1 gap-4 items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search cities..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant="outline"
              onClick={onToggleFilters}
              className="flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filter
            </Button>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={onExport}
            >
              <Download className="w-4 h-4" />
              Export
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={onImport}
            >
              <Upload className="w-4 h-4" />
              Import
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-4 mt-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Checkbox
              id="inactive"
              checked={showInactive}
              onCheckedChange={onToggleInactive}
            />
            <Label htmlFor="inactive">Show inactive cities</Label>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Last updated: {lastUpdated}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CityToolbar;