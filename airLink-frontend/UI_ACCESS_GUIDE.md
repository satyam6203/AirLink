# Ancillary UI Access Guide

## 🎯 All Ancillary UI Locations & Access Paths

---

## 1. 📦 Master Ancillaries (Catalog Management)

### Purpose
Manage your airline's ancillary service catalog (baggage, meals, seats, WiFi, etc.)

### File Location
```
src/pages/airline/Dashboard/Ancillaries/
├── AncillaryList.jsx
└── AncillaryForm.jsx
```

### Access Paths

#### Via Sidebar Navigation
```
📦 Ancillaries
  ├── Ancillary Catalog  → /airline/ancillaries
  └── Create Ancillary   → /airline/ancillaries/create
```

#### Direct URLs
- **List View:** `http://localhost:5173/airline/ancillaries`
- **Create:** `http://localhost:5173/airline/ancillaries/create`
- **Edit:** `http://localhost:5173/airline/ancillaries/edit/{id}`

### Features
- ✅ Grid view with search & filters
- ✅ Filter by category (Trip Protection, Baggage, Meals, etc.)
- ✅ Filter by level (Flight/Cabin)
- ✅ Visual category badges
- ✅ RFISC code display
- ✅ Create/Edit/Delete operations

---

## 2. ✈️ Flight Instance Ancillaries (Flight-Level)

### Purpose
Add ancillaries to specific flight instances (applies to all cabins)

### File Location
```
src/pages/airline/Dashboard/FlightInstanceAncillaries/
└── FlightInstanceAncillaryForm.jsx
```

### Access Paths

#### Via Sidebar Navigation
```
📅 Flight Instances
  └── Ancillary Services → /airline/instances/ancillaries
```

#### Direct URLs
- **Add to Flight:** `http://localhost:5173/airline/instances/ancillaries`

### Features
- ✅ Bulk add multiple ancillaries
- ✅ Flight-level pricing (same for all cabins)
- ✅ Select from master catalog
- ✅ Set availability & max quantity

---

## 3. 🪑 Cabin Ancillaries (Cabin-Specific Pricing)

### Purpose
Configure cabin-specific ancillary pricing and availability
(e.g., WiFi free in Business, $10 in Economy)

### File Location
```
src/pages/airline/Dashboard/FlightInstanceCabinAncillaries/
├── FlightInstanceCabinAncillaryList.jsx
└── FlightInstanceCabinAncillaryForm.jsx
```

### Access Paths

#### Via Flight Instance Detail
```
1. Go to Flight Instances → /airline/instances
2. Click on a specific instance
3. Navigate to cabin details
4. Access cabin ancillaries
```

#### Direct URLs
- **List View:** `http://localhost:5173/airline/flight-instance-cabins/{cabinId}/ancillaries`
- **Create:** `http://localhost:5173/airline/flight-instance-cabins/{cabinId}/ancillaries/create`

### Features
- ✅ Grouped by category (Trip Protection, Meals, etc.)
- ✅ Shows only CABIN-level ancillaries
- ✅ "Included in Fare" toggle
- ✅ Cabin-specific pricing
- ✅ Availability status indicators
- ✅ Max quantity per passenger

---

## 4. 🛒 Traveler Checkout (Booking Flow)

### Purpose
MakeMyTrip-style ancillary selection during booking

### File Location
```
src/components/Ancillary/
├── AncillaryCheckout.jsx
└── AncillaryCategorySection.jsx
```

### Access Paths

#### Via Booking Flow
```
1. Select flight
2. Enter passenger details
3. Ancillary checkout page
```

#### Direct URL
- **Checkout:** `http://localhost:5173/booking/{bookingId}/ancillaries`

### Features
- ✅ Grouped by category with icons
- ✅ Add/Remove buttons
- ✅ Quantity selection
- ✅ Selected summary with total
- ✅ Responsive design
- ✅ Real-time price calculation

---

## 📊 Redux State Structure

### Store Configuration
File: `src/Redux/globleState.js`

```javascript
{
  ancillary: ancillaryReducer,                           // Master catalog
  flightInstanceAncillary: flightInstanceAncillaryReducer, // Flight-level
  flightInstanceCabinAncillary: flightInstanceCabinAncillaryReducer // Cabin-level
}
```

