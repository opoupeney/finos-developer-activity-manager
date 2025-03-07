import { Masterclass } from "../types/masterclass";

export const getMasterclassData = (): Masterclass => {
  return {
    id: "mc-001",
    title: "(Orchestra) Masterclass",
    type: "Masterclass",
    date: "April 2025",
    kickOffDate: "March 1st 2024",
    endDate: "Apr 30th 2025",
    location: "London + Virtual",
    marketingCampaign: "DevExpand",
    marketingDescription: "Discover how Moody's AI orchestration platform is transforming the landscape of automated decision-making in our hands-on Orchestra Masterclass. This live workshop demystifies the setup and operation of the \"Orchestra\" platform, offering a unique behind-the-scenes look at its architecture, functionality, and real-world applications. Guided by experts who have contributed to the platform's development, participants will engage in interactive sessions that walk through the complete process—from configuration to optimization—highlighting the platform's impact on innovation and efficiency. Whether you're an AI enthusiast or a financial technology professional, this session provides practical insights and actionable techniques to harness AI orchestration.",
    status: "Approved",
    ownership: {
      finosLead: "LB",
      finosTeam: ["LB", "OP"],
      marketingLiaison: "WM",
      memberSuccessLiaison: "KP",
      sponsorsPartners: ["Moody"],
      channel: "Direct",
      ambassador: "Luca Borella",
      toc: "Andrew Aitken",
    },
    impacts: {
      useCase: "",
      strategicInitiative: "AI",
      projects: ["AIR"],
      targetedPersonas: ["Software Engineers", "Software Architects", "Data Scientists"],
    },
    metrics: {
      targetedRegistrations: 50,
      currentRegistrations: 35,
      registrationPercentage: 70,
      targetedParticipants: 35,
      currentParticipants: 24,
      participationPercentage: 68,
    },
  };
};

export const getMasterclassByID = (id: string): Masterclass | undefined => {
  const defaultMasterclass = getMasterclassData();
  
  const variations: Masterclass[] = [
    defaultMasterclass,
    { ...defaultMasterclass, id: "mc-002", title: "Financial API Masterclass", status: "Pending", 
      date: "June 2025", location: "New York + Virtual",
      metrics: { ...defaultMasterclass.metrics, targetedRegistrations: 75, currentRegistrations: 30, registrationPercentage: 40,
      targetedParticipants: 50, currentParticipants: 15, participationPercentage: 30 } },
    { ...defaultMasterclass, id: "mc-003", title: "Blockchain in Finance", status: "Approved", 
      date: "September 2025", location: "Singapore + Virtual",
      metrics: { ...defaultMasterclass.metrics, targetedRegistrations: 100, currentRegistrations: 85, registrationPercentage: 85,
      targetedParticipants: 60, currentParticipants: 48, participationPercentage: 80 } },
    { ...defaultMasterclass, id: "mc-004", title: "AI Ethics in Financial Systems", status: "Rejected", 
      date: "January 2026", location: "Virtual Only",
      metrics: { ...defaultMasterclass.metrics, targetedRegistrations: 40, currentRegistrations: 0, registrationPercentage: 0,
      targetedParticipants: 25, currentParticipants: 0, participationPercentage: 0 } },
  ];

  return variations.find(masterclass => masterclass.id === id);
};

export const updateMasterclass = async (masterclass: Masterclass): Promise<Masterclass> => {
  console.log("Updating masterclass:", masterclass);
  return masterclass;
};
