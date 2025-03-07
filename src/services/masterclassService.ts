
import { supabase } from "@/integrations/supabase/client";
import { Masterclass } from "../types/masterclass";

export const getMasterclassData = async (): Promise<Masterclass> => {
  try {
    // Get masterclass data
    const { data: masterclasses, error: masterclassError } = await supabase
      .from('masterclasses')
      .select('*')
      .eq('custom_id', 'mc-001')
      .single();
    
    if (masterclassError) throw masterclassError;
    
    // Get ownership data
    const { data: ownership, error: ownershipError } = await supabase
      .from('ownerships')
      .select('*')
      .eq('masterclass_id', masterclasses.id)
      .single();
    
    if (ownershipError) throw ownershipError;
    
    // Get impacts data
    const { data: impacts, error: impactsError } = await supabase
      .from('impacts')
      .select('*')
      .eq('masterclass_id', masterclasses.id)
      .single();
    
    if (impactsError) throw impactsError;
    
    // Get metrics data
    const { data: metrics, error: metricsError } = await supabase
      .from('metrics')
      .select('*')
      .eq('masterclass_id', masterclasses.id)
      .single();
    
    if (metricsError) throw metricsError;
    
    // Combine all data into a Masterclass object
    return {
      id: masterclasses.custom_id,
      title: masterclasses.title,
      type: masterclasses.type,
      date: masterclasses.date,
      kickOffDate: masterclasses.kick_off_date,
      endDate: masterclasses.end_date,
      location: masterclasses.location,
      marketingCampaign: masterclasses.marketing_campaign,
      marketingDescription: masterclasses.marketing_description,
      status: masterclasses.status,
      ownership: {
        finosLead: ownership.finos_lead,
        finosTeam: ownership.finos_team,
        marketingLiaison: ownership.marketing_liaison,
        memberSuccessLiaison: ownership.member_success_liaison,
        sponsorsPartners: ownership.sponsors_partners,
        channel: ownership.channel,
        ambassador: ownership.ambassador,
        toc: ownership.toc,
      },
      impacts: {
        useCase: impacts.use_case,
        strategicInitiative: impacts.strategic_initiative,
        projects: impacts.projects,
        targetedPersonas: impacts.targeted_personas,
      },
      metrics: {
        targetedRegistrations: metrics.targeted_registrations,
        currentRegistrations: metrics.current_registrations,
        registrationPercentage: metrics.registration_percentage,
        targetedParticipants: metrics.targeted_participants,
        currentParticipants: metrics.current_participants,
        participationPercentage: metrics.participation_percentage,
      },
    };
  } catch (error) {
    console.error("Error fetching masterclass data:", error);
    throw error;
  }
};

export const getMasterclassByID = async (id: string): Promise<Masterclass | undefined> => {
  try {
    // Get masterclass data
    const { data: masterclasses, error: masterclassError } = await supabase
      .from('masterclasses')
      .select('*')
      .eq('custom_id', id)
      .single();
    
    if (masterclassError) throw masterclassError;
    
    // Get ownership data
    const { data: ownership, error: ownershipError } = await supabase
      .from('ownerships')
      .select('*')
      .eq('masterclass_id', masterclasses.id)
      .single();
    
    if (ownershipError) throw ownershipError;
    
    // Get impacts data
    const { data: impacts, error: impactsError } = await supabase
      .from('impacts')
      .select('*')
      .eq('masterclass_id', masterclasses.id)
      .single();
    
    if (impactsError) throw impactsError;
    
    // Get metrics data
    const { data: metrics, error: metricsError } = await supabase
      .from('metrics')
      .select('*')
      .eq('masterclass_id', masterclasses.id)
      .single();
    
    if (metricsError) throw metricsError;
    
    // Combine all data into a Masterclass object
    return {
      id: masterclasses.custom_id,
      title: masterclasses.title,
      type: masterclasses.type,
      date: masterclasses.date,
      kickOffDate: masterclasses.kick_off_date,
      endDate: masterclasses.end_date,
      location: masterclasses.location,
      marketingCampaign: masterclasses.marketing_campaign,
      marketingDescription: masterclasses.marketing_description,
      status: masterclasses.status,
      ownership: {
        finosLead: ownership.finos_lead,
        finosTeam: ownership.finos_team,
        marketingLiaison: ownership.marketing_liaison,
        memberSuccessLiaison: ownership.member_success_liaison,
        sponsorsPartners: ownership.sponsors_partners,
        channel: ownership.channel,
        ambassador: ownership.ambassador,
        toc: ownership.toc,
      },
      impacts: {
        useCase: impacts.use_case,
        strategicInitiative: impacts.strategic_initiative,
        projects: impacts.projects,
        targetedPersonas: impacts.targeted_personas,
      },
      metrics: {
        targetedRegistrations: metrics.targeted_registrations,
        currentRegistrations: metrics.current_registrations,
        registrationPercentage: metrics.registration_percentage,
        targetedParticipants: metrics.targeted_participants,
        currentParticipants: metrics.current_participants,
        participationPercentage: metrics.participation_percentage,
      },
    };
  } catch (error) {
    console.error("Error fetching masterclass by ID:", error);
    return undefined;
  }
};

