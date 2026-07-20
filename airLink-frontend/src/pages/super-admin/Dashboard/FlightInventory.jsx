import * as React from "react"
import { Plane, Activity, AlertTriangle, Eye, Edit } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const FlightInventory = ({ activeSection }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plane className="h-5 w-5 text-blue-600" />
          Flight Inventory Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center gap-3">
              <Activity className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold text-blue-600">1,247</p>
                <p className="text-sm text-blue-800">Total Flights</p>
              </div>
            </div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center gap-3">
              <Plane className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-green-600">89</p>
                <p className="text-sm text-green-800">Live Flights</p>
              </div>
            </div>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-8 w-8 text-red-600" />
              <div>
                <p className="text-2xl font-bold text-red-600">15</p>
                <p className="text-sm text-red-800">Issues</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <h3 className="font-medium mb-4">Recent Flight Activities</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <div>
                <p className="font-medium">AI-203 (DEL → BOM)</p>
                <p className="text-sm text-gray-600">Departed on time</p>
              </div>
              <Badge className="bg-green-100 text-green-800">On Time</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <div>
                <p className="font-medium">6E-425 (BLR → DEL)</p>
                <p className="text-sm text-gray-600">Delayed by 30 minutes</p>
              </div>
              <Badge className="bg-yellow-100 text-yellow-800">Delayed</Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default FlightInventory
