
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

export const updateMasterclass = async (masterclass: Masterclass): Promise<Masterclass> => {
  // In a real application, this would make an API call to update the data
  console.log("Updating masterclass:", masterclass);
  return masterclass;
};
