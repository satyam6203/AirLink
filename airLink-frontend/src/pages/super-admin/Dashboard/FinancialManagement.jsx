import * as React from "react"
import { DollarSign, TrendingUp, CreditCard, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const FinancialManagement = ({ activeSection }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-green-600" />
          Financial Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <p className="text-2xl font-bold text-green-600">₹12.4M</p>
            <p className="text-sm text-green-800">Total Revenue</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <p className="text-2xl font-bold text-blue-600">₹890K</p>
            <p className="text-sm text-blue-800">Commission</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg text-center">
            <p className="text-2xl font-bold text-purple-600">8,934</p>
            <p className="text-sm text-purple-800">Transactions</p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg text-center">
            <p className="text-2xl font-bold text-red-600">12</p>
            <p className="text-sm text-red-800">Chargebacks</p>
          </div>
        </div>
        
        <div className="mt-6">
          <h3 className="font-medium mb-4">Payment Gateway Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <span>Stripe</span>
              <span className="text-green-600 font-medium">Active</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <span>Razorpay</span>
              <span className="text-green-600 font-medium">Active</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <span>PayPal</span>
              <span className="text-yellow-600 font-medium">Maintenance</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default FinancialManagement
