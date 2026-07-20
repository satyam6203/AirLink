import * as React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Bell,
  Crown,
  AlertTriangle,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";
import SuperAdminSidebar from "../Sidebar/SuperAdminSidebar";
import SuperAdminRoutes from "../routes/SuperAdminRoutes";
import {
  getActiveSectionFromPath,
  getSectionTitle,
  getSectionDescription,
  navigateToSection,
} from "../utils/routingUtils";
import { SIDEBAR_COLLAPSE_KEY } from "../constants";

const SuperAdminDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();


  const [activeSection, setActiveSection] = React.useState(
    getActiveSectionFromPath(location.pathname)
  );
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(() => {
    // Load sidebar collapse state from localStorage
    try {
      const saved = localStorage.getItem(SIDEBAR_COLLAPSE_KEY);
      return saved ? JSON.parse(saved) : false;
    } catch (error) {
      console.warn('Failed to load sidebar state from localStorage:', error);
      return false;
    }
  });

  // Update active section when location changes
  React.useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    setActiveSection(getActiveSectionFromPath(location.pathname, urlParams));
  }, [location.pathname, location.search]);

  // Handle sidebar section changes using the utility function
  const handleSectionChange = React.useCallback((sectionId) => {
    try {
      navigateToSection(sectionId, navigate);
    } catch (error) {
      console.error('Navigation error:', error);
      // Could show a toast notification here in production
    }
  }, [navigate]);

  const toggleSidebar = React.useCallback(() => {
    const newState = !isSidebarCollapsed;
    setIsSidebarCollapsed(newState);

    // Save sidebar state to localStorage
    try {
      localStorage.setItem(SIDEBAR_COLLAPSE_KEY, JSON.stringify(newState));
    } catch (error) {
      console.warn('Failed to save sidebar state to localStorage:', error);
    }
  }, [isSidebarCollapsed]);


  // Mock platform statistics
  const platformStats = {
    totalAirlines: 24,
    activeAirlines: 21,
    totalAirports: 156,
    totalFlights: 1247,
    activeFlights: 89,
    totalBookings: 15643,
    totalUsers: 45678,
    totalAgents: 234,
    systemRevenue: 12450000,
    commissionRevenue: 890000,
    pendingApprovals: 8,
    securityAlerts: 3,
    systemUptime: 99.97,
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <SuperAdminSidebar
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={toggleSidebar}
      />

      {/* Main Content Area */}
      <div
        className={cn(
          "flex-1 transition-all duration-300 ease-in-out",
          isSidebarCollapsed ? "ml-16" : "ml-80"
        )}
      >
        {/* Header */}
        <div className="bg-background border-b border-border sticky top-0 z-30">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                  <Crown className="h-6 w-6 text-primary" />
                  {getSectionTitle(activeSection)}
                </h1>
                <p className="text-muted-foreground">
                  {getSectionDescription(activeSection)}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <ThemeToggle />
                <Button variant="outline" className="flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  System Alerts
                  <Badge className="ml-1 bg-red-100 text-red-800">
                    {platformStats.securityAlerts}
                  </Badge>
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Pending Approvals
                  <Badge className="ml-1 bg-yellow-100 text-yellow-800">
                    {platformStats.pendingApprovals}
                  </Badge>
                </Button>
                <Button className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Admin Actions
                </Button>
              </div>
            </div>

          </div>
        </div>

        {/* Main Content */}
        <ScrollArea className="flex-1 p-6">
          <SuperAdminRoutes platformStats={platformStats} />
        </ScrollArea>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