export const updateMasterclass = async (masterclass: Masterclass): Promise<Masterclass> => {
  try {
    // Get the UUID of the masterclass
    const { data: masterclassData, error: masterclassError } = await supabase
      .from('masterclasses')
      .select('id')
      .eq('custom_id', masterclass.id)
      .single();
    
    if (masterclassError) throw masterclassError;
    
    const masterclassId = masterclassData.id;
    
    // Update masterclass
    const { error: updateError } = await supabase
      .from('masterclasses')
      .update({
        title: masterclass.title,
        type: masterclass.type,
        date: masterclass.date,
        kick_off_date: masterclass.kickOffDate,
        end_date: masterclass.endDate,
        location: masterclass.location,
        marketing_campaign: masterclass.marketingCampaign,
        marketing_description: masterclass.marketingDescription,
        status: masterclass.status,
        updated_at: new Date(),
      })
      .eq('id', masterclassId);
    
    if (updateError) throw updateError;
    
    // Update ownership
    const { error: ownershipError } = await supabase
      .from('ownerships')
      .update({
        finos_lead: masterclass.ownership.finosLead,
        finos_team: masterclass.ownership.finosTeam,
        marketing_liaison: masterclass.ownership.marketingLiaison,
        member_success_liaison: masterclass.ownership.memberSuccessLiaison,
        sponsors_partners: masterclass.ownership.sponsorsPartners,
        channel: masterclass.ownership.channel,
        ambassador: masterclass.ownership.ambassador,
        toc: masterclass.ownership.toc,
      })
      .eq('masterclass_id', masterclassId);
    
    if (ownershipError) throw ownershipError;
    
    // Update impacts
    const { error: impactsError } = await supabase
      .from('impacts')
      .update({
        use_case: masterclass.impacts.useCase,
        strategic_initiative: masterclass.impacts.strategicInitiative,
        projects: masterclass.impacts.projects,
        targeted_personas: masterclass.impacts.targetedPersonas,
      })
      .eq('masterclass_id', masterclassId);
    
    if (impactsError) throw impactsError;
    
    // Update metrics
    const { error: metricsError } = await supabase
      .from('metrics')
      .update({
        targeted_registrations: masterclass.metrics.targetedRegistrations,
        current_registrations: masterclass.metrics.currentRegistrations,
        registration_percentage: masterclass.metrics.registrationPercentage,
        targeted_participants: masterclass.metrics.targetedParticipants,
        current_participants: masterclass.metrics.currentParticipants,
        participation_percentage: masterclass.metrics.participationPercentage,
      })
      .eq('masterclass_id', masterclassId);
    
    if (metricsError) throw metricsError;
    
    return masterclass;
  } catch (error) {
    console.error("Error updating masterclass:", error);
    throw error;
  }
};

export const getAllMasterclasses = async (): Promise<Masterclass[]> => {
  try {
    const { data: masterclasses, error: masterclassError } = await supabase
      .from('masterclasses')
      .select('*');
    
    if (masterclassError) throw masterclassError;
    
    const result: Masterclass[] = [];
    
    for (const masterclass of masterclasses) {
      // Get ownership data
      const { data: ownership, error: ownershipError } = await supabase
        .from('ownerships')
        .select('*')
        .eq('masterclass_id', masterclass.id)
        .single();
      
      if (ownershipError) {
        console.error("Error fetching ownership for masterclass:", masterclass.id, ownershipError);
        continue;
      }
      
      // Get impacts data
      const { data: impacts, error: impactsError } = await supabase
        .from('impacts')
        .select('*')
        .eq('masterclass_id', masterclass.id)
        .single();
      
      if (impactsError) {
        console.error("Error fetching impacts for masterclass:", masterclass.id, impactsError);
        continue;
      }
      
      // Get metrics data
      const { data: metrics, error: metricsError } = await supabase
        .from('metrics')
        .select('*')
        .eq('masterclass_id', masterclass.id)
        .single();
      
      if (metricsError) {
        console.error("Error fetching metrics for masterclass:", masterclass.id, metricsError);
        continue;
      }
      
      // Add masterclass to result
      result.push({
        id: masterclass.custom_id,
        title: masterclass.title,
        type: masterclass.type,
        date: masterclass.date,
        kickOffDate: masterclass.kick_off_date,
        endDate: masterclass.end_date,
        location: masterclass.location,
        marketingCampaign: masterclass.marketing_campaign,
        marketingDescription: masterclass.marketing_description,
        status: masterclass.status,
        ownership: {
          finosLead: ownership.finos_lead,
          finosTeam: ownership.finos_team,
          marketingLiaison: ownership.marketing_liaison,
          memberSuccessLiaison: ownership.member_success_liaison,
          sponsorsPartners: ownership.sponsors_partners,
          channel: ownership.channel,
          ambassador: ownership.ambassador,
          toc: ownership.toc,
        },
        impacts: {
          useCase: impacts.use_case,
          strategicInitiative: impacts.strategic_initiative,
          projects: impacts.projects,
          targetedPersonas: impacts.targeted_personas,
        },
        metrics: {
          targetedRegistrations: metrics.targeted_registrations,
          currentRegistrations: metrics.current_registrations,
          registrationPercentage: metrics.registration_percentage,
          targetedParticipants: metrics.targeted_participants,
          currentParticipants: metrics.current_participants,
          participationPercentage: metrics.participation_percentage,
        },
      });
    }
    
    return result;
  } catch (error) {
    console.error("Error fetching all masterclasses:", error);
    throw error;
  }
};
