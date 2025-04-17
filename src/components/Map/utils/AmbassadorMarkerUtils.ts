
import React from 'react';
import mapboxgl from 'mapbox-gl';
import { Ambassador } from '@/types/ambassador';
import { UserRound } from 'lucide-react';
import { renderToString } from 'react-dom/server';
import { getCoordinates, locationHasActivity } from './CoordinateUtils';

// Create ambassador markers on the map
export const createAmbassadorMarker = (
  ambassador: Ambassador,
  map: mapboxgl.Map
): mapboxgl.Marker | null => {
  if (!ambassador.location) return null;
  
  // Log the ambassador location for debugging
  console.log('Creating ambassador marker for location:', ambassador.location);
  
  const coordinates = getCoordinates(ambassador.location);
  if (!coordinates) {
    console.log('No coordinates found for location:', ambassador.location);
    return null;
  }

  // Skip adding markers for Remote/Virtual/Online activities at [0,0]
  if (coordinates[0] === 0 && coordinates[1] === 0) return null;
  
  // Log the coordinates for this ambassador
  console.log('Ambassador coordinates:', coordinates, 'for', ambassador.first_name, ambassador.last_name);
  
  // Create popup content
  const popupContent = `
    <div class="p-2">
      <h3 class="font-bold text-sm">${ambassador.first_name} ${ambassador.last_name}</h3>
      ${ambassador.title ? `<p class="text-xs text-muted-foreground">${ambassador.title}</p>` : ''}
      ${ambassador.company ? `<p class="text-xs text-muted-foreground">${ambassador.company}</p>` : ''}
      ${ambassador.location ? `<p class="text-xs text-muted-foreground">${ambassador.location}</p>` : ''}
    </div>
  `;

  // Create a popup
  const popup = new mapboxgl.Popup({ offset: 25 })
    .setHTML(popupContent);

  // Convert UserRound icon to SVG string with smaller size
  const userIconSvg = renderToString(
    React.createElement(UserRound, {
      color: "white", 
      size: 16,
      strokeWidth: 1.5,
      fill: "#FF6B6B",
      className: "ambassador-icon"
    })
  );

  // Create custom marker element
  const el = document.createElement('div');
  el.className = 'ambassador-marker';
  el.innerHTML = userIconSvg;
  el.style.cursor = 'pointer';
  el.style.borderRadius = '50%';
  el.style.background = '#FF6B6B';
  el.style.padding = '2px';
  el.style.display = 'flex';
  el.style.alignItems = 'center';
  el.style.justifyContent = 'center';
  el.style.boxShadow = '0 0 4px rgba(0, 0, 0, 0.3)';
  
  // Check if there's already an activity at this location
  const coordKey = `${coordinates[0]},${coordinates[1]}`;
  const hasActivity = locationHasActivity.get(coordKey) || false;
  
  // If there's an activity at this location, add a slight offset to the ambassador marker
  let adjustedCoordinates = [...coordinates] as [number, number];
  if (hasActivity) {
    // Adjust the offset to ensure it's visible for all locations including Lakewood
    // Add a slight offset to the north-east (up and right)
    adjustedCoordinates = [
      coordinates[0] + 0.03, // Increased longitude offset
      coordinates[1] + 0.03  // Increased latitude offset
    ];
    console.log('Adjusted coordinates due to activity at same location:', adjustedCoordinates);
  }

  try {
    // Create marker with possibly adjusted coordinates
    return new mapboxgl.Marker({ element: el })
      .setLngLat(adjustedCoordinates)
      .setPopup(popup)
      .addTo(map);
  } catch (error) {
    console.error('Error creating ambassador marker:', error);
    return null;
  }
};
