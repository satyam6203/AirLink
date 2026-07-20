import React from 'react';
import { TrendingUp, Globe, Clock, AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const StatCard = ({ icon: Icon, value, label, color, bgColor }) => (
  <Card>
    <CardContent className="p-4">
      <div className="flex items-center gap-3">
        <div className={`p-2 ${bgColor} rounded-lg`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
        <div>
          <div className="text-2xl font-bold">{value}</div>
          <div className="text-sm text-gray-600">{label}</div>
        </div>
      </div>
    </CardContent>
  </Card>
);

const CityStatsCards = ({ statistics }) => {
  const stats = [
    {
      icon: TrendingUp,
      value: statistics?.totalCities || 0,
      label: 'Total Cities',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      icon: Globe,
      value: statistics?.totalCountries || 0,
      label: 'Countries',
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      icon: Clock,
      value: statistics?.totalTimezones || 0,
      label: 'Time Zones',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      icon: AlertTriangle,
      value: statistics?.issues || 0,
      label: 'Issues',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
};

export default CityStatsCards;