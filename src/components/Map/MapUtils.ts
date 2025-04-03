
// Re-export all map utilities from smaller files
export { 
  getCoordinates,
  resetMarkerPositions,
  groupActivitiesByLocation,
  locationHasActivity
} from './utils/CoordinateUtils';

export { createActivityMarker } from './utils/ActivityMarkerUtils';
export { createAmbassadorMarker } from './utils/AmbassadorMarkerUtils';
