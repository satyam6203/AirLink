import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllPayments } from "@/Redux/payment/paymentThunk";
import {
  Search,
  Filter,
  DollarSign,
  CreditCard,
  Download,
  Eye,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  Loader2,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Calendar,
  User,
  Plane,
  Building,
  Hash,
  TrendingUp,
  TrendingDown,
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
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

const TransactionsManagement = () => {
  const dispatch = useDispatch();
  const { payments, loading, error, totalPages, totalElements, currentPage } =
    useSelector((state) => state.payment);

  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [gatewayFilter, setGatewayFilter] = React.useState("all");
  const [sortBy, setSortBy] = React.useState("createdAt");
  const [sortDirection, setSortDirection] = React.useState("DESC");
  const [page, setPage] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(20);
  const [selectedPayment, setSelectedPayment] = React.useState(null);
  const [showPaymentDetails, setShowPaymentDetails] = React.useState(false);

  // Fetch payments with filters
  React.useEffect(() => {
    dispatch(
      getAllPayments({
        page,
        size: pageSize,
        sortBy,
        sortDirection,
      })
    );
  }, [dispatch, page, pageSize, sortBy, sortDirection]);

  // Filter payments locally
  const filteredPayments = React.useMemo(() => {
    if (!payments) return [];

    return payments.filter((payment) => {
      const matchesSearch =
        !searchQuery ||
        payment.transactionId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payment.gatewayPaymentId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payment.bookingId?.toString().includes(searchQuery);

      const matchesStatus =
        statusFilter === "all" ||
        payment.status?.toUpperCase() === statusFilter.toUpperCase();

      const matchesGateway =
        gatewayFilter === "all" ||
        payment.gateway?.toUpperCase() === gatewayFilter.toUpperCase();

      return matchesSearch && matchesStatus && matchesGateway;
    });
  }, [payments, searchQuery, statusFilter, gatewayFilter]);

  // Calculate statistics
  const statistics = React.useMemo(() => {
    if (!payments || payments.length === 0) {
      return {
        totalRevenue: 0,
        successfulPayments: 0,
        pendingPayments: 0,
        failedPayments: 0,
        successRate: 0,
      };
    }

    const successful = payments.filter((p) => p.status === "SUCCESS");
    const pending = payments.filter(
      (p) => p.status === "PENDING" || p.status === "PROCESSING"
    );
    const failed = payments.filter((p) => p.status === "FAILED");

    const totalRevenue = successful.reduce(
      (sum, p) => sum + (p.amount || 0),
      0
    );
    const successRate =
      payments.length > 0
        ? ((successful.length / payments.length) * 100).toFixed(1)
        : 0;

    return {
      totalRevenue,
      successfulPayments: successful.length,
      pendingPayments: pending.length,
      failedPayments: failed.length,
      successRate,
    };
  }, [payments]);

  const getStatusBadge = (status) => {
    const statusConfig = {
      SUCCESS: {
        color: "bg-green-100 text-green-800 border-green-300",
        icon: CheckCircle,
      },
      PENDING: {
        color: "bg-yellow-100 text-yellow-800 border-yellow-300",
        icon: Clock,
      },
      PROCESSING: {
        color: "bg-blue-100 text-blue-800 border-blue-300",
        icon: Loader2,
      },
      FAILED: {
        color: "bg-red-100 text-red-800 border-red-300",
        icon: XCircle,
      },
      CANCELLED: {
        color: "bg-gray-100 text-gray-800 border-gray-300",
        icon: XCircle,
      },
      REFUNDED: {
        color: "bg-purple-100 text-purple-800 border-purple-300",
        icon: RefreshCw,
      },
    };

    const upperStatus = status?.toUpperCase();
    const config = statusConfig[upperStatus] || statusConfig["PENDING"];
    const Icon = config.icon;

    return (
      <Badge className={cn("flex items-center gap-1 border", config.color)}>
        <Icon className="h-3 w-3" />
        {status}
      </Badge>
    );
  };

  const getGatewayBadge = (gateway) => {
    const gatewayConfig = {
      RAZORPAY: { color: "bg-blue-100 text-blue-800 border-blue-300" },
      STRIPE: { color: "bg-indigo-100 text-indigo-800 border-indigo-300" },
    };

    const config =
      gatewayConfig[gateway?.toUpperCase()] || { color: "bg-gray-100 text-gray-800 border-gray-300" };

    return (
      <Badge className={cn("border", config.color)}>
        {gateway || "Unknown"}
      </Badge>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };


  const handleSort = (field) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === "ASC" ? "DESC" : "ASC");
    } else {
      setSortBy(field);
      setSortDirection("DESC");
    }
  };

  const handleRefresh = () => {
    dispatch(
      getAllPayments({
        page,
        size: pageSize,
        sortBy,
        sortDirection,
      })
    );
  };

  const handleViewDetails = (payment) => {
    setSelectedPayment(payment);
    setShowPaymentDetails(true);
  };

  if (error) {
    return (
      <div className="p-6">
        <Card className="border-red-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 text-red-600">
              <AlertCircle className="h-5 w-5" />
              <div>
                <p className="font-semibold">Error loading transactions</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
            <Button onClick={handleRefresh} className="mt-4" variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
          <p className="text-gray-600 mt-1">
            Manage and monitor all payment transactions
          </p>
        </div>
        <Button onClick={handleRefresh} disabled={loading}>
          <RefreshCw
            className={cn("mr-2 h-4 w-4", loading && "animate-spin")}
          />
          Refresh
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Revenue */}
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-green-800">
                Total Revenue
              </CardTitle>
              <div className="p-2 bg-green-200 rounded-lg">
                <DollarSign className="h-5 w-5 text-green-700" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">
              ₹{(statistics.totalRevenue)}
            </div>
            <div className="flex items-center gap-1 mt-2 text-xs text-green-700">
              <TrendingUp className="h-3 w-3" />
              <span>From successful transactions</span>
            </div>
          </CardContent>
        </Card>

        {/* Successful Payments */}
        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-blue-800">
                Successful
              </CardTitle>
              <div className="p-2 bg-blue-200 rounded-lg">
                <CheckCircle className="h-5 w-5 text-blue-700" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">
              {statistics.successfulPayments}
            </div>
            <div className="flex items-center gap-1 mt-2 text-xs text-blue-700">
              <span>{statistics.successRate}% success rate</span>
            </div>
          </CardContent>
        </Card>

        {/* Pending Payments */}
        <Card className="bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-yellow-800">
                Pending
              </CardTitle>
              <div className="p-2 bg-yellow-200 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-700" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-900">
              {statistics.pendingPayments}
            </div>
            <div className="flex items-center gap-1 mt-2 text-xs text-yellow-700">
              <span>Awaiting confirmation</span>
            </div>
          </CardContent>
        </Card>

        {/* Failed Payments */}
        <Card className="bg-gradient-to-br from-red-50 to-rose-50 border-red-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-red-800">
                Failed
              </CardTitle>
              <div className="p-2 bg-red-200 rounded-lg">
                <XCircle className="h-5 w-5 text-red-700" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-900">
              {statistics.failedPayments}
            </div>
            <div className="flex items-center gap-1 mt-2 text-xs text-red-700">
              <TrendingDown className="h-3 w-3" />
              <span>Requires attention</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by Transaction ID, Booking ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className={"w-full"}>
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="SUCCESS">Success</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="PROCESSING">Processing</SelectItem>
                <SelectItem value="FAILED">Failed</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
                <SelectItem value="REFUNDED">Refunded</SelectItem>
              </SelectContent>
            </Select>

            {/* Gateway Filter */}
            <Select value={gatewayFilter} onValueChange={setGatewayFilter}>
              <SelectTrigger className={"w-full"}>
                <SelectValue placeholder="All Gateways" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Gateways</SelectItem>
                <SelectItem value="RAZORPAY">Razorpay</SelectItem>
                <SelectItem value="STRIPE">Stripe</SelectItem>
              </SelectContent>
            </Select>

            {/* Page Size */}
            <Select
              value={pageSize.toString()}
              onValueChange={(value) => {
                setPageSize(parseInt(value));
                setPage(0);
              }}
            >
              <SelectTrigger className={"w-full"}>
                <SelectValue placeholder="Page Size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10 per page</SelectItem>
                <SelectItem value="20">20 per page</SelectItem>
                <SelectItem value="50">50 per page</SelectItem>
                <SelectItem value="100">100 per page</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              All Transactions ({filteredPayments.length})
            </CardTitle>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading && !payments ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <span className="ml-3 text-gray-600">Loading transactions...</span>
            </div>
          ) : filteredPayments.length === 0 ? (
            <div className="text-center py-12">
              <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 font-medium">No transactions found</p>
              <p className="text-gray-500 text-sm mt-1">
                Try adjusting your filters
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <button
                      onClick={() => handleSort("transactionId")}
                      className="flex items-center gap-1 hover:text-blue-600 transition-colors"
                    >
                      Transaction ID
                      {sortBy === "transactionId" &&
                        (sortDirection === "ASC" ? (
                          <ArrowUp className="h-4 w-4" />
                        ) : (
                          <ArrowDown className="h-4 w-4" />
                        ))}
                    </button>
                  </TableHead>
                  <TableHead>Booking ID</TableHead>
                  <TableHead>
                    <button
                      onClick={() => handleSort("amount")}
                      className="flex items-center gap-1 hover:text-blue-600 transition-colors"
                    >
                      Amount
                      {sortBy === "amount" &&
                        (sortDirection === "ASC" ? (
                          <ArrowUp className="h-4 w-4" />
                        ) : (
                          <ArrowDown className="h-4 w-4" />
                        ))}
                    </button>
                  </TableHead>
                  <TableHead>Gateway</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>
                    <button
                      onClick={() => handleSort("createdAt")}
                      className="flex items-center gap-1 hover:text-blue-600 transition-colors"
                    >
                      Created
                      {sortBy === "createdAt" &&
                        (sortDirection === "ASC" ? (
                          <ArrowUp className="h-4 w-4" />
                        ) : (
                          <ArrowDown className="h-4 w-4" />
                        ))}
                    </button>
                  </TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.map((payment, index) => (
                  <TableRow key={payment.id || index}>
                    <TableCell>
                      <div className="font-mono text-xs bg-gray-100 px-2 py-1 rounded inline-block">
                        {payment.transactionId || "N/A"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Hash className="h-4 w-4 text-gray-400" />
                        <span className="font-medium">
                          {payment.bookingId || "N/A"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-semibold text-gray-900">
                        ₹{payment.amount}
                      </div>
                    </TableCell>
                    <TableCell>{getGatewayBadge(payment.gateway)}</TableCell>
                    <TableCell>{getStatusBadge(payment.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(payment.createdAt)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewDetails(payment)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {/* Pagination */}
          {!loading && filteredPayments.length > 0 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t">
              <div className="text-sm text-gray-600">
                Showing {page * pageSize + 1} to{" "}
                {Math.min((page + 1) * pageSize, totalElements)} of{" "}
                {totalElements} transactions
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 0}
                  onClick={() => setPage(page - 1)}
                >
                  Previous
                </Button>
                <div className="text-sm text-gray-600">
                  Page {page + 1} of {totalPages || 1}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages - 1}
                  onClick={() => setPage(page + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Details Modal */}
      {showPaymentDetails && selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-6 w-6" />
                  Transaction Details
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPaymentDetails(false)}
                  className="text-white hover:bg-white/20"
                >
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Transaction Info */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Hash className="h-5 w-5" />
                  Transaction Information
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Transaction ID</p>
                    <p className="font-mono font-medium text-gray-900">
                      {selectedPayment.transactionId}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Gateway Payment ID</p>
                    <p className="font-mono font-medium text-gray-900">
                      {selectedPayment.gatewayPaymentId || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Booking ID</p>
                    <p className="font-medium text-gray-900">
                      {selectedPayment.bookingId}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">User ID</p>
                    <p className="font-medium text-gray-900">
                      {selectedPayment.userId || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Payment Details */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Payment Details
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Amount</p>
                    <p className="font-bold text-xl text-gray-900">
                      {(selectedPayment.amount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Currency</p>
                    <p className="font-medium text-gray-900">INR</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Payment Gateway</p>
                    <div>{getGatewayBadge(selectedPayment.gateway)}</div>
                  </div>
                  <div>
                    <p className="text-gray-600">Status</p>
                    <div>{getStatusBadge(selectedPayment.status)}</div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Timestamps */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Timeline
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Created At</span>
                    <span className="font-medium text-gray-900">
                      {formatDate(selectedPayment.createdAt)}
                    </span>
                  </div>
                  {selectedPayment.updatedAt && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Updated At</span>
                      <span className="font-medium text-gray-900">
                        {formatDate(selectedPayment.updatedAt)}
                      </span>
                    </div>
                  )}
                  {selectedPayment.completedAt && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Completed At</span>
                      <span className="font-medium text-gray-900">
                        {formatDate(selectedPayment.completedAt)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Additional Info */}
              {(selectedPayment.description || selectedPayment.metadata) && (
                <>
                  <Separator />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">
                      Additional Information
                    </h3>
                    {selectedPayment.description && (
                      <div className="text-sm mb-3">
                        <p className="text-gray-600">Description</p>
                        <p className="text-gray-900">
                          {selectedPayment.description}
                        </p>
                      </div>
                    )}
                    {selectedPayment.metadata && (
                      <div className="text-sm">
                        <p className="text-gray-600 mb-2">Metadata</p>
                        <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
                          {JSON.stringify(selectedPayment.metadata, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default TransactionsManagement;
