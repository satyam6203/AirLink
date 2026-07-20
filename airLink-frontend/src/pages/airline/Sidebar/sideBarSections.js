import { SquarePlus } from "lucide-react";
import { UserPen } from "lucide-react";
import { ShieldUser } from "lucide-react";
import { PlaneTakeoff } from "lucide-react";
import {
  Plane,
  Building2,
  Calendar,
  Armchair,
  DollarSign,
  Tag,
  Users,
  BarChart3,
  TrendingUp,
  PieChart,
  FileText,

  Home,
  Plus,

  CreditCard,
  Gift,
  UserCheck,
  Clock,

  X,
  CalendarDays,
  Layers,
  RotateCcw,
  Grid3X3,
  Shield,
  Package,
  Luggage,
  UtensilsCrossed,
  Building,
  MapPin,
  Percent,
} from "lucide-react";

export const sidebarSections = [
  {
    id: "overview",
    title: "Dashboard",
    icon: Home,
    color: "from-primary to-[#6F1E51]",
    items: [
      {
        id: "overview",
        label: "Overview",
        icon: BarChart3,
        count: null,
        path: "/airline/dashboard",
      },
    ],
  },

  {
    id: "aircraft",
    title: "Aircraft Management",
    icon: PlaneTakeoff,
    color: "from-[#58B19F] to-[#55E6C1]",
    items: [
      {
        id: "aircraft",
        label: "All Aircraft",
        icon: PlaneTakeoff,
        count: 4,
        path: "/airline/aircraft",
      },
      {
        id: "create-aircraft",
        label: "Create Aircraft",
        icon: Plus,
        path: "/airline/aircraft/new",
      },
    ],
  },

  {
    id: "flights",
    title: "Flight Management",
    icon: Plane,
    color: "from-[#B53471] to-[#82589F]",
    items: [
      {
        id: "flights",
        label: "All Flights",
        icon: Plane,
        count: 45,
        path: "/airline/flights",
      },
      {
        id: "flights-create",
        label: "Create Flight",
        icon: Plus,
        count: null,
        path: "/airline/flights/new",
      },
      {
        id: "fare-create",
        label: "Create Fare",
        icon: DollarSign,
        count: null,
        path: "/airline/fare/new",
      },
      
      {
        id: "fare-rules-create",
        label: "Create Fare Rule",
        icon: Plus,
        count: null,
        path: "/airline/fare-rules/new",
      },
     
      {
        id: "baggage-policy-create",
        label: "Create Baggage Policy",
        icon: Plus,
        count: null,
        path: "/airline/baggage-policies/new",
      },

    ],
  },
  {
    id: "schedules",
    title: "Flight Schedules",
    icon: Calendar,
    color: "from-[#ff6b6b] to-[#ee5a24]",
    items: [
      {
        id: "schedules",
        label: "All Schedules",
        icon: Calendar,
        count: 45,
        path: "/airline/schedules",
      },
      {
        id: "schedules-create",
        label: "Create Schedule",
        icon: Plus,
        count: null,
        path: "/airline/schedules/new",
      },
     
    ],
  },
  {
    id: "instances",
    title: "Flight Instances",
    icon: CalendarDays,
    color: "from-[#3742fa] to-[#5f27cd]",
    items: [
      {
        id: "instances",
        label: "All Instances",
        icon: CalendarDays,
        count: null,
        path: "/airline/instances",
      },
      {
        id: "instances-create",
        label: "Create Instance",
        icon: Plus,
        count: null,
        path: "/airline/instances/new",
      },
      
    ],
  },
 

  {
    id: "ancillaries",
    title: "Ancillaries",
    icon: Package,
    color: "from-cyan-500 to-blue-500",
    items: [
      {
        id: "ancillaries-catalog",
        label: "Master Ancillaries",
        icon: Package,
        count: null,
        path: "/airline/ancillaries",
      },
      {
        id: "ancillaries-create",
        label: "Create Ancillary",
        icon: Plus,
        count: null,
        path: "/airline/ancillaries/create",
      },
      {
        id: "insurance-coverages",
        label: "Insurance Coverages",
        icon: Shield,
        count: null,
        path: "/airline/insurance-coverages",
      },
    ],
  },

  {
    id: "meals",
    title: "Meal Management",
    icon: UtensilsCrossed,
    color: "from-amber-500 to-orange-500",
    items: [
      {
        id: "meals",
        label: "Meal Catalog",
        icon: UtensilsCrossed,
        count: null,
        path: "/airline/meals",
      }
      
    ],
  },

  {
    id: "pricing",
    title: "Pricing & Discounts",
    icon: DollarSign,
    color: "from-green-500 to-emerald-500",
    items: [
    
     
      {
        id: "coupons",
        label: "Coupons",
        icon: Percent,
        count: null,
        path: "/airline/coupons",
      },
      {
        id: "coupons-create",
        label: "Create Coupon",
        icon: Plus,
        count: null,
        path: "/airline/coupons/new",
      },
      
     
     
    ],
  },
  {
    id: "bookings",
    title: "Bookings",
    icon: Users,
    color: "from-orange-500 to-red-500",
    items: [
      {
        id: "bookings-statistics",
        label: "Booking Statistics",
        icon: BarChart3,
        count: null,
        path: "/airline/bookings/statistics",
      },
      {
        id: "bookings-list",
        label: "All Bookings",
        icon: Users,
        count: 234,
        path: "/airline/bookings",
      },
      {
        id: "transactions",
        label: "Transactions",
        icon: CreditCard,
        count: null,
        path: "/airline/transactions",
      }
    ],
  },
  {
    id: "reports",
    title: "Reports & Analytics",
    icon: BarChart3,
    color: "from-pink-500 to-rose-500",
    items: [
      
      {
        id: "route-performance",
        label: "Route Performance",
        icon: MapPin,
        count: null,
        path: "/airline/route-performance",
      },
      
    ],
  },
  {
    id: "Profile",
    title: "Airline Profile",
    icon: UserPen,
    color: "from-pink-500 to-rose-500",
    items: [
      
      {
        id: "airline-profile",
        label: "Airline Profile",
        icon: ShieldUser,
        count: null,
        path: "/airline/profile",
      },
      
    ],
  },
];
