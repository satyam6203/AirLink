import * as React from "react"
import { Settings, Globe, DollarSign, Key } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const SystemConfiguration = ({ activeSection }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-gray-600" />
          System Configuration
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Supported Currencies</h3>
              <p className="text-2xl font-bold text-blue-600">12</p>
              <p className="text-sm text-blue-800">Active currencies</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Languages</h3>
              <p className="text-2xl font-bold text-green-600">8</p>
              <p className="text-sm text-green-800">Supported languages</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">API Integrations</h3>
              <p className="text-2xl font-bold text-purple-600">45</p>
              <p className="text-sm text-purple-800">Active APIs</p>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium mb-4">Global Settings</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span>Default Currency</span>
                <Button variant="outline" size="sm">INR - Edit</Button>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span>Default Language</span>
                <Button variant="outline" size="sm">English - Edit</Button>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span>Default Timezone</span>
                <Button variant="outline" size="sm">Asia/Kolkata - Edit</Button>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium mb-4">OTA Integrations</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span>MakeMyTrip</span>
                <span className="text-green-600 font-medium">Connected</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span>Expedia</span>
                <span className="text-green-600 font-medium">Connected</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span>Booking.com</span>
                <span className="text-yellow-600 font-medium">Pending</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default SystemConfiguration
