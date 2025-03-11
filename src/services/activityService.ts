
import { supabase } from "@/integrations/supabase/client";
import { Activity } from "../types/activity";

export const getActivityData = async (): Promise<Activity> => {
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
    
    // Combine all data into an Activity object
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
    console.error("Error fetching activity data:", error);
    throw error;
  }
};

export const getActivityByID = async (id: string): Promise<Activity | undefined> => {
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
    
    // Combine all data into an Activity object
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
    console.error("Error fetching activity by ID:", error);
    return undefined;
  }
};

export const updateActivity = async (activity: Activity): Promise<Activity> => {
  try {
    // Get the UUID of the event
    const { data: eventData, error: eventError } = await supabase
      .from('masterclasses')
      .select('id')
      .eq('custom_id', activity.id)
      .single();
    
    if (eventError) throw eventError;
    
    const eventId = eventData.id;
    
    // Update event
    const { error: updateError } = await supabase
      .from('masterclasses')
      .update({
        title: activity.title,
        type: activity.type,
        date: activity.date,
        kick_off_date: activity.kickOffDate,
        end_date: activity.endDate,
        location: activity.location,
        marketing_campaign: activity.marketingCampaign,
        marketing_description: activity.marketingDescription,
        status: activity.status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', eventId);
    
    if (updateError) throw updateError;
    
    // Update ownership
    const { error: ownershipError } = await supabase
      .from('ownerships')
      .update({
        finos_lead: activity.ownership.finosLead,
        finos_team: activity.ownership.finosTeam,
        marketing_liaison: activity.ownership.marketingLiaison,
        member_success_liaison: activity.ownership.memberSuccessLiaison,
        sponsors_partners: activity.ownership.sponsorsPartners,
        channel: activity.ownership.channel,
        ambassador: activity.ownership.ambassador,
        toc: activity.ownership.toc,
      })
      .eq('masterclass_id', eventId);
    
    if (ownershipError) throw ownershipError;
    
    // Update impacts
    const { error: impactsError } = await supabase
      .from('impacts')
      .update({
        use_case: activity.impacts.useCase,
        strategic_initiative: activity.impacts.strategicInitiative,
        projects: activity.impacts.projects,
        targeted_personas: activity.impacts.targetedPersonas,
      })
      .eq('masterclass_id', eventId);
    
    if (impactsError) throw impactsError;
    
    // Update metrics
    const { error: metricsError } = await supabase
      .from('metrics')
      .update({
        targeted_registrations: activity.metrics.targetedRegistrations,
        current_registrations: activity.metrics.currentRegistrations,
        registration_percentage: activity.metrics.registrationPercentage,
        targeted_participants: activity.metrics.targetedParticipants,
        current_participants: activity.metrics.currentParticipants,
        participation_percentage: activity.metrics.participationPercentage,
      })
      .eq('masterclass_id', eventId);
    
    if (metricsError) throw metricsError;
    
    return activity;
  } catch (error) {
    console.error("Error updating activity:", error);
    throw error;
  }
};

export const getAllActivities = async (): Promise<Activity[]> => {
  try {
    const { data: events, error: eventError } = await supabase
      .from('masterclasses')
      .select('*');
    
    if (eventError) throw eventError;
    
    const result: Activity[] = [];
    
    for (const event of events) {
      // Get ownership data
      const { data: ownership, error: ownershipError } = await supabase
        .from('ownerships')
        .select('*')
        .eq('masterclass_id', event.id)
        .single();
      
      if (ownershipError) {
        console.error("Error fetching ownership for activity:", event.id, ownershipError);
        continue;
      }
      
      // Get impacts data
      const { data: impacts, error: impactsError } = await supabase
        .from('impacts')
        .select('*')
        .eq('masterclass_id', event.id)
        .single();
      
      if (impactsError) {
        console.error("Error fetching impacts for activity:", event.id, impactsError);
        continue;
      }
      
      // Get metrics data
      const { data: metrics, error: metricsError } = await supabase
        .from('metrics')
        .select('*')
        .eq('masterclass_id', event.id)
        .single();
      
      if (metricsError) {
        console.error("Error fetching metrics for activity:", event.id, metricsError);
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
    console.error("Error fetching all activities:", error);
    throw error;
  }
};

export const createActivity = async (activity: Omit<Activity, 'id'>): Promise<Activity> => {
  try {
    // Create a custom ID for the new event
    const timestamp = Date.now();
    const customId = `de-${timestamp.toString().slice(-6)}`;
    
    // Insert activity record
    const { data: eventData, error: eventError } = await supabase
      .from('masterclasses')
      .insert({
        title: activity.title,
        type: activity.type,
        date: activity.date,
        kick_off_date: activity.kickOffDate,
        end_date: activity.endDate,
        location: activity.location,
        marketing_campaign: activity.marketingCampaign,
        marketing_description: activity.marketingDescription,
        status: activity.status,
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
        finos_lead: activity.ownership.finosLead,
        finos_team: activity.ownership.finosTeam,
        marketing_liaison: activity.ownership.marketingLiaison,
        member_success_liaison: activity.ownership.memberSuccessLiaison,
        sponsors_partners: activity.ownership.sponsorsPartners,
        channel: activity.ownership.channel,
        ambassador: activity.ownership.ambassador,
        toc: activity.ownership.toc,
      });
    
    if (ownershipError) throw ownershipError;
    
    // Insert impacts data
    const { error: impactsError } = await supabase
      .from('impacts')
      .insert({
        masterclass_id: eventData.id,
        use_case: activity.impacts.useCase,
        strategic_initiative: activity.impacts.strategicInitiative,
        projects: activity.impacts.projects,
        targeted_personas: activity.impacts.targetedPersonas,
      });
    
    if (impactsError) throw impactsError;
    
    // Insert metrics data
    const { error: metricsError } = await supabase
      .from('metrics')
      .insert({
        masterclass_id: eventData.id,
        targeted_registrations: activity.metrics.targetedRegistrations,
        current_registrations: activity.metrics.currentRegistrations,
        registration_percentage: activity.metrics.registrationPercentage,
        targeted_participants: activity.metrics.targetedParticipants,
        current_participants: activity.metrics.currentParticipants,
        participation_percentage: activity.metrics.participationPercentage,
      });
    
    if (metricsError) throw metricsError;
    
    // Return the created activity with its ID
    return {
      ...activity,
      id: eventData.custom_id,
    };
  } catch (error) {
    console.error("Error creating activity:", error);
    throw error;
  }
};

export const deleteActivity = async (id: string): Promise<void> => {
  try {
    // Get the UUID of the event
    const { data: eventData, error: eventError } = await supabase
      .from('masterclasses')
      .select('id')
      .eq('custom_id', id)
      .single();
    
    if (eventError) throw eventError;
    
    // Delete the activity (cascades to related tables due to FK constraints)
    const { error: deleteError } = await supabase
      .from('masterclasses')
      .delete()
      .eq('id', eventData.id);
    
    if (deleteError) throw deleteError;
  } catch (error) {
    console.error("Error deleting activity:", error);
    throw error;
  }
};
