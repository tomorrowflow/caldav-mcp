# caldav-mcp

<div align="center">

🗓️ A CalDAV Model Context Protocol (MCP) server to expose calendar operations as tools for AI assistants.

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![MCP Compatible](https://img.shields.io/badge/MCP-Compatible-purple.svg)](https://modelcontextprotocol.io)
[![semantic-release: angular](https://img.shields.io/badge/semantic--release-angular-e10079?logo=semantic-release)](https://github.com/semantic-release/semantic-release)

</div>

## ✨ Features

- Connect to CalDAV servers
- List calendars (fetched dynamically on each call)
- List calendar events within a specific timeframe
- List events across all calendars at once
- Create calendar events
- Delete calendar events
- Reference calendars by display name or URL

## Setup

```
{
  "mcpServers": {
    ...,
    "calendar": {
      "command": "npx",
      "args": [
        "caldav-mcp"
      ],
      "env": {
        "CALDAV_BASE_URL": "<CalDAV server URL>",
        "CALDAV_USERNAME": "<CalDAV username>",
        "CALDAV_PASSWORD": "<CalDAV password>"
      }
    }
  }
}
```

## Development

1. Compile TypeScript to JavaScript:
```bash
npx tsc
```

2. Run the MCP server:
```bash
node dist/index.js
```

## Available Tools

All tools that operate on a specific calendar (`list-events`, `create-event`, `delete-event`) accept either `calendarUrl` or `calendarName` to identify the target calendar. When using `calendarName`, the display name is matched case-insensitively.

### list-calendars

Lists all available calendars. Calendars are fetched dynamically on each call.

Parameters: none

Returns:
- List of all available calendars with name, URL, and metadata

### list-events

Lists events within a specified timeframe for a specific calendar.

Parameters:
- `start`: Date string - Start of the timeframe
- `end`: Date string - End of the timeframe
- `calendarUrl`: String (optional) - The calendar URL
- `calendarName`: String (optional) - The calendar display name

Returns:
- A list of events that fall within the given timeframe

### list-all-events

Lists events across all calendars within a specified timeframe.

Parameters:
- `start`: Date string - Start of the timeframe
- `end`: Date string - End of the timeframe

Returns:
- A list of events from all calendars, each tagged with `calendarName` and `calendarUrl`

### create-event

Creates a new calendar event.

Parameters:
- `summary`: String - Event title/summary
- `start`: DateTime string - Event start time (ISO 8601)
- `end`: DateTime string - Event end time (ISO 8601)
- `calendarUrl`: String (optional) - The calendar URL
- `calendarName`: String (optional) - The calendar display name
- `recurrenceRule`: Object (optional) - Recurrence rule (supports `freq`, `interval`, `count`, `until`, `byday`, `bymonthday`, `bymonth`)

Returns:
- The unique ID of the created event

### delete-event

Deletes an event from a calendar.

Parameters:
- `uid`: String - The UID of the calendar event to delete
- `calendarUrl`: String (optional) - The calendar URL
- `calendarName`: String (optional) - The calendar display name

## License

MIT