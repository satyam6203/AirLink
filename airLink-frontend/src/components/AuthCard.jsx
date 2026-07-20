import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Separator } from './ui/separator';
import { Plane } from 'lucide-react';

const AuthCard = ({ title, description, children }) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-blue-950">
      <div className="w-full max-w-md animate-fade-in">
        <Card className="overflow-hidden shadow-xl border-0">
          {/* Logo section */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 flex justify-center">
            <div className="rounded-full bg-white/20 p-3">
              <Plane className="h-8 w-8 text-white" />
            </div>
          </div>
          
          {/* Form section */}
          <CardHeader className="pb-2">
            <div className="text-center">
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                {title}
              </CardTitle>
              <CardDescription className="text-gray-500 dark:text-gray-400">
                {description}
              </CardDescription>
            </div>
          </CardHeader>
          
          <Separator className="my-4" />
          
          <CardContent className="pt-2">
            {children}
          </CardContent>
        </Card>
        
        {/* Footer note */}
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
          © 2024 FlightBooker. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default AuthCard;