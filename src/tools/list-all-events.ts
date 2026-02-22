import { CalDAVClient } from "ts-caldav"
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { z } from "zod"

const dateString = z.string().refine((val) => !isNaN(Date.parse(val)), {
  message: "Invalid date string",
})

export function registerListAllEvents(client: CalDAVClient, server: McpServer) {
  server.registerTool(
    "list-all-events",
    {
      description:
        "List all events across all calendars between start and end date",
      inputSchema: {
        start: dateString,
        end: dateString,
      },
    },
    async ({ start, end }) => {
      const calendars = await client.getCalendars()

      const options = {
        start: new Date(start),
        end: new Date(end),
      }

      const results = await Promise.all(
        calendars.map(async (calendar) => {
          const events = await client.getEvents(calendar.url, options)
          return events.map((event) => ({
            ...event,
            calendarName: calendar.displayName,
            calendarUrl: calendar.url,
          }))
        }),
      )

      const allEvents = results.flat()

      return {
        content: [{ type: "text", text: JSON.stringify(allEvents) }],
      }
    },
  )
}
