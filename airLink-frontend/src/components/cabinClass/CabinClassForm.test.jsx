import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import CabinClassForm from './CabinClassForm';
import cabinClassReducer from '@/Redux/cabinClass/cabinClassSlice';
import aircraftReducer from '@/Redux/aircraft/aircraftSlice';

// Mock Redux store for testing
const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      cabinClass: cabinClassReducer,
      aircraft: aircraftReducer,
    },
    preloadedState: {
      cabinClass: {
        cabinClasses: [],
        cabinClass: null,
        loading: false,
        error: null,
        ...initialState.cabinClass,
      },
      aircraft: {
        aircrafts: [
          { id: 1, code: 'TEST-001', model: 'Boeing 737', manufacturer: 'Boeing' },
          { id: 2, code: 'TEST-002', model: 'Airbus A320', manufacturer: 'Airbus' },
        ],
        ...initialState.aircraft,
      },
    },
  });
};

// Mock functions
const mockOnSuccess = jest.fn();
const mockOnCancel = jest.fn();

// Helper function to render component with store
const renderWithStore = (store, props = {}) => {
  return render(
    <Provider store={store}>
      <CabinClassForm
        onSuccess={mockOnSuccess}
        onCancel={mockOnCancel}
        {...props}
      />
    </Provider>
  );
};

