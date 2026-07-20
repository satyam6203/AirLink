import * as React from "react"
import { 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown,
  DollarSign,
  Clock,
  Plane,
  Building,
  TrendingUp,
  Grid3X3,
  List
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const SortingBar = ({ 
  sortBy, 
  sortOrder = "asc", 
  onSortChange, 
  onSortOrderChange,
  resultsCount,
  viewMode = "list",
  onViewModeChange,
  className 
}) => {
  const sortOptions = [
    {
      value: "price",
      label: "Price",
      icon: DollarSign,
      shortLabel: "Price"
    },
    {
      value: "duration",
      label: "Duration",
      icon: Clock,
      shortLabel: "Duration"
    },
    {
      value: "departure",
      label: "Departure Time",
      icon: Plane,
      shortLabel: "Departure"
    },
    {
      value: "arrival", 
      label: "Arrival Time",
      icon: Plane,
      shortLabel: "Arrival"
    },
    {
      value: "airline",
      label: "Airline",
      icon: Building,
      shortLabel: "Airline"
    }
  ]

  const handleSortChange = (newSort) => {
    if (newSort === sortBy) {
      // Toggle sort order if same sort option clicked
      onSortOrderChange?.(sortOrder === "asc" ? "desc" : "asc")
    } else {
      // Change sort option and default to ascending
      onSortChange?.(newSort)
      onSortOrderChange?.("asc")
    }
  }

  const getSortLabel = (option) => {
    if (option.value === sortBy) {
      const orderText = sortOrder === "asc" ? 
        (option.value === "price" || option.value === "duration" ? "Low → High" : "Earliest first") :
        (option.value === "price" || option.value === "duration" ? "High → Low" : "Latest first")
      return `${option.label} (${orderText})`
    }
    return option.label
  }

  return (
    <div className={cn("bg-background border-b border-border sticky top-20 z-30 rounded-md", className)}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4">
        {/* Results Count */}
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-foreground">
            {resultsCount} flight{resultsCount !== 1 ? 's' : ''} found
          </span>
        </div>

        {/* Sort Options */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium text-foreground mr-2">Sort by:</span>
          
          {/* Desktop Sort Buttons */}
          <div className="hidden md:flex items-center gap-1">
            {sortOptions.map((option) => {
              const Icon = option.icon
              const isActive = sortBy === option.value
              
              return (
                <Button
                  key={option.value}
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  onClick={() => handleSortChange(option.value)}
                  className={cn(
                    "flex items-center gap-1 text-xs font-medium transition-all duration-200",
                    isActive && "bg-primary text-primary-foreground hover:bg-primary/90",
                    !isActive && "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  <Icon className="h-3 w-3" />
                  <span className="hidden lg:inline">{option.shortLabel}</span>
                  {isActive && (
                    sortOrder === "asc" ? 
                    <ArrowUp className="h-3 w-3 ml-1" /> : 
                    <ArrowDown className="h-3 w-3 ml-1" />
                  )}
                </Button>
              )
            })}
          </div>

          {/* Mobile Sort Dropdown */}
          <div className="md:hidden">
            <select
              value={sortBy}
              onChange={(e) => onSortChange?.(e.target.value)}
              className="text-xs border border-border rounded-md px-2 py-1 focus:ring-2 focus:ring-primary focus:border-primary"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {getSortLabel(option)}
                </option>
              ))}
            </select>
            
            {/* Sort Order Toggle for Mobile */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSortOrderChange?.(sortOrder === "asc" ? "desc" : "asc")}
              className="ml-1 p-1"
            >
              {sortOrder === "asc" ? 
                <ArrowUp className="h-3 w-3" /> : 
                <ArrowDown className="h-3 w-3" />
              }
            </Button>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center border border-border rounded-md ml-4">
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => onViewModeChange?.("list")}
              className={cn(
                "rounded-r-none px-2 py-1",
                viewMode === "list" && "bg-primary text-primary-foreground hover:bg-primary/90"
              )}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => onViewModeChange?.("grid")}
              className={cn(
                "rounded-l-none px-2 py-1",
                viewMode === "grid" && "bg-primary text-primary-foreground hover:bg-primary/90"
              )}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Active Filters Summary */}
      <div className="px-4 pb-2">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <ArrowUpDown className="h-3 w-3" />
          <span>
            Sorted by {getSortLabel(sortOptions.find(opt => opt.value === sortBy))}
          </span>
        </div>
      </div>
    </div>
  )
}

export default SortingBar
