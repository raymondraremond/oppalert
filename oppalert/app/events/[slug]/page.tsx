import { Metadata } from "next"
import EventDetailClient from "./EventDetailClient"

async function getEvent(slug: string) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  const res = await fetch(`${baseUrl}/api/events/${slug}`, { 
    cache: "no-store" 
  })
  if (!res.ok) return null
  return res.json()
}

export async function generateMetadata({ 
  params 
}: { 
  params: { slug: string } 
}): Promise<Metadata> {
  const event = await getEvent(params.slug)
  if (!event) return { title: "Event Not Found" }

  return {
    title: `${event.title} | OppAlert Events`,
    description: event.description?.slice(0, 160) || "Join this amazing event on OppAlert.",
  }
}

export default async function EventDetailPage({ 
  params 
}: { 
  params: { slug: string } 
}) {
  const event = await getEvent(params.slug)
  if (!event) return <div className="min-h-screen pt-40 text-center">Event not found</div>

  return <EventDetailClient event={event} />
}
