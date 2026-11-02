// Lesson lengths in Studio previews, e.g. 754 -> "12:34", 3725 -> "1:02:05".
// A copy of the web app's formatClock so the Studio doesn't import web code.
export function formatClock(seconds: number): string {
  const total = Math.max(0, Math.round(seconds))
  const hours = Math.floor(total / 3600)
  const minutes = Math.floor((total % 3600) / 60)
  const secs = String(total % 60).padStart(2, '0')
  if (hours === 0) return `${minutes}:${secs}`
  return `${hours}:${String(minutes).padStart(2, '0')}:${secs}`
}
