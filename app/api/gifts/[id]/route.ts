import { neon } from '@neondatabase/serverless'
import { NextRequest, NextResponse } from 'next/server'

const sql = neon(process.env.DATABASE_URL!)

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const result = await sql`
      SELECT id, message, sender_name, recipient_name, box_style, image_url, created_at, opened_at
      FROM gifts
      WHERE id = ${id}
    `

    if (result.length === 0) {
      return NextResponse.json({ error: 'Gift not found' }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error('Error fetching gift:', error)
    return NextResponse.json({ error: 'Failed to fetch gift' }, { status: 500 })
  }
}

export async function PATCH(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await sql`
      UPDATE gifts
      SET opened_at = NOW()
      WHERE id = ${id} AND opened_at IS NULL
    `
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error marking gift opened:', error)
    return NextResponse.json({ error: 'Failed to update gift' }, { status: 500 })
  }
}
