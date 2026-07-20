import React, { ReactNode } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Box } from './ui/box'
import { AirplaneIcon } from '../icons/AirplaneIcon'

interface AuthCardProps {
  title: string
  description: string
  children: ReactNode
}

const AuthCard: React.FC<AuthCardProps> = ({ title, description, children }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 to-indigo-50 p-4 sm:p-6">
      <Box className="w-full max-w-md">
        {/* Logo/Illustration */}
        <div className="flex justify-center mb-8 mt-4">
          <div className="relative">
            <div className="absolute -inset-4 bg-blue-100/50 rounded-full blur-xl opacity-70"></div>
            <div className="relative p-4 bg-white rounded-full shadow-lg">
              <AirplaneIcon className="h-10 w-10 text-blue-600" />
            </div>
          </div>
        </div>
        
        {/* Auth Card */}
        <Card className="border-none shadow-xl overflow-hidden bg-white rounded-xl">
          <CardHeader className="pb-3">
            <div className="flex justify-center">
              <CardTitle className="text-2xl font-bold text-gray-900">
                {title}
              </CardTitle>
            </div>
            <CardDescription className="text-center text-gray-500">
              {description}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            {children}
          </CardContent>
        </Card>
        
        {/* Decorative Elements */}
        <div className="mt-8 flex justify-center space-x-2 text-sm text-gray-500">
          <div className="h-px bg-gray-300 w-10 self-center rounded-full"></div>
          <span className="text-xs uppercase tracking-wider">Fly with comfort</span>
          <div className="h-px bg-gray-300 w-10 self-center rounded-full"></div>
        </div>
      </Box>
    </div>
  )
}

export default AuthCard