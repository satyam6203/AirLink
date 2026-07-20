import React from 'react';
import { ChevronUp, ChevronDown, Edit, Trash2, MoreVertical, MapPin, Clock } from 'lucide-react';
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

const AirportTable = ({
  airports,
  
  sortField,
  sortDirection,
  onSort,

  onEdit,
  onDelete,
  loading = false
}) => {

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading airports...</div>
      </div>
    );
  }

  if (airports.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-gray-500 mb-2">No airports found</div>
          <div className="text-sm text-gray-400">
            Try adjusting your search criteria or add a new airport
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
              field="iataCode"
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={onSort}
            >
              IATA Code
            </SortableHeader>
            <SortableHeader
              field="name"
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={onSort}
            >
              Airport Name
            </SortableHeader>
            <TableHead>Detailed Name</TableHead>
            <SortableHeader
              field="city"
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={onSort}
            >
              City
            </SortableHeader>
            <SortableHeader
              field="country"
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={onSort}
            >
              Country
            </SortableHeader>
            <TableHead>Time Zone</TableHead>
            <TableHead>Coordinates</TableHead>
            <TableHead className="w-16">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {airports.map((airport) => (
            <TableRow key={airport.id} className="hover:bg-gray-50">
             
              <TableCell className="font-medium">
                <Badge variant="secondary" className="font-mono">
                  {airport.iataCode}
                </Badge>
              </TableCell>
              <TableCell className="font-medium">
                {airport.name}
              </TableCell>
              <TableCell className="text-gray-600">
                {airport.detailedName || '-'}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-gray-400" />
                  <span>{airport.city?.name || '-'}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span>{airport.address?.countryName || '-'}</span>
                  {airport.address?.countryCode && (
                    <Badge variant="outline" className="text-xs">
                      {airport.address.countryCode}
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-gray-400" />
                  <span className="text-sm">
                    {airport.timeZone || 'Not set'}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                {airport.geoCode?.latitude && airport.geoCode?.longitude ? (
                  <div className="text-sm text-gray-600">
                    <div>{airport.geoCode.latitude.toFixed(4)}</div>
                    <div>{airport.geoCode.longitude.toFixed(4)}</div>
                  </div>
                ) : (
                  <span className="text-gray-400">-</span>
                )}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(airport)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDelete(airport)}
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

export default AirportTable;