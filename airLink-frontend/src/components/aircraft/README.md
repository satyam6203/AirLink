# Aircraft Management Components

This directory contains production-ready React components for managing aircraft, cabin classes, and seat configurations in an airline admin dashboard.

## Components Overview

### 1. AircraftTable
**Location**: `./AircraftTable.jsx`

A comprehensive data table for displaying and managing aircraft fleet information.

**Features**:
- Search functionality (code, model, manufacturer)
- Status filtering (Active, Maintenance, Inactive, Retired)
- Sortable columns
- Pagination with configurable page sizes
- Responsive design
- Action buttons (View, Edit, Delete)

**Props**:
```jsx
{
  onViewDetails: (aircraft) => void,
  onEdit: (aircraft) => void,
  onDelete: (aircraft) => void
}
```

### 2. AircraftHeader
**Location**: `./AircraftHeader.jsx`

Displays comprehensive aircraft information in a structured header layout.

**Features**:
- Aircraft metadata display
- Status badges
- Performance metrics
- Seating capacity breakdown
- Important dates
- Current location and availability

**Props**:
```jsx
{
  aircraft: Object,
  onEdit: () => void
}
```

### 3. CabinCard
**Location**: `./CabinCard.jsx`

Card component for displaying cabin class information with management actions.

**Features**:
- Cabin class information
- Seat count and configuration
- Amenities display with icons
- Status indicators
- Action buttons (View Seatmap, Edit)

**Props**:
```jsx
{
  cabin: Object,
  onViewSeatmap: (cabin) => void,
  onEdit: (cabin) => void
}
```

### 4. SeatMapGrid
**Location**: `./SeatMapGrid.jsx`

Interactive seat map visualization with comprehensive controls.

**Features**:
- Dynamic seat layout generation
- Interactive seat selection
- Zoom controls (60% - 200%)
- Color-coded seat status
- Aisle visualization
- Legend and controls
- Row/seat label toggles

**Props**:
```jsx
{
  cabin: Object,
  seats: Array,
  onSeatClick: (seat) => void,
  selectedSeat: Object,
  className: String
}
```

### 5. SeatConfigDrawer
**Location**: `./SeatConfigDrawer.jsx`

Comprehensive seat configuration interface in a slide-out drawer.

**Features**:
- Complete seat attribute editing
- Amenity management with quick-add buttons
- Physical dimension controls
- Status and availability toggles
- Special features management
- Form validation
- Auto-save functionality

**Props**:
```jsx
{
  isOpen: Boolean,
  onClose: () => void,
  seat: Object,
  onSave: (seatData) => void
}
```

## Supporting Components

### Common Components
- **Loader**: Loading states with customizable messages
- **EmptyState**: Empty state displays with actions
- **Table**: Reusable table components with sorting

### UI Components
- **Drawer**: Slide-out panel component
- **Card**: Container components
- **Button**: Interactive buttons
- **Badge**: Status indicators
- **Input/Select**: Form controls

## Data Models

### Aircraft Object
```javascript
{
  id: String,
  code: String,
  model: String,
  manufacturer: String,
  yearOfManufacture: Number,
  registrationNumber: String,
  registrationDate: String,
  seatingCapacity: Number,
  economySeats: Number,
  premiumEconomySeats: Number,
  businessSeats: Number,
  firstClassSeats: Number,
  rangeKm: Number,
  cruisingSpeedKmh: Number,
  maxAltitudeFt: Number,
  status: String, // 'ACTIVE', 'MAINTENANCE', 'INACTIVE', 'RETIRED'
  isAvailable: Boolean,
  currentLocation: String,
  nextMaintenanceDate: String,
  configuration: String,
  createdAt: String,
  updatedAt: String
}
```

### Cabin Object
```javascript
{
  id: String,
  aircraftId: String,
  name: String,
  cabinClass: String, // 'FIRST', 'BUSINESS', 'PREMIUM_ECONOMY', 'ECONOMY'
  startRow: Number,
  endRow: Number,
  seatCount: Number,
  seatsPerRow: Number,
  seatConfiguration: String, // '2-2', '3-3', etc.
  seatPitch: Number,
  seatWidth: Number,
  status: String,
  isBookable: Boolean,
  isActive: Boolean,
  amenities: Array[String]
}
```

