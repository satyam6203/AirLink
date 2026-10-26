import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Mail, Phone, User, CreditCard, Loader2, RefreshCw } from "lucide-react"
import { getUserProfile } from "@/Redux/user/userThunks"

const UserProfile = () => {
  const dispatch = useDispatch()
  const { user, loading, error } = useSelector((state) => state.auth)

  const fetchProfile = () => {
    const token = localStorage.getItem("jwt")
    if (token) {
      dispatch(getUserProfile(token))
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  const getInitials = (name) => {
    if (!name) return "U"
    return name
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const formatDate = (value) => {
    if (!value) return "Not available"
    return new Date(value).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatRole = (role) => {
    if (!role) return "User"
    return role
      .replace("ROLE_", "")
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (c) => c.toUpperCase())
  }

  if (loading && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="text-sm">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">
            {error || "Unable to load profile."}
          </p>
          <Button variant="outline" onClick={fetchProfile}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
          <p className="text-muted-foreground mt-2">Manage your personal information</p>
        </div>

        <Card className="mb-6">
          <CardHeader className="text-center pb-2">
            <div className="flex justify-center mb-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user.profilePicture} alt={user.fullName} />
                <AvatarFallback className="text-2xl">{getInitials(user.fullName)}</AvatarFallback>
              </Avatar>
            </div>
            <CardTitle className="text-2xl">{user.fullName || "User"}</CardTitle>
            <Badge variant="secondary" className="w-fit mx-auto">
              {formatRole(user.role)}
            </Badge>
          </CardHeader>
          <CardContent className="flex justify-center pt-2">
            <Button variant="outline" size="sm" onClick={fetchProfile} disabled={loading}>
              <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </CardContent>
        </Card>

        {error && (
          <div className="mb-6 p-3 bg-red-50 text-red-700 rounded-md text-sm border border-red-100">
            {error}
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <User className="mr-2 h-5 w-5 text-primary" />
                Personal Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                <p className="text-lg font-medium">{user.fullName || "Not provided"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">User ID</label>
                <p className="text-sm text-muted-foreground font-mono">#{user.id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Role</label>
                <p className="text-sm font-medium">{formatRole(user.role)}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Mail className="mr-2 h-5 w-5 text-primary" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Email</label>
                <p className="text-lg break-all">{user.email || "Not provided"}</p>
              </div>
              <div className="flex items-start gap-2">
                <Phone className="mt-1 h-4 w-4 text-primary" />
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Phone</label>
                  <p className="text-lg">{user.phone || "Not provided"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <CreditCard className="mr-2 h-5 w-5 text-primary" />
              Account Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Account Status</label>
                <Badge variant="outline" className="block w-fit mt-1">
                  {user ? "Active" : "Inactive"}
                </Badge>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Member Since</label>
                <p className="text-sm text-muted-foreground">{formatDate(user.createdAt)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Last Login</label>
                <p className="text-sm text-muted-foreground">{formatDate(user.lastLogin)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-8">
          <p className="text-xs text-muted-foreground">
            Profile information is synced with your account
          </p>
        </div>
      </div>
    </div>
  )
}

export default UserProfile
