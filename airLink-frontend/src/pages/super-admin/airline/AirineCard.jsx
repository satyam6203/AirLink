import { Button } from "@/components/ui/button"
import { Globe } from "lucide-react"
import { CheckCircle } from "lucide-react"
import { Clock } from "lucide-react"
import { Ban } from "lucide-react"
import { XCircle } from "lucide-react"
import { FileText } from "lucide-react"
import { Users } from "lucide-react"
import { MapPin } from "lucide-react"
import React from "react"

const AirlineCard = ({
  airline,
  getStatusBadge,
  getComplianceBadge,
  onApprove,
  onReject,
  onSuspend,
  onBan,
  showApprovalActions = false
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="text-4xl">✈️</div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{airline.name}</h3>
            <p className="text-sm text-gray-600">{airline.iataCode} / {airline.icaoCode}</p>
            <div className="flex items-center gap-2 mt-1">
              {getStatusBadge(airline.status)}
              {getComplianceBadge(airline)}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="h-4 w-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Location</span>
          </div>
          <div className="text-sm">
            <div className="font-medium">{airline.country}</div>
            <div className="text-gray-600">{airline.headquarters?.name || "N/A"}</div>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <Globe className="h-4 w-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Contact</span>
          </div>
          <div className="text-sm">
            <div className="font-medium">{airline.website || "N/A"}</div>
            <div className="text-gray-600">{airline.support?.email || "N/A"}</div>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-4 w-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Alliance</span>
          </div>
          <div className="text-sm">
            <div className="font-medium">{airline.alliance || "None"}</div>
            <div className="text-gray-600">Owner: {airline.owner?.fullName || "N/A"}</div>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <FileText className="h-4 w-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Registration</span>
          </div>
          <div className="text-sm">
            <div className="font-medium">ID: {airline.id}</div>
            <div className="text-gray-600">{new Date(airline.createdAt).toLocaleDateString()}</div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="text-sm text-gray-500">
          Last Updated: {new Date(airline.updatedAt).toLocaleDateString()}
        </div>
        <div className="flex items-center gap-2">
          

          {showApprovalActions && airline.status === "INACTIVE" && (
            <>
              <Button size="sm" onClick={() => onApprove(airline.id)} className="bg-green-600 hover:bg-green-700">
                <CheckCircle className="h-3 w-3 mr-1" />
                Approve
              </Button>
              <Button variant="outline" size="sm" onClick={() => onReject(airline.id)} className="text-red-600 hover:text-red-700">
                <XCircle className="h-3 w-3 mr-1" />
                Reject
              </Button>
            </>
          )}

          {airline.status === "ACTIVE" && (
            <>
              <Button variant="outline" size="sm" onClick={() => onSuspend(airline.id)} className="text-yellow-600 hover:text-yellow-700">
                <Clock className="h-3 w-3 mr-1" />
                Suspend
              </Button>
              <Button variant="outline" size="sm" onClick={() => onBan(airline.id)} className="text-red-600 hover:text-red-700">
                <Ban className="h-3 w-3 mr-1" />
                Ban
              </Button>
            </>
          )}

          {(airline.status === "INACTIVE" || airline.status === "BANNED") && !showApprovalActions && (
            <Button size="sm" onClick={() => onApprove(airline.id)} className="bg-green-600 hover:bg-green-700">
              <CheckCircle className="h-3 w-3 mr-1" />
              Activate
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default AirlineCard