### Seat Object
```javascript
{
  id: String,
  seatNumber: String,
  row: Number,
  column: String,
  seatType: String, // 'WINDOW', 'AISLE', 'MIDDLE'
  status: String, // 'AVAILABLE', 'BLOCKED', 'EXTRA_LEGROOM', 'MAINTENANCE'
  isAvailable: Boolean,
  seatClass: String,
  seatPitch: Number,
  seatWidth: Number,
  hasRecline: Boolean,
  reclineAngle: Number,
  amenities: Array[String],
  specialFeatures: Array[String],
  cabinClassId: String,
  aircraftId: String,
  notes: String
}
```

## Redux Integration

### State Slices
- **aircraft**: Aircraft management state
- **cabinClass**: Cabin class management state
- **seat**: Seat management state

### Key Actions
- `listAllAircrafts()`: Fetch paginated aircraft list
- `getAircraftById(id)`: Fetch specific aircraft
- `getCabinClassesByAircraft(aircraftId)`: Fetch cabin configuration
- `updateSeat(seatData)`: Update seat configuration

## Usage Examples

### Basic Aircraft List
```jsx
import { AircraftTable } from '@/components/aircraft';

function AircraftManagement() {
  const navigate = useNavigate();

  return (
    <AircraftTable
      onViewDetails={(aircraft) => navigate(`/aircraft/${aircraft.id}`)}
      onEdit={(aircraft) => navigate(`/aircraft/${aircraft.id}/edit`)}
      onDelete={(aircraft) => handleDelete(aircraft)}
    />
  );
}
```

### Aircraft Detail Page
```jsx
import { AircraftHeader, CabinCard, SeatMapGrid } from '@/components/aircraft';

function AircraftDetail({ aircraftId }) {
  const [selectedCabin, setSelectedCabin] = useState(null);
  const [selectedSeat, setSelectedSeat] = useState(null);

  return (
    <div>
      <AircraftHeader aircraft={aircraft} onEdit={handleEdit} />

      <div className="grid grid-cols-3 gap-6">
        {cabins.map(cabin => (
          <CabinCard
            key={cabin.id}
            cabin={cabin}
            onViewSeatmap={setSelectedCabin}
            onEdit={handleEditCabin}
          />
        ))}
      </div>

      {selectedCabin && (
        <SeatMapGrid
          cabin={selectedCabin}
          seats={seats}
          onSeatClick={setSelectedSeat}
          selectedSeat={selectedSeat}
        />
      )}
    </div>
  );
}
```

### Seat Configuration
```jsx
import { SeatConfigDrawer } from '@/components/aircraft';

function SeatManagement() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedSeat, setSelectedSeat] = useState(null);

  const handleSeatSave = async (seatData) => {
    await dispatch(updateSeat(seatData));
    setDrawerOpen(false);
  };

  return (
    <SeatConfigDrawer
      isOpen={drawerOpen}
      onClose={() => setDrawerOpen(false)}
      seat={selectedSeat}
      onSave={handleSeatSave}
    />
  );
}
```

## Styling & Theming

All components use Tailwind CSS classes and follow the existing design system:

- **Colors**: Blue for primary actions, green for success states, red for errors
- **Spacing**: Consistent padding and margins using Tailwind spacing scale
- **Typography**: Font weights and sizes following design hierarchy
- **Responsive**: Mobile-first responsive design with breakpoints

## Accessibility

Components include:
- Proper ARIA labels and roles
- Keyboard navigation support
- Screen reader compatible
- High contrast color combinations
- Focus management
- Loading state announcements

## Performance Considerations

- **Memoization**: Components use React.memo and useMemo for expensive operations
- **Pagination**: Large datasets are paginated to prevent performance issues
- **Virtualization**: Seat maps handle large layouts efficiently
- **Lazy Loading**: Components can be code-split using React.lazy

## Testing

Mock data is available in `/src/data/mockAircraftData.js` for testing:

```jsx
import { mockAircraft, mockCabins, mockSeats } from '@/data/mockAircraftData';
```

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+