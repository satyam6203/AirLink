import React, { useEffect } from "react";
import {
  ArrowLeft,
  Edit,
  FileText,
  DollarSign,
  Clock,
  Shield,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  RefreshCw,
  Percent,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getFareRuleById } from "@/Redux/fareRules/fareRulesThunk";
import { Skeleton } from "@/components/ui/skeleton";

const FareRulesDetail = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const { currentFareRule, loading, error } = useSelector((state) => state.fareRules);

  useEffect(() => {
    if (id) {
      dispatch(getFareRuleById(id));
    }
  }, [dispatch, id]);

  const formatCurrency = (value) => {
    if (!value) return "Free";
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-6 w-48" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-6">
                <Skeleton className="h-8 w-64 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (error || !currentFareRule) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Fare Rule</h3>
            <p className="text-gray-600 mb-4">{error || "Fare rule not found"}</p>
            <Button onClick={() => navigate("/airline/fare-rules")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Fare Rules
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const rule = currentFareRule;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/airline/fare-rules")}
            className="flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Rules
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <div className="bg-primary/10 p-3 rounded-lg">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              {rule.ruleName}
            </h1>
            <p className="text-gray-600 mt-1">Fare Rule Details</p>
          </div>
        </div>
        <Button onClick={() => navigate(`/airline/fare-rules/${rule.id}/edit`)}>
          <Edit className="h-4 w-4 mr-2" />
          Edit Rule
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5 text-blue-600" />
                Rule Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Rule Name</h4>
                  <p className="text-gray-600">{rule.ruleName}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Airline ID</h4>
                  <p className="text-gray-600">{rule.airlineId}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <Badge
                  variant={rule.isRefundable ? "default" : "secondary"}
                  className="flex items-center gap-1"
                >
                  {rule.isRefundable ? (
                    <CheckCircle className="h-3 w-3" />
                  ) : (
                    <XCircle className="h-3 w-3" />
                  )}
                  {rule.isRefundable ? "Refundable" : "Non-Refundable"}
                </Badge>

                <Badge
                  variant={rule.upgradePossible ? "outline" : "secondary"}
                  className="flex items-center gap-1"
                >
                  {rule.upgradePossible ? (
                    <CheckCircle className="h-3 w-3" />
                  ) : (
                    <XCircle className="h-3 w-3" />
                  )}
                  {rule.upgradePossible ? "Upgradeable" : "Fixed Class"}
                </Badge>
              </div>

              {rule.additionalRestrictions && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Additional Restrictions</h4>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-gray-700 text-sm whitespace-pre-wrap">
                      {rule.additionalRestrictions}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Fees Structure */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                Fees Structure
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <RefreshCw className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <h4 className="font-medium text-gray-900">Change Fee</h4>
                  <p className="text-2xl font-bold text-blue-600">
                    {formatCurrency(rule.changeFee)}
                  </p>
                </div>

                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <XCircle className="h-8 w-8 text-red-600 mx-auto mb-2" />
                  <h4 className="font-medium text-gray-900">Cancellation Fee</h4>
                  <p className="text-2xl font-bold text-red-600">
                    {formatCurrency(rule.cancellationFee)}
                  </p>
                </div>

                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <AlertTriangle className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                  <h4 className="font-medium text-gray-900">No-Show Fee</h4>
                  <p className="text-2xl font-bold text-orange-600">
                    {formatCurrency(rule.noShowFee)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Deadlines */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-purple-600" />
                Time Limits & Deadlines
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center space-x-3 p-4 border rounded-lg">
                  <Clock className="h-8 w-8 text-blue-600" />
                  <div>
                    <h4 className="font-medium text-gray-900">Refund Deadline</h4>
                    <p className="text-gray-600">
                      {rule.refundDeadlineDays ? (
                        `${rule.refundDeadlineDays} days before departure`
                      ) : (
                        "No deadline set"
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-4 border rounded-lg">
                  <Clock className="h-8 w-8 text-green-600" />
                  <div>
                    <h4 className="font-medium text-gray-900">Change Deadline</h4>
                    <p className="text-gray-600">
                      {rule.changeDeadlineHours ? (
                        `${rule.changeDeadlineHours} hours before departure`
                      ) : (
                        "No deadline set"
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Refundable</span>
                <Badge variant={rule.isRefundable ? "default" : "secondary"}>
                  {rule.isRefundable ? "Yes" : "No"}
                </Badge>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">Upgradeable</span>
                <Badge variant={rule.upgradePossible ? "outline" : "secondary"}>
                  {rule.upgradePossible ? "Yes" : "No"}
                </Badge>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">Mileage Earn</span>
                <Badge variant="outline" className="text-yellow-700 border-yellow-300">
                  {rule.mileageEarnPercentage || 0}%
                </Badge>
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-medium text-gray-900 mb-2">Total Fees</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Change:</span>
                    <span className="font-medium">{formatCurrency(rule.changeFee)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cancel:</span>
                    <span className="font-medium">{formatCurrency(rule.cancellationFee)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>No-Show:</span>
                    <span className="font-medium">{formatCurrency(rule.noShowFee)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Mileage Earning */}
          {rule.mileageEarnPercentage && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Percent className="h-5 w-5 text-yellow-600" />
                  Mileage Program
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <Percent className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                  <h4 className="font-medium text-gray-900">Earn Rate</h4>
                  <p className="text-3xl font-bold text-yellow-600">
                    {rule.mileageEarnPercentage}%
                  </p>
                  <p className="text-sm text-gray-600 mt-1">of base fare value</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={() => navigate(`/airline/fare-rules/${rule.id}/edit`)}
                className="w-full"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Rule
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate(`/airline/fare-rules/duplicate/${rule.id}`)}
                className="w-full"
              >
                <FileText className="h-4 w-4 mr-2" />
                Duplicate Rule
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FareRulesDetail;