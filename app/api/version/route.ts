import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    const versionPath = path.join(process.cwd(), 'app/version.json')
    const versionData = JSON.parse(fs.readFileSync(versionPath, 'utf-8'))
    return NextResponse.json(versionData)
  } catch (error) {
    console.error('Error reading version:', error)
    return NextResponse.json({ error: 'Failed to read version' }, { status: 500 })
  }
} 