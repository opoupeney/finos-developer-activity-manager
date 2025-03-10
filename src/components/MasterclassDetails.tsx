
import React from 'react';
import DetailCard from './DetailCard';
import { Masterclass } from '../types/masterclass';
import { format } from 'date-fns';

interface MasterclassDetailsProps {
  masterclass: Masterclass;
}

const MasterclassDetails: React.FC<MasterclassDetailsProps> = ({ masterclass }) => {
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
    { label: "Type", value: masterclass.type },
    { label: "Date", value: formatDateString(masterclass.date) },
    { label: "Kick-off Date", value: formatDateString(masterclass.kickOffDate) },
    { label: "End Date", value: formatDateString(masterclass.endDate) },
    { label: "Location", value: masterclass.location },
    { label: "Marketing Campaign", value: masterclass.marketingCampaign },
  ];

  const ownershipDetails = [
    { label: "FINOS Lead", value: masterclass.ownership.finosLead },
    { label: "FINOS Team", value: masterclass.ownership.finosTeam },
    { label: "Marketing Liaison", value: masterclass.ownership.marketingLiaison },
    { label: "Member Success Liaison", value: masterclass.ownership.memberSuccessLiaison },
    { label: "Sponsors/Partners", value: masterclass.ownership.sponsorsPartners },
    { label: "Channel", value: masterclass.ownership.channel },
    { label: "Ambassador", value: masterclass.ownership.ambassador },
    { label: "TOC", value: masterclass.ownership.toc },
  ];

  const impactDetails = [
    { label: "Use Case", value: masterclass.impacts.useCase || "Not specified" },
    { label: "Strategic Initiative", value: masterclass.impacts.strategicInitiative },
    { label: "Projects", value: masterclass.impacts.projects },
    { label: "Targeted Personas", value: masterclass.impacts.targetedPersonas },
  ];

  return (
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
  );
};

export default MasterclassDetails;
