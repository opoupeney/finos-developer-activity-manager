import { supabase } from "@/integrations/supabase/client";
import { Masterclass } from "../types/masterclass";

export const getMasterclassData = async (): Promise<Masterclass> => {
  try {
    // Get event data
    const { data: events, error: eventError } = await supabase
      .from('masterclasses')
      .select('*')
      .eq('custom_id', 'mc-001')
      .single();
    
    if (eventError) throw eventError;
    
    // Get ownership data
    const { data: ownership, error: ownershipError } = await supabase
      .from('ownerships')
      .select('*')
      .eq('masterclass_id', events.id)
      .single();
    
    if (ownershipError) throw ownershipError;
    
    // Get impacts data
    const { data: impacts, error: impactsError } = await supabase
      .from('impacts')
      .select('*')
      .eq('masterclass_id', events.id)
      .single();
    
    if (impactsError) throw impactsError;
    
    // Get metrics data
    const { data: metrics, error: metricsError } = await supabase
      .from('metrics')
      .select('*')
      .eq('masterclass_id', events.id)
      .single();
    
    if (metricsError) throw metricsError;
    
    // Combine all data into a Masterclass object
    return {
      id: events.custom_id,
      title: events.title,
      type: events.type,
      date: events.date,
      kickOffDate: events.kick_off_date,
      endDate: events.end_date,
      location: events.location,
      marketingCampaign: events.marketing_campaign,
      marketingDescription: events.marketing_description,
      status: events.status as 'Approved' | 'Pending' | 'Rejected' | 'Done',
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
    console.error("Error fetching developer event data:", error);
    throw error;
  }
};

export const getMasterclassByID = async (id: string): Promise<Masterclass | undefined> => {
  try {
    // Get event data
    const { data: events, error: eventError } = await supabase
      .from('masterclasses')
      .select('*')
      .eq('custom_id', id)
      .single();
    
    if (eventError) throw eventError;
    
    // Get ownership data
    const { data: ownership, error: ownershipError } = await supabase
      .from('ownerships')
      .select('*')
      .eq('masterclass_id', events.id)
      .single();
    
    if (ownershipError) throw ownershipError;
    
    // Get impacts data
    const { data: impacts, error: impactsError } = await supabase
      .from('impacts')
      .select('*')
      .eq('masterclass_id', events.id)
      .single();
    
    if (impactsError) throw impactsError;
    
    // Get metrics data
    const { data: metrics, error: metricsError } = await supabase
      .from('metrics')
      .select('*')
      .eq('masterclass_id', events.id)
      .single();
    
    if (metricsError) throw metricsError;
    
    // Combine all data into a Masterclass object
    return {
      id: events.custom_id,
      title: events.title,
      type: events.type,
      date: events.date,
      kickOffDate: events.kick_off_date,
      endDate: events.end_date,
      location: events.location,
      marketingCampaign: events.marketing_campaign,
      marketingDescription: events.marketing_description,
      status: events.status as 'Approved' | 'Pending' | 'Rejected' | 'Done',
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
    console.error("Error fetching developer event by ID:", error);
    return undefined;
  }
};

export const updateMasterclass = async (masterclass: Masterclass): Promise<Masterclass> => {
  try {
    // Get the UUID of the event
    const { data: eventData, error: eventError } = await supabase
      .from('masterclasses')
      .select('id')
      .eq('custom_id', masterclass.id)
      .single();
    
    if (eventError) throw eventError;
    
    const eventId = eventData.id;
    
    // Update event
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
        updated_at: new Date().toISOString(),
      })
      .eq('id', eventId);
    
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
      .eq('masterclass_id', eventId);
    
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
      .eq('masterclass_id', eventId);
    
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
      .eq('masterclass_id', eventId);
    
    if (metricsError) throw metricsError;
    
    return masterclass;
  } catch (error) {
    console.error("Error updating developer event:", error);
    throw error;
  }
};

