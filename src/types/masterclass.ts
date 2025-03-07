
export interface Masterclass {
  id: string;
  title: string;
  type: string;
  date: string;
  kickOffDate: string;
  endDate: string;
  location: string;
  marketingCampaign: string;
  marketingDescription: string;
  status: 'Approved' | 'Pending' | 'Rejected';
  ownership: Ownership;
  impacts: Impacts;
  metrics: Metrics;
}

export interface Ownership {
  finosLead: string;
  finosTeam: string[];
  marketingLiaison: string;
  memberSuccessLiaison: string;
  sponsorsPartners: string[];
  channel: string;
  ambassador: string;
  toc: string;
}

export interface Impacts {
  useCase: string;
  strategicInitiative: string;
  projects: string[];
  targetedPersonas: string[];
}

export interface Metrics {
  targetedRegistrations: number;
  currentRegistrations: number;
  registrationPercentage: number;
  targetedParticipants: number;
  currentParticipants: number;
  participationPercentage: number;
}
