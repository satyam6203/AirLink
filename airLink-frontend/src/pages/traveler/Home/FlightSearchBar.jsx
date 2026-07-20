import * as React from "react"
import { Calendar as CalendarIcon, Users, Search, ArrowLeftRight, Plane, MapPin, CalendarDays, GraduationCap, Shield, User, Stethoscope, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import { useSelector, useDispatch } from "react-redux"
import { listAllAirports } from "@/Redux/airport/airportThunk"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

const FlightSearchBar = ({ onSearch, className }) => {
  const dispatch = useDispatch()
  const { airports } = useSelector((state) => state.airport)

  const [tripType, setTripType] = React.useState("oneWay") // roundTrip, oneWay, multiCity
  const [specialFare, setSpecialFare] = React.useState("regular")
  const [searchData, setSearchData] = React.useState({
    departureAirportId: "",
    arrivalAirportId: "",
    departureDate: new Date(), // Default to today
    returnDate: null,
    numberOfTravellers: 1,
    cabinClass: "ECONOMY"
  })

  const [departureDateOpen, setDepartureDateOpen] = React.useState(false)
  const [returnDateOpen, setReturnDateOpen] = React.useState(false)
  const [passengersOpen, setPassengersOpen] = React.useState(false)
  const [fromAirportSearch, setFromAirportSearch] = React.useState("")
  const [toAirportSearch, setToAirportSearch] = React.useState("")
  const [defaultsSet, setDefaultsSet] = React.useState(false)

  const cabinClasses = [
    { value: "ECONOMY", label: "Economy" },
    { value: "PREMIUM_ECONOMY", label: "Premium Economy" },
    { value: "BUSINESS", label: "Business" },
    { value: "FIRST", label: "First Class" }
  ]

  const specialFares = [
    {
      id: "regular",
      label: "Regular",
      description: "Regular fares",
      icon: User,
      discount: null
    },
    {
      id: "student",
      label: "Student",
      description: "Extra discounts/baggage",
      icon: GraduationCap,
      discount: null
    },
    {
      id: "armed_forces",
      label: "Armed Forces",
      description: "Up to ₹600 off",
      icon: Shield,
      discount: "₹600"
    },
    {
      id: "senior_citizen",
      label: "Senior Citizen",
      description: "Up to ₹600 off",
      icon: User,
      discount: "₹600"
    },
    {
      id: "doctor_nurses",
      label: "Doctor and Nurses",
      description: "Up to ₹600 off",
      icon: Stethoscope,
      discount: "₹600"
    }
  ]

  // Load airports on component mount
  React.useEffect(() => {
    dispatch(listAllAirports())
  }, [dispatch])

  // Set default airports (Ahmedabad to Delhi) after airports are loaded
  React.useEffect(() => {
    if (airports.length > 0 && !defaultsSet) {
      // Find Ahmedabad airport (AMD)
      const ahmedabadAirport = airports.find(
        airport => airport.iataCode === "AMD" ||
        airport.city?.name?.toLowerCase().includes("ahmedabad")
      )

      // Find Delhi airport (DEL)
      const delhiAirport = airports.find(
        airport => airport.iataCode === "DEL" ||
        airport.city?.name?.toLowerCase().includes("delhi")
      )

      if (ahmedabadAirport && delhiAirport) {
        setSearchData(prev => ({
          ...prev,
          departureAirportId: ahmedabadAirport.id,
          arrivalAirportId: delhiAirport.id
        }))
        setDefaultsSet(true)
      }
    }
  }, [airports, defaultsSet])



  const handleSearch = () => {
    if (searchData.departureAirportId && searchData.arrivalAirportId && searchData.departureDate) {
      // Format date as YYYY-MM-DD for API
      const formattedDate = searchData.departureDate.toISOString().split('T')[0]

      const searchParams = {
        departureAirportId: searchData.departureAirportId,
        arrivalAirportId: searchData.arrivalAirportId,
        numberOfTravellers: searchData.numberOfTravellers,
        cabinClass: searchData.cabinClass,
        departureDate: formattedDate,
        specialFare: specialFare
      }

      onSearch?.(searchParams)
    }
  }

  const handleSwapAirports = () => {
    setSearchData(prev => ({
      ...prev,
      departureAirportId: prev.arrivalAirportId,
      arrivalAirportId: prev.departureAirportId
    }))
    setFromAirportSearch(toAirportSearch)
    setToAirportSearch(fromAirportSearch)
  }

  const formatDate = (date) => {
    if (!date) return { day: "--", month: "Month", year: "", weekday: "" }
    return {
      day: date.getDate().toString().padStart(2, '0'),
      month: date.toLocaleDateString("en-US", { month: "short" }),
      year: date.getFullYear().toString(),
      weekday: date.toLocaleDateString("en-US", { weekday: "short" })
    }
  }

  

  const adjustPassengers = (increment) => {
    setSearchData(prev => ({
      ...prev,
      numberOfTravellers: Math.max(1, Math.min(9, prev.numberOfTravellers + increment))
    }))
  }

  const getSelectedAirport = (airportId) => {
    return airports.find(airport => airport.id === parseInt(airportId))
  }

  return (
    <div className={cn(
      "bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-slate-800",
      className
    )}>
      {/* Trip Type Tabs */}
      <div className="bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-800 dark:via-slate-800 dark:to-slate-800 px-8 py-6 border-b border-gray-200 dark:border-slate-700">
        <div className="flex space-x-2 bg-white dark:bg-slate-800 rounded-2xl p-2 shadow-sm border border-gray-200 dark:border-slate-700">
          <button
            onClick={() => setTripType("roundTrip")}
            className={cn(
              "px-8 py-3 rounded-xl text-sm font-bold transition-all duration-300 relative overflow-hidden",
              tripType === "roundTrip"
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-slate-700"
            )}
          >
            Round Trip
          </button>
          <button
            onClick={() => setTripType("oneWay")}
            className={cn(
              "px-8 py-3 rounded-xl text-sm font-bold transition-all duration-300",
              tripType === "oneWay"
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-slate-700"
            )}
          >
            One Way
          </button>
          <button
            onClick={() => setTripType("multiCity")}
            className={cn(
              "px-8 py-3 rounded-xl text-sm font-bold transition-all duration-300",
              tripType === "multiCity"
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-slate-700"
            )}
          >
            Multi City
          </button>
        </div>
      </div>

      <div className="p-8">
        {/* Combined Flight Search Section - All in One Line */}
        <div className="bg-gradient-to-r from-gray-50 to-blue-50/30 dark:from-slate-800 dark:to-slate-800 rounded-2xl p-1 mb-6">
          <div className="flex items-center justify-between ">
            {/* From */}
            <div className="relative group">
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-blue-400 dark:hover:border-blue-600 h-full">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg">
                    <Plane className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1 block">From</label>
                    <Select
                      value={searchData.departureAirportId.toString()}
                      onValueChange={(value) => setSearchData(prev => ({ ...prev, departureAirportId: parseInt(value) }))}
                    >
                      <SelectTrigger className="border-0 shadow-none p-0 h-auto focus:ring-0 bg-transparent">
                        <div className="text-left">
                          <div className="text-2xl font-black text-gray-900 dark:text-white mb-0.5">
                            {searchData.departureAirportId ? getSelectedAirport(searchData.departureAirportId)?.iataCode : "---"}
                          </div>
                          <div className="text-xs font-medium text-gray-600 dark:text-gray-400 truncate">
                            {searchData.departureAirportId ? getSelectedAirport(searchData.departureAirportId)?.city?.name : "Select City"}
                          </div>
                        </div>
                      </SelectTrigger>
                      <SelectContent className="w-[450px] max-h-[400px]">
                        {airports.map((airport) => (
                          <SelectItem key={airport.id} value={airport.id.toString()} className="py-4 cursor-pointer">
                            
                            <div className="flex items-center gap-4">
                              
                              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                                <MapPin className="h-6 w-6 text-white" />
                              </div>
                              
                              <div className="flex-1">
                                
                                <div className="font-bold text-gray-900 dark:text-white text-base mb-1">
                                  {airport.iataCode} - {airport.city?.name}
                                </div>
                                
                                <div className="text-xs text-gray-500 dark:text-gray-400 leading-tight">
                                  {airport.name}
                                </div>

                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            {/* Swap Button */}
            <div className="flex justify-center items-center px-2">
              <button
                onClick={handleSwapAirports}
                className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white hover:shadow-2xl hover:shadow-blue-500/50 hover:scale-110 transition-all duration-300 flex items-center justify-center group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <ArrowLeftRight className="h-5 w-5 relative z-10 group-hover:rotate-180 transition-transform duration-300" />
              </button>
            </div>

            {/* To */}
            <div className="relative group">
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-green-400 dark:hover:border-green-600 h-full">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg shadow-lg">
                    <Plane className="h-5 w-5 text-white rotate-90" />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1 block">To</label>
                    <Select
                      value={searchData.arrivalAirportId.toString()}
                      onValueChange={(value) => setSearchData(prev => ({ ...prev, arrivalAirportId: parseInt(value) }))}
                    >
                      <SelectTrigger className="border-0 shadow-none p-0 h-auto focus:ring-0 bg-transparent">
                        <div className="text-left">
                          <div className="text-2xl font-black text-gray-900 dark:text-white mb-0.5">
                            {searchData.arrivalAirportId ? getSelectedAirport(searchData.arrivalAirportId)?.iataCode : "---"}
                          </div>
                          <div className="text-xs font-medium text-gray-600 dark:text-gray-400 truncate">
                            {searchData.arrivalAirportId ? getSelectedAirport(searchData.arrivalAirportId)?.city?.name : "Select City"}
                          </div>
                        </div>
                      </SelectTrigger>
                      <SelectContent className="w-[450px] max-h-[400px]">
                        {airports.filter(airport => airport.id !== searchData.departureAirportId).map((airport) => (
                          <SelectItem key={airport.id} value={airport.id.toString()} className="py-4 cursor-pointer">
                            <div className="flex items-center gap-4">
                              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                                <MapPin className="h-6 w-6 text-white" />
                              </div>
                              <div className="flex-1">
                                <div className="font-bold text-gray-900 dark:text-white text-base mb-1">
                                  {airport.iataCode} - {airport.city?.name}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400 leading-tight">
                                  {airport.name}
                                </div>
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            {/* Departure Date */}
            <Dialog open={departureDateOpen} onOpenChange={setDepartureDateOpen}>
              <DialogTrigger asChild>
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 hover:shadow-lg transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-orange-400 dark:hover:border-orange-600 group h-full">
                  <div className="flex items-start gap-2">
                    <div className="p-2 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-lg">
                      <CalendarDays className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <label className="text-xs font-bold text-orange-700 dark:text-orange-400 uppercase tracking-widest mb-1 block">Departure</label>
                      <div className="flex items-baseline gap-1">
                        <div className="text-xl font-black text-gray-900 dark:text-white">
                          {formatDate(searchData.departureDate).day}
                        </div>
                        <div className="text-xs font-bold text-gray-700 dark:text-gray-300">
                          {formatDate(searchData.departureDate).month}
                        </div>
                      </div>

                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {searchData.departureDate ? formatDate(searchData.departureDate).weekday : "Select"}
                      </div>
                      
                    </div>
                  </div>
                </div>
              </DialogTrigger>
              <DialogContent className="w-auto p-0">
                <DialogHeader className="p-6 pb-0">
                  <DialogTitle className="text-2xl font-bold">Select departure date</DialogTitle>
                </DialogHeader>
                <Calendar
                  mode="single"
                  selected={searchData.departureDate}
                  captionLayout="dropdown"
                  onSelect={(date) => {
                    setSearchData(prev => ({ ...prev, departureDate: date }))
                    setDepartureDateOpen(false)
                  }}
                  disabled={(date) => date < new Date().setHours(0, 0, 0, 0)}
                  initialFocus
                  className="p-6"
                />
              </DialogContent>
            </Dialog>

        
           

            {/* Passengers */}
            <Dialog open={passengersOpen} onOpenChange={setPassengersOpen}>
              <DialogTrigger asChild>
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 hover:shadow-lg transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-pink-400 dark:hover:border-pink-600 group h-full">
                  <div className="flex items-start gap-2">
                    <div className="p-2 bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg shadow-lg">
                      <Users className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <label className="text-xs font-bold text-pink-700 dark:text-pink-400 uppercase tracking-widest mb-1 block">Travelers</label>
                      <div className="text-xl font-black text-gray-900 dark:text-white">
                        {searchData.numberOfTravellers}
                      </div>
                      <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
                        {searchData.numberOfTravellers === 1 ? "Traveller" : "Travellers"}
                      </div>
                    </div>
                  </div>
                </div>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold">Select passengers</DialogTitle>
                </DialogHeader>
                <div className="py-8">
                  <div className="flex items-center justify-between bg-gray-50 dark:bg-slate-800 p-6 rounded-2xl">
                    <div>
                      <div className="font-bold text-lg text-gray-900 dark:text-white">Passengers</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Age 12+</div>
                    </div>
                    <div className="flex items-center gap-5">
                      <button
                        onClick={() => adjustPassengers(-1)}
                        disabled={searchData.numberOfTravellers <= 1}
                        className="h-12 w-12 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-xl transition-all hover:scale-110"
                      >
                        -
                      </button>
                      <span className="w-14 text-center text-3xl font-black text-gray-900 dark:text-white">
                        {searchData.numberOfTravellers}
                      </span>
                      <button
                        onClick={() => adjustPassengers(1)}
                        disabled={searchData.numberOfTravellers >= 9}
                        className="h-12 w-12 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-xl transition-all hover:scale-110"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={() => setPassengersOpen(false)}
                  className="w-full h-14 text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-lg"
                >
                  Done
                </Button>
              </DialogContent>
            </Dialog>

            {/* Cabin Class */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-cyan-400 dark:hover:border-cyan-600 group h-full">
              <div className="flex items-start gap-2">
                <div className="p-2 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-lg shadow-lg">
                  <Plane className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1">
                  <label className="text-xs font-bold text-cyan-700 dark:text-cyan-400 uppercase tracking-widest mb-1 block">Class</label>
                  <Select
                    value={searchData.cabinClass}
                    onValueChange={(value) => setSearchData(prev => ({ ...prev, cabinClass: value }))}
                  >
                    <SelectTrigger className="border-0 shadow-none p-0 h-auto focus:ring-0 bg-transparent">
                      <div className="text-left">
                        <div className="text-sm font-black text-gray-900 dark:text-white">
                          <SelectValue />
                        </div>
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {cabinClasses.map((cabin) => (
                        <SelectItem key={cabin.value} value={cabin.value} className="py-3 cursor-pointer">
                          <div className="font-bold text-base">{cabin.label}</div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Special Fares */}
        <div className="mt-8 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Select Special Fares</span>
            <div className="h-px flex-1 bg-gradient-to-r from-gray-300 to-transparent dark:from-gray-600"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {specialFares.map((fare) => {
              const Icon = fare.icon
              return (
                <button
                  key={fare.id}
                  onClick={() => setSpecialFare(fare.id)}
                  className={cn(
                    "relative p-4 rounded-xl border-2 transition-all duration-300 text-left group hover:shadow-md",
                    specialFare === fare.id
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30 shadow-md shadow-blue-500/20"
                      : "border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-blue-300 dark:hover:border-blue-700"
                  )}
                >
                  {/* Check Icon */}
                  {specialFare === fare.id && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                  )}

                  {/* Icon */}
                  <div className={cn(
                    "mb-2 p-2 rounded-lg w-fit transition-colors",
                    specialFare === fare.id
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                  )}>
                    <Icon className="h-4 w-4" />
                  </div>

                  {/* Label */}
                  <div className={cn(
                    "font-bold text-sm mb-1",
                    specialFare === fare.id ? "text-blue-700 dark:text-blue-400" : "text-gray-900 dark:text-white"
                  )}>
                    {fare.label}
                  </div>

                  {/* Description */}
                  <div className={cn(
                    "text-xs leading-tight",
                    specialFare === fare.id ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"
                  )}>
                    {fare.description}
                  </div>

                  {/* Discount Badge */}
                  {fare.discount && (
                    <div className="mt-2">
                      <span className={cn(
                        "text-xs font-bold px-2 py-1 rounded-full",
                        specialFare === fare.id
                          ? "bg-blue-600 text-white"
                          : "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                      )}>
                        {fare.discount}
                      </span>
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Search Button */}
        <Button
          onClick={handleSearch}
          className="w-full h-20 text-xl font-black bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 rounded-2xl shadow-2xl shadow-blue-500/30 hover:shadow-blue-600/50 transition-all duration-300 hover:scale-[1.02] relative overflow-hidden group"
          disabled={!searchData.departureAirportId || !searchData.arrivalAirportId || !searchData.departureDate}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative z-10 flex items-center justify-center gap-3">
            <Search className="h-7 w-7" />
            <span>Search Flights</span>
          </div>
        </Button>
      </div>
    </div>
  )
}

export default FlightSearchBar
