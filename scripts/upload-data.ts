import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function uploadData() {
  try {
    // Read data from data.json
    const dataPath = path.join(process.cwd(), 'app', 'data', 'data.json');
    const data = fs.readFileSync(dataPath, 'utf-8');

    // Upload to Supabase storage
    const { error } = await supabase.storage
      .from('data')
      .upload('data.json', data, {
        upsert: true,
        contentType: 'application/json'
      });

    if (error) {
      console.error('Error uploading data:', error);
      return;
    }

    console.log('Data uploaded successfully!');
  } catch (error) {
    console.error('Error during upload:', error);
  }
}

uploadData(); 