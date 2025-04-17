
import { Activity } from '@/types/activity';
import { Ambassador } from '@/types/ambassador';

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
    'Bangalore': [77.5946, 12.9716],
    'Barcelona': [2.1734, 41.3851],
    'Hyderabad': [78.4861, 17.3850],
    'Lakewood, Ohio': [-81.7996, 41.4819],
    'Lakewood': [-81.7996, 41.4819], // Adding just 'Lakewood' as an alias
    'Remote': [0, 0],
    'Virtual': [0, 0],
    'Online': [0, 0]
  };

  // Log the location being searched for
  console.log('Looking up coordinates for location:', location);
  
  if (!location) {
    console.log('Empty location provided');
    return null;
  }

  // First try exact match
  if (locationMap[location]) {
    console.log('Exact match found for', location, 'with coordinates', locationMap[location]);
    return locationMap[location];
  }

  // Then try case-insensitive exact match
  const locationLower = location.toLowerCase();
  for (const [key, value] of Object.entries(locationMap)) {
    if (key.toLowerCase() === locationLower) {
      console.log('Case-insensitive exact match found for', location, ':', key, 'with coordinates', value);
      return value;
    }
  }
  
  // Finally try includes match
  for (const [key, value] of Object.entries(locationMap)) {
    if (location.toLowerCase().includes(key.toLowerCase()) || 
        key.toLowerCase().includes(location.toLowerCase())) {
      console.log('Partial match found for', location, ':', key, 'with coordinates', value);
      return value;
    }
  }

  // Log if no location was found
  console.log('No coordinates found for location:', location);
  
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
    console.log('Marked location as having activity:', coordKey, activity.location);
  });
  
  return groupedActivities;
};

// Group ambassadors by location
export const groupAmbassadorsByLocation = (ambassadors: Ambassador[]): Record<string, Ambassador[]> => {
  const groupedAmbassadors: Record<string, Ambassador[]> = {};
  
  ambassadors.forEach(ambassador => {
    if (!ambassador.location) return;
    
    const coordinates = getCoordinates(ambassador.location);
    if (!coordinates) return;
    
    // Skip adding Remote/Virtual/Online ambassadors at [0,0]
    if (coordinates[0] === 0 && coordinates[1] === 0) return;
    
    const coordKey = `${coordinates[0]},${coordinates[1]}`;
    
    if (!groupedAmbassadors[coordKey]) {
      groupedAmbassadors[coordKey] = [];
    }
    
    groupedAmbassadors[coordKey].push(ambassador);
    
    console.log('Grouped ambassador at location:', coordKey, ambassador.first_name, ambassador.last_name);
  });
  
  return groupedAmbassadors;
};