### Thunks Available

#### Master Ancillaries
```javascript
import {
  createAncillary,
  getAllAncillaries,
  getAncillaryById,
  updateAncillary,
  deleteAncillary
} from '@/Redux/ancillary/ancillaryThunk';
```

#### Flight Instance Ancillaries
```javascript
import {
  createFlightInstanceAncillary,
  getByFlightInstanceId,
  updateFlightInstanceAncillary
} from '@/Redux/flightInstanceAncillary/flightInstanceAncillaryThunk';
```

#### Cabin Ancillaries
```javascript
import {
  createFlightInstanceCabinAncillary,
  getFlightInstanceCabinAncillariesByCabinId,
  updateFlightInstanceCabinAncillary
} from '@/Redux/flightInstanceCabinAncillary/flightInstanceCabinAncillaryThunk';
```

---

## 🔄 Typical Workflow

### 1. Create Master Ancillaries (One-time Setup)
```
Sidebar → Ancillaries → Ancillary Catalog → Create Ancillary
```
Create services like:
- Extra Baggage (Flight-level, BAGGAGE category)
- WiFi (Cabin-level, ONBOARD_SERVICES category)
- Meals (Cabin-level, MEALS category)

### 2. Configure Flight Instance
```
Sidebar → Flight Instances → Select Instance → Ancillaries
```
Add flight-level ancillaries (baggage, insurance)

### 3. Configure Cabin-Specific Pricing
```
Flight Instance → Cabin Details → Cabin Ancillaries
```
Set cabin-specific prices (WiFi free in Business, $10 in Economy)

### 4. Traveler Booking
```
Traveler selects flight → Checkout → Ancillaries
```
Traveler sees categorized ancillaries with appropriate pricing

---

## 🚀 Quick Start Guide

### Step 1: Create Sample Ancillaries
```javascript
// Navigate to: /airline/ancillaries/create

1. Extra Baggage
   - Type: BAGGAGE
   - Level: FLIGHT
   - Category: BAGGAGE
   - Name: "Extra Checked Bag 23kg"
   - RFISC: "0CC"

2. WiFi
   - Type: ONBOARD_SERVICE
   - Level: CABIN
   - Category: ONBOARD_SERVICES
   - Name: "In-flight WiFi"
   - RFISC: "0G3"

3. Meal
   - Type: MEAL
   - Level: CABIN
   - Category: MEALS
   - Name: "Hot Meal"
```

### Step 2: Add to Flight Instance
```javascript
// Navigate to: /airline/instances/ancillaries

Select ancillaries to add to specific flight
```

### Step 3: Configure Cabin Pricing
```javascript
// Navigate to: /airline/flight-instance-cabins/{cabinId}/ancillaries/create

Business Class:
- WiFi: Free (Included in Fare ✓)
- Meal: Free (Included in Fare ✓)

Economy Class:
- WiFi: $10 USD
- Meal: $15 USD
```

---

## 🎨 UI Screenshots Reference

### Master Ancillaries List
- Grid layout with category filters
- Color-coded badges
- Search functionality

### Cabin Ancillaries List
- Grouped by category
- Included in fare badges
- Availability indicators

### Traveler Checkout
- MakeMyTrip-style sections
- Add/Remove controls
- Selected summary

---

## 🐛 Troubleshooting

### Can't see sidebar menu item?
- Check: `src/pages/airline/Sidebar/sideBarSections.js`
- Ensure "Ancillaries" section exists

### Routes not working?
- Check: `src/pages/airline/routes/AirlineRoutes.jsx`
- Ensure all routes are imported and defined

### Redux state undefined?
- Check: `src/Redux/globleState.js`
- Ensure all reducers are imported and added to store

### Components not found?
- Verify file paths match exactly
- Check import statements use correct casing

---

## 📝 Summary

✅ **3 UI Locations Created:**
1. Master Ancillaries (Catalog)
2. Flight Instance Ancillaries (Flight-level)
3. Cabin Ancillaries (Cabin-specific)

✅ **1 Traveler UI:**
- Ancillary Checkout (Booking flow)

✅ **All Routes Configured**
✅ **All Redux Slices Connected**
✅ **Sidebar Navigation Added**

Access everything through the sidebar or direct URLs!