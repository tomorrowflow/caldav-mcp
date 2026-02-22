import { CalDAVClient } from "ts-caldav"

export async function resolveCalendarUrl(
  client: CalDAVClient,
  calendarUrl?: string,
  calendarName?: string,
): Promise<string> {
  if (calendarUrl) {
    return calendarUrl
  }

  if (!calendarName) {
    throw new Error("Either calendarUrl or calendarName must be provided")
  }

  const calendars = await client.getCalendars()
  const match = calendars.find(
    (c) => c.displayName.toLowerCase() === calendarName.toLowerCase(),
  )

  if (!match) {
    const available = calendars.map((c) => c.displayName).join(", ")
    throw new Error(
      `No calendar found with name "${calendarName}". Available calendars: ${available}`,
    )
  }

  return match.url
}
