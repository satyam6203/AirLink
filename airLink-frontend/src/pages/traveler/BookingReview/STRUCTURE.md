# BookingReview Page - Visual Structure

## Page Layout (MakeMyTrip Style)

```
┌─────────────────────────────────────────────────────────────────────┐
│                           STICKY HEADER                              │
│  [← Back to Flight Search]              Need help? Call: 1800-XXX   │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                      Complete Your Booking                           │
│            Review your flight details and fill in traveller info     │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────┬──────────────────────────────────┐
│         MAIN CONTENT (2/3)       │    FARE SUMMARY (1/3)            │
│                                  │    ┌──────────────────────────┐  │
│ ┌──────────────────────────────┐ │    │  📄 Fare Summary        │  │
│ │ ✈️  FLIGHT DETAILS           │ │    │  1 Passenger(s)         │  │
│ │                              │ │    │                          │  │
│ │ IndiGo 6E 2045              │ │    │  ┌────────────────────┐ │  │
│ │ DEL → BOM                   │ │    │  │ Total: ₹4,400      │ │  │
│ │ 06:15 ──✈️── 08:45          │ │    │  │ You save: ₹0       │ │  │
│ │ 2h 30m • Non-stop           │ │    │  └────────────────────┘ │  │
│ │                              │ │    │                          │  │
│ │ 🧳 Baggage:                 │ │    │  [Fare Breakdown ▼]     │  │
│ │ Cabin: 7 Kgs / Adult        │ │    │  - Base Fare: ₹3,599   │  │
│ │ Check-in: 15 Kgs / Adult    │ │    │  - Taxes: ₹801         │  │
│ └──────────────────────────────┘ │    │  - Seat: ₹0            │  │
│                                  │    │  - Meals: ₹0           │  │
│ ┌──────────────────────────────┐ │    │  - Add-ons: ₹0         │  │
│ │ 👤 TRAVELLER DETAILS         │ │    │  ─────────────────────  │  │
│ │ Enter passenger info as ID   │ │    │  Grand Total: ₹4,400   │  │
│ │                              │ │    │                          │  │
│ │ ⚠️  Important:               │ │    │  [Promo Code: _____ ]  │  │
│ │ • Name as per ID proof       │ │    │                          │  │
│ │ • Middle name optional       │ │    │  ┌────────────────────┐ │  │
│ │                              │ │    │  │ 💳 Proceed to      │ │  │
│ │ ┌──────────────────────────┐ │ │    │  │    Payment         │ │  │
│ │ │ [1] Adult 1        ✓     │ │ │    │  └────────────────────┘ │  │
│ │ │ Mr John Doe         [▼]  │ │ │    │                          │  │
│ │ └──────────────────────────┘ │ │    │  🔒 Secure ⚡ Instant   │  │
│ │                              │ │    │  ✓ Verified             │  │
│ │ [Expanded Form]              │ │    └──────────────────────────┘  │
│ │ Title: [Mr ▼]               │ │         ↑ STICKY ON SCROLL       │
│ │ First Name: [John____]       │ │                                  │
│ │ Last Name: [Doe_____]        │ │                                  │
│ │ Gender: [Male ▼]            │ │                                  │
│ │ DOB: [01/01/1990]           │ │                                  │
│ │ Nationality: [Indian___]     │ │                                  │
│ │                              │ │                                  │
│ │ 📧 Contact Information      │ │                                  │
│ │ Email: [john@example.com__] │ │                                  │
│ │ Phone: [+91] [9876543210_] │ │                                  │
│ └──────────────────────────────┘ │                                  │
│                                  │                                  │
│ ┌──────────────────────────────┐ │                                  │
│ │ 💺 SEAT SELECTION            │ │                                  │
│ │ Choose your preferred seat   │ │                                  │
│ │                              │ │                                  │
│ │ [No seat selected]           │ │                                  │
│ │ 💺 Choose seat to continue   │ │                                  │
│ │         [Select Seat →]      │ │                                  │
│ └──────────────────────────────┘ │                                  │
│                                  │                                  │
│ ┌──────────────────────────────┐ │                                  │
│ │ 🍽️  MEAL SELECTION           │ │                                  │
│ │ Pre-book meals at great prices│ │                                 │
│ │                              │ │                                  │
│ │ [All][Veg][Non-Veg][Snacks] │ │                                  │
│ │                              │ │                                  │
│ │ ┌──────┐  ┌──────┐          │ │                                  │
│ │ │ 🍛   │  │ 🌯   │          │ │                                  │
│ │ │ Veg  │  │ Chic │          │ │                                  │
│ │ │ Birya│  │ Wrap │          │ │                                  │
│ │ │ ₹250 │  │ ₹350 │          │ │                                  │
│ │ └──────┘  └──────┘          │ │                                  │
│ └──────────────────────────────┘ │                                  │
│                                  │                                  │
│ ┌──────────────────────────────┐ │                                  │
│ │ 🛡️  FLEXIBILITY ADD-ON       │ │                                  │
│ │ Get full flexibility          │ │                                  │
│ │                              │ │                                  │
│ │ ┌──────┐  ┌──────────┐      │ │                                  │
│ │ │Basic │  │Plus ⭐   │      │ │                                  │
│ │ │₹299  │  │₹599      │      │ │                                  │
│ │ └──────┘  └──────────┘      │ │                                  │
│ └──────────────────────────────┘ │                                  │
│                                  │                                  │
│ ┌──────────────────────────────┐ │                                  │
│ │ 🛡️  TRIP SECURE              │ │                                  │
│ │ Protect your trip             │ │                                  │
│ │                              │ │                                  │
│ │ ┌──────┐  ┌──────────┐      │ │                                  │
│ │ │Basic │  │Premium⭐│      │ │                                  │
│ │ │₹149  │  │₹299      │      │ │                                  │
│ │ └──────┘  └──────────┘      │ │                                  │
│ └──────────────────────────────┘ │                                  │
│                                  │                                  │
│ ┌──────────────────────────────┐ │                                  │
│ │ ❌ CANCELLATION POLICY       │ │                                  │
│ │ [Expandable sections]        │ │                                  │
│ │ • Cancellation [▼]           │ │                                  │
│ │ • Date Change [▼]            │ │                                  │
│ └──────────────────────────────┘ │                                  │
│                                  │                                  │
│ ┌──────────────────────────────┐ │                                  │
│ │ ⚠️  IMPORTANT INFORMATION    │ │                                  │
│ │ Please read before proceeding │ │                                  │
│ │                              │ │                                  │
│ │ • Check-in Info [▼]          │ │                                  │
│ │ • Baggage Rules [▼]          │ │                                  │
│ │ • Travel Guidelines [▼]      │ │                                  │
│ └──────────────────────────────┘ │                                  │
└──────────────────────────────────┴──────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                    MOBILE STICKY BOTTOM BAR                          │
│  Total: ₹4,400              [💳 Continue →]                         │
└─────────────────────────────────────────────────────────────────────┘
```

