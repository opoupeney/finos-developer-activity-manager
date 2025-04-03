
import { Activity } from '@/types/activity';

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
export const locationHasActivity = new Map<string, boolean>();

// Reset tracking when map is reinitialized
export const resetMarkerPositions = () => {
  locationHasActivity.clear();
};

// Group activities by location
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
