
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapIcon } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface MapSetupCardProps {
  tokenInput: string;
  setTokenInput: (token: string) => void;
  handleTokenSubmit: () => void;
}

const MapSetupCard: React.FC<MapSetupCardProps> = ({ 
  tokenInput, 
  setTokenInput, 
  handleTokenSubmit 
}) => {
  return (
    <Card className="animate-fade-in">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <MapIcon className="h-5 w-5 text-finos-blue" />
          Map Setup Required
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4 text-sm text-muted-foreground">
          To display the activity map, please enter your Mapbox public token below. 
          You can get one by signing up at <a href="https://www.mapbox.com/" className="text-finos-blue underline" target="_blank" rel="noopener noreferrer">mapbox.com</a> and going to your account's token section.
        </p>
        <div className="flex gap-2">
          <Input 
            type="text" 
            placeholder="Enter your Mapbox public token" 
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
            className="flex-1"
          />
          <Button 
            onClick={handleTokenSubmit} 
            className="bg-finos-blue hover:bg-finos-blue/90"
            disabled={!tokenInput}
          >
            Save & Load Map
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MapSetupCard;
