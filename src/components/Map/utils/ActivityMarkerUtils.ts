
import mapboxgl from 'mapbox-gl';
import { Activity } from '@/types/activity';
import { getCoordinates } from './CoordinateUtils';

// Create activity markers on the map
export const createActivityMarker = (
  activities: Activity[], 
  map: mapboxgl.Map
): mapboxgl.Marker | null => {
  if (!activities.length) return null;
  
  // Use the first activity's location for the coordinates
  const coordinates = getCoordinates(activities[0].location);
  if (!coordinates) return null;

  // Skip adding markers for Remote/Virtual/Online activities at [0,0]
  if (coordinates[0] === 0 && coordinates[1] === 0) return null;
  
  // Create popup content for all activities at this location
  const popupContent = `
    <div class="p-2">
      <h3 class="font-bold text-sm mb-2">${activities.length > 1 ? `${activities.length} Activities at this location` : activities[0].title}</h3>
      <div class="space-y-2 max-h-60 overflow-y-auto">
        ${activities.map(activity => `
          <div class="p-1.5 border-b border-border last:border-0">
            <p class="font-semibold text-xs">${activity.title}</p>
            <p class="text-xs text-muted-foreground">${activity.type}</p>
            <div class="text-xs text-finos-blue mt-0.5">
              ${activity.metrics?.currentRegistrations || 0} registrations
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  // Create a popup
  const popup = new mapboxgl.Popup({ offset: 25 })
    .setHTML(popupContent);

  // Create custom marker element with color based on activity status
  const el = document.createElement('div');
  el.className = 'marker';
  el.style.position = 'absolute';
  
  // Set marker color - if multiple activities, use a special color
  let color;
  if (activities.length > 1) {
    color = '#0091CD'; // Special color for multiple activities
    
    // Add a badge showing the number of activities - using absolute positioning
    const badge = document.createElement('div');
    badge.className = 'activity-count';
    badge.textContent = activities.length.toString();
    badge.style.position = 'absolute';
    badge.style.top = '-8px';
    badge.style.right = '-8px';
    badge.style.backgroundColor = '#FF3E00';
    badge.style.color = 'white';
    badge.style.borderRadius = '50%';
    badge.style.width = '16px';
    badge.style.height = '16px';
    badge.style.fontSize = '10px';
    badge.style.fontWeight = 'bold';
    badge.style.display = 'flex';
    badge.style.justifyContent = 'center';
    badge.style.alignItems = 'center';
    badge.style.border = '1px solid white';
    el.appendChild(badge);
  } else {
    // If single activity, use its status color
    const activity = activities[0];
    switch(activity.status) {
      case 'Approved': color = '#77C043'; break;
      case 'Pending': color = '#FFBB28'; break;
      case 'Rejected': color = '#FF8042'; break;
      case 'Done': color = '#929292'; break;
      default: color = '#0091CD'; break;
    }
  }
  
  el.style.backgroundColor = color;
  el.style.width = '24px';
  el.style.height = '24px';
  el.style.borderRadius = '50%';
  el.style.cursor = 'pointer';
  el.style.border = '2px solid white';
  el.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.3)';
  
  // Create marker at exact coordinates without any offset
  return new mapboxgl.Marker(el)
    .setLngLat(coordinates)
    .setPopup(popup)
    .addTo(map);
};
