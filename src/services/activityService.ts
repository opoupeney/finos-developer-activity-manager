
import { supabase } from "@/integrations/supabase/client";
import { Activity, KeyDate } from "../types/activity";

export const getActivityData = async (): Promise<Activity> => {
  try {
    // Get event data
    const { data: events, error: eventError } = await supabase
      .from('activities')
      .select('*')
      .eq('custom_id', 'mc-001')
      .single();
    
    if (eventError) throw eventError;
    
    // Get ownership data
    const { data: ownership, error: ownershipError } = await supabase
      .from('ownerships')
      .select('*')
      .eq('activity_id', events.id)
      .single();
    
    if (ownershipError) throw ownershipError;
    
    // Get impacts data
    const { data: impacts, error: impactsError } = await supabase
      .from('impacts')
      .select('*')
      .eq('activity_id', events.id)
      .single();
    
    if (impactsError) throw impactsError;
    
    // Get metrics data
    const { data: metrics, error: metricsError } = await supabase
      .from('metrics')
      .select('*')
      .eq('activity_id', events.id)
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
      .from('activities')
      .select('*')
      .eq('custom_id', id)
      .single();
    
    if (eventError) throw eventError;
    
    // Get ownership data
    const { data: ownership, error: ownershipError } = await supabase
      .from('ownerships')
      .select('*')
      .eq('activity_id', events.id)
      .single();
    
    if (ownershipError) throw ownershipError;
    
    // Get impacts data
    const { data: impacts, error: impactsError } = await supabase
      .from('impacts')
      .select('*')
      .eq('activity_id', events.id)
      .single();
    
    if (impactsError) throw impactsError;
    
    // Get metrics data
    const { data: metrics, error: metricsError } = await supabase
      .from('metrics')
      .select('*')
      .eq('activity_id', events.id)
      .single();
    
    if (metricsError) throw metricsError;
    
    // Get key dates data
    const { data: keyDates, error: keyDatesError } = await supabase
      .from('key_dates')
      .select('*')
      .eq('activity_id', events.id);
    
    if (keyDatesError) {
      console.error("Error fetching key dates:", keyDatesError);
      // Continue with other data even if key dates fail
    }
    
    // Transform key dates to match our interface
    const formattedKeyDates: KeyDate[] = keyDates ? keyDates.map(kd => ({
      id: kd.id,
      activityId: events.custom_id,
      date: kd.date,
      description: kd.description,
      owner: kd.owner
    })) : [];
    
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
      keyDates: formattedKeyDates
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
      .from('activities')
      .select('id')
      .eq('custom_id', activity.id)
      .single();
    
    if (eventError) throw eventError;
    
    const eventId = eventData.id;
    
    // Update event
    const { error: updateError } = await supabase
      .from('activities')
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
      .eq('activity_id', eventId);
    
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
      .eq('activity_id', eventId);
    
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
      .eq('activity_id', eventId);
    
    if (metricsError) throw metricsError;
    
    // Update key dates (delete and insert approach)
    if (activity.keyDates) {
      // First delete existing key dates
      const { error: deleteKeyDatesError } = await supabase
        .from('key_dates')
        .delete()
        .eq('activity_id', eventId);
      
      if (deleteKeyDatesError) throw deleteKeyDatesError;
      
      // Then insert new ones if there are any
      if (activity.keyDates.length > 0) {
        const keyDatesForInsert = activity.keyDates.map(kd => ({
          activity_id: eventId,
          date: kd.date,
          description: kd.description,
          owner: kd.owner
        }));
        
        const { error: insertKeyDatesError } = await supabase
          .from('key_dates')
          .insert(keyDatesForInsert);
        
        if (insertKeyDatesError) throw insertKeyDatesError;
      }
    }
    
    return activity;
  } catch (error) {
    console.error("Error updating activity:", error);
    throw error;
  }
};

// Function to update only key dates
export const updateKeyDates = async (activityId: string, keyDates: KeyDate[]): Promise<void> => {
  try {
    // Get the UUID of the event
    const { data: eventData, error: eventError } = await supabase
      .from('activities')
      .select('id')
      .eq('custom_id', activityId)
      .single();
    
    if (eventError) throw eventError;
    
    const eventId = eventData.id;
    
    // First delete existing key dates
    const { error: deleteKeyDatesError } = await supabase
      .from('key_dates')
      .delete()
      .eq('activity_id', eventId);
    
    if (deleteKeyDatesError) throw deleteKeyDatesError;
    
    // Then insert new ones if there are any
    if (keyDates.length > 0) {
      const keyDatesForInsert = keyDates.map(kd => ({
        activity_id: eventId,
        date: kd.date,
        description: kd.description,
        owner: kd.owner
      }));
      
      const { error: insertKeyDatesError } = await supabase
        .from('key_dates')
        .insert(keyDatesForInsert);
      
      if (insertKeyDatesError) throw insertKeyDatesError;
    }
  } catch (error) {
    console.error("Error updating key dates:", error);
    throw error;
  }
};

