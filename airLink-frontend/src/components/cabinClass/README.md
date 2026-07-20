# Cabin Class Form Component

A comprehensive, reusable form component for creating and editing cabin class configurations in the airline management system.

## Overview

The `CabinClassForm` component provides a complete interface for managing cabin class data with full validation, error handling, and integration with the Redux store. It supports both create and edit modes with a single, flexible component.

## Features

### ✅ Complete Form Management
- **Create Mode**: Add new cabin classes to aircraft
- **Edit Mode**: Update existing cabin class configurations
- **Auto-loading**: Automatically fetches data for edit mode
- **Form Validation**: Comprehensive Yup validation schema
- **Error Handling**: Field-level and form-level error display

### ✅ Rich User Interface
- **Responsive Design**: Mobile-first, adaptive layouts
- **Modern UI**: Shadcn/UI components with Tailwind CSS
- **Interactive Elements**: Switches, selects, and smart inputs
- **Visual Feedback**: Loading states, validation indicators
- **Accessibility**: ARIA labels, keyboard navigation

### ✅ Advanced Features
- **Premium Amenities**: Configurable cabin features and services
- **Seat Configuration**: Detailed seat specifications
- **Status Management**: Active/inactive and bookable flags
- **Character Counters**: Real-time input feedback
- **Smart Validation**: Context-aware validation rules

## Installation & Dependencies

### Required Packages
```bash
npm install formik yup
```

### Dependencies
- `formik`: Form state management
- `yup`: Schema validation
- `@reduxjs/toolkit`: State management
- `react-redux`: Redux React bindings
- `react-router-dom`: Navigation
- `lucide-react`: Icons

## Usage

### Basic Create Form
```jsx
import CabinClassForm from '@/components/cabinClass/CabinClassForm';

function CreateCabinClass() {
  const handleSuccess = (cabinClass) => {
    console.log('Created:', cabinClass);
    // Handle success (navigate, show notification, etc.)
  };

  const handleCancel = () => {
    // Handle cancel action
  };

  return (
    <CabinClassForm
      isEdit={false}
      aircraftId={123}
      onSuccess={handleSuccess}
      onCancel={handleCancel}
    />
  );
}
```

### Basic Edit Form
```jsx
import CabinClassForm from '@/components/cabinClass/CabinClassForm';

function EditCabinClass() {
  const handleSuccess = (cabinClass) => {
    console.log('Updated:', cabinClass);
    // Handle success
  };

  return (
    <CabinClassForm
      isEdit={true}
      cabinClassId="cabin_123"
      aircraftId={123}
      onSuccess={handleSuccess}
      onCancel={() => navigate('/back')}
    />
  );
}
```

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `isEdit` | `boolean` | No | `false` | Whether this is an edit form or create form |
| `cabinClassId` | `string` | Conditional* | `null` | ID of cabin class to edit (required when `isEdit=true`) |
| `aircraftId` | `number` | No | `null` | ID of the aircraft this cabin belongs to |
| `onSuccess` | `function` | No | `undefined` | Callback called when form submission succeeds |
| `onCancel` | `function` | No | `undefined` | Callback called when user cancels the form |
| `className` | `string` | No | `''` | Additional CSS classes for the container |

*Required when `isEdit={true}`

## Data Structure

### Input Data (CabinClassRequest)
```javascript
{
  name: "Business Class",              // Required, 2-50 chars
  code: "B",                          // Required, 1-2 uppercase chars
  description: "Premium cabin...",     // Optional, max 500 chars
  aircraftId: 123,                    // Required, positive number
  displayOrder: 1,                    // Optional, 0-100
  isActive: true,                     // Boolean, default true
  isBookable: true,                   // Boolean, default true
  typicalSeatPitch: 42,               // Number, 28-84 inches
  typicalSeatWidth: 21.0,             // Number, 16-26 inches
  seatType: "LIE_FLAT",               // Enum: STANDARD, RECLINER, ANGLE_FLAT, LIE_FLAT
  hasPriorityBoarding: true,          // Boolean, default false
  hasLoungeAccess: true,              // Boolean, default false
  hasExtraLegroom: true,              // Boolean, default false
  hasPreferredSeating: true,          // Boolean, default false
  hasMealService: true,               // Boolean, default false
  hasWifiAccess: true,                // Boolean, default false
  hasPowerOutlet: true,               // Boolean, default false
  hasEntertainment: true              // Boolean, default false
}
```

### Response Data
The form returns the complete cabin class object as stored in the database, including:
- Auto-generated `id`
- Timestamps (`createdAt`, `updatedAt`)
- Related aircraft information
- Computed fields

## Validation Rules

