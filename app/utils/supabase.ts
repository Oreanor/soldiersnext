import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Types
export interface Set {
  id: number;
  name: string;
  manufacturer: string;
  scale: string;
  year: string;
  folder: string;
  img: string;
  material: string;
  type: string;
  desc: string;
  figures: string[];
}

// Functions for working with sets
export const getSets = async () => {
  const { data, error } = await supabase
    .from('sets')
    .select('*')
    .order('id');
  
  if (error) throw error;
  return data as Set[];
};

export const getSetById = async (id: number) => {
  const { data, error } = await supabase
    .from('sets')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data as Set;
};

export const createSet = async (set: Omit<Set, 'id'>) => {
  const { data, error } = await supabase
    .from('sets')
    .insert([set])
    .select()
    .single();
  
  if (error) throw error;
  return data as Set;
};

export const updateSet = async (id: number, set: Partial<Set>) => {
  const { data, error } = await supabase
    .from('sets')
    .update(set)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data as Set;
};

export const deleteSet = async (id: number) => {
  const { error } = await supabase
    .from('sets')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

// Functions for working with images
export const uploadImage = async (file: File, folder: string) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${folder}/${Math.random()}.${fileExt}`;
  
  const { data, error } = await supabase.storage
    .from('images')
    .upload(fileName, file);
  
  if (error) throw error;
  return data.path;
};

export const getImageUrl = (path: string) => {
  return supabase.storage
    .from('images')
    .getPublicUrl(path).data.publicUrl;
};

export const deleteImage = async (path: string) => {
  const { error } = await supabase.storage
    .from('images')
    .remove([path]);
  
  if (error) throw error;
}; 
