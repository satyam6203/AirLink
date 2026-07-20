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
  Luggage,
  Briefcase,
  Package,
  Weight,
  AlertTriangle,
  Copy,
  Power,
  PowerOff,
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/utils/formateCurrency";
import {
  deletePolicy,
  getPolicyByAirline,
} from "@/Redux/baggagePolicy/baggagePolicyThunk";
import BaggagePolicyState from "./BaggagePolicyState";

const BaggagePolicyTable = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { policies, loading, error } = useSelector(
    (state) => state.baggagePolicy
  );


 
  const [deletePolicyId, setDeletePolicyId] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);


  useEffect(() => {
    // Load baggage policies for the current airline
    dispatch(getPolicyByAirline());
  }, [dispatch]);

 

  const handleDelete = async () => {
    try {
      await dispatch(deletePolicy(deletePolicyId)).unwrap();
    } catch (error) {
      console.error("Failed to delete baggage policy:", error);
    }
    setShowDeleteDialog(false);
    setDeletePolicyId(null);
  };



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
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Error Loading Baggage Policies
            </h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => dispatch(getPolicyByAirline())}>
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

      {/* Summary Stats */}
      <BaggagePolicyState policies={policies}/>
      
      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {policies.length === 0 ? (
            <div className="text-center py-12">
              <Luggage className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Baggage Policies Found
              </h3>
              <p className="text-gray-600">
                {
                   "No baggage policies have been created yet."}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">Policy Name</TableHead>
                  <TableHead>Cabin Baggage</TableHead>
                  <TableHead>Checked Baggage</TableHead>
                  <TableHead>Extra Charge</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {policies.map((policy) => (
                  <TableRow key={policy.id} className="hover:bg-gray-50/50">
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium text-gray-900">
                          {policy.name}
                        </div>
                        {policy.description && (
                          <div className="text-sm text-gray-500 line-clamp-1">
                            {policy.description}
                          </div>
                        )}
                        
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-2">
                          <Briefcase className="h-3 w-3 text-blue-600" />
                          <span className="font-medium">
                            {policy.cabinBaggageMaxWeight || 0} kg
                          </span>
                        </div>
                        {policy.cabinBaggageMaxDimension && (
                          <div className="text-gray-500 text-xs">
                            Max: {policy.cabinBaggageMaxDimension} cm
                          </div>
                        )}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-2">
                          <Luggage className="h-3 w-3 text-green-600" />
                          <span className="font-medium">
                            {policy.checkInBaggageMaxWeight || 0} kg
                          </span>
                        </div>
                        <div className="text-gray-500 text-xs">
                          {policy.freeCheckedBagsAllowance || 0} free bag(s)
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="space-y-1 text-sm">
                        {policy.extraBaggageChargePerKg ? (
                          <div className="flex items-center gap-1">
                            <Weight className="h-3 w-3 text-orange-600" />
                            <span className="font-medium">
                              {formatCurrency(policy.extraBaggageChargePerKg)}
                              /kg
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-500">Free</span>
                        )}
                      </div>
                    </TableCell>

                    <TableCell>
                      {policy.isActive ? (
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
                          <XCircle className="h-3 w-3 mr-1" />
                          Inactive
                        </Badge>
                      )}
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
                            onClick={() =>
                              navigate(`/airline/baggage-policies/${policy.id}`)
                            }
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              navigate(
                                `/airline/baggage-policies/${policy.id}/edit`
                              )
                            }
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Policy
                          </DropdownMenuItem>
                        
                          <DropdownMenuSeparator />

                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600 focus:text-red-600"
                            onClick={() => {
                              setDeletePolicyId(policy.id);
                              setShowDeleteDialog(true);
                            }}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Policy
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



      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              baggage policy and remove it from all associated fares.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setShowDeleteDialog(false);
                setDeletePolicyId(null);
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Policy
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

   
    </div>
  );
};

export default BaggagePolicyTable;
