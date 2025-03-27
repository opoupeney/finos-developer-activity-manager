
import React from 'react';
import DetailCard from './DetailCard';
import { Activity } from '../types/activity';
import { format } from 'date-fns';

interface ActivityDetailsProps {
  activity: Activity;
}

const ActivityDetails: React.FC<ActivityDetailsProps> = ({ activity }) => {
  // Format the date string if it's a valid date
  const formatDateString = (dateStr: string) => {
    try {
      // Check if we have a valid date string
      const date = new Date(dateStr);
      if (!isNaN(date.getTime())) {
        return format(date, 'MMMM d, yyyy');
      }
      // If not a valid date, return the original string
      return dateStr;
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateStr;
    }
  };

  const generalDetails = [
    { label: "Type", value: activity.type },
    { label: "Date", value: formatDateString(activity.date) },
    { label: "Kick-off Date", value: formatDateString(activity.kickOffDate) },
    { label: "End Date", value: formatDateString(activity.endDate) },
    { label: "Location", value: activity.location },
    { label: "Marketing Campaign", value: activity.marketingCampaign },
  ];

  const ownershipDetails = [
    { label: "FINOS Lead", value: activity.ownership.finosLead },
    { label: "FINOS Team", value: activity.ownership.finosTeam },
    { label: "Marketing Liaison", value: activity.ownership.marketingLiaison },
    { label: "Member Success Liaison", value: activity.ownership.memberSuccessLiaison },
    { label: "Sponsors/Partners", value: activity.ownership.sponsorsPartners },
    { label: "Channel", value: activity.ownership.channel },
    { label: "Ambassador", value: activity.ownership.ambassador },
    { label: "TOC", value: activity.ownership.toc },
  ];

  const impactDetails = [
    { label: "Use Case", value: activity.impacts.useCase || "Not specified" },
    { label: "Strategic Initiative", value: activity.impacts.strategicInitiative },
    { label: "Projects", value: activity.impacts.projects },
    { label: "Targeted Personas", value: activity.impacts.targetedPersonas },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DetailCard 
          title="General Information" 
          items={generalDetails} 
          className="animate-slide-in-left"
        />
        
        <DetailCard 
          title="Ownership" 
          items={ownershipDetails} 
          className="animate-slide-in-left"
        />
        
        <DetailCard 
          title="Impacts" 
          items={impactDetails} 
          className="animate-slide-in-left"
        />
      </div>
    </div>
  );
};

export default ActivityDetails;
