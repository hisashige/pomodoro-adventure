import { format, utcToZonedTime } from 'date-fns-tz'
import { isWithinInterval, subMinutes, parse } from 'date-fns'

const timezone = 'Asia/Tokyo'

export const now = () => format(utcToZonedTime(new Date(), timezone), 'yyyy/MM/dd HH:mm')

export const isWithinPomodoroMinutes = (startTime: string) => {
  const now = new Date()
  const targetTime = parse(startTime, 'yyyy/MM/dd HH:mm', new Date())
  const time25MinutesAgo = subMinutes(now, 25)
  const isWithin25Minutes = isWithinInterval(targetTime, { start: time25MinutesAgo, end: now })
  return isWithin25Minutes
}
