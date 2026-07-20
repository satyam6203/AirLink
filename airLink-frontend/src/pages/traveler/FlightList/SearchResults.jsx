import * as React from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { SlidersHorizontal, Menu, X, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Import new components
import SearchSummaryBar from "./SearchSummaryBar";
import FiltersSidebar from "./Filterssidebar";
import SortingBar from "./SortingBar";
import ModernFlightCard from "./ModernFlightCard";
import {
  SearchResultsLoading,
  SearchingFlights,
  NoResultsFound,
  FiltersSkeleton,
} from "./LoadingStates";

import FlightSearchBar from "@/pages/traveler/Home/FlightSearchBar";
import { searchFlightsAvailability } from "@/Redux/flightSearch/flightSearchThunk";
// import { listAllAirports } from "@/Redux/airports/airportsThunk"
import "./animations.css";
import { listAllAirports } from "@/Redux/airport/airportThunk";
import { useEffect } from "react";
import { getAirlinesForDropdown } from "@/Redux/airline/airlineThunks";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { dropdownAirlines } = useSelector((store) => store.airline);

  // Redux state
  const {
    searchResults,
    loading: searchLoading,
    error,
  } = useSelector((state) => state.flightSearch);

  const { airports } = useSelector((state) => state.airport);

  // Extract search parameters and map to API format
  const searchData = {
    departureAirportId: parseInt(searchParams.get("departureAirportId")) || "",
    arrivalAirportId: parseInt(searchParams.get("arrivalAirportId")) || "",
    departureDate: searchParams.get("departureDate")
      ? new Date(searchParams.get("departureDate"))
      : null,
    returnDate: searchParams.get("returnDate")
      ? new Date(searchParams.get("returnDate"))
      : null,
    passengers: parseInt(searchParams.get("numberOfTravellers") || "1"),
    cabinClass: searchParams.get("cabinClass") || "ECONOMY",
  };

  // console.log("Search Data: ----- ", searchData);

  const [sortBy, setSortBy] = React.useState("price");
  const [sortOrder, setSortOrder] = React.useState("asc");
  const [viewMode, setViewMode] = React.useState("list");
  const [isLoading, setIsLoading] = React.useState(false);
  const [showMobileFilters, setShowMobileFilters] = React.useState(false);
  const [bookmarkedFlights, setBookmarkedFlights] = React.useState(new Set());

  // Track initial mount to prevent double search
  const isInitialMount = React.useRef(true);

  // Enhanced filters state
  const [filters, setFilters] = React.useState({
    airlines: [],
    priceRange: { min: 1000, max: 200000 },
    departureTimeRange: "any",
    arrivalTimeRange: "any",
    maxDuration: 1440, // 24 hours in minutes
    alliance: "any",
  });

  // Build filter parameters for backend API
  const buildFilterParams = (currentFilters) => {
    const params = {};

    // airlines: List<Long> — only send when user has selected specific airlines
    if (currentFilters.airlines.length > 0) {
      params.airlines = currentFilters.airlines;
    }

    // minPrice / maxPrice — only send when user has moved from default bounds
    if (currentFilters.priceRange.min > 1000) {
      params.minPrice = currentFilters.priceRange.min;
    }

    if (currentFilters.priceRange.max < 200000) {
      params.maxPrice = currentFilters.priceRange.max;
    }

    if (currentFilters.departureTimeRange !== "any") {
      params.departureTimeRange = currentFilters.departureTimeRange;
    }

    if (currentFilters.arrivalTimeRange !== "any") {
      params.arrivalTimeRange = currentFilters.arrivalTimeRange;
    }

    // maxDuration in minutes — only send when user has restricted below 24h
    if (currentFilters.maxDuration < 1440) {
      params.maxDuration = currentFilters.maxDuration;
    }

    if (currentFilters.alliance && currentFilters.alliance !== "any") {
      params.alliance = currentFilters.alliance;
    }

    return params;
  };

  // Build sort parameters for backend API
  const buildSortParams = () => {
    return {
      sortBy: sortBy,
      sortOrder: sortOrder,
    };
  };

  // Enhanced search handler with real API
  const handleSearch = async (newSearchData) => {
    try {
      const searchParams = new URLSearchParams({
        departureAirportId: newSearchData.departureAirportId?.toString() || "",
        arrivalAirportId: newSearchData.arrivalAirportId?.toString() || "",
        departureDate:
          newSearchData.departureDate?.toISOString().split("T")[0] || "",
        returnDate: newSearchData.returnDate?.toISOString().split("T")[0] || "",
        passengers: newSearchData.numberOfTravellers?.toString() || "1",
        cabinClass: newSearchData.cabinClass || "ECONOMY",
      });

      // Dispatch search flights action with filters and sorting
      await dispatch(
        searchFlightsAvailability({
          departureAirportId: newSearchData.departureAirportId,
          arrivalAirportId: newSearchData.arrivalAirportId,
          passengers: newSearchData.passengers,
          cabinClass: newSearchData.cabinClass,
          departureDate: newSearchData.departureDate
            ?.toISOString()
            .split("T")[0],
          ...buildFilterParams(filters),
          ...buildSortParams(),
        }),
      );

      navigate(`/search-results?${searchParams.toString()}`);
    } catch (error) {
      console.error("Search failed:", error);
    }
  };

  // Load airports on component mount
  React.useEffect(() => {
    if (airports.length === 0) {
      dispatch(listAllAirports());
    }
  }, [dispatch, airports.length]);

  useEffect(() => {
    dispatch(getAirlinesForDropdown());
  }, []);

  // Search on component mount with URL params
  React.useEffect(() => {
    if (
      searchData.departureAirportId &&
      searchData.arrivalAirportId &&
      searchData.departureDate
    ) {
      const data = {
        departureAirportId: searchData.departureAirportId,
        arrivalAirportId: searchData.arrivalAirportId,
        passengers: searchData.passengers,
        cabinClass: searchData.cabinClass,
        departureDate: searchData.departureDate?.toISOString().split("T")[0],
        ...buildFilterParams(filters),
        ...buildSortParams(),
      };

      // console.log("search data with filters and sorting", data);

      dispatch(searchFlightsAvailability(data));
    }
  }, []);

  // Re-search when filters or sorting change
  React.useEffect(() => {
    // Skip the initial render (already searched on mount)
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (
      searchData.departureAirportId &&
      searchData.arrivalAirportId &&
      searchData.departureDate
    ) {
      // Debounce the search to avoid too many requests
      const timeoutId = setTimeout(() => {
        const data = {
          departureAirportId: searchData.departureAirportId,
          arrivalAirportId: searchData.arrivalAirportId,
          passengers: searchData.passengers,
          cabinClass: searchData.cabinClass,
          departureDate: searchData.departureDate?.toISOString().split("T")[0],
          ...buildFilterParams(filters),
          ...buildSortParams(),
        };

        console.log("re-searching with filters and sorting", data);

        dispatch(searchFlightsAvailability(data));
      }, 500); // 500ms debounce

      return () => clearTimeout(timeoutId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, sortBy, sortOrder]);

  // Handler functions
  const handleBookmark = (flight) => {
    setBookmarkedFlights((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(flight.id)) {
        newSet.delete(flight.id);
      } else {
        newSet.add(flight.id);
      }
      return newSet;
    });
  };

  const clearAllFilters = () => {
    setFilters({
      airlines: [],
      priceRange: { min: 1000, max: 200000 },
      departureTimeRange: "any",
      arrivalTimeRange: "any",
      maxDuration: 1440,
      alliance: "any",
    });
  };

  // Get unique airlines for filter from flights data

  // Get airport names for search data display
  const getDepartureAirport = () =>
    airports.find((a) => a.id === searchData.departureAirportId);
  const getArrivalAirport = () =>
    airports.find((a) => a.id === searchData.arrivalAirportId);

  if (searchLoading) {
    return <SearchingFlights />;
  }

  // Show error state if search failed
  if (error && searchResults?.content?.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md mx-auto px-4">
          <div className="text-6xl mb-4">✈️💨</div>
          <h2 className="text-2xl font-bold text-foreground">Search Failed</h2>
          <p className="text-muted-foreground">{error}</p>
          <div className="space-y-2">
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => navigate("/traveler")}
              className="w-full bg-muted text-muted-foreground px-6 py-3 rounded-lg font-medium hover:bg-muted/80 transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Two-Tone Background - Goibibo Style */}
      {/* Top 30% - Darker/Colored Section */}
      <div className="absolute top-0 left-0 right-0 h-[30vh] bg-gradient-to-br from-blue-900 via-blue-950 to-[#1B1464] dark:from-blue-950 dark:via-slate-950 dark:to-indigo-950">
        {/* Decorative elements for top section */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute top-20 right-20 w-80 h-80 bg-indigo-400/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>

          {/* Subtle Pattern */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
              backgroundSize: "32px 32px",
            }}
          ></div>
        </div>
      </div>

      {/* Bottom 70% - Light Section */}
      <div className="absolute top-[30vh] left-0 right-0 bottom-0 bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-400 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
        {/* Decorative elements for bottom section */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute top-40 left-1/4 w-96 h-96 bg-blue-400/5 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "3s" }}
          ></div>
          <div
            className="absolute bottom-20 right-1/4 w-80 h-80 bg-purple-400/5 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "5s" }}
          ></div>

          {/* Subtle Pattern */}
          <div
            className="absolute inset-0 opacity-[0.02] dark:opacity-[0.01]"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
              backgroundSize: "40px 40px",
            }}
          ></div>
        </div>
      </div>

      {/* Smooth Transition Wave Between Sections */}
      <div className="absolute top-[29vh] left-0 right-0 h-[3vh] pointer-events-none z-0">
        <svg
          className="absolute bottom-0 w-full h-full"
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
        >
          <path
            fill="currentColor"
            className="text-gray-50 dark:text-slate-900"
            d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,64C960,75,1056,85,1152,80C1248,75,1344,53,1392,42.7L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
          ></path>
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Mobile Filter Button */}
        <div className="lg:hidden mb-4">
          <Button
            variant="outline"
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="w-full flex items-center justify-center gap-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md hover:bg-white dark:hover:bg-slate-800 transition-all shadow-md hover:shadow-lg border-blue-200 dark:border-blue-800"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters & Sort
            {showMobileFilters ? (
              <X className="h-4 w-4 ml-auto" />
            ) : (
              <Menu className="h-4 w-4 ml-auto" />
            )}
          </Button>
        </div>

        {/* Search Summary Bar */}
        <div className="z-10 pb-3">
          <SearchSummaryBar
            searchData={{
              from: getDepartureAirport()?.iataCode || "",
              to: getArrivalAirport()?.iataCode || "",
              departureDate: searchData.departureDate,
              returnDate: searchData.returnDate,
              passengers: searchData.passengers,
              cabinClass: searchData.cabinClass.toLowerCase().replace("_", "-"),
            }}
            onModifySearch={handleSearch}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Enhanced Filters Sidebar */}
          <div
            className={cn(
              "lg:col-span-1",
              showMobileFilters ? "block" : "hidden lg:block",
            )}
          >
            {isLoading ? (
              <FiltersSkeleton />
            ) : (
              <div className="relative">
                {/* Decorative gradient behind filter */}
                <div className="absolute -inset-2 bg-gradient-to-br from-blue-500/10 to-purple-500/10 dark:from-blue-500/5 dark:to-purple-500/5 rounded-2xl blur-xl"></div>
                <div className="relative">
                  <FiltersSidebar
                    filters={filters}
                    onFiltersChange={setFilters}
                    airlines={dropdownAirlines}
                    className="animate-slide-in-left bg-white/80 dark:bg-slate-800/80 backdrop-blur-md shadow-xl"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Flight Results Section */}
          <div className="lg:col-span-3 space-y-4">
            {/* Enhanced Sorting Bar with glow effect */}
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 dark:from-blue-500/10 dark:to-purple-500/10 rounded-xl blur-lg"></div>
              <div className="relative">
                <SortingBar
                  sortBy={sortBy}
                  sortOrder={sortOrder}
                  onSortChange={setSortBy}
                  onSortOrderChange={setSortOrder}
                  resultsCount={searchResults?.content?.length}
                  viewMode={viewMode}
                  onViewModeChange={setViewMode}
                  className="animate-slide-in-top bg-white/90 dark:bg-slate-800/90 backdrop-blur-md shadow-lg"
                />
              </div>
            </div>

            {/* Flight Results with enhanced cards */}
            {isLoading ? (
              <SearchResultsLoading count={5} />
            ) : searchResults?.content?.length === 0 ? (
              <NoResultsFound onClearFilters={clearAllFilters} />
            ) : (
              <div
                className={cn(
                  viewMode === "grid"
                    ? "grid grid-cols-1 xl:grid-cols-2 gap-4"
                    : "space-y-4",
                )}
              >
                {searchResults?.content?.map((flight, index) => (
                  <div
                    key={flight.id}
                    className="animate-fade-in relative group"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* Subtle hover glow effect */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/20 group-hover:to-purple-500/20 dark:group-hover:from-blue-500/10 dark:group-hover:to-purple-500/10 rounded-2xl blur-lg transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
                    <div className="relative">
                      <ModernFlightCard
                        flight={flight}
                        cabinClass={searchData?.cabinClass}
                        onBookmark={handleBookmark}
                        isBookmarked={bookmarkedFlights.has(flight.id)}
                        viewMode={viewMode}
                        className="card-hover bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-300"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Load More Button - for pagination simulation */}
            {searchResults?.content?.length > 0 && !isLoading && (
              <div className="flex justify-center pt-8">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur opacity-30 group-hover:opacity-60 transition-opacity duration-300"></div>
                  <Button
                    variant="outline"
                    className="relative px-8 py-3 bg-white dark:bg-slate-800 backdrop-blur-sm hover:bg-white dark:hover:bg-slate-800 transition-all duration-200 shadow-lg hover:shadow-xl border-blue-200 dark:border-blue-800 font-semibold"
                  >
                    Load more flights
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Floating Action Buttons */}
        <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-40">
          {/* Scroll to Top Button */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full blur opacity-40 group-hover:opacity-75 transition-opacity duration-300"></div>
            <Button
              variant="secondary"
              size="sm"
              className="relative rounded-full w-12 h-12 p-0 bg-white dark:bg-slate-800 backdrop-blur-md shadow-xl hover:shadow-2xl transition-all duration-200 hover:scale-110 float-animation border-2 border-blue-200 dark:border-blue-700"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              <span className="text-lg">⬆️</span>
            </Button>
          </div>

          {/* Bookmarked Flights Button */}
          {bookmarkedFlights.size > 0 && (
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-br from-pink-500 to-red-500 rounded-full blur opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
              <Button
                variant="secondary"
                size="sm"
                className="relative rounded-full w-12 h-12 p-0 bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-xl hover:shadow-2xl transition-all duration-200 hover:scale-110 float-animation border-2 border-blue-400"
                style={{ animationDelay: "1s" }}
              >
                <Bookmark className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-gradient-to-br from-red-500 to-pink-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg ring-2 ring-white">
                  {bookmarkedFlights.size}
                </span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
