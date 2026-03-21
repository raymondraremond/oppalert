export function generateSlug(title: string): string {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 50)
  
  const suffix = Math.random()
    .toString(36)
    .substring(2, 7)
  
  return base + "-" + suffix
}

export function formatEventDate(date: string): string {
  return new Date(date).toLocaleDateString("en-NG", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function formatEventTime(date: string): string {
  return new Date(date).toLocaleTimeString("en-NG", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })
}

export function getSpotsRemaining(
  max: number | null,
  current: number
): string {
  if (!max) return "Unlimited spots"
  const remaining = max - current
  if (remaining <= 0) return "Fully booked"
  if (remaining <= 10) return remaining + " spots left"
  return remaining + " spots remaining"
}
