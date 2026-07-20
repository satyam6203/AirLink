import * as React from "react"
import { Plane, Search } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

// Skeleton Loader for Flight Cards
export const FlightCardSkeleton = ({ className }) => {
  return (
    <Card className={cn("animate-pulse", className)}>
      <CardContent className="p-0">
        {/* Top section skeleton */}
        <div className="flex items-center justify-between p-4 pb-2 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-muted"></div>
            <div>
              <div className="h-4 bg-muted rounded w-32 mb-2"></div>
              <div className="h-3 bg-muted rounded w-20"></div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-6 bg-muted rounded-full w-16"></div>
            <div className="h-6 bg-muted rounded-full w-20"></div>
          </div>
        </div>

        {/* Middle section skeleton */}
        <div className="p-4">
          <div className="grid grid-cols-3 gap-4 items-center">
            <div className="text-left">
              <div className="h-8 bg-muted rounded w-16 mb-2"></div>
              <div className="h-3 bg-muted rounded w-12 mb-1"></div>
              <div className="h-3 bg-muted rounded w-20"></div>
            </div>
            <div className="flex flex-col items-center">
              <div className="h-3 bg-muted rounded w-12 mb-2"></div>
              <div className="relative w-full flex items-center">
                <div className="w-3 h-3 rounded-full bg-muted"></div>
                <div className="flex-1 h-0.5 bg-muted mx-2"></div>
                <div className="w-3 h-3 rounded-full bg-muted"></div>
              </div>
              <div className="h-3 bg-muted rounded w-16 mt-2"></div>
            </div>
            <div className="text-right">
              <div className="h-8 bg-muted rounded w-16 mb-2 ml-auto"></div>
              <div className="h-3 bg-muted rounded w-12 mb-1 ml-auto"></div>
              <div className="h-3 bg-muted rounded w-20 ml-auto"></div>
            </div>
          </div>
        </div>

        {/* Bottom section skeleton */}
        <div className="px-4 pb-4">
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div>
              <div className="h-6 bg-muted rounded w-20 mb-1"></div>
              <div className="h-3 bg-muted rounded w-16"></div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-9 bg-muted rounded w-24"></div>
              <div className="h-9 bg-muted rounded w-24"></div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Loading State for Search Results
export const SearchResultsLoading = ({ count = 5 }) => {
  return (
    <div className="space-y-4">
      {[...Array(count)].map((_, index) => (
        <FlightCardSkeleton key={index} />
      ))}
    </div>
  )
}

// Loading State with Animation
export const SearchingFlights = ({ className }) => {
  return (
    <div className={cn("flex flex-col items-center justify-center py-16", className)}>
      <div className="relative mb-6">
        <div className="w-16 h-16 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin"></div>
        <Plane className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-primary" />
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2">
        Searching for flights...
      </h3>
      <p className="text-muted-foreground text-center max-w-md">
        We're comparing prices across multiple airlines to find you the best deals.
      </p>
      <div className="flex items-center gap-1 mt-4">
        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      </div>
    </div>
  )
}

// No Results State
export const NoResultsFound = ({ onClearFilters, className }) => {
  return (
    <div className={cn("flex flex-col items-center justify-center py-16", className)}>
      <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-6">
        <Search className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="text-2xl font-semibold text-foreground mb-2">
        No flights found
      </h3>
      <p className="text-muted-foreground text-center max-w-md mb-6">
        We couldn't find any flights matching your criteria. Try adjusting your filters or search dates to see more options.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={onClearFilters}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Clear all filters
        </button>
        <button
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-muted/50 transition-colors"
        >
          Modify search
        </button>
      </div>
    </div>
  )
}

// Filter Loading State
export const FiltersSkeleton = () => {
  return (
    <Card className="h-fit">
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded w-12"></div>
          </div>
          <div className="h-6 bg-muted rounded w-16"></div>
        </div>
      </div>
      <div className="space-y-4 p-4">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="space-y-2">
            <div className="h-4 bg-muted rounded w-20"></div>
            <div className="space-y-2">
              <div className="h-3 bg-muted rounded w-full"></div>
              <div className="h-3 bg-muted rounded w-3/4"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

// Price Loading Animation
export const PriceLoader = ({ className }) => {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="animate-pulse">
        <div className="h-6 bg-gradient-to-r from-green-200 to-green-300 rounded w-20"></div>
      </div>
      <div className="flex items-center gap-1">
        <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse"></div>
        <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
      </div>
    </div>
  )
}
