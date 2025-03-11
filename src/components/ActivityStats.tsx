
import React from 'react';
import ProgressCard from './ProgressCard';
import { Activity } from '../types/activity';

interface ActivityStatsProps {
  activity: Activity;
}

const ActivityStats: React.FC<ActivityStatsProps> = ({ activity }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <ProgressCard 
        title="Targeted Registrations"
        value={activity.metrics.currentRegistrations}
        target={activity.metrics.targetedRegistrations}
        percentage={activity.metrics.registrationPercentage}
        className="animate-fade-in"
      />
      
      <ProgressCard 
        title="Targeted Participants"
        value={activity.metrics.currentParticipants}
        target={activity.metrics.targetedParticipants}
        percentage={activity.metrics.participationPercentage}
        className="animate-fade-in delay-100"
      />
    </div>
  );
};

export default ActivityStats;
