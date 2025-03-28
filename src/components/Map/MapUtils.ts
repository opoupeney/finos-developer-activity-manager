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

// Create separate maps to track markers at each coordinate by type
const activityMarkerPositions: Record<string, number> = {};
const ambassadorMarkerPositions: Record<string, number> = {};

// Reset marker positions when map is reinitialized
export const resetMarkerPositions = () => {
  Object.keys(activityMarkerPositions).forEach(key => delete activityMarkerPositions[key]);
  Object.keys(ambassadorMarkerPositions).forEach(key => delete ambassadorMarkerPositions[key]);
};

// Function to get an offset for activity markers at the same position
const getActivityMarkerOffset = (coordinates: [number, number]): [number, number] => {
  const coordKey = `${coordinates[0]},${coordinates[1]}`;
  
  // If this is the first marker at this position, no offset needed
  if (!activityMarkerPositions[coordKey]) {
    activityMarkerPositions[coordKey] = 0;
    return [0, 0];
  }
  
  // Increment the count of markers at this position
  activityMarkerPositions[coordKey]++;
  
  // Calculate offset based on count (create a spiral pattern)
  const count = activityMarkerPositions[coordKey];
  const angle = count * 0.8; // in radians
  const radius = Math.min(5 + count * 2, 25); // limit the max radius
  
  return [
    Math.cos(angle) * radius,
    Math.sin(angle) * radius
  ];
};

// Function to get an offset for ambassador markers at the same position
const getAmbassadorMarkerOffset = (coordinates: [number, number]): [number, number] => {
  const coordKey = `${coordinates[0]},${coordinates[1]}`;
  
  // If this is the first marker at this position, start with a slight offset from activities
  if (!ambassadorMarkerPositions[coordKey]) {
    ambassadorMarkerPositions[coordKey] = 0;
    // Start ambassadors with a different initial offset to separate from activities
    return [10, -10]; 
  }
  
  // Increment the count of markers at this position
  ambassadorMarkerPositions[coordKey]++;
  
  // Calculate offset based on count (create a spiral pattern)
  const count = ambassadorMarkerPositions[coordKey];
  const angle = count * 0.8 + Math.PI; // in radians, offset by 180 degrees from activities
  const radius = Math.min(5 + count * 2, 25); // limit the max radius
  
  return [
    Math.cos(angle) * radius + 10,  // Add initial offset
    Math.sin(angle) * radius - 10   // Add initial offset
  ];
};

export const createActivityMarker = (
  activity: Activity, 
  map: mapboxgl.Map
): mapboxgl.Marker | null => {
  const coordinates = getCoordinates(activity.location);
  if (!coordinates) return null;

  // Skip adding markers for Remote/Virtual/Online activities at [0,0]
  if (coordinates[0] === 0 && coordinates[1] === 0) return null;
  
  // Create popup content
  const popupContent = `
    <div class="p-2">
      <h3 class="font-bold text-sm">${activity.title}</h3>
      <p class="text-xs text-muted-foreground">${activity.type}</p>
      <p class="text-xs text-muted-foreground">${activity.location}</p>
      <div class="text-xs text-finos-blue mt-1">
        ${activity.metrics.currentRegistrations} registrations
      </div>
    </div>
  `;

  // Create a popup
  const popup = new mapboxgl.Popup({ offset: 25 })
    .setHTML(popupContent);

  // Create custom marker element with color based on activity status
  const el = document.createElement('div');
  el.className = 'marker';
  
  // Set marker color based on status
  let color;
  switch(activity.status) {
    case 'Approved': color = '#77C043'; break;
    case 'Pending': color = '#FFBB28'; break;
    case 'Rejected': color = '#FF8042'; break;
    case 'Done': color = '#929292'; break;
    default: color = '#0091CD'; break;
  }
  
  el.style.backgroundColor = color;
  el.style.width = '20px';
  el.style.height = '20px';
  el.style.borderRadius = '50%';
  el.style.cursor = 'pointer';
  el.style.border = '2px solid white';
  el.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.3)';

  // Get offset for this marker
  const offset = getActivityMarkerOffset(coordinates);
  
  // Create marker with custom element and apply offset
  return new mapboxgl.Marker(el)
    .setLngLat(coordinates)
    .setPopup(popup)
    .setOffset(offset)
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

  // Get offset for this marker using ambassador-specific function
  const offset = getAmbassadorMarkerOffset(coordinates);
  
  // Create marker with custom element and apply offset
  return new mapboxgl.Marker(el)
    .setLngLat(coordinates)
    .setPopup(popup)
    .setOffset(offset)
    .addTo(map);
};
