import { useMemo } from 'react'

export function useTimezone() {
  return useMemo(() => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
    const offsetMin = new Date().getTimezoneOffset()
    const offsetHours = -offsetMin / 60
    const sign = offsetHours >= 0 ? '+' : '-'
    const absH = Math.abs(Math.floor(offsetHours))
    const absM = Math.abs(offsetMin) % 60
    const label = absM === 0
      ? `UTC${sign}${absH}`
      : `UTC${sign}${absH}:${absM === 30 ? '30' : absM}`
    const bandIndex = Math.round(offsetHours) + 12 // UTC-12 → band 0, UTC+12 → band 24
    return { tz, offsetHours, offsetMin, label, bandIndex }
  }, [])
}