
import React from 'react';
import { Activity } from '@/types/activity';
import { Ambassador } from '@/types/ambassador';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapIcon } from 'lucide-react';
import MapContainer from './MapContainer';

// Hardcoded Mapbox token
const MAPBOX_TOKEN = "pk.eyJ1Ijoib3BvdXBlbmV5IiwiYSI6ImNtN3pwajV5dTAwN20ya29pZ3Q1ZmpiNWQifQ.mKi-872Gk8COifzbu-UVtA";

interface ActivityMapProps {
  activities: Activity[];
  ambassadors?: Ambassador[];
}

const ActivityMap: React.FC<ActivityMapProps> = ({ activities, ambassadors = [] }) => {
  // Filter out rejected activities
  const nonRejectedActivities = activities.filter(activity => activity.status !== 'Rejected');

  return (
    <Card className="animate-fade-in">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <MapIcon className="h-5 w-5 text-finos-blue" />
          Activity Locations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <MapContainer 
          activities={nonRejectedActivities} 
          ambassadors={ambassadors}
          mapboxToken={MAPBOX_TOKEN} 
        />
      </CardContent>
    </Card>
  );
};

export default ActivityMap;
