
import { supabase } from '@/integrations/supabase/client';
import { Content } from '@/types/content';

export const fetchContents = async (): Promise<Content[]> => {
  const { data, error } = await supabase
    .from('contents')
    .select('*')
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('Error fetching contents:', error);
    throw error;
  }

  return data || [];
};

export const fetchContentById = async (id: string): Promise<Content | null> => {
  const { data, error } = await supabase
    .from('contents')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('Error fetching content:', error);
    throw error;
  }

  return data;
};

export const createContent = async (content: Omit<Content, 'id' | 'created_at' | 'updated_at'>): Promise<Content> => {
  const { data, error } = await supabase
    .from('contents')
    .insert(content)
    .select()
    .single();

  if (error) {
    console.error('Error creating content:', error);
    throw error;
  }

  return data;
};

export const updateContent = async (id: string, content: Partial<Omit<Content, 'id' | 'created_at' | 'updated_at'>>): Promise<Content> => {
  const { data, error } = await supabase
    .from('contents')
    .update(content)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating content:', error);
    throw error;
  }

  return data;
};

export const deleteContent = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('contents')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting content:', error);
    throw error;
  }
};
