import React from 'react';
import { ChevronUp, ChevronDown, Edit, Trash2, MoreVertical } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

const SortableHeader = ({ field, sortField, sortDirection, onSort, children }) => (
  <TableHead
    className="cursor-pointer hover:bg-gray-50 transition-colors"
    onClick={() => onSort(field)}
  >
    <div className="flex items-center gap-1">
      {children}
      {sortField === field && (
        sortDirection === 'asc' ?
          <ChevronUp className="w-4 h-4" /> :
          <ChevronDown className="w-4 h-4" />
      )}
    </div>
  </TableHead>
);

const CityTable = ({
  cities,
  selectedCities,
  sortField,
  sortDirection,
  onSort,
  onSelectAll,
  onSelectCity,
  onEdit,
  onDelete,
  loading = false
}) => {
  const isAllSelected = cities.length > 0 && selectedCities.length === cities.length;
  const isIndeterminate = selectedCities.length > 0 && selectedCities.length < cities.length;

  console.log("Rendering CityTable with cities:", cities);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading cities...</div>
      </div>
    );
  }

  if (cities.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-gray-500 mb-2">No cities found</div>
          <div className="text-sm text-gray-400">
            Try adjusting your search criteria or add a new city
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <Table>
        <TableHeader>
          <TableRow>
            
            <SortableHeader
              field="name"
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={onSort}
            >
              City Name
            </SortableHeader>
            <SortableHeader
              field="cityCode"
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={onSort}
            >
              Code
            </SortableHeader>
            <SortableHeader
              field="countryName"
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={onSort}
            >
              Country
            </SortableHeader>
            <SortableHeader
              field="regionCode"
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={onSort}
            >
              Region
            </SortableHeader>
            <SortableHeader
              field="timezoneOffset"
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={onSort}
            >
              Timezone
            </SortableHeader>
            <TableHead className="w-16">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cities.map((city) => (
            <TableRow key={city.id} className="hover:bg-gray-50">
             
              <TableCell className="font-medium">
                {city.name}
              </TableCell>
              <TableCell>
                <Badge variant="secondary">{city.cityCode}</Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span>{city.countryName}</span>
                  <Badge variant="outline" className="text-xs">
                    {city.countryCode}
                  </Badge>
                </div>
              </TableCell>
              <TableCell>
                {city.regionCode ? (
                  <Badge variant="outline">{city.regionCode}</Badge>
                ) : (
                  <span className="text-gray-400">-</span>
                )}
              </TableCell>
              <TableCell>
                <Badge variant="outline">
                  {city.timezoneOffset || 'Not set'}
                </Badge>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(city)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDelete(city)}
                      className="text-red-600"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CityTable;