
import { supabase } from '@/integrations/supabase/client';
import { Ambassador } from '@/types/ambassador';

export const fetchAmbassadors = async (): Promise<Ambassador[]> => {
  const { data, error } = await supabase
    .from('ambassadors')
    .select('*')
    .order('last_name', { ascending: true });

  if (error) {
    console.error('Error fetching ambassadors:', error);
    throw new Error(error.message);
  }

  return data || [];
};

export const fetchAmbassadorById = async (id: string): Promise<Ambassador> => {
  const { data, error } = await supabase
    .from('ambassadors')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching ambassador:', error);
    throw new Error(error.message);
  }

  return data;
};

export const createAmbassador = async (ambassador: Omit<Ambassador, 'id' | 'created_at' | 'updated_at'>): Promise<Ambassador> => {
  console.log('Creating ambassador with data:', ambassador);
  
  // Ensure all fields are properly formatted
  const formattedData = {
    ...ambassador,
    location: ambassador.location || null,
    linkedin_profile: ambassador.linkedin_profile || null,
    github_id: ambassador.github_id || null,
    company: ambassador.company || null,
    title: ambassador.title || null,
    bio: ambassador.bio || null,
    headshot_url: ambassador.headshot_url || null
  };
  
  const { data, error } = await supabase
    .from('ambassadors')
    .insert(formattedData)
    .select()
    .single();

  if (error) {
    console.error('Error creating ambassador:', error);
    throw new Error(error.message);
  }

  console.log('Ambassador created successfully:', data);
  return data;
};

export const updateAmbassador = async (id: string, ambassador: Partial<Omit<Ambassador, 'id' | 'created_at' | 'updated_at'>>): Promise<Ambassador> => {
  const { data, error } = await supabase
    .from('ambassadors')
    .update(ambassador)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating ambassador:', error);
    throw new Error(error.message);
  }

  return data;
};

export const deleteAmbassador = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('ambassadors')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting ambassador:', error);
    throw new Error(error.message);
  }
};

// Alias for backward compatibility
export const getAmbassador = fetchAmbassadorById;
