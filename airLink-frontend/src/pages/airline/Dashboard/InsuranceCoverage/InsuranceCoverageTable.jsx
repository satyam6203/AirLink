import React, { useState, useEffect } from "react";
import {
  Edit,
  Trash2,
  Eye,
  MoreHorizontal,
  Search,
  Shield,
  DollarSign,
  Phone,
  AlertCircle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Plus,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSelector, useDispatch } from "react-redux";
import {
  getAllInsuranceCoverages,
  deleteInsuranceCoverage,
  getInsuranceCoveragesByAncillaryId,
  getActiveInsuranceCoveragesByAncillaryId,
} from "@/Redux/insuranceCoverage/insuranceCoverageThunk";
import { getAllAncillaries } from "@/Redux/ancillary/ancillaryThunk";
import { Skeleton } from "@/components/ui/skeleton";

const InsuranceCoverageTable = ({ onEdit }) => {
  const dispatch = useDispatch();
  const { insuranceCoverages, loading, error } = useSelector(
    (state) => state.insuranceCoverage
  );
  const { ancillaries } = useSelector((state) => state.ancillary);

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCoverages, setFilteredCoverages] = useState([]);
  const [deleteCoverageId, setDeleteCoverageId] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedAncillary, setSelectedAncillary] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    dispatch(getAllInsuranceCoverages());
    dispatch(getAllAncillaries());
  }, [dispatch]);

  useEffect(() => {
    let filtered = [...insuranceCoverages];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (coverage) =>
          coverage.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          coverage.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          coverage.coverageType?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by ancillary
    if (selectedAncillary && selectedAncillary !== "all") {
      filtered = filtered.filter(
        (coverage) => coverage.ancillary?.id === parseInt(selectedAncillary)
      );
    }

    // Filter by status
    if (statusFilter === "active") {
      filtered = filtered.filter((coverage) => coverage.active);
    } else if (statusFilter === "inactive") {
      filtered = filtered.filter((coverage) => !coverage.active);
    }

    // Sort by display order
    filtered.sort((a, b) => (a.displayOrder || 999) - (b.displayOrder || 999));

    setFilteredCoverages(filtered);
  }, [insuranceCoverages, searchTerm, selectedAncillary, statusFilter]);

  const handleDelete = async () => {
    try {
      await dispatch(deleteInsuranceCoverage(deleteCoverageId)).unwrap();
      dispatch(getAllInsuranceCoverages());
      setShowDeleteDialog(false);
      setDeleteCoverageId(null);
    } catch (error) {
      console.error("Failed to delete insurance coverage:", error);
    }
  };

  const formatCurrency = (value, currency = "INR") => {
    if (!value) return "N/A";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
    }).format(value);
  };

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

  const getCategoryColor = (type) => {
    if (type?.includes("BAGGAGE")) return "bg-blue-100 text-blue-800 border-blue-200";
    if (type === "PERSONAL_ACCIDENT") return "bg-red-100 text-red-800 border-red-200";
    if (type?.includes("TRIP") || type?.includes("FLIGHT"))
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    if (type?.includes("DATE") || type?.includes("CANCELLATION"))
      return "bg-green-100 text-green-800 border-green-200";
    return "bg-purple-100 text-purple-800 border-purple-200";
  };

  // Filter ancillaries to show only TRAVEL_PROTECTION
  const travelProtectionAncillaries = ancillaries.filter(
    (a) => a.type === "TRAVEL_PROTECTION"
  );

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex space-x-4">
                  <Skeleton className="h-12 w-full" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Error Loading Insurance Coverages
            </h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => dispatch(getAllInsuranceCoverages())}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header & Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Title & Search */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  Insurance Coverages ({filteredCoverages.length})
                </h3>
                <p className="text-sm text-muted-foreground">
                  Manage coverage details for travel protection
                </p>
              </div>
              <Button onClick={() => onEdit && onEdit(null)} className="bg-gradient-to-r from-blue-600 to-purple-600">
                <Plus className="h-4 w-4 mr-2" />
                Add Coverage
              </Button>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search coverages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Ancillary Filter */}
              <Select value={selectedAncillary} onValueChange={setSelectedAncillary}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by Ancillary" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ancillaries</SelectItem>
                  {travelProtectionAncillaries.map((ancillary) => (
                    <SelectItem key={ancillary.id} value={ancillary.id.toString()}>
                      {ancillary.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Status Filter */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active Only</SelectItem>
                  <SelectItem value="inactive">Inactive Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {filteredCoverages.length === 0 ? (
            <div className="text-center py-12">
              <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Insurance Coverages Found
              </h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || selectedAncillary !== "all" || statusFilter !== "all"
                  ? "No coverages match your filters."
                  : "No insurance coverages have been created yet."}
              </p>
              <Button onClick={() => onEdit && onEdit(null)}>
                <Plus className="h-4 w-4 mr-2" />
                Create First Coverage
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">Order</TableHead>
                  <TableHead className="w-[250px]">Coverage Details</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Ancillary</TableHead>
                  <TableHead>Coverage Amount</TableHead>
                  <TableHead>Emergency Contact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCoverages.map((coverage) => (
                  <TableRow key={coverage.id} className="hover:bg-gray-50/50">
                    {/* Display Order */}
                    <TableCell>
                      <Badge variant="outline" className="font-mono">
                        {coverage.displayOrder || "-"}
                      </Badge>
                    </TableCell>

                    {/* Coverage Details */}
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium text-gray-900">
                          {coverage.name}
                        </div>
                        {coverage.description && (
                          <div className="text-xs text-gray-500 line-clamp-2">
                            {coverage.description}
                          </div>
                        )}
                      </div>
                    </TableCell>

                    {/* Coverage Type */}
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`${getCategoryColor(coverage.coverageType)}`}
                      >
                        {getCoverageTypeLabel(coverage.coverageType)}
                      </Badge>
                    </TableCell>

                    {/* Ancillary */}
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium text-sm">
                          {coverage.ancillary?.name || "N/A"}
                        </div>
                        {coverage.ancillary?.subType && (
                          <Badge variant="secondary" className="text-xs">
                            {coverage.ancillary.subType}
                          </Badge>
                        )}
                      </div>
                    </TableCell>

                    {/* Coverage Amount */}
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-semibold text-green-600">
                          {formatCurrency(
                            coverage.coverageAmount,
                            coverage.currency
                          )}
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {coverage.isFlat ? "Flat Amount" : "Percentage"}
                        </Badge>
                      </div>
                    </TableCell>

                    {/* Emergency Contact */}
                    <TableCell>
                      {coverage.emergencyContact ? (
                        <div className="flex items-center gap-1 text-sm">
                          <Phone className="h-3 w-3 text-orange-600" />
                          <span className="text-xs">
                            {coverage.emergencyContact}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">Not provided</span>
                      )}
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <Badge
                        variant={coverage.active ? "default" : "secondary"}
                        className="flex items-center gap-1 w-fit"
                      >
                        {coverage.active ? (
                          <>
                            <CheckCircle className="h-3 w-3" /> Active
                          </>
                        ) : (
                          <>
                            <XCircle className="h-3 w-3" /> Inactive
                          </>
                        )}
                      </Badge>
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => onEdit && onEdit(coverage)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Coverage
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600 focus:text-red-600"
                            onClick={() => {
                              setDeleteCoverageId(coverage.id);
                              setShowDeleteDialog(true);
                            }}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Coverage
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <div className="text-sm">
                <div className="font-medium">
                  {filteredCoverages.filter((c) => c.active).length} Active
                </div>
                <div className="text-gray-500">Coverages</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-blue-600" />
              <div className="text-sm">
                <div className="font-medium">
                  {filteredCoverages.filter((c) => c.isFlat).length} Flat Amount
                </div>
                <div className="text-gray-500">Coverages</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4 text-orange-600" />
              <div className="text-sm">
                <div className="font-medium">
                  {filteredCoverages.filter((c) => c.emergencyContact).length}{" "}
                  With Contact
                </div>
                <div className="text-gray-500">Coverages</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-purple-600" />
              <div className="text-sm">
                <div className="font-medium">{ancillaries.filter(a => a.type === "TRAVEL_PROTECTION").length} Insurance</div>
                <div className="text-gray-500">Products</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Delete Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the insurance
              coverage and remove it from all associated ancillaries.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Coverage
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default InsuranceCoverageTable;
