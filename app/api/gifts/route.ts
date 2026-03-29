import { neon } from '@neondatabase/serverless'
import { NextRequest, NextResponse } from 'next/server'

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, sender_name, recipient_name, box_style, image_url } = body

    if (!message || !sender_name || !recipient_name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const result = await sql`
      INSERT INTO gifts (message, sender_name, recipient_name, box_style, image_url)
      VALUES (${message}, ${sender_name}, ${recipient_name}, ${box_style ?? 'simple'}, ${image_url ?? null})
      RETURNING id
    `

    return NextResponse.json({ id: result[0].id })
  } catch (error) {
    console.error('Error creating gift:', error)
    return NextResponse.json({ error: 'Failed to create gift' }, { status: 500 })
  }
}
