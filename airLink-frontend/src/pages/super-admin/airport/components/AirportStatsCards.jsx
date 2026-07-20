import React from 'react';
import { Plane, Globe, Clock, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const AirportStatsCards = ({ statistics }) => {
  const {
    totalAirports = 0,
    totalCountries = 0,
    totalTimezones = 0,
    activeAirports = 0
  } = statistics;

  const stats = [
    {
      title: 'Total Airports',
      value: totalAirports,
      icon: Plane,
      color: 'blue',
      description: `${activeAirports} active`
    },
    {
      title: 'Countries',
      value: totalCountries,
      icon: Globe,
      color: 'green',
      description: 'Worldwide coverage'
    },
    {
      title: 'Time Zones',
      value: totalTimezones,
      icon: Clock,
      color: 'purple',
      description: 'Different zones'
    },
    {
      title: 'Active Airports',
      value: activeAirports,
      icon: CheckCircle,
      color: 'emerald',
      description: `${totalAirports - activeAirports} inactive`
    }
  ];

  const getColorClasses = (color) => {
    const colorMap = {
      blue: 'from-blue-50 to-blue-100 border-blue-200 text-blue-600',
      green: 'from-green-50 to-green-100 border-green-200 text-green-600',
      purple: 'from-purple-50 to-purple-100 border-purple-200 text-purple-600',
      emerald: 'from-emerald-50 to-emerald-100 border-emerald-200 text-emerald-600'
    };
    return colorMap[color] || colorMap.blue;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className={`bg-gradient-to-br ${getColorClasses(stat.color)} border`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm font-medium opacity-90">{stat.title}</div>
                </div>
                <Icon className="h-8 w-8" />
              </div>
              <div className="mt-2">
                <span className="text-xs opacity-75">{stat.description}</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default AirportStatsCards;