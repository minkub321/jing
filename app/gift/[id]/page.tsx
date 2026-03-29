import { GiftUnboxing } from '@/components/gift-unboxing'
import { notFound } from 'next/navigation'
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

async function getGift(id: string) {
  try {
    const result = await sql`
      SELECT id, message, sender_name, recipient_name, box_style, image_url, created_at, opened_at
      FROM gifts
      WHERE id = ${id}
    `
    return result[0] ?? null
  } catch {
    return null
  }
}

export default async function GiftPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const gift = await getGift(id)

  if (!gift) notFound()

  return (
    <GiftUnboxing
      id={gift.id}
      message={gift.message}
      senderName={gift.sender_name}
      recipientName={gift.recipient_name}
      boxStyle={gift.box_style}
      imageUrl={gift.image_url}
      alreadyOpened={!!gift.opened_at}
    />
  )
}
