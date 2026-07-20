# Airline Onboarding Wizard - UI Wireframe Implementation

## Overview

This is a comprehensive multi-step onboarding wizard for airlines registering with the Global Distribution System (GDS). The implementation features JWT-based persistence, form validation, and a polished user experience built with React, shadcn/ui, and Tailwind CSS.

## Features

### ✅ Multi-Step Wizard Flow
- **Step 1**: Owner Details (User Account Creation)
- **Step 2**: Airline Details (Company Information)
- **Step 3**: Support & Contact Information
- **Step 4**: Review & Confirmation
- **Success Screen**: Welcome & Dashboard Redirect

### ✅ JWT-Based Persistence
- Progress automatically saved to localStorage
- Survives page refreshes
- Secure token-based authentication
- Auto-resume from last completed step

### ✅ Form Validation
- Real-time validation with Formik + Yup
- Inline error messages
- Format validation (email, phone, IATA/ICAO codes)
- Password strength requirements
- Duplicate email detection

### ✅ Professional UI/UX
- Responsive design (mobile-first)
- Gradient backgrounds with animations
- Progress stepper with visual indicators
- Smooth transitions and hover effects
- Loading states and error handling
- shadcn/ui components for consistency

## Component Architecture

### Main Components

#### `AirlineOnboardingWizard.jsx`
Main wizard controller that manages:
- Step navigation
- Form data persistence
- JWT token handling
- Progress tracking

#### `Stepper.jsx`
Custom stepper component with:
- Visual progress indicators
- Step completion states
- Responsive design
- Accessibility features

### Step Components

#### `OwnerDetailsStep.jsx`
- User account creation form
- JWT token management
- API integration for registration
- Password validation
- Email uniqueness check

#### `AirlineDetailsStep.jsx`
- IATA/ICAO code validation
- Country selection
- Logo upload functionality
- Status and alliance configuration
- Website validation

#### `SupportContactStep.jsx`
- Optional contact information
- Support hours configuration
- Pre-filled examples
- Textarea for additional notes

#### `ReviewConfirmationStep.jsx`
- Complete data review
- Editable sections
- Terms & conditions
- Final submission
- Error handling

#### `SuccessScreen.jsx`
- Success confirmation
- Airline logo display
- Next steps guidance
- Dashboard redirect

## API Integration

### Authentication Endpoints
```javascript
POST /api/auth/register
GET /api/user/profile
```

### Airline Registration
```javascript
POST /api/airlines
```

### Data Persistence
- Form data saved to localStorage as `airline_onboarding_progress`
- JWT token stored as `jwt`
- Progress includes current step and form data

## Validation Schema

### Step 1 - Owner Details
- **Full Name**: Required, min 2 characters
- **Email**: Required, valid email format, unique
- **Phone**: Required, phone format validation
- **Password**: Required, min 8 chars, uppercase, lowercase, number
- **Confirm Password**: Required, must match

### Step 2 - Airline Details
- **IATA Code**: Required, exactly 2 uppercase letters
- **ICAO Code**: Required, exactly 3 uppercase letters
- **Airline Name**: Required, min 2 characters
- **Country**: Required
- **Headquarters City**: Required
- **Website**: Optional, valid URL format
- **Logo URL**: Optional, valid URL format

### Step 3 - Support & Contact
- All fields optional
- **Support Email**: Valid email format if provided
- **Support Phone**: Phone format validation if provided

## Routing

### New Routes Added
```javascript
/airline-onboarding - Main wizard entry point
```

### Existing Routes
```javascript
/onboarding - Original onboarding page (maintained)
/login - Login page
/register - Registration page
/airline - Airline dashboard (redirect target)
```

## File Structure

```
src/pages/onboarding/
├── AirlineOnboardingWizard.jsx    # Main wizard component
├── README.md                      # This documentation
└── steps/
    ├── index.js                   # Clean exports
    ├── OwnerDetailsStep.jsx       # Step 1: Account creation
    ├── AirlineDetailsStep.jsx     # Step 2: Airline info
    ├── SupportContactStep.jsx     # Step 3: Contact info
    ├── ReviewConfirmationStep.jsx # Step 4: Review & submit
    └── SuccessScreen.jsx          # Success & redirect

src/components/ui/
└── stepper.jsx                    # Custom stepper component
```

## Dependencies Used

### Core Dependencies
- React 19.1.1
- React Router DOM 7.8.1
- Formik 2.4.6
- Yup 1.7.0
- Axios 1.12.2

### UI Components
- @radix-ui/* components
- Tailwind CSS 4.1.12
- Lucide React 0.539.0
- class-variance-authority 0.7.1

## Usage

### Starting the Wizard
Navigate to `/airline-onboarding` to begin the registration process.

### Development
```bash
npm run dev
```

### Testing
The wizard handles various scenarios:
- Page refresh during onboarding
- Network errors during submission
- Invalid form data
- Existing user sessions

## Security Features

- JWT token validation
- Session persistence
- Form data encryption in localStorage
- CSRF protection ready
- Input sanitization
- XSS prevention

## Accessibility

- Keyboard navigation
- ARIA labels
- Screen reader support
- Focus management
- Color contrast compliance
- Responsive design

## Performance

- Component lazy loading ready
- Form validation debouncing
- Image optimization
- Minimal re-renders
- Efficient state management

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Future Enhancements

### Potential Improvements
- [ ] Multi-language support
- [ ] Dark mode theme
- [ ] File upload progress bars
- [ ] Advanced IATA/ICAO validation via API
- [ ] Real-time city search
- [ ] Webhook integration for notifications
- [ ] Analytics tracking
- [ ] A/B testing framework

### Technical Debt
- [ ] Add comprehensive unit tests
- [ ] Add integration tests
- [ ] Add Storybook stories
- [ ] Performance monitoring
- [ ] Error boundary implementation

---

**Note**: This wireframe implementation provides a production-ready foundation for airline onboarding with modern UX patterns and robust error handling.