describe('CabinClassForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Create Mode', () => {
    test('renders create form correctly', () => {
      const store = createMockStore();
      renderWithStore(store, { isEdit: false, aircraftId: 1 });

      expect(screen.getByText('Create New Cabin Class')).toBeInTheDocument();
      expect(screen.getByText('Add a new cabin class to your aircraft configuration')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /create cabin class/i })).toBeInTheDocument();
    });

    test('validates required fields', async () => {
      const store = createMockStore();
      renderWithStore(store, { isEdit: false, aircraftId: 1 });

      // Try to submit empty form
      const submitButton = screen.getByRole('button', { name: /create cabin class/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Name is required')).toBeInTheDocument();
        expect(screen.getByText('Code is required')).toBeInTheDocument();
      });
    });

    test('validates code format', async () => {
      const store = createMockStore();
      renderWithStore(store, { isEdit: false, aircraftId: 1 });

      const codeInput = screen.getByLabelText(/cabin code/i);
      fireEvent.change(codeInput, { target: { value: 'invalid' } });
      fireEvent.blur(codeInput);

      await waitFor(() => {
        expect(screen.getByText('Code must be 1-2 uppercase letters or numbers')).toBeInTheDocument();
      });
    });

    test('fills form with valid data', async () => {
      const store = createMockStore();
      renderWithStore(store, { isEdit: false, aircraftId: 1 });

      // Fill form with valid data
      fireEvent.change(screen.getByLabelText(/cabin class name/i), {
        target: { value: 'Business Class' }
      });
      fireEvent.change(screen.getByLabelText(/cabin code/i), {
        target: { value: 'B' }
      });
      fireEvent.change(screen.getByLabelText(/description/i), {
        target: { value: 'Premium business class with lie-flat seats' }
      });

      // Verify values are set
      expect(screen.getByDisplayValue('Business Class')).toBeInTheDocument();
      expect(screen.getByDisplayValue('B')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Premium business class with lie-flat seats')).toBeInTheDocument();
    });
  });

  describe('Edit Mode', () => {
    test('renders edit form correctly', () => {
      const store = createMockStore({
        cabinClass: {
          cabinClass: {
            id: 'cabin_1',
            name: 'Business Class',
            code: 'B',
            description: 'Premium cabin',
            aircraftId: 1,
          },
        },
      });

      renderWithStore(store, {
        isEdit: true,
        cabinClassId: 'cabin_1',
        aircraftId: 1,
      });

      expect(screen.getByText('Edit Cabin Class')).toBeInTheDocument();
      expect(screen.getByText('Update cabin class configuration and settings')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /update cabin class/i })).toBeInTheDocument();
    });
  });

  describe('Form Sections', () => {
    test('renders all form sections', () => {
      const store = createMockStore();
      renderWithStore(store, { isEdit: false, aircraftId: 1 });

      expect(screen.getByText('Basic Information')).toBeInTheDocument();
      expect(screen.getByText('Seat Configuration')).toBeInTheDocument();
      expect(screen.getByText('Status & Availability')).toBeInTheDocument();
      expect(screen.getByText('Premium Features & Amenities')).toBeInTheDocument();
    });

    test('renders all premium features switches', () => {
      const store = createMockStore();
      renderWithStore(store, { isEdit: false, aircraftId: 1 });

      const expectedFeatures = [
        'Priority Boarding',
        'Lounge Access',
        'Extra Legroom',
        'Preferred Seating',
        'Meal Service',
        'WiFi Access',
        'Power Outlet',
        'Entertainment',
      ];

      expectedFeatures.forEach((feature) => {
        expect(screen.getByText(feature)).toBeInTheDocument();
      });
    });
  });

  describe('Form Interactions', () => {
    test('handles cancel button click', () => {
      const store = createMockStore();
      renderWithStore(store, { isEdit: false, aircraftId: 1 });

      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      fireEvent.click(cancelButton);

      expect(mockOnCancel).toHaveBeenCalledTimes(1);
    });

    test('toggles switches correctly', () => {
      const store = createMockStore();
      renderWithStore(store, { isEdit: false, aircraftId: 1 });

      const activeSwitch = screen.getByRole('switch', { name: /active status/i });
      const bookableSwitch = screen.getByRole('switch', { name: /bookable/i });

      // Initially should be checked (default true)
      expect(activeSwitch).toBeChecked();
      expect(bookableSwitch).toBeChecked();

      // Click to toggle
      fireEvent.click(activeSwitch);
      fireEvent.click(bookableSwitch);

      expect(activeSwitch).not.toBeChecked();
      expect(bookableSwitch).not.toBeChecked();
    });

    test('validates seat dimensions', async () => {
      const store = createMockStore();
      renderWithStore(store, { isEdit: false, aircraftId: 1 });

      const pitchInput = screen.getByLabelText(/seat pitch/i);
      const widthInput = screen.getByLabelText(/seat width/i);

      // Test invalid values
      fireEvent.change(pitchInput, { target: { value: '20' } }); // Too small
      fireEvent.change(widthInput, { target: { value: '10' } }); // Too small
      fireEvent.blur(pitchInput);
      fireEvent.blur(widthInput);

      await waitFor(() => {
        expect(screen.getByText('Seat pitch must be at least 28 inches')).toBeInTheDocument();
        expect(screen.getByText('Seat width must be at least 16 inches')).toBeInTheDocument();
      });
    });
  });

  describe('Character Counter', () => {
    test('shows character count for description', () => {
      const store = createMockStore();
      renderWithStore(store, { isEdit: false, aircraftId: 1 });

      const description = 'Test description';
      const descriptionInput = screen.getByLabelText(/description/i);
      fireEvent.change(descriptionInput, { target: { value: description } });

      expect(screen.getByText(`${description.length}/500 characters`)).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    test('displays error message when present', () => {
      const store = createMockStore({
        cabinClass: {
          error: 'Failed to create cabin class',
        },
      });

      renderWithStore(store, { isEdit: false, aircraftId: 1 });

      expect(screen.getByText('Error')).toBeInTheDocument();
      expect(screen.getByText('Failed to create cabin class')).toBeInTheDocument();
    });
  });

  describe('Loading States', () => {
    test('disables form when loading', () => {
      const store = createMockStore({
        cabinClass: {
          loading: true,
        },
      });

      renderWithStore(store, { isEdit: false, aircraftId: 1 });

      const submitButton = screen.getByRole('button', { name: /creating.../i });
      expect(submitButton).toBeDisabled();
    });
  });
});

// Integration test helpers
export const mockCabinClassData = {
  name: 'Business Class',
  code: 'B',
  description: 'Premium business class with lie-flat seats',
  aircraftId: 1,
  displayOrder: 1,
  isActive: true,
  isBookable: true,
  typicalSeatPitch: 42,
  typicalSeatWidth: 21,
  seatType: 'LIE_FLAT',
  hasPriorityBoarding: true,
  hasLoungeAccess: true,
  hasExtraLegroom: true,
  hasPreferredSeating: true,
  hasMealService: true,
  hasWifiAccess: true,
  hasPowerOutlet: true,
  hasEntertainment: true,
};

export { createMockStore, renderWithStore };