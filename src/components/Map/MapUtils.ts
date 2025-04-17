
// Re-export all map utilities from smaller files
export { 
  getCoordinates,
  resetMarkerPositions,
  groupActivitiesByLocation,
  groupAmbassadorsByLocation,
  locationHasActivity
} from './utils/CoordinateUtils';

export { createActivityMarker } from './utils/ActivityMarkerUtils';
export { createAmbassadorMarker } from './utils/AmbassadorMarkerUtils';

// Add custom scrollbar styles for map popups
const addMapPopupStyles = () => {
  // Check if the styles are already added
  if (!document.getElementById('map-popup-styles')) {
    const styleEl = document.createElement('style');
    styleEl.id = 'map-popup-styles';
    styleEl.innerHTML = `
      .custom-scrollbar::-webkit-scrollbar {
        width: 4px;
      }
      .custom-scrollbar::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 4px;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background: #888;
        border-radius: 4px;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: #555;
      }
      .mapboxgl-popup-content {
        max-width: 280px !important;
      }
    `;
    document.head.appendChild(styleEl);
  }
};

// Initialize the styles when the module is loaded
if (typeof document !== 'undefined') {
  addMapPopupStyles();
}
