# Aircraft Management Routes

This document outlines all the routes available for the Aircraft Management system in the Airline Admin Dashboard.

## Main Route Structure

The aircraft management system is accessible under the `/airline` path with the following structure:

```
/airline/                           → Dashboard Overview
/airline/aircraft                   → Aircraft List Page
/airline/aircraft/:aircraftId       → Aircraft Detail Page
/airline/aircraft/:aircraftId/edit  → Edit Aircraft Form
/airline/aircraft/new              → New Aircraft Form
/airline/aircraft/:aircraftId/cabin/:cabinId/edit → Edit Cabin Form
/airline/aircraft/:aircraftId/cabin/new → New Cabin Form
```

## Detailed Route Descriptions

### 1. Dashboard Overview
- **Path**: `/airline/`
- **Component**: `DashboardOverview`
- **Purpose**: Main landing page showing overview of airline operations
- **Features**: Quick stats, recent activity, recent flights

### 2. Aircraft List Page
- **Path**: `/airline/aircraft`
- **Component**: `AircraftListPage`
- **Purpose**: Display paginated list of all aircraft
- **Features**:
  - Search by code, model, manufacturer
  - Filter by status (Active, Maintenance, Inactive, Retired)
  - Sort by various columns
  - Pagination with configurable page sizes
  - Actions: View Details, Edit, Delete

### 3. Aircraft Detail Page
- **Path**: `/airline/aircraft/:aircraftId`
- **Component**: `AircraftDetail`
- **Purpose**: Detailed view of a specific aircraft
- **Features**:
  - Aircraft header with metadata
  - Cabin configuration cards
  - Interactive seat maps
  - Seat configuration drawer
  - Summary statistics

### 4. Aircraft Edit Form (Planned)
- **Path**: `/airline/aircraft/:aircraftId/edit`
- **Component**: `AircraftEditForm` (To be implemented)
- **Purpose**: Edit existing aircraft details
- **Features**: Form to modify aircraft attributes

### 5. New Aircraft Form (Planned)
- **Path**: `/airline/aircraft/new`
- **Component**: `NewAircraftForm` (To be implemented)
- **Purpose**: Create new aircraft
- **Features**: Form to add new aircraft to fleet

### 6. Cabin Edit Form (Planned)
- **Path**: `/airline/aircraft/:aircraftId/cabin/:cabinId/edit`
- **Component**: `CabinEditForm` (To be implemented)
- **Purpose**: Edit cabin class configuration
- **Features**: Form to modify cabin attributes

### 7. New Cabin Form (Planned)
- **Path**: `/airline/aircraft/:aircraftId/cabin/new`
- **Component**: `NewCabinForm` (To be implemented)
- **Purpose**: Add new cabin class to aircraft
- **Features**: Form to create new cabin configuration

## Navigation Integration

### Sidebar Navigation
The aircraft routes are integrated with the sidebar navigation:

```javascript
// In AirlineDashboard.jsx
const handleSectionChange = (sectionId) => {
  switch(sectionId) {
    case 'aircraft':
      navigate('/airline/aircraft')
      break
    // ... other cases
  }
}
```

### URL-Based Active Section Detection
The active section is determined from the current URL:

```javascript
const getActiveSectionFromPath = (pathname) => {
  if (pathname.includes('/aircraft')) return 'aircraft'
  // ... other conditions
}
```

## Route Parameters

### `:aircraftId`
- **Type**: String
- **Description**: Unique identifier for an aircraft
- **Example**: `aircraft_1`, `SW-789`
- **Usage**: Used to fetch and display specific aircraft data

### `:cabinId`
- **Type**: String
- **Description**: Unique identifier for a cabin class
- **Example**: `cabin_1`, `business_class_001`
- **Usage**: Used to manage specific cabin configurations

## Query Parameters

### Aircraft List Page
- `page`: Current page number (default: 0)
- `size`: Items per page (default: 10)
- `search`: Search query string
- `status`: Filter by aircraft status
- `sortBy`: Sort field (default: 'code')
- `sortDirection`: Sort direction ('asc' or 'desc')

Example: `/airline/aircraft?page=1&size=25&search=boeing&status=ACTIVE&sortBy=model&sortDirection=asc`

## Protected Routes

All aircraft management routes are protected and require:
1. **Authentication**: User must be logged in
2. **Authorization**: User must have `ROLE_AIRLINE_ADMIN` role
3. **Airline Association**: User must be associated with an airline

## State Management Integration

### Redux State
Routes automatically connect to Redux state slices:
- `aircraft`: Aircraft data and operations
- `cabinClass`: Cabin configuration data
- `seat`: Seat configuration data

### Global State Access
Components have access to:
```javascript
const { aircrafts, loading, error } = useSelector(state => state.aircraft)
const { cabinClasses } = useSelector(state => state.cabinClass)
const { seats } = useSelector(state => state.seat)
```

## Error Handling

### 404 Not Found
- Invalid aircraft IDs redirect to aircraft list
- Invalid cabin IDs show error messages
- Proper error boundaries for component failures

### Access Control
- Unauthorized access redirects to login
- Insufficient permissions show access denied

## SEO and Metadata

### Page Titles
Routes automatically update page titles:
- `/airline/aircraft` → "Aircraft Management - Airline Dashboard"
- `/airline/aircraft/:id` → "{Aircraft Code} - Aircraft Details"

### Breadcrumbs
Implemented breadcrumb navigation:
```
Dashboard > Aircraft > [Aircraft Code] > [Action]
```

## Future Enhancements

### Planned Routes
1. `/airline/aircraft/:aircraftId/maintenance` - Maintenance scheduling
2. `/airline/aircraft/:aircraftId/history` - Aircraft history
3. `/airline/aircraft/:aircraftId/documents` - Aircraft documents
4. `/airline/aircraft/bulk-import` - Bulk aircraft import
5. `/airline/aircraft/reports` - Aircraft reports

### Additional Features
- Route-based permissions
- Dynamic route generation
- Advanced filtering URLs
- Export/import routes
- Mobile-specific routes

## Testing Routes

### Development
```bash
npm start
# Navigate to http://localhost:3000/airline/aircraft
```

### Testing URLs
- List: `http://localhost:3000/airline/aircraft`
- Detail: `http://localhost:3000/airline/aircraft/aircraft_1`
- Edit: `http://localhost:3000/airline/aircraft/aircraft_1/edit`

## Best Practices

1. **Consistent Naming**: Use kebab-case for URLs
2. **Resource-Oriented**: Routes follow RESTful conventions
3. **Hierarchical**: Nested resources reflect data relationships
4. **Descriptive**: Route names clearly indicate functionality
5. **Versioned**: Consider API versioning for future changes