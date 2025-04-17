
import React from 'react';
import mapboxgl from 'mapbox-gl';
import { Ambassador } from '@/types/ambassador';
import { UserRound } from 'lucide-react';
import { renderToString } from 'react-dom/server';
import { getCoordinates, locationHasActivity } from './CoordinateUtils';

// Create ambassador markers for a single ambassador
const createSingleAmbassadorMarker = (
  ambassador: Ambassador,
  map: mapboxgl.Map,
  coordinates: [number, number]
): mapboxgl.Marker | null => {
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
  
  // Create marker with position adjustment if needed
  const coordKey = `${coordinates[0]},${coordinates[1]}`;
  console.log('Checking if location has activity:', coordKey, 'Has activity:', locationHasActivity.get(coordKey));
  
  // Check if there's already an activity at this location
  const hasActivity = locationHasActivity.get(coordKey) || false;
  
  // Always apply an offset for Lakewood, OH locations to make sure they're visible
  let adjustedCoordinates = [...coordinates] as [number, number];
  if (hasActivity || ambassador.location?.toLowerCase().includes('lakewood')) {
    // Apply a larger offset for Lakewood specifically
    if (ambassador.location?.toLowerCase().includes('lakewood')) {
      adjustedCoordinates = [
        coordinates[0] + 0.05, // Extra large longitude offset for Lakewood
        coordinates[1] + 0.05  // Extra large latitude offset for Lakewood
      ];
      console.log('Applied LAKEWOOD SPECIFIC offset to coordinates:', adjustedCoordinates);
    } else {
      // Standard offset for other locations with activities
      adjustedCoordinates = [
        coordinates[0] + 0.03, // Increased longitude offset
        coordinates[1] + 0.03  // Increased latitude offset
      ];
      console.log('Applied standard offset due to activity at same location:', adjustedCoordinates);
    }
  }

  try {
    // Create marker with possibly adjusted coordinates
    const marker = new mapboxgl.Marker({ element: el })
      .setLngLat(adjustedCoordinates)
      .setPopup(popup)
      .addTo(map);
    
    console.log('Successfully created marker for ambassador at:', adjustedCoordinates);
    return marker;
  } catch (error) {
    console.error('Error creating ambassador marker:', error);
    return null;
  }
};

// Create marker for multiple ambassadors at the same location
const createGroupAmbassadorMarker = (
  ambassadors: Ambassador[],
  map: mapboxgl.Map,
  coordinates: [number, number]
): mapboxgl.Marker | null => {
  // Create popup content for all ambassadors at this location
  const popupContent = `
    <div class="p-2">
      <h3 class="font-bold text-sm mb-2">${ambassadors.length} Ambassadors at this location</h3>
      <div class="space-y-2 max-h-60 overflow-y-auto">
        ${ambassadors.map(ambassador => `
          <div class="p-1.5 border-b border-border last:border-0">
            <p class="font-semibold text-xs">${ambassador.first_name} ${ambassador.last_name}</p>
            ${ambassador.title ? `<p class="text-xs text-muted-foreground">${ambassador.title}</p>` : ''}
            ${ambassador.company ? `<p class="text-xs text-muted-foreground">${ambassador.company}</p>` : ''}
          </div>
        `).join('')}
      </div>
    </div>
  `;

  // Create a popup
  const popup = new mapboxgl.Popup({ offset: 25 })
    .setHTML(popupContent);

  // Convert UserRound icon to SVG string
  const userIconSvg = renderToString(
    React.createElement(UserRound, {
      color: "white", 
      size: 20,  // Slightly larger for group markers
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
  el.style.position = 'relative';
  
  // Add badge showing the number of ambassadors
  const badge = document.createElement('div');
  badge.className = 'ambassador-count';
  badge.textContent = ambassadors.length.toString();
  badge.style.position = 'absolute';
  badge.style.top = '-5px';
  badge.style.right = '-5px';
  badge.style.backgroundColor = '#FF3E00';
  badge.style.color = 'white';
  badge.style.borderRadius = '50%';
  badge.style.width = '14px';
  badge.style.height = '14px';
  badge.style.fontSize = '9px';
  badge.style.fontWeight = 'bold';
  badge.style.display = 'flex';
  badge.style.justifyContent = 'center';
  badge.style.alignItems = 'center';
  badge.style.border = '1px solid white';
  el.appendChild(badge);
  
  // Apply offset if there's an activity at this location
  const coordKey = `${coordinates[0]},${coordinates[1]}`;
  const hasActivity = locationHasActivity.get(coordKey) || false;
  
  let adjustedCoordinates = [...coordinates] as [number, number];
  if (hasActivity) {
    adjustedCoordinates = [
      coordinates[0] + 0.03,
      coordinates[1] + 0.03
    ];
    console.log('Applied offset to group of ambassadors due to activity at same location:', adjustedCoordinates);
  }

  try {
    // Create marker
    const marker = new mapboxgl.Marker({ element: el })
      .setLngLat(adjustedCoordinates)
      .setPopup(popup)
      .addTo(map);
    
    console.log('Successfully created group marker for', ambassadors.length, 'ambassadors at:', adjustedCoordinates);
    return marker;
  } catch (error) {
    console.error('Error creating group ambassador marker:', error);
    return null;
  }
};

// Create ambassador markers on the map
export const createAmbassadorMarker = (
  ambassador: Ambassador | Ambassador[],
  map: mapboxgl.Map
): mapboxgl.Marker | null => {
  // Handle single ambassador case (backward compatibility)
  if (!Array.isArray(ambassador)) {
    if (!ambassador.location) return null;
    
    // Log the ambassador location for debugging
    console.log('Creating ambassador marker for location:', ambassador.location);
    console.log('Ambassador name:', ambassador.first_name, ambassador.last_name);
    
    const coordinates = getCoordinates(ambassador.location);
    if (!coordinates) {
      console.log('No coordinates found for location:', ambassador.location);
      return null;
    }

    // Skip adding markers for Remote/Virtual/Online activities at [0,0]
    if (coordinates[0] === 0 && coordinates[1] === 0) return null;
    
    // Log the coordinates for this ambassador
    console.log('Ambassador coordinates:', coordinates, 'for', ambassador.first_name, ambassador.last_name);
    
    return createSingleAmbassadorMarker(ambassador, map, coordinates);
  }
  
  // Handle multiple ambassadors at the same location
  const ambassadors = ambassador;
  if (ambassadors.length === 0) return null;
  
  const firstAmbassador = ambassadors[0];
  if (!firstAmbassador.location) return null;
  
  // Get coordinates for the first ambassador (they all share the same location)
  const coordinates = getCoordinates(firstAmbassador.location);
  if (!coordinates) return null;
  
  // Skip adding markers for Remote/Virtual/Online locations
  if (coordinates[0] === 0 && coordinates[1] === 0) return null;
  
  // If it's just one ambassador, use the single marker function
  if (ambassadors.length === 1) {
    return createSingleAmbassadorMarker(firstAmbassador, map, coordinates);
  }
  
  // For multiple ambassadors, use the group marker function
  return createGroupAmbassadorMarker(ambassadors, map, coordinates);
};
