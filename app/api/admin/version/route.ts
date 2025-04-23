import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function PUT(request: NextRequest) {
  try {
    const versionPath = path.join(process.cwd(), 'app/version.json')
    const currentVersion = JSON.parse(fs.readFileSync(versionPath, 'utf-8'))
    
    // Parse version string into major.minor.patch
    const [major, minor, patch] = currentVersion.version.split('.').map(Number)
    
    // Increment patch version
    const newVersion = `${major}.${minor}.${patch + 1}`
    
    const newVersionData = {
      version: newVersion,
      lastUpdated: new Date().toISOString()
    }
    
    fs.writeFileSync(versionPath, JSON.stringify(newVersionData, null, 2))
    
    return NextResponse.json(newVersionData)
  } catch (error) {
    console.error('Error updating version:', error)
    return NextResponse.json({ error: 'Failed to update version' }, { status: 500 })
  }
} 