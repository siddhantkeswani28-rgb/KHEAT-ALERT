import { NextResponse } from 'next/server'

// Seed data endpoint (fake data as requested)
const seed = {
  updatedAt: new Date().toISOString(),
  status: 'seed',
  message: 'Serving seed data. Live pipelines (FIRMS/Open-Meteo/USGS/Overpass) not yet connected.',
}

export async function GET(request, { params }) {
  const path = (params?.path || []).join('/')
  return NextResponse.json({ ok: true, path, ...seed })
}

export async function POST(request, { params }) {
  const body = await request.json().catch(() => ({}))
  return NextResponse.json({ ok: true, received: body, ...seed })
}
