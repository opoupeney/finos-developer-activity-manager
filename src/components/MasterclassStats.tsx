
import React from 'react';
import ProgressCard from './ProgressCard';
import { Masterclass } from '../types/masterclass';

interface MasterclassStatsProps {
  masterclass: Masterclass;
}

const MasterclassStats: React.FC<MasterclassStatsProps> = ({ masterclass }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <ProgressCard 
        title="Targeted Registrations"
        value={masterclass.metrics.currentRegistrations}
        target={masterclass.metrics.targetedRegistrations}
        percentage={masterclass.metrics.registrationPercentage}
        className="animate-fade-in"
      />
      
      <ProgressCard 
        title="Targeted Participants"
        value={masterclass.metrics.currentParticipants}
        target={masterclass.metrics.targetedParticipants}
        percentage={masterclass.metrics.participationPercentage}
        className="animate-fade-in delay-100"
      />
    </div>
  );
};

export default MasterclassStats;
