import * as React from "react"
import { Shield, Lock, AlertTriangle, CheckCircle, FileText } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const SecurityCompliance = ({ activeSection }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-red-600" />
          Security & Compliance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <p className="text-2xl font-bold text-blue-600">15</p>
            <p className="text-sm text-blue-800">Role Permissions</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <p className="text-2xl font-bold text-green-600">234</p>
            <p className="text-sm text-green-800">KYC Verified</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg text-center">
            <p className="text-2xl font-bold text-purple-600">5,432</p>
            <p className="text-sm text-purple-800">Audit Logs</p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg text-center">
            <p className="text-2xl font-bold text-red-600">3</p>
            <p className="text-sm text-red-800">Threat Alerts</p>
          </div>
        </div>
        
        <div className="space-y-6">
          <div>
            <h3 className="font-medium mb-4">Compliance Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>GDPR Compliance</span>
                </div>
                <Badge className="bg-green-100 text-green-800">Active</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>PCI DSS Compliance</span>
                </div>
                <Badge className="bg-green-100 text-green-800">Certified</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  <span>ISO 27001 Audit</span>
                </div>
                <Badge className="bg-yellow-100 text-yellow-800">Due Soon</Badge>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium mb-4">Recent Security Events</h3>
            <div className="space-y-3">
              <div className="p-3 bg-red-50 rounded border-l-4 border-red-500">
                <p className="font-medium text-red-800">Suspicious Login Attempt</p>
                <p className="text-sm text-red-600">Multiple failed login attempts from IP: 192.168.1.100</p>
                <p className="text-xs text-red-500 mt-1">2 hours ago</p>
              </div>
              <div className="p-3 bg-yellow-50 rounded border-l-4 border-yellow-500">
                <p className="font-medium text-yellow-800">Unusual Payment Pattern</p>
                <p className="text-sm text-yellow-600">High-value transactions detected for user ID: USR-12345</p>
                <p className="text-xs text-yellow-500 mt-1">4 hours ago</p>
              </div>
              <div className="p-3 bg-green-50 rounded border-l-4 border-green-500">
                <p className="font-medium text-green-800">Security Patch Applied</p>
                <p className="text-sm text-green-600">System security update completed successfully</p>
                <p className="text-xs text-green-500 mt-1">6 hours ago</p>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium mb-4">Role-Based Access Control</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span>Super Admin</span>
                <span className="text-sm text-gray-600">Full System Access</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span>Airline Admin</span>
                <span className="text-sm text-gray-600">Airline Management</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span>Support Agent</span>
                <span className="text-sm text-gray-600">Customer Support</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex gap-2">
          <Button className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Security Scan
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Generate Report
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default SecurityCompliance
