
import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Activity } from '@/types/activity';
import { Ambassador } from '@/types/ambassador';
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
        // Clear any existing markers
        markersRef.current.forEach(marker => marker.remove());
        markersRef.current = [];
        
        // Reset marker position tracking
        resetMarkerPositions();

        // Log original activities count
        console.log('Original activities count:', activities.length);

        // Group activities by location
        const groupedActivities = groupActivitiesByLocation(activities);
        console.log('Grouped activities:', Object.keys(groupedActivities).length, 'unique locations');
        
        // Add markers for each group of activities
        Object.values(groupedActivities).forEach(activitiesAtLocation => {
          console.log(`Adding marker for ${activitiesAtLocation.length} activities at ${activitiesAtLocation[0].location}`);
          const marker = createActivityMarker(activitiesAtLocation, map.current!);
          if (marker) {
            markersRef.current.push(marker);
          }
        });

        // Add markers for each ambassador with a valid location
        // Adding ambassadors after activities ensures their positioning logic can check for existing activity markers
        ambassadors.forEach(ambassador => {
          const marker = createAmbassadorMarker(ambassador, map.current!);
          if (marker) {
            markersRef.current.push(marker);
          }
        });

        console.log('Total markers added:', markersRef.current.length);
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
  }, [mapboxToken, activities, ambassadors]);

  return (
    <div ref={mapContainer} className="w-full h-[400px] rounded-md overflow-hidden" />
  );
};

export default MapContainer;
