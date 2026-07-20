# Airport Management Module

A comprehensive airport management system for the Super Admin Dashboard implementing the full CRUD functionality with modern UI components.

## Features Implemented

### ✅ **Main Dashboard**
- **AirportManagementNew.jsx** - Main container with full CRUD operations
- Real-time statistics cards showing total airports, countries, timezones, and active airports
- Search and filter functionality with debounced input
- Pagination with configurable items per page (10, 25, 50, 100)
- Bulk selection and operations

### ✅ **Data Table**
- **AirportTable.jsx** - Sortable table with all airport information
- Columns: IATA Code, Name, Detailed Name, City, Country, Time Zone, Coordinates, Actions
- Sortable headers with visual indicators
- Row selection with checkboxes
- Action dropdown menu for Edit/Delete operations
- Loading and empty states

### ✅ **Form Modal (Formik + Yup)**
- **AirportFormModal.jsx** - Comprehensive form with validation
- **Required fields**: IATA Code (3 chars), Airport Name, Time Zone, City
- **Optional sections**: Address (collapsible), Geographic Coordinates (collapsible)
- Real-time IATA code validation to prevent duplicates
- Dropdown integration with city data from Redux store
- Field-level validation with proper error messages

### ✅ **Delete Modal**
- **AirportDeleteModal.jsx** - Confirmation dialog with airport preview
- Displays full airport information before deletion
- Warning message about potential impact on flights
- Loading state during deletion process

### ✅ **Supporting Components**
- **AirportStatsCards.jsx** - Statistics overview cards
- **AirportToolbar.jsx** - Search bar and action buttons
- **AirportFilters.jsx** - Advanced filtering options
- **AirportPagination.jsx** - Pagination controls
- **AirportNotification.jsx** - Toast notifications

## Data Model Integration

### Airport Form Fields
```javascript
{
  iataCode: string,          // Required, exactly 3 characters
  name: string,              // Required
  detailedName: string,      // Optional
  timeZone: string,          // Required, dropdown selection
  cityId: string,            // Required, linked to City model
  address: {                 // Optional embedded object
    street: string,
    postalCode: string,
    cityName: string,
    countryName: string,
    regionCode: string
  },
  geoCode: {                 // Optional embedded object
    latitude: number,        // -90 to 90
    longitude: number        // -180 to 180
  }
}
```

## Redux Integration

### Thunks Used
- `createAirport` - Create new airport
- `updateAirport` - Update existing airport
- `deleteAirport` - Delete airport
- `listAllAirports` - Fetch all airports
- `getAirportByIataCode` - Validate IATA code uniqueness
- `getAllCities` - Populate city dropdown

### State Management
- Direct Redux dispatch (no custom hooks)
- Local component state for UI interactions
- Proper loading states and error handling

## Validation Schema (Yup)

```javascript
{
  iataCode: Yup.string()
    .length(3, 'IATA code must be exactly 3 characters')
    .matches(/^[A-Z]{3}$/, 'IATA code must contain only uppercase letters')
    .required('IATA code is required'),

  name: Yup.string()
    .min(2, 'Airport name must be at least 2 characters')
    .max(200, 'Airport name must be less than 200 characters')
    .required('Airport name is required'),

  // ... additional validation rules
}
```

## UI/UX Features

### Search & Filtering
- Real-time search across name, IATA code, city, country
- Advanced filters for country, city, timezone, status
- Filter chips with individual removal
- Reset filters functionality

### Responsive Design
- Mobile-friendly table layout
- Responsive form modal (90% viewport on mobile)
- Collapsible sections for better mobile experience
- Proper keyboard navigation

### Accessibility
- ARIA labels and descriptions
- Keyboard navigation support
- Focus management in modals
- Screen reader friendly notifications

## User Flow

1. **Default View**: Airport list with statistics
2. **Add Airport**: Click "Add Airport" → Form modal opens
3. **Edit Airport**: Click Edit action → Pre-filled form modal
4. **Delete Airport**: Click Delete → Confirmation modal with warning
5. **Search/Filter**: Use toolbar controls → Real-time filtering
6. **Pagination**: Navigate through results with configurable page sizes

## File Structure

```
src/pages/super-admin/airport/
├── AirportManagementNew.jsx          # Main component
├── components/
│   ├── AirportTable.jsx              # Data table
│   ├── AirportFormModal.jsx          # Add/Edit form
│   ├── AirportDeleteModal.jsx        # Delete confirmation
│   ├── AirportStatsCards.jsx         # Statistics cards
│   ├── AirportToolbar.jsx            # Search & actions
│   ├── AirportFilters.jsx            # Advanced filters
│   ├── AirportPagination.jsx         # Pagination controls
│   └── AirportNotification.jsx       # Toast notifications
└── README.md                         # This documentation
```

## Integration Notes

- Uses existing Redux store configuration
- Integrates with city management for dropdown data
- Compatible with existing UI component library
- Follows established patterns from city management module
- Ready for production deployment

## Usage

The Airport Management module is accessible at `/airports` in the Super Admin dashboard and provides a complete solution for managing airport data with modern UI patterns and comprehensive validation.