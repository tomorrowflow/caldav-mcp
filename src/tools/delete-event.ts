import { CalDAVClient } from "ts-caldav"
import { z } from "zod"
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { resolveCalendarUrl } from "./resolve-calendar.js"

export function registerDeleteEvent(client: CalDAVClient, server: McpServer) {
  server.registerTool(
    "delete-event",
    {
      description:
        "Deletes an event in the calendar specified by its URL or name",
      inputSchema: {
        uid: z.string(),
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
    async ({ uid, calendarUrl, calendarName }) => {
      const resolved = await resolveCalendarUrl(
        client,
        calendarUrl,
        calendarName,
      )

      await client.deleteEvent(resolved, uid)

      return {
        content: [{ type: "text", text: "Event deleted" }],
      }
    },
  )
}
