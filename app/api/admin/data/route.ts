import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { DataItem } from '@/app/types'
import { DATA_FILE_PATH } from '@/app/consts'
import { getData, saveData } from '@/app/utils/cloudinary'

function generateId(): string {
  return Math.random().toString(36).substring(2, 8);
}

export async function GET() {
  try {
    const data = await getData();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error reading data:', error);
    return NextResponse.json({ error: 'Failed to read data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await getData();
    let newItem: Partial<DataItem>;
    try {
      newItem = await request.json();
    } catch (error) {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }

    if (!newItem.id) {
      newItem.id = generateId();
    }

    data.unshift(newItem as DataItem);
    await saveData(data);

    return NextResponse.json(newItem);
  } catch (error) {
    console.error('Error saving data:', error);
    return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const data = await getData();
    let updatedItem: Partial<DataItem>;
    try {
      updatedItem = await request.json();
    } catch (error) {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }

    const index = data.findIndex((item: DataItem) => item.id === updatedItem.id);
    if (index === -1) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    data[index] = { ...data[index], ...updatedItem };
    await saveData(data);

    return NextResponse.json(data[index]);
  } catch (error) {
    console.error('Error updating data:', error);
    return NextResponse.json({ error: 'Failed to update data' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const data = await getData();
    const { id } = await request.json();

    const index = data.findIndex((item: DataItem) => item.id === id);
    if (index === -1) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    data.splice(index, 1);
    await saveData(data);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting data:', error);
    return NextResponse.json({ error: 'Failed to delete data' }, { status: 500 });
  }
} 