export const getAllMasterclasses = async (): Promise<Masterclass[]> => {
  try {
    const { data: events, error: eventError } = await supabase
      .from('masterclasses')
      .select('*');
    
    if (eventError) throw eventError;
    
    const result: Masterclass[] = [];
    
    for (const event of events) {
      // Get ownership data
      const { data: ownership, error: ownershipError } = await supabase
        .from('ownerships')
        .select('*')
        .eq('masterclass_id', event.id)
        .single();
      
      if (ownershipError) {
        console.error("Error fetching ownership for developer event:", event.id, ownershipError);
        continue;
      }
      
      // Get impacts data
      const { data: impacts, error: impactsError } = await supabase
        .from('impacts')
        .select('*')
        .eq('masterclass_id', event.id)
        .single();
      
      if (impactsError) {
        console.error("Error fetching impacts for developer event:", event.id, impactsError);
        continue;
      }
      
      // Get metrics data
      const { data: metrics, error: metricsError } = await supabase
        .from('metrics')
        .select('*')
        .eq('masterclass_id', event.id)
        .single();
      
      if (metricsError) {
        console.error("Error fetching metrics for developer event:", event.id, metricsError);
        continue;
      }
      
      // Add event to result
      result.push({
        id: event.custom_id,
        title: event.title,
        type: event.type,
        date: event.date,
        kickOffDate: event.kick_off_date,
        endDate: event.end_date,
        location: event.location,
        marketingCampaign: event.marketing_campaign,
        marketingDescription: event.marketing_description,
        status: event.status as 'Approved' | 'Pending' | 'Rejected' | 'Done',
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
    console.error("Error fetching all developer events:", error);
    throw error;
  }
};

export const createMasterclass = async (masterclass: Omit<Masterclass, 'id'>): Promise<Masterclass> => {
  try {
    // Create a custom ID for the new event
    const timestamp = Date.now();
    const customId = `de-${timestamp.toString().slice(-6)}`;
    
    // Insert masterclass record
    const { data: eventData, error: eventError } = await supabase
      .from('masterclasses')
      .insert({
        title: masterclass.title,
        type: masterclass.type,
        date: masterclass.date,
        kick_off_date: masterclass.kickOffDate,
        end_date: masterclass.endDate,
        location: masterclass.location,
        marketing_campaign: masterclass.marketingCampaign,
        marketing_description: masterclass.marketingDescription,
        status: masterclass.status,
        custom_id: customId,
      })
      .select('id, custom_id')
      .single();
    
    if (eventError) throw eventError;
    
    // Insert ownership data
    const { error: ownershipError } = await supabase
      .from('ownerships')
      .insert({
        masterclass_id: eventData.id,
        finos_lead: masterclass.ownership.finosLead,
        finos_team: masterclass.ownership.finosTeam,
        marketing_liaison: masterclass.ownership.marketingLiaison,
        member_success_liaison: masterclass.ownership.memberSuccessLiaison,
        sponsors_partners: masterclass.ownership.sponsorsPartners,
        channel: masterclass.ownership.channel,
        ambassador: masterclass.ownership.ambassador,
        toc: masterclass.ownership.toc,
      });
    
    if (ownershipError) throw ownershipError;
    
    // Insert impacts data
    const { error: impactsError } = await supabase
      .from('impacts')
      .insert({
        masterclass_id: eventData.id,
        use_case: masterclass.impacts.useCase,
        strategic_initiative: masterclass.impacts.strategicInitiative,
        projects: masterclass.impacts.projects,
        targeted_personas: masterclass.impacts.targetedPersonas,
      });
    
    if (impactsError) throw impactsError;
    
    // Insert metrics data
    const { error: metricsError } = await supabase
      .from('metrics')
      .insert({
        masterclass_id: eventData.id,
        targeted_registrations: masterclass.metrics.targetedRegistrations,
        current_registrations: masterclass.metrics.currentRegistrations,
        registration_percentage: masterclass.metrics.registrationPercentage,
        targeted_participants: masterclass.metrics.targetedParticipants,
        current_participants: masterclass.metrics.currentParticipants,
        participation_percentage: masterclass.metrics.participationPercentage,
      });
    
    if (metricsError) throw metricsError;
    
    // Return the created masterclass with its ID
    return {
      ...masterclass,
      id: eventData.custom_id,
    };
  } catch (error) {
    console.error("Error creating developer event:", error);
    throw error;
  }
};

export const deleteMasterclass = async (id: string): Promise<void> => {
  try {
    // Get the UUID of the event
    const { data: eventData, error: eventError } = await supabase
      .from('masterclasses')
      .select('id')
      .eq('custom_id', id)
      .single();
    
    if (eventError) throw eventError;
    
    // Delete the masterclass (cascades to related tables due to FK constraints)
    const { error: deleteError } = await supabase
      .from('masterclasses')
      .delete()
      .eq('id', eventData.id);
    
    if (deleteError) throw deleteError;
  } catch (error) {
    console.error("Error deleting developer event:", error);
    throw error;
  }
};
