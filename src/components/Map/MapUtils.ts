
import { Masterclass } from '@/types/masterclass';
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

export const createActivityMarker = (
  activity: Masterclass, 
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

  // Create marker with custom element
  return new mapboxgl.Marker(el)
    .setLngLat(coordinates)
    .setPopup(popup)
    .addTo(map);
};