## Section Order (Top to Bottom)

### Main Content (Left Side)
1. **Flight Details Overview** - Flight summary with baggage info
2. **Traveller Details Form** - Dynamic forms (most important!)
3. **Seat Selection** - Optional seat picker
4. **Meal Selection** - Optional meal options
5. **Flexibility Add-On** - Optional date change protection
6. **Trip Secure** - Optional travel insurance
7. **Cancellation Policy** - Important terms
8. **Important Information** - Travel guidelines

### Sidebar (Right Side - Sticky)
- **Fare Summary Card** - Always visible while scrolling
  - Total amount (prominent)
  - Fare breakdown (expandable)
  - Promo code input
  - CTA button

## Responsive Behavior

### Desktop (≥1024px)
```
┌────────────────────────┬──────────────┐
│                        │              │
│   Main Content         │   Fare       │
│   (All sections)       │   Summary    │
│                        │   (Sticky)   │
│                        │              │
└────────────────────────┴──────────────┘
```

### Tablet (768px - 1023px)
```
┌────────────────────────┬──────────────┐
│                        │              │
│   Main Content         │   Fare       │
│   (All sections)       │   Summary    │
│                        │              │
└────────────────────────┴──────────────┘
```

### Mobile (<768px)
```
┌────────────────────────┐
│                        │
│   Main Content         │
│   (All sections)       │
│   Stacked vertically   │
│                        │
│   Fare Summary         │
│   (Not sticky)         │
│                        │
└────────────────────────┘
│                        │
│  Sticky Bottom Bar     │
│  Total | [Continue]    │
└────────────────────────┘
```

## Interaction Flow

### 1. Page Load
- ✓ Flight details displayed
- ✓ First passenger form expanded
- ⚠ Traveller forms empty (red indicator)
- ⚠ Other sections collapsed/empty

### 2. User Fills Form
- ✓ User expands passenger 1
- ✓ Fills all required fields
- ✓ Green checkmark appears
- ✓ Contact details added

### 3. Optional Add-ons
- User can select seat (modal opens)
- User can add meals (multiple)
- User can add flexibility plan
- User can add insurance
- ✓ Fare updates in real-time

### 4. Review & Proceed
- User reviews policies
- User reads important info
- User clicks "Proceed to Payment"
- ✓ Validation occurs
- ✓ Redirects to payment or shows error

## Color Coding

### Status Indicators
- 🟢 Green: Completed/Selected
- 🔴 Red: Required/Missing
- 🟡 Yellow: Warning/Info
- 🔵 Blue: Action/CTA
- ⚪ Gray: Optional/Disabled

### Component Colors
- Flight Details: Blue theme
- Traveller Form: Blue theme
- Seat Selection: Indigo theme
- Meal Selection: Orange theme
- Flexibility: Purple theme
- Insurance: Blue theme
- Policies: Orange/Red theme
- Important Info: Red theme

## Key Metrics (For Development)

- **Total Components**: 10
- **Form Fields**: 6-8 per passenger
- **Validation Points**: 2 (form + contact)
- **Optional Sections**: 4 (seat, meal, flexibility, insurance)
- **Expandable Sections**: 5 (passengers, policies, info)
- **Mobile Breakpoint**: 1024px
- **Sticky Elements**: 2 (sidebar desktop, bottom mobile)

## User Experience Features

✅ Auto-expand first passenger form
✅ Visual completion indicators
✅ Real-time fare calculation
✅ Inline validation hints
✅ Collapsible sections for cleaner UI
✅ Mobile-optimized forms
✅ Sticky CTA always visible
✅ Help phone number in header
✅ Trust indicators (Secure, Verified)
✅ Promo code support

---

This structure exactly matches MakeMyTrip, ClearTrip, and similar booking platforms!
