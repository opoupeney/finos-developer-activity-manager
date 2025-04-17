
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Activity } from '@/types/activity';
import { Ambassador } from '@/types/ambassador';
import MapToolbar, { MapFilters } from './MapToolbar';
import { 
  createActivityMarker, 
  createAmbassadorMarker, 
  resetMarkerPositions, 
  groupActivitiesByLocation 
} from './MapUtils';

interface MapContainerProps {
  activities: Activity[];
  ambassadors?: Ambassador[];
  mapboxToken: string;
}

const MapContainer: React.FC<MapContainerProps> = ({ activities, ambassadors = [], mapboxToken }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  
  // Initialize filter state
  const [filters, setFilters] = useState<MapFilters>({
    showActivities: true,
    showAmbassadors: true
  });

  // Function to update markers based on current filters
  const updateMarkers = () => {
    if (!map.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];
    
    // Reset marker position tracking
    resetMarkerPositions();
    
    console.log('Updating markers with filters:', filters);
    console.log('Number of activities:', activities.length);
    console.log('Number of ambassadors:', ambassadors.length);
    
    // Add activity markers if filter is enabled
    if (filters.showActivities) {
      const groupedActivities = groupActivitiesByLocation(activities);
      
      Object.values(groupedActivities).forEach(activitiesAtLocation => {
        const marker = createActivityMarker(activitiesAtLocation, map.current!);
        if (marker) {
          markersRef.current.push(marker);
        }
      });
      
      console.log('Added activity markers:', Object.values(groupedActivities).length);
    }
    
    // Add ambassador markers if filter is enabled
    if (filters.showAmbassadors) {
      console.log('Adding ambassador markers...');
      ambassadors.forEach(ambassador => {
        console.log('Processing ambassador:', ambassador.first_name, ambassador.last_name, ambassador.location);
        const marker = createAmbassadorMarker(ambassador, map.current!);
        if (marker) {
          markersRef.current.push(marker);
        }
      });
      
      console.log('Total ambassador markers added:', markersRef.current.length);
    }
  };

  // Setup map
  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    try {
      // Initialize map
      mapboxgl.accessToken = mapboxToken;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [0, 20], // Center on world map
        zoom: 1.5
      });

      // Add navigation controls
      map.current.addControl(
        new mapboxgl.NavigationControl(),
        'top-right'
      );

      // Add markers when map loads
      map.current.on('load', () => {
        console.log('Map loaded, adding markers...');
        updateMarkers();
      });
    } catch (error) {
      console.error("Error initializing map:", error);
    }

    // Cleanup
    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [mapboxToken]);

  // Update markers when activities, ambassadors, or filters change
  useEffect(() => {
    if (map.current && map.current.loaded()) {
      console.log('Data or filters changed, updating markers...');
      updateMarkers();
    }
  }, [activities, ambassadors, filters]);

  return (
    <div className="relative w-full h-[400px] rounded-md overflow-hidden">
      <MapToolbar 
        filters={filters} 
        onChange={setFilters} 
        className="absolute top-2 left-2 z-10" 
      />
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
};

export default MapContainer;
