# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This project is a CalDAV client using the Model Context Protocol (MCP) server to expose calendar operations as tools. It uses:

- ts-caldav: A TypeScript CalDAV client for interacting with calendar servers
- MCP SDK: Model Context Protocol for creating tools that can be used by AI assistants
- dotenv: For environment variable management

## Environment Setup

The project requires the following environment variables to be set in a `.env` file:

```
CALDAV_BASE_URL=<CalDAV server URL>
CALDAV_USERNAME=<CalDAV username>
CALDAV_PASSWORD=<CalDAV password>
```

## Common Commands

```bash
# Install dependencies
npm install

# Compile TypeScript to JavaScript
npx tsc

# Run the MCP server
node index.js
```

## Project Architecture

The codebase is an MCP server implementation that:

1. Connects to a CalDAV server using credentials from environment variables
2. Exposes five MCP tools:
   - `list-calendars`: Dynamically lists all calendars (fetched fresh on each call)
   - `list-events`: Lists events between a start and end time for a specific calendar
   - `list-all-events`: Lists events across all calendars between a start and end time
   - `create-event`: Creates a calendar event with summary, start, and end time
   - `delete-event`: Deletes event from a calendar
3. Calendar resolution: `list-events`, `create-event`, and `delete-event` accept either `calendarUrl` or `calendarName` (case-insensitive display name match) via the shared `resolveCalendarUrl` helper in `src/tools/resolve-calendar.ts`

The MCP server supports both StdioServerTransport (stdin/stdout) and StreamableHTTPServerTransport, configured via the `MCP_TRANSPORT` environment variable. This makes it suitable for integration with Claude or other AI assistants that support the Model Context Protocol.