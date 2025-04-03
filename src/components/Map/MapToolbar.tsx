
import React from 'react';
import { Filter, Users, Activity, X } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Button } from '@/components/ui/button';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export interface MapFilters {
  showActivities: boolean;
  showAmbassadors: boolean;
}

interface MapToolbarProps {
  filters: MapFilters;
  onChange: (filters: MapFilters) => void;
  className?: string;
}

const MapToolbar: React.FC<MapToolbarProps> = ({ 
  filters, 
  onChange,
  className = "" 
}) => {
  const { showActivities, showAmbassadors } = filters;

  // Handle toggling individual filters
  const toggleFilter = (filterType: keyof MapFilters) => {
    onChange({
      ...filters,
      [filterType]: !filters[filterType]
    });
  };

  // Clear all filters (show everything)
  const resetFilters = () => {
    onChange({
      showActivities: true,
      showAmbassadors: true
    });
  };

  return (
    <div className={`bg-background/80 backdrop-blur-sm p-2 rounded-md shadow-md border flex items-center gap-2 ${className}`}>
      <TooltipProvider>
        <div className="flex items-center gap-1.5">
          <Filter size={16} className="text-muted-foreground" />
          <span className="text-xs font-medium">Filter:</span>
        </div>
        
        <ToggleGroup type="multiple" className="gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <ToggleGroupItem
                value="activities"
                aria-label="Toggle activities"
                pressed={showActivities}
                onClick={() => toggleFilter('showActivities')}
                className="flex items-center gap-1 h-8"
              >
                <Activity size={16} />
                <span className="text-xs">Activities</span>
              </ToggleGroupItem>
            </TooltipTrigger>
            <TooltipContent>
              <p>Show/hide activities</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <ToggleGroupItem
                value="ambassadors"
                aria-label="Toggle ambassadors"
                pressed={showAmbassadors}
                onClick={() => toggleFilter('showAmbassadors')}
                className="flex items-center gap-1 h-8"
              >
                <Users size={16} />
                <span className="text-xs">Ambassadors</span>
              </ToggleGroupItem>
            </TooltipTrigger>
            <TooltipContent>
              <p>Show/hide ambassadors</p>
            </TooltipContent>
          </Tooltip>
        </ToggleGroup>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={resetFilters}
              className="h-8 w-8"
            >
              <X size={16} />
              <span className="sr-only">Reset filters</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Reset filters</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default MapToolbar;
