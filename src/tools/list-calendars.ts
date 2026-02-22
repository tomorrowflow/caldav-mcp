import { CalDAVClient } from "ts-caldav"
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"

export function registerListCalendars(client: CalDAVClient, server: McpServer) {
  server.registerTool(
    "list-calendars",
    {
      description: "List all calendars returning both name and URL",
      inputSchema: {},
    },
    async () => {
      const calendars = await client.getCalendars()
      return { content: [{ type: "text", text: JSON.stringify(calendars) }] }
    },
  )
}
