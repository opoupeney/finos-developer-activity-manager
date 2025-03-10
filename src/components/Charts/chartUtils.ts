
import { Masterclass } from '@/types/masterclass';

// Define color palette for pie charts
export const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#a64d79', '#674ea7', '#3c78d8', '#6aa84f', '#f1c232', '#cc0000'];

// Process data for registrations by location
export const processLocationData = (activities: Masterclass[]) => {
  const registrationsByLocation = activities.reduce((acc: Record<string, number>, activity) => {
    const location = activity.location;
    if (!acc[location]) {
      acc[location] = 0;
    }
    acc[location] += activity.metrics.currentRegistrations;
    return acc;
  }, {});

  return Object.entries(registrationsByLocation).map(([name, value]) => ({ name, value }));
};

// Process data for registrations by type
export const processRegistrationTypeData = (activities: Masterclass[]) => {
  const registrationsByType = activities.reduce((acc: Record<string, number>, activity) => {
    const type = activity.type;
    if (!acc[type]) {
      acc[type] = 0;
    }
    acc[type] += activity.metrics.currentRegistrations;
    return acc;
  }, {});

  return Object.entries(registrationsByType).map(([name, value]) => ({ name, value }));
};

// Process data for participants by type
export const processParticipantTypeData = (activities: Masterclass[]) => {
  const participantsByType = activities.reduce((acc: Record<string, number>, activity) => {
    const type = activity.type;
    if (!acc[type]) {
      acc[type] = 0;
    }
    acc[type] += activity.metrics.currentParticipants || 0;
    return acc;
  }, {});

  return Object.entries(participantsByType).map(([name, value]) => ({ name, value }));
};
