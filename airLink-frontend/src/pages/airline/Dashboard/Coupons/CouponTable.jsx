import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Percent,
  Filter,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Calendar,
  DollarSign,
  Users,
  X,
  Plus,
  Tag,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useDispatch, useSelector } from "react-redux";
import { getAllCoupons, deleteCoupon } from "@/Redux/coupon/couponThunk";
import { toast } from "sonner";

const CouponTable = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [keyword, setKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortField, setSortField] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { paginatedCoupons } = useSelector((store) => store.coupon);

  useEffect(() => {
    dispatch(
      getAllCoupons({
        page: currentPage - 1,
        size: itemsPerPage,
        status: statusFilter !== "all" ? statusFilter : undefined,
        keyword: keyword || undefined,
        sort: `${sortField},${sortDirection}`,
      })
    );
  }, [dispatch, currentPage, statusFilter, keyword, sortField, sortDirection]);

  const paginatedData = paginatedCoupons?.content || [];
  const totalPages = paginatedCoupons?.totalPages || 0;
  const totalElements = paginatedCoupons?.totalElements || 0;

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const clearFilters = () => {
    setKeyword("");
    setStatusFilter("all");
    setCurrentPage(1);
  };

  const hasActiveFilters = keyword || statusFilter !== "all";

  const getStatusBadge = (status, coupon) => {
    const statusConfig = {
      ACTIVE: {
        color: "bg-green-100 text-green-800 border-green-200",
        label: "Active",
      },
      INACTIVE: {
        color: "bg-gray-100 text-gray-800 border-gray-200",
        label: "Inactive",
      },
      EXPIRED: {
        color: "bg-red-100 text-red-800 border-red-200",
        label: "Expired",
      },
      DEPLETED: {
        color: "bg-orange-100 text-orange-800 border-orange-200",
        label: "Depleted",
      },
    };

    const config = statusConfig[status] || statusConfig["ACTIVE"];

    return (
      <Badge className={cn("flex items-center gap-1 border", config.color)}>
        {config.label}
      </Badge>
    );
  };

  const getDiscountDisplay = (coupon) => {
    if (coupon.discountType === "PERCENTAGE") {
      return `${coupon.discountValue}%`;
    } else {
      return `$${coupon.discountValue}`;
    }
  };

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteCoupon(id)).unwrap();
      toast.success("Coupon deleted successfully");
    } catch (error) {
      toast.error(error || "Failed to delete coupon");
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Coupons</h1>
          <p className="text-muted-foreground">
            Manage discount coupons for your flights
          </p>
        </div>
        <Button
          onClick={() => navigate("/airline/coupons/new")}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Create Coupon
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by code or description..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="INACTIVE">Inactive</SelectItem>
                <SelectItem value="EXPIRED">Expired</SelectItem>
                <SelectItem value="DEPLETED">Depleted</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select
              value={`${sortField}-${sortDirection}`}
              onValueChange={(value) => {
                const [field, direction] = value.split("-");
                setSortField(field);
                setSortDirection(direction);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt-desc">Newest First</SelectItem>
                <SelectItem value="createdAt-asc">Oldest First</SelectItem>
                <SelectItem value="code-asc">Code A-Z</SelectItem>
                <SelectItem value="code-desc">Code Z-A</SelectItem>
                <SelectItem value="validUntil-asc">Expires Soon</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <div className="mt-4 flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Clear Filters
              </Button>
              <span className="text-sm text-muted-foreground">
                {totalElements} result{totalElements !== 1 ? "s" : ""} found
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Coupons ({totalElements})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort("code")}>
                    <div className="flex items-center gap-2">
                      Code
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Discount</TableHead>
                  <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort("validFrom")}>
                    <div className="flex items-center gap-2">
                      Valid Period
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead>Usage</TableHead>
                  <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort("status")}>
                    <div className="flex items-center gap-2">
                      Status
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No coupons found. Create your first coupon!
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedData.map((coupon) => (
                    <TableRow key={coupon.id} className="hover:bg-muted/50">
                      {/* Code */}
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Tag className="h-4 w-4 text-muted-foreground" />
                          <span className="font-mono font-bold">{coupon.code}</span>
                        </div>
                      </TableCell>

                      {/* Description */}
                      <TableCell>
                        <div className="max-w-xs truncate">{coupon.description}</div>
                      </TableCell>

                      {/* Discount */}
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {coupon.discountType === "PERCENTAGE" ? (
                            <Percent className="h-4 w-4 text-green-600" />
                          ) : (
                            <DollarSign className="h-4 w-4 text-green-600" />
                          )}
                          <span className="font-semibold text-green-600">
                            {getDiscountDisplay(coupon)}
                          </span>
                        </div>
                      </TableCell>

                      {/* Valid Period */}
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <div className="text-sm">
                            <div>{format(new Date(coupon.validFrom), "MMM dd, yyyy")}</div>
                            <div className="text-xs text-muted-foreground">
                              to {format(new Date(coupon.validUntil), "MMM dd, yyyy")}
                            </div>
                          </div>
                        </div>
                      </TableCell>

                      {/* Usage */}
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <div className="text-sm">
                            <div className="font-medium">
                              {coupon.usedCount} / {coupon.usageLimit || "∞"}
                            </div>
                            {coupon.remainingUsage !== null && (
                              <div className="text-xs text-muted-foreground">
                                {coupon.remainingUsage} remaining
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>

                      {/* Status */}
                      <TableCell>{getStatusBadge(coupon.status, coupon)}</TableCell>

                      {/* Actions */}
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/airline/coupons/${coupon.id}/edit`)}
                            className="flex items-center gap-1"
                          >
                            <Edit className="h-4 w-4" />
                            Edit
                          </Button>

                          {/* Delete Button with Confirmation */}
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                                Delete
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will permanently delete the coupon <strong>{coupon.code}</strong>.
                                  <br />
                                  <br />
                                  This action cannot be undone and users will no longer be able to use this coupon.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(coupon.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-muted-foreground">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                {Math.min(currentPage * itemsPerPage, totalElements)} of {totalElements} results
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(pageNum)}
                        className="w-8 h-8 p-0"
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-1"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CouponTable;
