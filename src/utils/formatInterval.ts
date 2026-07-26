/**
 * Formats a PostgreSQL INTERVAL value for display.
 * The value comes as a string from Supabase (e.g. "00:05:00", "5 min", "1:30:00").
 */
export function formatInterval(value: string | null | undefined): string {
  if (!value) return ''

  // Already a human-readable format like "5 min" or "1h 30min"
  if (/^\d+\s*(min|h)/i.test(value)) return value

  // HH:MM:SS format (PostgreSQL default for small intervals)
  const hhmmss = value.match(/^(\d{1,2}):(\d{2}):(\d{2})/)
  if (hhmmss) {
    const hours = parseInt(hhmmss[1], 10)
    const minutes = parseInt(hhmmss[2], 10)
    if (hours > 0) return `${hours}h ${minutes}min`
    return `${minutes} min`
  }

  // MM:SS format
  const mmss = value.match(/^(\d{1,2}):(\d{2})$/)
  if (mmss) {
    return `${parseInt(mmss[1], 10)} min`
  }

  // Pure number (assume minutes)
  const pure = value.match(/^(\d+)$/)
  if (pure) return `${pure[1]} min`

  return value
}
