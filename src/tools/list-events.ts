import { CalDAVClient } from "ts-caldav"
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { z } from "zod"
import { resolveCalendarUrl } from "./resolve-calendar.js"

const dateString = z.string().refine((val) => !isNaN(Date.parse(val)), {
  message: "Invalid date string",
})

export function registerListEvents(client: CalDAVClient, server: McpServer) {
  server.registerTool(
    "list-events",
    {
      description:
        "List all events between start and end date in the calendar specified by its URL or name",
      inputSchema: {
        start: dateString,
        end: dateString,
        calendarUrl: z
          .string()
          .optional()
          .describe(
            "The calendar URL. Either this or calendarName is required",
          ),
        calendarName: z
          .string()
          .optional()
          .describe(
            "The calendar display name. Either this or calendarUrl is required",
          ),
      },
    },
    async ({ calendarUrl, calendarName, start, end }) => {
      const resolved = await resolveCalendarUrl(
        client,
        calendarUrl,
        calendarName,
      )

      const options = {
        start: new Date(start),
        end: new Date(end),
      }

      const events = await client.getEvents(resolved, options)

      return {
        content: [{ type: "text", text: JSON.stringify(events) }],
      }
    },
  )
}
