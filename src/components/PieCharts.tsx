
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Masterclass } from '@/types/masterclass';

// Define color palette for pie charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#a64d79', '#674ea7', '#3c78d8', '#6aa84f', '#f1c232', '#cc0000'];

interface PieChartsProps {
  activities: Masterclass[];
}

const PieCharts: React.FC<PieChartsProps> = ({ activities }) => {
  // Process data for registrations by location
  const registrationsByLocation = activities.reduce((acc: Record<string, number>, activity) => {
    const location = activity.location;
    if (!acc[location]) {
      acc[location] = 0;
    }
    acc[location] += activity.metrics.currentRegistrations;
    return acc;
  }, {});

  // Process data for registrations by type
  const registrationsByType = activities.reduce((acc: Record<string, number>, activity) => {
    const type = activity.type;
    if (!acc[type]) {
      acc[type] = 0;
    }
    acc[type] += activity.metrics.currentRegistrations;
    return acc;
  }, {});

  // Process data for participants by type
  const participantsByType = activities.reduce((acc: Record<string, number>, activity) => {
    const type = activity.type;
    if (!acc[type]) {
      acc[type] = 0;
    }
    acc[type] += activity.metrics.currentParticipants;
    return acc;
  }, {});

  // Convert objects to arrays for recharts
  const locationData = Object.entries(registrationsByLocation).map(([name, value]) => ({ name, value }));
  const registrationTypeData = Object.entries(registrationsByType).map(([name, value]) => ({ name, value }));
  const participantTypeData = Object.entries(participantsByType).map(([name, value]) => ({ name, value }));

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded p-2 shadow-md">
          <p className="font-medium">{`${payload[0].name}`}</p>
          <p className="text-finos-blue">{`${payload[0].value} ${payload[0].dataKey === 'participants' ? 'participants' : 'registrations'}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 animate-fade-in">
      {/* Registrations by Location */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Registrations by Location</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            {locationData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={locationData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {locationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                No data available
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Registrations by Type */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Registrations by Type</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            {registrationTypeData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={registrationTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {registrationTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                No data available
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Participants by Type */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Participants by Type</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            {participantTypeData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={participantTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {participantTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                No data available
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PieCharts;
