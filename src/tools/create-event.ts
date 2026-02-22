import { CalDAVClient, RecurrenceRule } from "ts-caldav"
import { z } from "zod"
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { resolveCalendarUrl } from "./resolve-calendar.js"

const recurrenceRuleSchema = z.object({
  freq: z.enum(["DAILY", "WEEKLY", "MONTHLY", "YEARLY"]).optional(),
  interval: z.number().optional(),
  count: z.number().optional(),
  until: z.string().datetime().optional(), // ISO 8601 string
  byday: z.array(z.string()).optional(), // e.g. ["MO", "TU"]
  bymonthday: z.array(z.number()).optional(),
  bymonth: z.array(z.number()).optional(),
})

export function registerCreateEvent(client: CalDAVClient, server: McpServer) {
  server.registerTool(
    "create-event",
    {
      description:
        "Creates an event in the calendar specified by its URL or name",
      inputSchema: {
        summary: z.string(),
        start: z.string().datetime(),
        end: z.string().datetime(),
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
        recurrenceRule: recurrenceRuleSchema.optional(),
      },
    },
    async ({
      calendarUrl,
      calendarName,
      summary,
      start,
      end,
      recurrenceRule,
    }) => {
      const resolved = await resolveCalendarUrl(
        client,
        calendarUrl,
        calendarName,
      )

      const event = await client.createEvent(resolved, {
        summary: summary,
        start: new Date(start),
        end: new Date(end),
        recurrenceRule: recurrenceRule as RecurrenceRule,
      })

      return {
        content: [{ type: "text", text: event.uid }],
      }
    },
  )
}
