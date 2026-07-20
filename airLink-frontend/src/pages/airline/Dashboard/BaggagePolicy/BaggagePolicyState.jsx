import { Card, CardContent } from '@/components/ui/card'
import { Weight, Luggage, Package, CheckCircle, TrendingUp } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import React from 'react'

const BaggagePolicyState = ({policies}) => {
  const totalPolicies = policies.length;
  const activePolicies = policies.filter((p) => p.isActive).length;
  const policiesWithFreeBags = policies.filter((p) => p.freeCheckedBagsAllowance > 0).length;
  const policiesWithCharges = policies.filter((p) => p.extraBaggageChargePerKg > 0).length;
  const totalFreeBags = policies.reduce((sum, p) => sum + (p.freeCheckedBagsAllowance || 0), 0);

  const activePercentage = totalPolicies > 0 ? Math.round((activePolicies / totalPolicies) * 100) : 0;
  const freeBagsPercentage = totalPolicies > 0 ? Math.round((policiesWithFreeBags / totalPolicies) * 100) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Active Policies Card */}
      <Card className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 border-green-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-green-100 rounded-full -mr-16 -mt-16 opacity-50" />
        <CardContent className="p-6 relative">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-xl shadow-sm">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
              {activePercentage}%
            </Badge>
          </div>
          <div className="space-y-1">
            <div className="text-3xl font-bold text-green-700">
              {activePolicies}
            </div>
            <div className="text-sm font-medium text-green-600">Active Policies</div>
            <div className="text-xs text-green-500 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              Out of {totalPolicies} total
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Policies With Free Bags Card */}
      <Card className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-blue-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full -mr-16 -mt-16 opacity-50" />
        <CardContent className="p-6 relative">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-xl shadow-sm">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
            <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200">
              {freeBagsPercentage}%
            </Badge>
          </div>
          <div className="space-y-1">
            <div className="text-3xl font-bold text-blue-700">
              {policiesWithFreeBags}
            </div>
            <div className="text-sm font-medium text-blue-600">With Free Bags</div>
            <div className="text-xs text-blue-500 flex items-center gap-1">
              <Package className="h-3 w-3" />
              Complimentary allowance
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Paid Extra Baggage Card */}
      <Card className="bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 border-orange-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100 rounded-full -mr-16 -mt-16 opacity-50" />
        <CardContent className="p-6 relative">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-orange-100 rounded-xl shadow-sm">
              <Weight className="h-6 w-6 text-orange-600" />
            </div>
            <Badge variant="secondary" className="bg-orange-100 text-orange-700 border-orange-200">
              Paid
            </Badge>
          </div>
          <div className="space-y-1">
            <div className="text-3xl font-bold text-orange-700">
              {policiesWithCharges}
            </div>
            <div className="text-sm font-medium text-orange-600">With Extra Charges</div>
            <div className="text-xs text-orange-500 flex items-center gap-1">
              <Weight className="h-3 w-3" />
              Per kg pricing
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Total Free Bags Card */}
      <Card className="bg-gradient-to-br from-purple-50 via-fuchsia-50 to-pink-50 border-purple-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-100 rounded-full -mr-16 -mt-16 opacity-50" />
        <CardContent className="p-6 relative">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-purple-100 rounded-xl shadow-sm">
              <Luggage className="h-6 w-6 text-purple-600" />
            </div>
            <Badge variant="secondary" className="bg-purple-100 text-purple-700 border-purple-200">
              Total
            </Badge>
          </div>
          <div className="space-y-1">
            <div className="text-3xl font-bold text-purple-700">
              {totalFreeBags}
            </div>
            <div className="text-sm font-medium text-purple-600">Total Free Bags</div>
            <div className="text-xs text-purple-500 flex items-center gap-1">
              <Luggage className="h-3 w-3" />
              Combined allowance
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default BaggagePolicyState