import React from "react";
import {
  Plus,
  FileText,
  Settings,
  TrendingUp,
  Shield,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import FareRulesTable from "./FareRulesTable";
import { useSelector } from "react-redux";
import { Badge } from "@/components/ui/badge";

const FareRulesManagement = () => {
  const navigate = useNavigate();
  const { fareRules } = useSelector((state) => state.fareRules);
  const { user } = useSelector((state) => state.auth);

  const stats = {
    total: fareRules?.length || 0,
    refundable: fareRules?.filter(r => r.isRefundable).length || 0,
    upgradeable: fareRules?.filter(r => r.upgradePossible).length || 0,
    withFees: fareRules?.filter(r => r.changeFee > 0 || r.cancellationFee > 0).length || 0,
  };

  const handleCreateNew = () => {
    navigate("/airline/fare-rules/new");
  };



  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <div className="bg-primary/10 p-3 rounded-lg">
              <FileText className="h-8 w-8 text-primary" />
            </div>
            Fare Rules Management
          </h1>
          <p className="text-gray-600 mt-2">
            Create and manage fare policies that control pricing, refunds, and changes
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={() => navigate("/airline/fare-rules/help")}>
            <Info className="h-4 w-4 mr-2" />
            Help Guide
          </Button>
          <Button onClick={handleCreateNew} className="bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-2" />
            Create Fare Rule
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Rules</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg mr-3">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Refundable</p>
                <p className="text-2xl font-bold text-gray-900">{stats.refundable}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg mr-3">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Upgradeable</p>
                <p className="text-2xl font-bold text-gray-900">{stats.upgradeable}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg mr-3">
                <Settings className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">With Fees</p>
                <p className="text-2xl font-bold text-gray-900">{stats.withFees}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      

      {/* Info Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-blue-50/50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Info className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-blue-900 mb-1">Fare Rules Impact</h4>
                <p className="text-sm text-blue-700">
                  These rules apply to all flights using the associated fare classes.
                  Changes affect future bookings immediately.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50/50 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Shield className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-semibold text-green-900 mb-1">Best Practices</h4>
                <p className="text-sm text-green-700">
                  Create different rule sets for different fare types (Basic, Standard, Flexible)
                  to offer passengers choice.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-orange-50/50 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Settings className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <h4 className="font-semibold text-orange-900 mb-1">Revenue Strategy</h4>
                <p className="text-sm text-orange-700">
                  Balance customer flexibility with revenue protection using
                  appropriate fees and deadlines.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Table */}
      <FareRulesTable />

      {/* Footer Info */}
      <Card className="bg-gray-50 border-gray-200">
        <CardContent className="p-6">
          <div className="text-center space-y-2">
            <h4 className="font-semibold text-gray-900">Need Help?</h4>
            <p className="text-sm text-gray-600">
              Learn more about fare rules and best practices in our comprehensive guide.
            </p>
            <Button variant="outline" onClick={() => navigate("/airline/help/fare-rules")}>
              <FileText className="h-4 w-4 mr-2" />
              View Documentation
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FareRulesManagement;