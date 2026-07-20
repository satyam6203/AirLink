import React from 'react'

interface AirplaneIconProps {
  className?: string
}

const AirplaneIcon: React.FC<AirplaneIconProps> = ({ className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="m2 22 7-4 3-11-9-4 18-4 3 16-10 4z" />
      <path d="M4.92 13.61a2 2 0 0 0 1.88 2.39h11a2 2 0 0 0 1.95-2.54L16.73 3.63H7.27l-2.35 10z" />
    </svg>
  )
}

export default AirplaneIcon