import React, { useState, useEffect } from "react";
import {
  Edit,
  Trash2,
  Eye,
  MoreHorizontal,
  Search,
  Filter,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  DollarSign,
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  getAllFareRules,
  deleteFareRule,
  getFareRulesByAirline,
} from "@/Redux/fareRules/fareRulesThunk";
import { Skeleton } from "@/components/ui/skeleton";

const FareRulesTable = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { fareRules, loading, error } = useSelector((state) => state.fareRules);
  const { user } = useSelector((state) => state.auth);

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredRules, setFilteredRules] = useState([]);
  const [deleteRuleId, setDeleteRuleId] = useState(null);

  useEffect(() => {
    // Load fare rules for the airline
    if (user?.airlineId) {
      dispatch(getFareRulesByAirline(user.airlineId));
    } else {
      dispatch(getAllFareRules());
    }
  }, [dispatch, user?.airlineId]);

  useEffect(() => {
    // Filter rules based on search term
    if (searchTerm) {
      const filtered = fareRules.filter(rule =>
        rule.ruleName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rule.additionalRestrictions?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredRules(filtered);
    } else {
      setFilteredRules(fareRules);
    }
  }, [fareRules, searchTerm]);

  const handleDelete = async (ruleId) => {
    try {
      await dispatch(deleteFareRule(ruleId)).unwrap();
      // Refresh the list
      if (user?.airlineId) {
        dispatch(getFareRulesByAirline(user.airlineId));
      } else {
        dispatch(getAllFareRules());
      }
    } catch (error) {
      console.error("Failed to delete fare rule:", error);
    }
    setDeleteRuleId(null);
  };

  const formatCurrency = (value) => {
    if (!value) return "Free";
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const RefundableBadge = ({ isRefundable }) => (
    <Badge variant={isRefundable ? "default" : "secondary"} className="flex items-center gap-1">
      {isRefundable ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
      {isRefundable ? "Refundable" : "Non-Refundable"}
    </Badge>
  );

  const UpgradeBadge = ({ upgradePossible }) => (
    <Badge variant={upgradePossible ? "outline" : "secondary"} className="flex items-center gap-1">
      {upgradePossible ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
      {upgradePossible ? "Upgradeable" : "Fixed"}
    </Badge>
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
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Fare Rules</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => dispatch(getAllFareRules())}>
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Fare Rules ({filteredRules.length})</h3>
          <p className="text-sm text-muted-foreground">
            Manage pricing policies and restrictions
          </p>
        </div>
      </div>

    

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {filteredRules.length === 0 ? (
            <div className="text-center py-12">
              <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Fare Rules Found</h3>
              <p className="text-gray-600">
                {searchTerm
                  ? "No rules match your search criteria."
                  : "No fare rules have been created yet."}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Rule Name</TableHead>
                  <TableHead>Refund Policy</TableHead>
                  <TableHead>Change Policy</TableHead>
                  <TableHead>Fees</TableHead>
                  <TableHead>Deadlines</TableHead>
             
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRules.map((rule) => (
                  <TableRow key={rule.id} className="hover:bg-gray-50/50">
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium text-gray-900">
                          {rule.ruleName}
                        </div>
                        <div className="flex items-center space-x-2">
                          <RefundableBadge isRefundable={rule.isRefundable} />
                          <UpgradeBadge upgradePossible={rule.upgradePossible} />
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="space-y-1">
                        {rule.isRefundable ? (
                          <div className="text-sm">
                            <div className="text-green-600 font-medium">Refundable</div>
                            {rule.refundDeadlineDays && (
                              <div className="text-gray-500 flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {rule.refundDeadlineDays} days before departure
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="text-sm">
                            <div className="text-red-600 font-medium">Non-Refundable</div>
                          </div>
                        )}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm">
                          <div className="font-medium">
                            Fee: {formatCurrency(rule.changeFee)}
                          </div>
                          {rule.changeDeadlineHours && (
                            <div className="text-gray-500 flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {rule.changeDeadlineHours}h before departure
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3 text-blue-600" />
                          <span>Cancel: {formatCurrency(rule.cancellationFee)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3 text-orange-600" />
                          <span>No-Show: {formatCurrency(rule.noShowFee)}</span>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="space-y-1 text-sm">
                        {rule.refundDeadlineDays && (
                          <div>Refund: {rule.refundDeadlineDays}d</div>
                        )}
                        {rule.changeDeadlineHours && (
                          <div>Change: {rule.changeDeadlineHours}h</div>
                        )}
                        {!rule.refundDeadlineDays && !rule.changeDeadlineHours && (
                          <span className="text-gray-500">No deadlines</span>
                        )}
                      </div>
                    </TableCell>

                   

                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => navigate(`/airline/fare-rules/${rule.id}`)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => navigate(`/airline/fare-rules/${rule.id}/edit`)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Rule
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem
                                className="text-red-600 focus:text-red-600"
                                onSelect={(e) => {
                                  e.preventDefault();
                                  setDeleteRuleId(rule.id);
                                }}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Rule
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete the fare rule
                                  "{rule.ruleName}" and remove it from all associated flights.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel onClick={() => setDeleteRuleId(null)}>
                                  Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(rule.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete Rule
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
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
                  {filteredRules.filter(r => r.isRefundable).length} Refundable
                </div>
                <div className="text-gray-500">Rules</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <RefreshCw className="h-4 w-4 text-blue-600" />
              <div className="text-sm">
                <div className="font-medium">
                  {filteredRules.filter(r => r.upgradePossible).length} Upgradeable
                </div>
                <div className="text-gray-500">Rules</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-yellow-600" />
              <div className="text-sm">
                <div className="font-medium">
                  {filteredRules.filter(r => r.changeFee > 0).length} Paid Changes
                </div>
                <div className="text-gray-500">Rules</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-purple-600" />
              <div className="text-sm">
                <div className="font-medium">
                  {filteredRules.filter(r => r.refundDeadlineDays || r.changeDeadlineHours).length}
                </div>
                <div className="text-gray-500">With Deadlines</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FareRulesTable;