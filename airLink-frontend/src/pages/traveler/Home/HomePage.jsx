import * as React from "react"
import { useNavigate } from "react-router-dom"
import { Plane, MapPin, Calendar, Users, Shield, CreditCard, HeadphonesIcon, CheckCircle, Tag, Percent, Gift, Star, TrendingDown, Clock } from "lucide-react"
import FlightSearchBar from "@/pages/traveler/Home/FlightSearchBar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const HomePage = () => {
  const navigate = useNavigate()

  const handleSearch = (searchData) => {
    // Navigate to search results page with new API parameter format
    const searchParams = new URLSearchParams({
      departureAirportId: searchData.departureAirportId?.toString() || "",
      arrivalAirportId: searchData.arrivalAirportId?.toString() || "",
      departureDate: searchData.departureDate || "",
      returnDate: searchData.returnDate?.toISOString().split('T')[0] || "",
      numberOfTravellers: searchData.numberOfTravellers?.toString() || "1",
      cabinClass: searchData.cabinClass || "ECONOMY"
    })

    navigate(`/search-results?${searchParams.toString()}`)
  }

  const offers = [
    {
      icon: <Percent className="h-6 w-6" />,
      title: "FLAT 12% OFF",
      subtitle: "On Domestic Flights",
      code: "FLYFIRST",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: <Gift className="h-6 w-6" />,
      title: "FREE Meal",
      subtitle: "On International Flights",
      code: "INTMEAL",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <Tag className="h-6 w-6" />,
      title: "Up to ₹2000 OFF",
      subtitle: "Use Code on Flight Bookings",
      code: "SAVE2K",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Star className="h-6 w-6" />,
      title: "Extra 10% OFF",
      subtitle: "For First Time Users",
      code: "WELCOME10",
      color: "from-green-500 to-emerald-500"
    }
  ]

  const whyBookWithUs = [
    {
      icon: <TrendingDown className="h-10 w-10" />,
      title: "Easy Booking",
      description: "We offer easy and convenient flight bookings with attractive offers",
      gradient: "from-blue-500 to-blue-600"
    },
    {
      icon: <CreditCard className="h-10 w-10" />,
      title: "Lowest Price",
      description: "We ensure low rates on hotel reservations, holiday packages and flights",
      gradient: "from-green-500 to-green-600"
    },
    {
      icon: <Shield className="h-10 w-10" />,
      title: "Safe & Secure",
      description: "Your payment information is protected with the latest security measures",
      gradient: "from-purple-500 to-purple-600"
    },
    {
      icon: <HeadphonesIcon className="h-10 w-10" />,
      title: "24/7 Support",
      description: "Get assistance anytime on call, WhatsApp or email. We are here for you!",
      gradient: "from-orange-500 to-orange-600"
    }
  ]

  const popularDestinations = [
    {
      city: "Dubai",
      country: "United Arab Emirates",
      code: "DXB",
      image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=300&fit=crop",
      price: "₹12,499"
    },
    {
      city: "London",
      country: "United Kingdom",
      code: "LHR",
      image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&h=300&fit=crop",
      price: "₹45,999"
    },
    {
      city: "Paris",
      country: "France",
      code: "CDG",
      image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=300&fit=crop",
      price: "₹42,899"
    },
    {
      city: "New York",
      country: "United States",
      code: "JFK",
      image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&h=300&fit=crop",
      price: "₹58,999"
    },
    {
      city: "Singapore",
      country: "Singapore",
      code: "SIN",
      image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=400&h=300&fit=crop",
      price: "₹18,999"
    },
    {
      city: "Tokyo",
      country: "Japan",
      code: "NRT",
      image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=300&fit=crop",
      price: "₹38,499"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-slate-950 dark:to-slate-900">
      {/* Hero Section with Gradient */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 dark:from-blue-900 dark:via-blue-950 dark:to-slate-950 min-h-[85vh]s flex items-center overflow-hidden">
        
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        {/* Animated Wave Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Wave 1 */}
          <svg className="absolute bottom-0 left-0 w-full h-[800px] opacity-20" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path fill="currentColor" className="text-white" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,165.3C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z">
              <animate attributeName="d" dur="10s" repeatCount="indefinite" values="
                M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,165.3C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z;
                M0,128L48,138.7C96,149,192,171,288,165.3C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,170.7C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z;
                M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,165.3C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
            </path>
          </svg>

          {/* Wave 2 */}
          <svg className="absolute bottom-0 left-0 w-full h-[850px] opacity-15" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path fill="currentColor" className="text-red-500" fillOpacity="1" d="M0,160L48,165.3C96,171,192,181,288,181.3C384,181,480,171,576,154.7C672,139,768,117,864,128C960,139,1056,181,1152,186.7C1248,192,1344,160,1392,144L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z">
              <animate attributeName="d" dur="8s" repeatCount="indefinite" values="
                M0,160L48,165.3C96,171,192,181,288,181.3C384,181,480,171,576,154.7C672,139,768,117,864,128C960,139,1056,181,1152,186.7C1248,192,1344,160,1392,144L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z;
                M0,192L48,181.3C96,171,192,149,288,154.7C384,160,480,192,576,197.3C672,203,768,181,864,165.3C960,149,1056,139,1152,149.3C1248,160,1344,192,1392,208L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z;
                M0,160L48,165.3C96,171,192,181,288,181.3C384,181,480,171,576,154.7C672,139,768,117,864,128C960,139,1056,181,1152,186.7C1248,192,1344,160,1392,144L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
            </path>
          </svg>

          {/* Wave 3 */}
          <svg className="absolute bottom-0 left-0 w-full h-36 opacity-10" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path fill="currentColor" className="text-purple-400" fillOpacity="1" d="M0,224L48,213.3C96,203,192,181,288,176C384,171,480,181,576,197.3C672,213,768,235,864,229.3C960,224,1056,192,1152,181.3C1248,171,1344,181,1392,186.7L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z">
              <animate attributeName="d" dur="12s" repeatCount="indefinite" values="
                M0,224L48,213.3C96,203,192,181,288,176C384,171,480,181,576,197.3C672,213,768,235,864,229.3C960,224,1056,192,1152,181.3C1248,171,1344,181,1392,186.7L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z;
                M0,192L48,197.3C96,203,192,213,288,218.7C384,224,480,224,576,213.3C672,203,768,181,864,181.3C960,181,1056,203,1152,208C1248,213,1344,203,1392,197.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z;
                M0,224L48,213.3C96,203,192,181,288,176C384,171,480,181,576,197.3C672,213,768,235,864,229.3C960,224,1056,192,1152,181.3C1248,171,1344,181,1392,186.7L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
            </path>
          </svg>
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/3 w-40 h-40 bg-purple-400/10 rounded-full blur-2xl animate-pulse delay-500"></div>
        </div>

        <div className="searchBox relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12 z-10">
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl lg:text-3xl font-bold text-white mb-4 leading-tight">
              Let's Start Your Journey!
            </h1>
            <p className=" text-blue-100 max-w-2xl mx-auto">
              Discover the world with our amazing flight deals. Book now and save big!
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-5xl mx-auto">
            <FlightSearchBar onSearch={handleSearch} />
          </div>

          {/* Trust Badges */}
          <div className="mt-8 flex flex-wrap justify-center gap-6 text-white/90">
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <span>Free Cancellation</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <span>No Hidden Charges</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <span>Best Price Guaranteed</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <span>24/7 Support</span>
            </div>
          </div>
        </div>
      </section>

      {/* Offers Section */}
      <section className="py-16 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Offers
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Explore great deals and offers on flights
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {offers.map((offer, index) => (
              <Card key={index} className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className={`h-2 bg-gradient-to-r ${offer.color}`}></div>
                <CardContent className="p-6">
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${offer.color} text-white mb-4`}>
                    {offer.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                    {offer.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {offer.subtitle}
                  </p>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-mono">
                      {offer.code}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Book With Us Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-950 dark:to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Book With Us?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              We make travel planning simple, affordable, and stress-free
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyBookWithUs.map((item, index) => (
              <div key={index} className="text-center group">
                <div className={`inline-flex p-6 rounded-2xl bg-gradient-to-br ${item.gradient} text-white mb-5 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Popular Destinations
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Fly to your dream destination at the best prices
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularDestinations.map((destination, index) => (
              <Card
                key={index}
                className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
                onClick={() => handleSearch({
                  departureAirportId: "",
                  arrivalAirportId: destination.code,
                  departureDate: new Date(),
                  returnDate: null,
                  numberOfTravellers: 1,
                  cabinClass: "ECONOMY"
                })}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={destination.image}
                    alt={destination.city}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-2xl font-bold text-white mb-1">
                      {destination.city}
                    </h3>
                    <p className="text-sm text-white/90">
                      {destination.country}
                    </p>
                  </div>
                  <Badge className="absolute top-4 right-4 bg-white/90 text-gray-900 hover:bg-white">
                    {destination.code}
                  </Badge>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Starting from</p>
                      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {destination.price}
                      </p>
                    </div>
                    <Plane className="h-6 w-6 text-gray-400 group-hover:text-blue-600 transition-colors" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-900 dark:via-indigo-900 dark:to-purple-900 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '32px 32px'
          }}></div>
        </div>

        {/* Floating Shapes */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-700"></div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex p-4 bg-white/10 rounded-2xl mb-6">
            <Plane className="h-12 w-12 text-white" />
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            Ready to Explore the World?
          </h2>
          <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
            Join millions of travelers who trust us to find their perfect flight.
            Start your journey today and discover amazing deals!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105"
            >
              Search Flights Now
            </button>
            <button className="px-8 py-4 border-2 border-white text-white rounded-xl font-semibold text-lg hover:bg-white hover:text-blue-600 transition-all duration-300 hover:scale-105">
              Download Mobile App
            </button>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">10M+</div>
              <div className="text-sm text-white/80">Happy Travelers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">500+</div>
              <div className="text-sm text-white/80">Airlines</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">1000+</div>
              <div className="text-sm text-white/80">Destinations</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">24/7</div>
              <div className="text-sm text-white/80">Support</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
