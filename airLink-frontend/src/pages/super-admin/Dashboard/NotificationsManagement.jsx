import * as React from "react"
import { Bell, Mail, Smartphone, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const NotificationsManagement = ({ activeSection }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-yellow-600" />
          Notifications & Communication
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-yellow-50 p-4 rounded-lg text-center">
            <p className="text-2xl font-bold text-yellow-600">8</p>
            <p className="text-sm text-yellow-800">System Alerts</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <p className="text-2xl font-bold text-blue-600">23</p>
            <p className="text-sm text-blue-800">Email Campaigns</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <p className="text-2xl font-bold text-green-600">156</p>
            <p className="text-sm text-green-800">SMS Alerts</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg text-center">
            <p className="text-2xl font-bold text-purple-600">7</p>
            <p className="text-sm text-purple-800">Marketing</p>
          </div>
        </div>
        
        <div>
          <h3 className="font-medium mb-4">Recent Notifications</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <div>
                <p className="font-medium">System Maintenance Alert</p>
                <p className="text-sm text-gray-600">Sent to all airlines and agents</p>
              </div>
              <Badge className="bg-blue-100 text-blue-800">Email</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <div>
                <p className="font-medium">Flight Delay Notification</p>
                <p className="text-sm text-gray-600">AI-203 delay alert to passengers</p>
              </div>
              <Badge className="bg-green-100 text-green-800">SMS</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <div>
                <p className="font-medium">New Offer Campaign</p>
                <p className="text-sm text-gray-600">Festival discount promotion</p>
              </div>
              <Badge className="bg-purple-100 text-purple-800">Marketing</Badge>
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex gap-2">
          <Button className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Send System Alert
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Create Campaign
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default NotificationsManagement
