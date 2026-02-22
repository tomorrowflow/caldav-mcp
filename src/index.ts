#!/usr/bin/env node

import "dotenv/config"
import { CalDAVClient } from "ts-caldav"
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js"
import express from "express"

import { registerCreateEvent } from "./tools/create-event.js"
import { registerDeleteEvent } from "./tools/delete-event.js"
import { registerListAllEvents } from "./tools/list-all-events.js"
import { registerListCalendars } from "./tools/list-calendars.js"
import { registerListEvents } from "./tools/list-events.js"

const server = new McpServer({
  name: "caldav-mcp",
  version: "0.1.0",
})

async function main() {
  const client = await CalDAVClient.create({
    baseUrl: process.env.CALDAV_BASE_URL || "",
    auth: {
      type: "basic",
      username: process.env.CALDAV_USERNAME || "",
      password: process.env.CALDAV_PASSWORD || "",
    },
  })

  registerCreateEvent(client, server)
  registerListEvents(client, server)
  registerDeleteEvent(client, server)
  registerListCalendars(client, server)
  registerListAllEvents(client, server)

  const mcpTransport = process.env.MCP_TRANSPORT || "stdio"

  if (mcpTransport === "streamable-http") {
    const host = process.env.MCP_HOST || "0.0.0.0"
    const port = parseInt(process.env.MCP_PORT || "3040", 10)

    const app = express()
    app.use(express.json())

    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
    })

    app.post("/mcp", async (req, res) => {
      await transport.handleRequest(req, res, req.body)
    })

    app.get("/mcp", async (req, res) => {
      await transport.handleRequest(req, res)
    })

    app.delete("/mcp", async (req, res) => {
      await transport.handleRequest(req, res)
    })

    await server.connect(transport)

    app.listen(port, host, () => {
      console.log(`CalDAV MCP server listening on http://${host}:${port}/mcp`)
    })
  } else {
    // Default: stdio transport
    const transport = new StdioServerTransport()
    await server.connect(transport)
  }
}

main()
