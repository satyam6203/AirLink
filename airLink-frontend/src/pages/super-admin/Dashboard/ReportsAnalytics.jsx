import * as React from "react"
import { BarChart3, Building2, MapPin, Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const ReportsAnalytics = ({ activeSection }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-pink-600" />
          Reports & Analytics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium mb-3">Top Performing Airlines</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>IndiGo</span>
                <span className="font-medium">₹78M</span>
              </div>
              <div className="flex justify-between">
                <span>Air India</span>
                <span className="font-medium">₹45M</span>
              </div>
              <div className="flex justify-between">
                <span>Vistara</span>
                <span className="font-medium">₹32M</span>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-medium mb-3">Busiest Routes</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>DEL → BOM</span>
                <span className="font-medium">1,247 flights</span>
              </div>
              <div className="flex justify-between">
                <span>BLR → DEL</span>
                <span className="font-medium">892 flights</span>
              </div>
              <div className="flex justify-between">
                <span>BOM → BLR</span>
                <span className="font-medium">674 flights</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 bg-purple-50 p-4 rounded-lg">
          <h3 className="font-medium mb-3">Customer Insights</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-purple-600">67%</p>
              <p className="text-sm">Domestic Travel</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600">33%</p>
              <p className="text-sm">International</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600">2.3</p>
              <p className="text-sm">Avg Trips/Year</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default ReportsAnalytics
