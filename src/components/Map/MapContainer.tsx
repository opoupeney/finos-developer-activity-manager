
import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Masterclass } from '@/types/masterclass';
import { createActivityMarker } from './MapUtils';

interface MapContainerProps {
  activities: Masterclass[];
  mapboxToken: string;
}

const MapContainer: React.FC<MapContainerProps> = ({ activities, mapboxToken }) => {
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
        // Clear any existing markers
        markersRef.current.forEach(marker => marker.remove());
        markersRef.current = [];

        // Add markers for each activity with a valid location
        activities.forEach(activity => {
          const marker = createActivityMarker(activity, map.current!);
          if (marker) {
            markersRef.current.push(marker);
          }
        });
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
  }, [mapboxToken, activities]);

  return (
    <div ref={mapContainer} className="w-full h-[400px] rounded-md overflow-hidden" />
  );
};

export default MapContainer;
