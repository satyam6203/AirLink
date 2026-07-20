import * as React from "react"
import { 

  ChevronDown,
  ChevronRight,

  Menu,
  X
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { LogOut } from "lucide-react"
import { useDispatch } from "react-redux"
import { logout } from "@/Redux/user/userThunks"
import {
  useNavigate,
  useLocation
} from "react-router-dom";
import { sidebarSections } from "./sideBarSections"



const AirlineSidebar = ({ activeSection, onSectionChange, isCollapsed, onToggleCollapse }) => {
  const [expandedSections, setExpandedSections] = React.useState({
    airlines: false,
    flights: true,
    seats: false,
    pricing: false,
    bookings: false,
    reports: true,
    meals: false,
    ancillaries: false
  })

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }))
  }



  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  return (
    <div className={cn(
      "fixed left-0 top-0 h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white transition-all duration-300 ease-in-out z-50 shadow-2xl",
      isCollapsed ? "w-16" : "w-80"
    )}>
      {/* Header */}
      <div className="p-6 border-b border-slate-700/50">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Airline Dashboard
              </h1>
              <p className="text-slate-400 text-sm mt-1">Management Console</p>
            </div>
          )}
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onToggleCollapse}
            className="text-slate-400 hover:text-white hover:bg-slate-700/50 p-2"
          >
            {isCollapsed ? <Menu className="h-5 w-5" /> : <X className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 py-4 space-y-2 h-[88vh]">
        {sidebarSections.map((section) => {
          const SectionIcon = section.icon
          const isExpanded = expandedSections[section.id]
          const hasActiveItem = section.items.some(item => item.path === location.pathname)

          return (
            <div key={section.id} className="px-3">
              {/* Section Header */}
              <button
                onClick={() => toggleSection(section.id)}
                className={cn(
                  "w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 group",
                  "hover:bg-gradient-to-r hover:from-slate-700/50 hover:to-slate-600/50",
                  hasActiveItem && "bg-gradient-to-r from-slate-700/70 to-slate-600/70",
                  isCollapsed && "justify-center"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "p-2 rounded-lg bg-gradient-to-r transition-all duration-200",
                    section.color,
                    "group-hover:scale-110 group-hover:shadow-lg"
                  )}>
                    <SectionIcon className="h-5 w-5 text-white" />
                  </div>
                  {!isCollapsed && (
                    <span className="font-medium text-slate-200 group-hover:text-white transition-colors">
                      {section.title}
                    </span>
                  )}
                </div>
                {!isCollapsed && (
                  <div className="flex items-center gap-2">
                    {section.items.some(item => item.count) && (
                      <Badge className="bg-slate-600 text-slate-200 text-xs">
                        {section.items.reduce((sum, item) => sum + (item.count || 0), 0)}
                      </Badge>
                    )}
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4 text-slate-400 transition-transform duration-200" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-slate-400 transition-transform duration-200" />
                    )}
                  </div>
                )}
              </button>

              {/* Section Items */}
              {!isCollapsed && (
                <div className={cn(
                  "overflow-hidden transition-all duration-300 ease-in-out",
                  isExpanded ? " opacity-100" : "max-h-0 opacity-0"
                )}>
                  <div className="mt-2 space-y-1 pl-4">
                    {section.items.map((item) => {
                      const ItemIcon = item.icon
                      const isActive = item.path === location.pathname

                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            console.log("Navigating to:", item.id)
                            onSectionChange(item.id)
                            if (item.path) {
                              navigate(item.path)
                            }
                          }}
                          className={cn(
                            "w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 group",
                            "hover:bg-slate-700/50 hover:translate-x-1",
                            isActive && "bg-gradient-to-r from-blue-900 to-cyan-600 shadow-lg transform translate-x-1"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "p-1.5 rounded-md transition-all duration-200",
                              isActive 
                                ? "bg-white/20" 
                                : "bg-slate-600/50 group-hover:bg-slate-600"
                            )}>
                              <ItemIcon className={cn(
                                "h-4 w-4 transition-colors",
                                isActive ? "text-white" : "text-slate-300 group-hover:text-white"
                              )} />
                            </div>
                            <span className={cn(
                              "text-sm font-medium transition-colors",
                              isActive ? "text-white" : "text-slate-300 group-hover:text-white"
                            )}>
                              {item.label}
                            </span>
                          </div>
                          {item.count && (
                            <Badge className={cn(
                              "text-xs transition-all duration-200",
                              isActive 
                                ? "bg-white/20 text-white" 
                                : "bg-slate-600 text-slate-300 group-hover:bg-slate-500"
                            )}>
                              {item.count}
                            </Badge>
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Collapsed tooltip items */}
              {isCollapsed && (
                <div className="relative group">
                  <div className="absolute left-full top-0 ml-2 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 z-50">
                    <div className="bg-slate-800 border border-slate-600 rounded-lg shadow-xl p-3 min-w-48">
                      <h3 className="font-medium text-white mb-2">{section.title}</h3>
                      <div className="space-y-1">
                        {section.items.map((item) => {
                          const ItemIcon = item.icon
                          const isActive = item.path === location.pathname
                          return (
                            <button
                              key={item.id}
                              onClick={() => {
                                onSectionChange(item.id)
                                if (item.path) {
                                  navigate(item.path)
                                }
                              }}
                              className={cn(
                                "w-full flex items-center justify-between p-2 rounded transition-colors",
                                isActive
                                  ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white"
                                  : "hover:bg-slate-700/50"
                              )}
                            >
                              <div className="flex items-center gap-2">
                                <ItemIcon className={cn(
                                  "h-4 w-4",
                                  isActive ? "text-white" : "text-slate-300"
                                )} />
                                <span className={cn(
                                  "text-sm",
                                  isActive ? "text-white" : "text-slate-300"
                                )}>{item.label}</span>
                              </div>
                              {item.count && (
                                <Badge className={cn(
                                  "text-xs",
                                  isActive
                                    ? "bg-white/20 text-white"
                                    : "bg-slate-600 text-slate-300"
                                )}>
                                  {item.count}
                                </Badge>
                              )}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
        <div className="px-3 mt-4">
          {/* <Button ><LogOut/> Logout</Button> */}
          <button
                onClick={handleLogout}
                
                className={cn(
                  "w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 group",
                  "hover:bg-gradient-to-r hover:from-slate-700/50 hover:to-slate-600/50",
                 
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "p-2 rounded-lg bg-gradient-to-r transition-all duration-200 bg-red-600",
                    
                    "group-hover:scale-110 group-hover:shadow-lg"
                  )}>
                    <LogOut className="h-5 w-5 text-white" />
                  </div>
                  <span>Logout</span>
                  
                </div>
              
                 
               
              </button>
        </div>
      </ScrollArea>

      {/* Footer */}
      {!isCollapsed && (
        <div className="p-4 border-t border-slate-700/50">
          <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-blue-500/30 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-slate-200">System Status</span>
            </div>
            <p className="text-xs text-slate-400">All systems operational</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default AirlineSidebar