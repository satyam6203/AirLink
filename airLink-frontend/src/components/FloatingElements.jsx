import React from 'react'
import { Plane, Cloud, Star, Globe } from 'lucide-react'

const FloatingElements = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Floating planes */}
      <div className="absolute top-20 left-10 animate-float opacity-20" style={{animationDelay: '0s'}}>
        <Plane className="h-8 w-8 text-blue-400 transform rotate-45" />
      </div>
      
      <div className="absolute top-40 right-20 animate-float opacity-30" style={{animationDelay: '2s'}}>
        <Plane className="h-6 w-6 text-purple-400 transform -rotate-12" />
      </div>
      
      <div className="absolute bottom-32 left-32 animate-float opacity-25" style={{animationDelay: '4s'}}>
        <Plane className="h-7 w-7 text-cyan-400 transform rotate-12" />
      </div>

      {/* Floating clouds */}
      <div className="absolute top-60 left-1/4 animate-float opacity-15" style={{animationDelay: '1s'}}>
        <Cloud className="h-12 w-12 text-gray-300" />
      </div>
      
      <div className="absolute bottom-40 right-1/4 animate-float opacity-20" style={{animationDelay: '3s'}}>
        <Cloud className="h-10 w-10 text-blue-200" />
      </div>

      {/* Floating stars */}
      <div className="absolute top-1/3 right-1/3 animate-pulse opacity-30" style={{animationDelay: '0.5s'}}>
        <Star className="h-4 w-4 text-yellow-400" />
      </div>
      
      <div className="absolute top-1/2 left-1/5 animate-pulse opacity-25" style={{animationDelay: '1.5s'}}>
        <Star className="h-3 w-3 text-yellow-300" />
      </div>
      
      <div className="absolute bottom-1/3 right-1/5 animate-pulse opacity-35" style={{animationDelay: '2.5s'}}>
        <Star className="h-5 w-5 text-orange-400" />
      </div>

      {/* Floating globe */}
      <div className="absolute top-1/4 left-1/2 animate-float opacity-20" style={{animationDelay: '1.8s'}}>
        <Globe className="h-9 w-9 text-green-400" />
      </div>

      {/* Gradient orbs */}
      <div className="absolute top-16 right-16 w-24 h-24 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-20 left-20 w-32 h-32 bg-gradient-to-r from-pink-400/15 to-orange-400/15 rounded-full blur-2xl animate-float" style={{animationDelay: '2.2s'}}></div>
      <div className="absolute top-1/2 right-10 w-20 h-20 bg-gradient-to-r from-cyan-400/25 to-blue-400/25 rounded-full blur-lg animate-pulse" style={{animationDelay: '3.5s'}}></div>
    </div>
  )
}

export default FloatingElements
