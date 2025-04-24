import { createClient } from '@supabase/supabase-js';
import { DataItem } from '../types';

// Проверяем наличие переменных окружения
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('NEXT_PUBLIC_SUPABASE_URL is required');
}

if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY is required');
}

// Создаем клиент с настройками
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    },
    db: {
      schema: 'public'
    }
  }
);

// Functions for working with data file
export const getData = async (): Promise<DataItem[]> => {
  try {
    console.log('Fetching data from Supabase...')
    const { data, error } = await supabase.storage
      .from('data')
      .download('data.json');

    if (error) {
      console.error('Error downloading data:', error);
      throw error;
    }
    
    const text = await data.text();
    console.log('Raw data from Supabase:', text);
    
    const parsedData = JSON.parse(text);
    console.log('Parsed data items:', parsedData.length);
    console.log('First item ID:', parsedData[0]?.id);
    
    return parsedData;
  } catch (error) {
    console.error('Error in getData:', error);
    throw error;
  }
};

export const updateData = async (data: DataItem[]): Promise<void> => {
  try {
    console.log('Attempting to update data in Supabase...')
    console.log('Original data:', JSON.stringify(data, null, 2))
    
    // First try to update
    const { error: updateError } = await supabase.storage
      .from('data')
      .update('data.json', JSON.stringify(data), {
        contentType: 'application/json',
        cacheControl: 'no-cache'
      });

    // If update fails, try upload
    if (updateError) {
      console.log('Update failed, trying upload...', updateError);
      const { error: uploadError } = await supabase.storage
        .from('data')
        .upload('data.json', JSON.stringify(data), {
          upsert: true,
          contentType: 'application/json',
          cacheControl: 'no-cache'
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }
    }

    // Verify the upload
    const { data: verifyData, error: verifyError } = await supabase.storage
      .from('data')
      .download('data.json');

    if (verifyError) {
      console.error('Verification error:', verifyError);
      throw verifyError;
    }

    const uploadedContent = await verifyData.text();
    console.log('Uploaded content:', uploadedContent);
    
    const uploadedData = JSON.parse(uploadedContent);
    console.log('Uploaded data:', JSON.stringify(uploadedData, null, 2));
    
    const originalStr = JSON.stringify(data);
    const uploadedStr = JSON.stringify(uploadedData);
    
    if (originalStr !== uploadedStr) {
      console.error('Data mismatch detected');
      console.error('Original length:', originalStr.length);
      console.error('Uploaded length:', uploadedStr.length);
      console.error('First difference at:', findFirstDifference(originalStr, uploadedStr));
      throw new Error('Data verification failed');
    }

    console.log('Data updated and verified successfully in Supabase');
  } catch (error) {
    console.error('Error in updateData:', error);
    throw error;
  }
};

function findFirstDifference(str1: string, str2: string): number {
  const minLength = Math.min(str1.length, str2.length);
  for (let i = 0; i < minLength; i++) {
    if (str1[i] !== str2[i]) {
      return i;
    }
  }
  return minLength;
}

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
