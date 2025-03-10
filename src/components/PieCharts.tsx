
import React from 'react';
import { Masterclass } from '@/types/masterclass';
import PieChartCard from './Charts/PieChartCard';
import { 
  processLocationData, 
  processRegistrationTypeData, 
  processParticipantTypeData 
} from './Charts/chartUtils';

interface PieChartsProps {
  activities: Masterclass[];
}

const PieCharts: React.FC<PieChartsProps> = ({ activities }) => {
  // Convert data for charts
  const locationData = processLocationData(activities);
  const registrationTypeData = processRegistrationTypeData(activities);
  const participantTypeData = processParticipantTypeData(activities);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 animate-fade-in">
      <PieChartCard 
        title="Registrations by Location" 
        data={locationData} 
      />
      
      <PieChartCard 
        title="Registrations by Type" 
        data={registrationTypeData} 
      />
      
      <PieChartCard 
        title="Participants by Type" 
        data={participantTypeData} 
      />
    </div>
  );
};

export default PieCharts;