### Field Validations
- **Name**: Required, 2-50 characters
- **Code**: Required, 1-2 uppercase letters/numbers, unique per aircraft
- **Description**: Optional, max 500 characters
- **Aircraft**: Required selection from available aircraft
- **Display Order**: Optional, 0-100
- **Seat Pitch**: Optional, 28-84 inches
- **Seat Width**: Optional, 16-26 inches
- **Seat Type**: Must be valid enum value

### Business Rules
- Cabin codes must be unique within an aircraft
- Display order determines cabin class hierarchy
- Seat dimensions must be realistic for commercial aircraft
- Status flags control booking and operational availability

## Form Sections

### 1. Basic Information
- Cabin class name and code
- Description and aircraft selection
- Display order configuration

### 2. Seat Configuration
- Typical seat pitch and width
- Seat type selection with visual badges
- Dimensional constraints and validation

### 3. Status & Availability
- Active status toggle
- Bookable status toggle
- Visual indicators for current state

### 4. Premium Features & Amenities
- 8 configurable premium features
- Toggle switches with descriptions
- Feature categories: boarding, lounge, seating, services

## Redux Integration

### Actions Dispatched
- `createCabinClass(data)`: Create new cabin class
- `updateCabinClass({id, data})`: Update existing cabin class
- `getCabinClassById(id)`: Fetch cabin class for editing
- `clearCabinClassError()`: Clear form errors

### State Dependencies
```javascript
// Required state slices
const { loading, error, cabinClass } = useSelector(state => state.cabinClass);
const { aircrafts } = useSelector(state => state.aircraft);
```

### Error Handling
- Automatic error display from Redux state
- Field-specific error mapping
- User-friendly error messages
- Retry mechanisms for network failures

## Styling & Theming

### Design System
- **Framework**: Tailwind CSS
- **Components**: Shadcn/UI
- **Icons**: Lucide React
- **Typography**: Consistent heading hierarchy
- **Colors**: Semantic color palette

### Responsive Breakpoints
- **Mobile**: Single column, stacked layout
- **Tablet**: Two-column grid for most sections
- **Desktop**: Multi-column layouts, optimal spacing

### Accessibility Features
- ARIA labels and descriptions
- Keyboard navigation support
- Screen reader compatible
- High contrast mode support
- Focus management and indicators

## Routes & Navigation

### Standard Routes
```javascript
// Create new cabin class
/airline/aircraft/:aircraftId/cabin/new

// Edit existing cabin class
/airline/aircraft/:aircraftId/cabin/:cabinId/edit
```

### Page Components
- `CabinClassCreate`: Wrapper for create mode
- `CabinClassEdit`: Wrapper for edit mode
- Both include navigation breadcrumbs and back buttons

## Testing

### Test Coverage
- Component rendering in both modes
- Form validation and error handling
- User interactions and state changes
- Redux integration and async operations
- Accessibility and keyboard navigation

### Mock Data
```javascript
import { mockCabinClassData, createMockStore } from './CabinClassForm.test.jsx';

// Use in tests or development
const testData = mockCabinClassData;
```

## Best Practices

### Form Usage
1. **Always provide callbacks**: Handle success and cancel events
2. **Validate aircraft ID**: Ensure valid aircraft selection
3. **Handle loading states**: Show appropriate feedback during operations
4. **Error recovery**: Provide clear error messages and retry options

### Performance
1. **Memoization**: Form uses React.memo for performance
2. **Lazy loading**: Component can be code-split
3. **Optimistic updates**: Consider implementing for better UX
4. **Debounced validation**: Reduces unnecessary validation calls

### Accessibility
1. **Form labels**: Always use proper labels for inputs
2. **Error announcement**: Screen readers announce validation errors
3. **Keyboard support**: All interactions work with keyboard only
4. **Focus management**: Logical focus order throughout form

## Troubleshooting

### Common Issues

**Form not submitting**
- Check network connectivity
- Verify Redux store configuration
- Ensure required props are provided

**Validation errors**
- Review validation schema
- Check input format requirements
- Verify unique constraints (cabin codes)

**Loading states**
- Verify Redux loading states
- Check async thunk implementations
- Monitor network requests in DevTools

**Data not loading in edit mode**
- Ensure `cabinClassId` is provided
- Check Redux state for cabin class data
- Verify API endpoint accessibility

### Debug Mode
Enable debug logging by setting:
```javascript
window.DEBUG_CABIN_FORM = true;
```

## Future Enhancements

### Planned Features
- Bulk cabin class import/export
- Template-based cabin creation
- Advanced amenity categories
- Seat map preview integration
- Multi-language support

### Performance Optimizations
- Virtual scrolling for large aircraft lists
- Incremental form validation
- Offline form editing capability
- Progressive form loading