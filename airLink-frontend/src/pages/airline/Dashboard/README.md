# Airline Management Dashboard

This directory contains comprehensive airline management components built with React, TailwindCSS, and shadcn/ui, designed to work with your backend DTOs.

## Components

### 1. AirlineProfile.jsx
A comprehensive profile view component that displays all airline information based on your `AirlineResponse` DTO.

**Features:**
- Complete airline information display
- Status badges with visual indicators
- Contact information section
- Business details and system information
- Quick action buttons
- Responsive design

**Props:**
- `onEdit`: Function to handle edit action
- `isEditing`: Boolean to control edit mode

### 2. AirlineUpdateForm.jsx
A comprehensive form component for creating and updating airline information based on your `AirlineRequest` DTO.

**Features:**
- Real-time form validation
- IATA/ICAO code validation (exactly 2/3 characters, uppercase)
- Email and URL validation
- Status and alliance dropdowns
- Support information fields
- Error handling and user feedback
- Create and edit modes

**Props:**
- `airlineData`: Existing airline data for editing (optional)
- `onSave`: Function to handle form submission
- `onCancel`: Function to handle form cancellation
- `isEditMode`: Boolean to distinguish between create and edit modes

### 3. AirlineManagement.jsx
Main management component that integrates profile and form components.

**Features:**
- Airline listing with search functionality
- Create new airline functionality
- Edit existing airline functionality
- Profile view integration
- State management for all operations

### 4. AirlineManagementDemo.jsx
Demo component showcasing all airline management features.

**Features:**
- Interactive demo of all components
- DTO integration information
- Feature showcase
- Sample data display

## DTO Integration

### AirlineRequest DTO Support
- ✅ `iataCode` (2 characters, required)
- ✅ `icaoCode` (3 characters, required)
- ✅ `name` (required)
- ✅ `alias` (optional)
- ✅ `country` (required)
- ✅ `logoUrl` (optional, with URL validation)
- ✅ `website` (optional, with URL validation)
- ✅ `status` (AirlineStatus enum)
- ✅ `alliance` (optional)
- ✅ `baggagePolicyId` (optional, numeric)
- ✅ `headquartersCityId` (optional, numeric)
- ✅ `supportEmail` (optional, with email validation)
- ✅ `supportPhone` (optional, with phone validation)
- ✅ `supportHours` (optional)

### AirlineResponse DTO Support
- ✅ All request fields included
- ✅ `id` (displayed in profile)
- ✅ `headquartersCityName` (displayed in profile)
- ✅ `createdAt` and `updatedAt` (formatted timestamps)
- ✅ `ownerId` and `updatedById` (displayed in profile)

## Validation Rules

### IATA Code
- Required
- Exactly 2 characters
- Uppercase letters only
- Pattern: `^[A-Z]{2}$`

### ICAO Code
- Required
- Exactly 3 characters
- Uppercase letters only
- Pattern: `^[A-Z]{3}$`

### Airline Name
- Required
- Minimum 2 characters
- Maximum 100 characters

### Website
- Optional
- Must be valid URL starting with http:// or https://
- Pattern: `^https?:\/\/.+`

### Logo URL
- Optional
- Must be valid image URL
- Pattern: `^https?:\/\/.+\.(png|jpg|jpeg|gif|svg)$`

### Support Email
- Optional
- Must be valid email format
- Pattern: `^[^\s@]+@[^\s@]+\.[^\s@]+$`

### Support Phone
- Optional
- Must be valid phone number
- Pattern: `^[\+]?[0-9\s\-\(\)]{10,}$`

## Status Management

### AirlineStatus Enum
- `ACTIVE`: Green badge with checkmark
- `INACTIVE`: Red badge with alert icon
- `PENDING`: Yellow badge with clock icon
- `SUSPENDED`: Gray badge with shield icon

## Usage

### Basic Usage
```jsx
import AirlineProfile from './AirlineProfile'
import AirlineUpdateForm from './AirlineUpdateForm'
import AirlineManagement from './AirlineManagement'

// Profile view
<AirlineProfile onEdit={handleEdit} />

// Create form
<AirlineUpdateForm 
  onSave={handleSave}
  onCancel={handleCancel}
  isEditMode={false}
/>

// Edit form
<AirlineUpdateForm 
  airlineData={existingData}
  onSave={handleSave}
  onCancel={handleCancel}
  isEditMode={true}
/>

// Management component
<AirlineManagement activeSection="airlines-profile" />
```

### Integration with Backend
The components are designed to work seamlessly with your backend DTOs. Simply implement the `onSave` function to make API calls to your backend endpoints.

## Styling
- Built with TailwindCSS
- Uses shadcn/ui components
- Responsive design
- Dark/light theme support
- Modern, professional UI

## Dependencies
- React
- TailwindCSS
- shadcn/ui components
- Lucide React icons
- Custom validation utilities

