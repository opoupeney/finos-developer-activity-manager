
import React from 'react';
import { useToast } from '@/hooks/use-toast';
import MapContainer from './MapContainer';
import { Activity } from '@/types/activity';
import { Ambassador } from '@/types/ambassador';

interface ActivityMapProps {
  activities: Activity[];
  ambassadors?: Ambassador[];
}

const ActivityMap: React.FC<ActivityMapProps> = ({ activities, ambassadors = [] }) => {
  const { toast } = useToast();
  const mapboxToken = 'pk.eyJ1Ijoib3BvdXBlbmV5IiwiYSI6ImNtN3pwajV5dTAwN20ya29pZ3Q1ZmpiNWQifQ.mKi-872Gk8COifzbu-UVtA';

  if (!mapboxToken) {
    // Show a warning toast if Mapbox token is missing
    React.useEffect(() => {
      toast({
        title: "Mapbox Token Missing",
        description: "Please provide a valid Mapbox token to display the map.",
        variant: "destructive"
      });
    }, [toast]);

    return (
      <div className="bg-muted p-8 text-center rounded-md">
        <p className="text-muted-foreground">Map cannot be displayed. Mapbox token is missing.</p>
      </div>
    );
  }

  return <MapContainer activities={activities} ambassadors={ambassadors} mapboxToken={mapboxToken} />;
};

export default ActivityMap;
