import React from 'react';
import mapboxgl from 'mapbox-gl';
import { Ambassador } from '@/types/ambassador';
import { UserRound } from 'lucide-react';
import { renderToString } from 'react-dom/server';
import { getCoordinates, locationHasActivity } from './CoordinateUtils';

// Shared function to create consistent marker element
const createAmbassadorMarkerElement = (
  iconSize: number = 16, 
  hasCounter: boolean = false, 
  ambassadorCount?: number
): HTMLDivElement => {
  // Convert UserRound icon to SVG string
  const userIconSvg = renderToString(
    React.createElement(UserRound, {
      color: "white", 
      size: iconSize,
      strokeWidth: 1.5,
      fill: "#FF6B6B",
      className: "ambassador-icon"
    })
  );

  // Create custom marker element with consistent dimensions
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
  el.style.width = '28px';
  el.style.height = '28px';
  el.style.position = 'relative';

  // Add counter badge if needed
  if (hasCounter && ambassadorCount && ambassadorCount > 1) {
    const badge = document.createElement('div');
    badge.className = 'ambassador-count';
    badge.textContent = ambassadorCount.toString();
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
  }

  return el;
};

// Existing functions remain the same, just replace marker element creation
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
  const popup = new mapboxgl.Popup({ 
    offset: 25,
    maxWidth: '280px'
  }).setHTML(popupContent);

  // Create marker element with consistent sizing
  const el = createAmbassadorMarkerElement(16, false);
  
  try {
    // Create marker at exact coordinates (no offset)
    const marker = new mapboxgl.Marker({ element: el })
      .setLngLat(coordinates)
      .setPopup(popup)
      .addTo(map);
    
    console.log('Successfully created marker for ambassador at:', coordinates);
    return marker;
  } catch (error) {
    console.error('Error creating ambassador marker:', error);
    return null;
  }
};

const createGroupAmbassadorMarker = (
  ambassadors: Ambassador[],
  map: mapboxgl.Map,
  coordinates: [number, number]
): mapboxgl.Marker | null => {
  // Create popup content for all ambassadors at this location
  // Limit visible items to 2 and make the rest scrollable
  const popupContent = `
    <div class="p-2">
      <h3 class="font-bold text-sm mb-2">${ambassadors.length} Ambassadors at this location</h3>
      <div class="space-y-2 max-h-24 overflow-y-auto pr-1 custom-scrollbar">
        ${ambassadors.map(ambassador => `
          <div class="p-1.5 border-b border-border last:border-0">
            <p class="font-semibold text-xs">${ambassador.first_name} ${ambassador.last_name}</p>
            ${ambassador.title ? `<p class="text-xs text-muted-foreground">${ambassador.title}</p>` : ''}
            ${ambassador.company ? `<p class="text-xs text-muted-foreground">${ambassador.company}</p>` : ''}
          </div>
        `).join('')}
      </div>
      ${ambassadors.length > 2 ? `<div class="text-xs text-muted-foreground mt-1 text-center">Scroll to see more</div>` : ''}
    </div>
  `;

  // Create a popup
  const popup = new mapboxgl.Popup({ 
    offset: 25,
    maxWidth: '280px'
  }).setHTML(popupContent);

  // Create marker element with counter
  const el = createAmbassadorMarkerElement(16, true, ambassadors.length);
  
  try {
    // Create marker at exact coordinates (no offset)
    const marker = new mapboxgl.Marker({ element: el })
      .setLngLat(coordinates)
      .setPopup(popup)
      .addTo(map);
    
    console.log('Successfully created group marker for', ambassadors.length, 'ambassadors at:', coordinates);
    return marker;
  } catch (error) {
    console.error('Error creating group ambassador marker:', error);
    return null;
  }
};

// Existing createAmbassadorMarker function remains unchanged
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
