
import React, { useState } from 'react';
import { Masterclass } from '@/types/masterclass';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapIcon } from 'lucide-react';
import MapSetupCard from './MapSetupCard';
import MapContainer from './MapContainer';

interface ActivityMapProps {
  activities: Masterclass[];
}

const ActivityMap: React.FC<ActivityMapProps> = ({ activities }) => {
  const [mapboxToken, setMapboxToken] = useState<string>(
    localStorage.getItem('mapbox_token') || ''
  );
  const [tokenInput, setTokenInput] = useState<string>(mapboxToken);
  const [isMapReady, setIsMapReady] = useState<boolean>(!!mapboxToken);

  const handleTokenSubmit = () => {
    // Save token to localStorage
    localStorage.setItem('mapbox_token', tokenInput);
    setMapboxToken(tokenInput);
    setIsMapReady(true);
  };

  if (!isMapReady) {
    return (
      <MapSetupCard 
        tokenInput={tokenInput}
        setTokenInput={setTokenInput}
        handleTokenSubmit={handleTokenSubmit}
      />
    );
  }

  return (
    <Card className="animate-fade-in">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <MapIcon className="h-5 w-5 text-finos-blue" />
          Activity Locations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <MapContainer activities={activities} mapboxToken={mapboxToken} />
      </CardContent>
    </Card>
  );
};

export default ActivityMap;
