import { NextResponse } from 'next/server'
import { DataItem } from '@/app/types'
import { getData, updateData } from '@/app/utils/supabase'
import { supabase } from '@/app/utils/supabase'

function generateId(): string {
  return Math.random().toString(36).substring(2, 8);
}

export async function GET() {
  try {
    const { data: supabaseData, error: downloadError } = await supabase.storage
      .from('data')
      .download('data.json');

    if (downloadError) {
      console.error('Error downloading data:', downloadError);
      throw downloadError;
    }

    const text = await supabaseData.text();
    const data = JSON.parse(text);
    console.log('Fetched data from Supabase:', data.length, 'items');
    
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  } catch (error) {
    console.error('Error reading data:', error);
    return NextResponse.json({ error: 'Failed to read data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    console.log('POST request received')
    const data = await getData();
    console.log('Current data:', data)
    
    let newItem: Partial<DataItem>;
    try {
      newItem = await request.json();
      console.log('New item from request:', newItem)
    } catch (error) {
      console.error('JSON parse error:', error)
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }

    if (!newItem.id) {
      newItem.id = generateId();
    }

    data.unshift(newItem as DataItem);
    console.log('Data after adding new item:', data)
    
    try {
      await updateData(data);
      console.log('Data updated in Supabase')
    } catch (error) {
      console.error('Supabase update error:', error)
      throw error
    }

    return NextResponse.json(newItem);
  } catch (error) {
    console.error('Error in POST route:', error);
    return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    console.log('Processing PUT request...');
    
    // Get the entire data array from request
    const updatedData = await request.json();
    console.log('Received data array with length:', updatedData.length);
    
    // Upload the new data directly to data.json
    const { error: uploadError } = await supabase.storage
      .from('data')
      .upload('data.json', JSON.stringify(updatedData), {
        upsert: true,
        contentType: 'application/json',
        cacheControl: 'no-cache'
      });

    if (uploadError) {
      console.error('Error uploading data:', uploadError);
      throw uploadError;
    }

    // Force immediate update by downloading the file
    const { data: verifyData, error: verifyError } = await supabase.storage
      .from('data')
      .download('data.json');

    if (verifyError) {
      console.error('Error verifying upload:', verifyError);
      throw verifyError;
    }

    const text = await verifyData.text();
    const verifiedData = JSON.parse(text);
    console.log('Verified data length:', verifiedData.length);

    console.log('Data updated in Supabase successfully');
    return NextResponse.json({ success: true }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  } catch (error) {
    console.error('Error updating data:', error);
    return NextResponse.json({ error: 'Failed to update data' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    console.log('Processing DELETE request...');
    
    // Get ID from URL
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();
    console.log('Looking for ID:', id);
    
    // Get current data from Supabase
    const { data: supabaseData, error: downloadError } = await supabase.storage
      .from('data')
      .download('data.json');

    if (downloadError) {
      console.error('Error downloading data:', downloadError);
      throw downloadError;
    }

    const text = await supabaseData.text();
    const data = JSON.parse(text);
    console.log('Current items in Supabase:', data.length);
    
    // Remove item from array
    const updatedData = data.filter((item: DataItem) => item.id !== id);
    console.log('Items after removal:', updatedData.length);
    
    // Upload updated data back to Supabase
    const { error: uploadError } = await supabase.storage
      .from('data')
      .upload('data.json', JSON.stringify(updatedData), {
        upsert: true,
        contentType: 'application/json',
        cacheControl: 'no-cache'
      });

    if (uploadError) {
      console.error('Error uploading data:', uploadError);
      throw uploadError;
    }

    console.log('Data updated in Supabase');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting data:', error);
    return NextResponse.json({ error: 'Failed to delete data' }, { status: 500 });
  }
} 