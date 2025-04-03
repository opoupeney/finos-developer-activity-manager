
import { Activity } from '@/types/activity';
import { Ambassador } from '@/types/ambassador';
import mapboxgl from 'mapbox-gl';

// Function to convert location strings to coordinates
// This is a simplified version - in a real app you would use a geocoding service
export const getCoordinates = (location: string): [number, number] | null => {
  // Static mapping of common locations to coordinates for demo
  const locationMap: Record<string, [number, number]> = {
    'New York': [-74.006, 40.7128],
    'San Francisco': [-122.4194, 37.7749],
    'London': [-0.1278, 51.5074],
    'Tokyo': [139.6917, 35.6895],
    'Sydney': [151.2093, -33.8688],
    'Berlin': [13.4050, 52.5200],
    'Paris': [2.3522, 48.8566],
    'Toronto': [-79.3832, 43.6532],
    'Chicago': [-87.6298, 41.8781],
    'Los Angeles': [-118.2437, 34.0522],
    'Singapore': [103.8198, 1.3521],
    'Bangalore': [77.5946, 12.9716], // Added Bangalore coordinates
    'Remote': [0, 0], // Center of the map for remote activities
    'Virtual': [0, 0],  // Center of the map for virtual activities
    'Online': [0, 0]    // Center of the map for online activities
  };

  // Try to match the location
  for (const [key, value] of Object.entries(locationMap)) {
    if (location.toLowerCase().includes(key.toLowerCase())) {
      return value;
    }
  }

  // Default to center of map if location not found
  return null;
};

// Track locations that have activities to adjust ambassador positions
const locationHasActivity = new Map<string, boolean>();

// Reset tracking when map is reinitialized
export const resetMarkerPositions = () => {
  locationHasActivity.clear();
};

// New function to group activities by location
export const groupActivitiesByLocation = (activities: Activity[]): Record<string, Activity[]> => {
  const groupedActivities: Record<string, Activity[]> = {};
  
  activities.forEach(activity => {
    if (!activity.location) return;
    
    const coordinates = getCoordinates(activity.location);
    if (!coordinates) return;
    
    // Skip adding Remote/Virtual/Online activities at [0,0]
    if (coordinates[0] === 0 && coordinates[1] === 0) return;
    
    const coordKey = `${coordinates[0]},${coordinates[1]}`;
    
    if (!groupedActivities[coordKey]) {
      groupedActivities[coordKey] = [];
    }
    
    groupedActivities[coordKey].push(activity);
    
    // Mark this location as having an activity
    locationHasActivity.set(coordKey, true);
  });
  
  return groupedActivities;
};

// Updated createActivityMarker function to show multiple activities in the popup
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

export const createAmbassadorMarker = (
  ambassador: Ambassador,
  map: mapboxgl.Map
): mapboxgl.Marker | null => {
  if (!ambassador.location) return null;
  
  const coordinates = getCoordinates(ambassador.location);
  if (!coordinates) return null;

  // Skip adding markers for Remote/Virtual/Online activities at [0,0]
  if (coordinates[0] === 0 && coordinates[1] === 0) return null;
  
  // Create popup content
  const popupContent = `
    <div class="p-2">
      <h3 class="font-bold text-sm">${ambassador.first_name} ${ambassador.last_name}</h3>
      ${ambassador.title ? `<p class="text-xs text-muted-foreground">${ambassador.title}</p>` : ''}
      ${ambassador.company ? `<p class="text-xs text-muted-foreground">${ambassador.company}</p>` : ''}
      <p class="text-xs text-muted-foreground">${ambassador.location}</p>
    </div>
  `;

  // Create a popup
  const popup = new mapboxgl.Popup({ offset: 25 })
    .setHTML(popupContent);

  // Create custom marker element for ambassadors - using a diamond shape
  const el = document.createElement('div');
  el.className = 'ambassador-marker';
  
  // Ambassador markers are a different color and shape
  el.style.backgroundColor = '#FF6B6B'; // Different color for ambassadors
  el.style.width = '20px';
  el.style.height = '20px';
  el.style.transform = 'rotate(45deg)'; // Diamond shape
  el.style.cursor = 'pointer';
  el.style.border = '2px solid white';
  el.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.3)';

  // Check if there's already an activity at this location
  const coordKey = `${coordinates[0]},${coordinates[1]}`;
  const hasActivity = locationHasActivity.get(coordKey) || false;
  
  // If there's an activity at this location, add a small offset to the ambassador marker
  let adjustedCoordinates = [...coordinates] as [number, number];
  if (hasActivity) {
    // Add a slight offset to the north-east (up and right)
    adjustedCoordinates = [
      coordinates[0] + 0.016, // Small longitude offset
      coordinates[1] + 0.08  // Small latitude offset
    ];
  }

  // Create marker with possibly adjusted coordinates
  return new mapboxgl.Marker(el)
    .setLngLat(adjustedCoordinates)
    .setPopup(popup)
    .addTo(map);
};