export const getAllActivities = async (): Promise<Activity[]> => {
  try {
    const { data: events, error: eventError } = await supabase
      .from('activities')
      .select('*');
    
    if (eventError) throw eventError;
    
    const result: Activity[] = [];
    
    for (const event of events) {
      // Get ownership data
      const { data: ownership, error: ownershipError } = await supabase
        .from('ownerships')
        .select('*')
        .eq('activity_id', event.id)
        .single();
      
      if (ownershipError) {
        console.error("Error fetching ownership for activity:", event.id, ownershipError);
        continue;
      }
      
      // Get impacts data
      const { data: impacts, error: impactsError } = await supabase
        .from('impacts')
        .select('*')
        .eq('activity_id', event.id)
        .single();
      
      if (impactsError) {
        console.error("Error fetching impacts for activity:", event.id, impactsError);
        continue;
      }
      
      // Get metrics data
      const { data: metrics, error: metricsError } = await supabase
        .from('metrics')
        .select('*')
        .eq('activity_id', event.id)
        .single();
      
      if (metricsError) {
        console.error("Error fetching metrics for activity:", event.id, metricsError);
        continue;
      }
      
      // Get key dates data for this activity
      const { data: keyDates, error: keyDatesError } = await supabase
        .from('key_dates')
        .select('*')
        .eq('activity_id', event.id);
      
      if (keyDatesError) {
        console.error("Error fetching key dates for activity:", event.id, keyDatesError);
      }
      
      // Format key dates to match our interface
      const formattedKeyDates: KeyDate[] = keyDates ? keyDates.map(kd => ({
        id: kd.id,
        activityId: event.custom_id,
        date: kd.date,
        description: kd.description,
        owner: kd.owner
      })) : [];
      
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
        keyDates: formattedKeyDates
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
    // Ensure all data is serializable by creating a clean object
    const activityPayload = {
      title: activity.title,
      type: activity.type,
      date: activity.date,
      kick_off_date: activity.kickOffDate,
      end_date: activity.endDate,
      location: activity.location,
      marketing_campaign: activity.marketingCampaign,
      marketing_description: activity.marketingDescription,
      status: activity.status,
      custom_id: `de-${Date.now().toString().slice(-6)}`,
    };

    console.log('HEEERRRE activity', activityPayload);
    
    // Insert activity record
    const { data: eventData, error: eventError } = await supabase
      .from('activities')
      .insert(activityPayload)
      .select('id, custom_id')
      .single();
    
    if (eventError) throw eventError;

    // Create clean ownership object
    const ownershipPayload = {
      activity_id: eventData.id,
      finos_lead: activity.ownership.finosLead,
      finos_team: Array.isArray(activity.ownership.finosTeam) ? activity.ownership.finosTeam : [],
      marketing_liaison: activity.ownership.marketingLiaison,
      member_success_liaison: activity.ownership.memberSuccessLiaison,
      sponsors_partners: Array.isArray(activity.ownership.sponsorsPartners) ? activity.ownership.sponsorsPartners : [],
      channel: activity.ownership.channel,
      ambassador: activity.ownership.ambassador,
      toc: activity.ownership.toc,
    };

    console.log('HEEERRRE ownership', ownershipPayload);
    
    // Insert ownership data
    const { error: ownershipError } = await supabase
      .from('ownerships')
      .insert(ownershipPayload);
    
    if (ownershipError) throw ownershipError;
    
    // Create clean impacts object
    const impactsPayload = {
      activity_id: eventData.id,
      use_case: activity.impacts.useCase,
      strategic_initiative: activity.impacts.strategicInitiative,
      projects: Array.isArray(activity.impacts.projects) ? activity.impacts.projects : [],
      targeted_personas: Array.isArray(activity.impacts.targetedPersonas) ? activity.impacts.targetedPersonas : [],
    };

    console.log('HEEERRRE impact', activityPayload);
    
    // Insert impacts data
    const { error: impactsError } = await supabase
      .from('impacts')
      .insert(impactsPayload);
    
    if (impactsError) throw impactsError;
    
    // Create clean metrics object
    const metricsPayload = {
      activity_id: eventData.id,
      targeted_registrations: Number(activity.metrics.targetedRegistrations) || 0,
      current_registrations: Number(activity.metrics.currentRegistrations) || 0,
      registration_percentage: Number(activity.metrics.registrationPercentage) || 0,
      targeted_participants: Number(activity.metrics.targetedParticipants) || 0,
      current_participants: Number(activity.metrics.currentParticipants) || 0,
      participation_percentage: Number(activity.metrics.participationPercentage) || 0,
    };

    console.log('HEEERRRE metrics', activityPayload);
    
    // Insert metrics data
    const { error: metricsError } = await supabase
      .from('metrics')
      .insert(metricsPayload);
    
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
      .from('activities')
      .select('id')
      .eq('custom_id', id)
      .single();
    
    if (eventError) throw eventError;
    
    // Delete the activity (cascades to related tables due to FK constraints)
    const { error: deleteError } = await supabase
      .from('activities')
      .delete()
      .eq('id', eventData.id);
    
    if (deleteError) throw deleteError;
  } catch (error) {
    console.error("Error deleting activity:", error);
    throw error;
  }
};

// Alias functions for compatibility during transition
export const getMasterclassByID = getActivityByID;
export const getAllMasterclasses = getAllActivities;
export const createMasterclass = createActivity;
export const updateMasterclass = updateActivity;
export const deleteMasterclass = deleteActivity;
