import * as React from "react";
import {
  Filter,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Plane,
  Clock,
  Star,
  IndianRupee,
  Timer,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const MIN_PRICE = 1000;
const MAX_PRICE = 200000;
const MAX_DURATION = 1440; // 24h in minutes

const formatPrice = (value) =>
  new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(value);

const formatDuration = (minutes) => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
};

const FiltersSidebar = ({ filters, onFiltersChange, airlines, className }) => {
  const [expandedSections, setExpandedSections] = React.useState({
    price: true,
    airlines: true,
    departure: true,
    arrival: false,
    duration: false,
    other: false,
  });

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const updateFilter = (key, value) => {
    onFiltersChange((prev) => ({ ...prev, [key]: value }));
  };

  const clearAllFilters = () => {
    onFiltersChange({
      airlines: [],
      priceRange: { min: MIN_PRICE, max: MAX_PRICE },
      departureTimeRange: "any",
      arrivalTimeRange: "any",
      maxDuration: MAX_DURATION,
      alliance: "any",
    });
  };

  // Active filter counts per section
  const activeCounts = {
    price:
      filters.priceRange.min > MIN_PRICE || filters.priceRange.max < MAX_PRICE
        ? 1
        : 0,
    airlines: filters.airlines.length,
    departure: filters.departureTimeRange !== "any" ? 1 : 0,
    arrival: filters.arrivalTimeRange !== "any" ? 1 : 0,
    duration: filters.maxDuration < MAX_DURATION ? 1 : 0,
    other: filters.alliance && filters.alliance !== "any" ? 1 : 0,
  };

  const totalActive = Object.values(activeCounts).reduce((a, b) => a + b, 0);

  const timeRanges = [
    { value: "any", label: "Any Time", icon: "🕐", sub: "All departures" },
    { value: "morning", label: "Morning", icon: "🌅", sub: "6 AM – 12 PM" },
    { value: "afternoon", label: "Afternoon", icon: "☀️", sub: "12 PM – 6 PM" },
    { value: "evening", label: "Evening", icon: "🌆", sub: "6 PM – 12 AM" },
    { value: "night", label: "Night", icon: "🌙", sub: "12 AM – 6 AM" },
  ];

  const alliances = [
    { value: "any", label: "Any Alliance" },
    { value: "star", label: "Star Alliance" },
    { value: "oneworld", label: "Oneworld" },
    { value: "skyteam", label: "SkyTeam" },
  ];

  const FilterSection = ({ title, id, icon: Icon, children }) => {
    const count = activeCounts[id] || 0;
    return (
      <div className="border-b border-border last:border-b-0">
        <Button
          onClick={() => toggleSection(id)}
          className="w-full flex items-center justify-between px-4 py-3 text-left rounded-none h-auto"
          variant="ghost"
        >
          <div className="flex items-center gap-2">
            <Icon className="h-4 w-4 text-primary" />
            <span className="font-medium text-sm text-foreground">{title}</span>
            {count > 0 && (
              <Badge
                variant="default"
                className="h-5 px-1.5 text-xs bg-primary text-primary-foreground"
              >
                {count}
              </Badge>
            )}
          </div>
          {expandedSections[id] ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          )}
        </Button>
        {expandedSections[id] && (
          <div className="px-4 pb-4 animate-in slide-in-from-top-1 fade-in duration-200">
            {children}
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className={cn("h-fit sticky top-24 overflow-hidden", className)}>
      <CardHeader className="pb-2 pt-4 px-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-primary" />
            <span className="text-base">Filters</span>
            {totalActive > 0 && (
              <Badge className="h-5 px-1.5 text-xs bg-primary/90">
                {totalActive} active
              </Badge>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-xs text-muted-foreground hover:text-destructive h-7 px-2"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Reset
          </Button>
        </CardTitle>
      </CardHeader>

      <Separator />

      <CardContent className="p-0">
        {/* ── Price Range ─────────────────────────────── */}
        <FilterSection title="Price Range" id="price" icon={IndianRupee}>
          <div className="space-y-3 pt-1">
            {/* Current range label */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                ₹{formatPrice(filters.priceRange.min)}
              </span>
              <span className="text-xs text-muted-foreground">to</span>
              <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                ₹{formatPrice(filters.priceRange.max)}
              </span>
            </div>

            <Slider
              value={[filters.priceRange.min, filters.priceRange.max]}
              onValueChange={(val) =>
                updateFilter("priceRange", { min: val[0], max: val[1] })
              }
              min={MIN_PRICE}
              max={MAX_PRICE}
              step={500}
              className="w-full"
            />

            <div className="flex gap-2">
              <div className="flex-1">
                <Label className="text-xs text-muted-foreground mb-1 block">
                  Min (₹)
                </Label>
                <Input
                  type="number"
                  value={filters.priceRange.min}
                  onChange={(e) =>
                    updateFilter("priceRange", {
                      ...filters.priceRange,
                      min: Math.max(
                        MIN_PRICE,
                        parseInt(e.target.value) || MIN_PRICE,
                      ),
                    })
                  }
                  className="h-8 text-sm"
                  min={MIN_PRICE}
                  max={MAX_PRICE}
                />
              </div>
              <div className="flex-1">
                <Label className="text-xs text-muted-foreground mb-1 block">
                  Max (₹)
                </Label>
                <Input
                  type="number"
                  value={filters.priceRange.max}
                  onChange={(e) =>
                    updateFilter("priceRange", {
                      ...filters.priceRange,
                      max: Math.min(
                        MAX_PRICE,
                        parseInt(e.target.value) || MAX_PRICE,
                      ),
                    })
                  }
                  className="h-8 text-sm"
                  min={MIN_PRICE}
                  max={MAX_PRICE}
                />
              </div>
            </div>

            <div className="flex justify-between text-xs text-muted-foreground">
              <span>₹{formatPrice(MIN_PRICE)}</span>
              <span>₹{formatPrice(MAX_PRICE)}</span>
            </div>
          </div>
        </FilterSection>

        {/* ── Airlines ────────────────────────────────── */}
        <FilterSection title="Airlines" id="airlines" icon={Plane}>
          {airlines && airlines.length > 0 ? (
            <ScrollArea className="h-[180px] pr-2">
              <div className="space-y-1 pt-1">
                {airlines.map((airline) => {
                  // Backend expects List<Long> – store airline.id (number)
                  const isChecked = filters.airlines.includes(airline.id);
                  return (
                    <div
                      key={airline.id}
                      className={cn(
                        "flex items-center gap-3 px-2 py-2 rounded-lg transition-colors cursor-pointer",
                        isChecked
                          ? "bg-primary/10 border border-primary/20"
                          : "hover:bg-muted/60",
                      )}
                      onClick={() => {
                        if (isChecked) {
                          updateFilter(
                            "airlines",
                            filters.airlines.filter((id) => id !== airline.id),
                          );
                        } else {
                          updateFilter("airlines", [
                            ...filters.airlines,
                            airline.id,
                          ]);
                        }
                      }}
                    >
                      <Checkbox
                        id={`airline-${airline.id}`}
                        checked={isChecked}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            updateFilter("airlines", [
                              ...filters.airlines,
                              airline.id,
                            ]);
                          } else {
                            updateFilter(
                              "airlines",
                              filters.airlines.filter(
                                (id) => id !== airline.id,
                              ),
                            );
                          }
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="pointer-events-none"
                      />
                      <Avatar>
                        <AvatarImage src={airline.logoUrl} />
                        <AvatarFallback>{airline.iataCode}</AvatarFallback>
                      </Avatar>
                     
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground truncate">
                          {airline.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {airline.code}
                        </p>
                      </div>
                      {isChecked && (
                        <Badge
                          variant="secondary"
                          className="h-4 px-1 text-[10px] bg-primary/20 text-primary"
                        >
                          ✓
                        </Badge>
                      )}
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          ) : (
            <p className="text-xs text-muted-foreground pt-2">
              No airlines available.
            </p>
          )}
        </FilterSection>

        {/* ── Departure Time ──────────────────────────── */}
        <FilterSection title="Departure Time" id="departure" icon={Clock}>
          <RadioGroup
            value={filters.departureTimeRange}
            onValueChange={(value) => updateFilter("departureTimeRange", value)}
            className="space-y-1 pt-1"
          >
            {timeRanges.map((range) => {
              const isSelected = filters.departureTimeRange === range.value;
              return (
                <div
                  key={range.value}
                  className={cn(
                    "flex items-center gap-3 px-2 py-2 rounded-lg transition-colors cursor-pointer",
                    isSelected
                      ? "bg-primary/10 border border-primary/20"
                      : "hover:bg-muted/60",
                  )}
                  onClick={() =>
                    updateFilter("departureTimeRange", range.value)
                  }
                >
                  <RadioGroupItem
                    value={range.value}
                    id={`dep-${range.value}`}
                    className="pointer-events-none"
                  />
                  <span className="text-base leading-none">{range.icon}</span>
                  <div className="flex-1">
                    <Label
                      htmlFor={`dep-${range.value}`}
                      className="text-sm font-medium cursor-pointer block"
                    >
                      {range.label}
                    </Label>
                    <p className="text-xs text-muted-foreground">{range.sub}</p>
                  </div>
                </div>
              );
            })}
          </RadioGroup>
        </FilterSection>

        {/* ── Arrival Time ────────────────────────────── */}
        <FilterSection title="Arrival Time" id="arrival" icon={Clock}>
          <RadioGroup
            value={filters.arrivalTimeRange}
            onValueChange={(value) => updateFilter("arrivalTimeRange", value)}
            className="space-y-1 pt-1"
          >
            {timeRanges.map((range) => {
              const isSelected = filters.arrivalTimeRange === range.value;
              return (
                <div
                  key={range.value}
                  className={cn(
                    "flex items-center gap-3 px-2 py-2 rounded-lg transition-colors cursor-pointer",
                    isSelected
                      ? "bg-primary/10 border border-primary/20"
                      : "hover:bg-muted/60",
                  )}
                  onClick={() => updateFilter("arrivalTimeRange", range.value)}
                >
                  <RadioGroupItem
                    value={range.value}
                    id={`arr-${range.value}`}
                    className="pointer-events-none"
                  />
                  <span className="text-base leading-none">{range.icon}</span>
                  <div className="flex-1">
                    <Label
                      htmlFor={`arr-${range.value}`}
                      className="text-sm font-medium cursor-pointer block"
                    >
                      {range.label}
                    </Label>
                    <p className="text-xs text-muted-foreground">{range.sub}</p>
                  </div>
                </div>
              );
            })}
          </RadioGroup>
        </FilterSection>

        {/* ── Max Duration ────────────────────────────── */}
        <FilterSection title="Max Duration" id="duration" icon={Timer}>
          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Up to</span>
              <span
                className={cn(
                  "text-sm font-semibold px-2 py-0.5 rounded-full",
                  filters.maxDuration < MAX_DURATION
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground",
                )}
              >
                {filters.maxDuration >= MAX_DURATION
                  ? "No limit"
                  : formatDuration(filters.maxDuration)}
              </span>
            </div>

            <Slider
              value={[filters.maxDuration]}
              onValueChange={(val) => updateFilter("maxDuration", val[0])}
              min={60}
              max={MAX_DURATION}
              step={30}
              className="w-full"
            />

            <div className="flex justify-between text-xs text-muted-foreground">
              <span>1h</span>
              <span>6h</span>
              <span>12h</span>
              <span>24h</span>
            </div>

            {/* Quick preset buttons */}
            <div className="flex gap-1.5 flex-wrap">
              {[180, 360, 480, 720].map((mins) => (
                <button
                  key={mins}
                  onClick={() => updateFilter("maxDuration", mins)}
                  className={cn(
                    "text-xs px-2 py-1 rounded-md border transition-colors",
                    filters.maxDuration === mins
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-muted/50 text-muted-foreground border-border hover:bg-muted",
                  )}
                >
                  {formatDuration(mins)}
                </button>
              ))}
              <button
                onClick={() => updateFilter("maxDuration", MAX_DURATION)}
                className={cn(
                  "text-xs px-2 py-1 rounded-md border transition-colors",
                  filters.maxDuration === MAX_DURATION
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-muted/50 text-muted-foreground border-border hover:bg-muted",
                )}
              >
                Any
              </button>
            </div>
          </div>
        </FilterSection>

        {/* ── Alliance ────────────────────────────────── */}
        <FilterSection title="Alliance" id="other" icon={Star}>
          <div className="space-y-2 pt-1">
            <div className="grid grid-cols-1 gap-1">
              {alliances.map((a) => {
                const isSelected = (filters.alliance || "any") === a.value;
                return (
                  <button
                    key={a.value}
                    onClick={() => updateFilter("alliance", a.value)}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors border",
                      isSelected
                        ? "bg-primary/10 border-primary/30 text-primary font-medium"
                        : "bg-transparent border-transparent hover:bg-muted/60 text-foreground",
                    )}
                  >
                    {a.label}
                  </button>
                );
              })}
            </div>
          </div>
        </FilterSection>
      </CardContent>
    </Card>
  );
};

export default FiltersSidebar;
