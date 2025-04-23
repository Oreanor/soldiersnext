import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const VERSION_FILE_PATH = path.join(process.cwd(), 'app', 'version.json')

async function readVersion() {
  try {
    const raw = await fs.readFile(VERSION_FILE_PATH, 'utf8')
    return JSON.parse(raw)
  } catch (error) {
    console.error('Error reading version file:', error)
    return { version: '1.0.0', lastUpdated: new Date().toISOString() }
  }
}

async function writeVersion(version: string) {
  try {
    const data = {
      version,
      lastUpdated: new Date().toISOString()
    }
    await fs.writeFile(VERSION_FILE_PATH, JSON.stringify(data, null, 2), 'utf8')
  } catch (error) {
    console.error('Error writing version:', error)
    throw error
  }
}

export async function GET() {
  const data = await readVersion()
  return NextResponse.json(data)
}

export async function POST() {
  try {
    const data = await readVersion()
    const [major, minor, patch] = data.version.split('.').map(Number)
    const newVersion = `${major}.${minor}.${patch + 1}`
    await writeVersion(newVersion)
    return NextResponse.json({ version: newVersion })
  } catch (error) {
    console.error('Error updating version:', error)
    return NextResponse.json({ error: 'Failed to update version' }, { status: 500 })
  }
} 