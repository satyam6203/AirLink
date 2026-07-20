import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { deleteAncillary } from "@/Redux/ancillary/ancillaryThunk";
import {
  Trash2,
  Edit,
  Package,
  Weight,
  Ruler,
  Shield,
  CheckCircle,
  ChevronRight,
  DollarSign,
  Phone,
  AlertCircle,
} from "lucide-react";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  getAncillaryIcon,
  getAncillaryIconBgColor,
  getAncillaryBadgeColor,
} from "@/utils/ancillaryIcons";
import { ScrollArea } from "@/components/ui/scroll-area";

const AncillaryCard = ({ ancillary }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showAllCoverages, setShowAllCoverages] = useState(false);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this ancillary?")) {
      dispatch(deleteAncillary(id));
    }
  };

  // Get the appropriate icon
  const IconComponent = getAncillaryIcon(ancillary.type, ancillary.subType);

  // Format currency
  const formatCurrency = (value, currency = "INR") => {
    if (!value) return "N/A";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
    }).format(value);
  };

  // Get coverage type label
  const getCoverageTypeLabel = (type) => {
    const typeMap = {
      BAGGAGE_LOSS: "Baggage Loss",
      BAGGAGE_DELAY: "Baggage Delay",
      BAGGAGE_ASSISTANCE: "Baggage Assistance",
      PERSONAL_ACCIDENT: "Personal Accident",
      TRIP_DELAY: "Trip Delay",
      TRIP_CANCELLATION: "Trip Cancellation",
      MISSED_CONNECTION: "Missed Connection",
      DIVERTED_FLIGHT: "Diverted Flight",
      FREE_DATE_CHANGE: "Free Date Change",
      ZERO_CANCELLATION: "Zero Cancellation",
      EMERGENCY_ASSISTANCE: "Emergency Assistance",
      TRAVEL_DOCUMENT_LOSS: "Travel Document Loss",
      MEDICAL_EMERGENCY: "Medical Emergency",
    };
    return typeMap[type] || type;
  };

  // Get coverage type icon color
  const getCoverageTypeColor = (type) => {
    if (type?.includes("BAGGAGE")) return "text-purple-600 bg-purple-50";
    if (type === "PERSONAL_ACCIDENT") return "text-red-600 bg-red-50";
    if (type?.includes("TRIP") || type?.includes("FLIGHT"))
      return "text-yellow-600 bg-yellow-50";
    if (type?.includes("DATE") || type?.includes("CANCELLATION"))
      return "text-green-600 bg-green-50";
    return "text-blue-600 bg-blue-50";
  };

  const hasCoverages = ancillary.coverages.length>0 && ancillary.coverages.length > 0;

  return (
    <Card
      key={ancillary.id}
      className="hover:shadow-lg transition-all duration-300 flex flex-col h-full"
    >
      {/* Header Section - Compact */}
      <CardHeader
        className={`p-3 ${
          hasCoverages ? "bg-gradient-to-r from-blue-50/50 to-purple-50/50" : ""
        }`}
      >
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div
            className={`p-2.5 rounded-lg ${getAncillaryIconBgColor(
              ancillary.type
            )} relative flex-shrink-0`}
          >
            <IconComponent className="h-5 w-5" />
            {hasCoverages && (
              <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-blue-600 rounded-full flex items-center justify-center">
                <Shield className="h-2 w-2 text-white" />
              </div>
            )}
          </div>

          {/* Title and Info */}
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base font-semibold line-clamp-2 mb-1">
              {ancillary.name}
            </CardTitle>
            <div className="flex flex-wrap items-center gap-1.5">
              {ancillary.rfisc && (
                <Badge variant="outline" className="text-xs px-1.5 py-0">
                  {ancillary.rfisc}
                </Badge>
              )}
              <Badge
                className={`${getAncillaryBadgeColor(
                  ancillary.type
                )} text-xs px-1.5 py-0`}
              >
                {ancillary.type}
              </Badge>
              {ancillary.subType && (
                <Badge variant="secondary" className="text-xs px-1.5 py-0">
                  {ancillary.subType}
                </Badge>
              )}
              {hasCoverages && (
                <Badge className="bg-blue-600 text-white text-xs px-1.5 py-0">
                  {ancillary.coverages.length} Coverage
                  {ancillary.coverages.length > 1 ? "s" : ""}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      {/* Content Section - Scrollable */}
      <ScrollArea
        className={`
      ${hasCoverages || ancillary.metadata ? "h-[450px]" : "h-[200px]"}`}
      >
        <CardContent className="flex-1  pt-0 pb-3 space-y-3">
          {/* Description */}
          {ancillary.description && (
            <p className="text-sm text-gray-600 leading-relaxed">
              {ancillary.description}
            </p>
          )}

          {/* Metadata Display - Compact */}
          {ancillary.metadata && (
            <div className="space-y-2">
              <div className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                <Package className="h-3.5 w-3.5" />
                Specifications
              </div>

              {/* Baggage Metadata */}
              {ancillary.metadata.baggage && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-2.5">
                  <div className="flex flex-wrap gap-2">
                    {ancillary.metadata.baggage.weight && (
                      <div className="flex items-center gap-1 bg-white px-2 py-1 rounded text-xs border border-purple-200">
                        <Weight className="h-3 w-3 text-purple-600" />
                        <span className="font-semibold">
                          {ancillary.metadata.baggage.weight}{" "}
                          {ancillary.metadata.baggage.unit || "KG"}
                        </span>
                      </div>
                    )}
                    {ancillary.metadata.baggage.pieces && (
                      <div className="flex items-center gap-1 bg-white px-2 py-1 rounded text-xs border border-purple-200">
                        <Package className="h-3 w-3 text-purple-600" />
                        <span className="font-semibold">
                          {ancillary.metadata.baggage.pieces} pc
                        </span>
                      </div>
                    )}
                    {ancillary.metadata.baggage.dimensions && (
                      <div className="flex items-center gap-1 bg-white px-2 py-1 rounded text-xs border border-purple-200">
                        <Ruler className="h-3 w-3 text-purple-600" />
                        <span className="font-semibold">
                          {ancillary.metadata.baggage.dimensions} cm
                        </span>
                      </div>
                    )}
                    {ancillary.metadata.baggage.category && (
                      <Badge variant="secondary" className="text-xs">
                        {ancillary.metadata.baggage.category}
                      </Badge>
                    )}
                  </div>
                  {ancillary.metadata.baggage.notes && (
                    <p className="text-xs text-gray-600 mt-2">
                      {ancillary.metadata.baggage.notes}
                    </p>
                  )}
                </div>
              )}

              {/* Meal Metadata */}
              {ancillary.metadata.meal && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-2.5 space-y-1.5">
                  {ancillary.metadata.meal.type && (
                    <Badge variant="secondary" className="text-xs">
                      {ancillary.metadata.meal.type}
                    </Badge>
                  )}
                  {ancillary.metadata.meal.dietary && (
                    <p className="text-xs text-gray-600">
                      {ancillary.metadata.meal.dietary.join(", ")}
                    </p>
                  )}
                </div>
              )}

              {/* Service Metadata */}
              {ancillary.metadata.service && (
                <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-2.5 space-y-1">
                  {ancillary.metadata.service.duration && (
                    <div className="text-xs text-gray-600">
                      <span className="font-medium">Duration:</span>{" "}
                      {ancillary.metadata.service.duration}
                    </div>
                  )}
                  {ancillary.metadata.service.availability && (
                    <div className="text-xs text-gray-600">
                      {ancillary.metadata.service.availability}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Insurance Coverage Display - Compact Vertical */}
          {hasCoverages && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Shield className="h-3.5 w-3.5 text-blue-600" />
                  <span className="text-xs font-semibold text-gray-700">
                    Insurance Coverage
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                {ancillary.coverages?.map((coverage, index) => (
                  <div
                    key={coverage.id || index}
                    className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-2.5 border border-blue-200"
                  >
                    {/* Coverage Header */}
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-1">
                          <div
                            className={`px-1.5 py-0.5 rounded text-xs font-medium ${getCoverageTypeColor(
                              coverage.coverageType
                            )}`}
                          >
                            {getCoverageTypeLabel(coverage.coverageType)}
                          </div>
                          {coverage.active && (
                            <CheckCircle className="h-3 w-3 text-green-600 flex-shrink-0" />
                          )}
                        </div>
                        <div className="text-xs font-semibold text-gray-900 truncate">
                          {coverage.name}
                        </div>
                      </div>
                      {coverage.displayOrder !== null && (
                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-white border border-gray-300 flex items-center justify-center">
                          <span className="text-xs font-bold text-gray-600">
                            {coverage.displayOrder}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Coverage Amount */}
                    <div className="flex items-center gap-1 bg-white px-2 py-1 rounded border border-green-200 w-fit mb-1.5">
                      <DollarSign className="h-3 w-3 text-green-600" />
                      <span className="text-xs font-bold text-green-700">
                        {formatCurrency(
                          coverage.coverageAmount,
                          coverage.currency
                        )}
                      </span>
                    </div>

                    {/* Additional Info */}
                    {(coverage.emergencyContact || coverage.claimCondition) && (
                      <div className="space-y-1">
                        {coverage.emergencyContact && (
                          <div className="flex items-center gap-1 text-xs text-orange-600">
                            <Phone className="h-3 w-3 flex-shrink-0" />
                            <span className="truncate">
                              {coverage.emergencyContact}
                            </span>
                          </div>
                        )}
                        {coverage.claimCondition && (
                          <div className="flex items-start gap-1 bg-amber-50 border border-amber-200 rounded p-1.5">
                            <AlertCircle className="h-3 w-3 text-amber-600 flex-shrink-0 mt-0.5" />
                            <span className="text-xs text-amber-700 line-clamp-2">
                              {coverage.claimCondition}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Coverage Summary - Compact */}
              <div className="bg-blue-100 border border-blue-300 rounded-lg p-2 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-gray-700">
                    <span className="font-bold text-blue-700">
                      {ancillary.coverages.filter((c) => c.active).length}
                    </span>{" "}
                    Active
                  </span>
                  <span className="text-gray-400">•</span>
                  <span className="font-bold text-green-700">
                    {formatCurrency(
                      ancillary.coverages.reduce(
                        (sum, c) => sum + (c.coverageAmount || 0),
                        0
                      ),
                      ancillary.coverages[0]?.currency
                    )}
                  </span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </ScrollArea>

      {/* Footer - Compact Actions */}
      <div className="border-t bg-gray-50/50 px-4 py-2.5 flex items-center justify-between mt-auto">
        <div className="flex gap-1.5">
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              navigate(`/airline/ancillaries/edit/${ancillary.id}`)
            }
            className="h-7 px-2"
          >
            <Edit className="h-3.5 w-3.5" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleDelete(ancillary.id)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50 h-7 px-2"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
        <div className="text-xs text-gray-500 flex items-center gap-1">
          <span className="font-medium">
            #{ancillary.displayOrder || "N/A"}
          </span>
        </div>
      </div>
    </Card>
  );
};

export default AncillaryCard;
