# powercode-mcp

Read-only MCP server for the [Powercode REST API](https://restapi.powercode.com/). 25 tools covering customers, billing lookups, services, tickets, scheduling, equipment, inventory and system health. Write/delete endpoints are intentionally not exposed yet.

## Configuration (env vars)

| Variable | Notes |
|---|---|
| `POWERCODE_HOST` | Your Powercode server hostname (required) |
| `POWERCODE_PORT` | Default `444` |
| `POWERCODE_API_KEY` | The API key exactly as shown in the admin portal (the server base64-encodes it), **or** use the two below |
| `POWERCODE_USERNAME` / `POWERCODE_PASSWORD` | Alternative to the API key |
| `POWERCODE_INSECURE_TLS` | Set to `1` to accept a self-signed certificate |
| `POWERCODE_ENABLE_WRITES` | Set to `1` to expose the write tools (off by default) |

## Triaging large ticket backlogs

The API only lists tickets by date range, one page at a time. Two tools page through the whole range server-side:

- `sweep_tickets`: fetches everything, caches it for 10 minutes, and returns a compact slice (`fields`, `contains`, `offset`, `limit`). Call it first with a small `limit` to see the field names and total count.
- `export_tickets`: saves the full set to a local `.json` or `.csv` file so an agent with shell access can analyze thousands of rows with scripts instead of reading them in the conversation.

Use an early `startDay` to reach old tickets. `maxRows` (default 5000) caps a sweep as a safety limit; the result says if the cap was hit.

## Write tools (opt-in)

Registered only when `POWERCODE_ENABLE_WRITES=1`. Each carries MCP annotations so clients can prompt before running them.

| Tool | Annotation |
|---|---|
| `create_credit`, `create_debit`, `create_one_time_charge`, `create_call_log` | write |
| `update_credit`, `update_debit`, `set_invoice_preference`, `set_service_price_override`, `add_customer_tags` | write, idempotent |
| `delete_credit`, `delete_debit`, `remove_customer_tags` | **destructive** |
| `generate_invoice` | **destructive** (issues a customer-facing invoice) |

Not exposed: contracts (the API takes credentials in the query string), customer creation, salesperson assignment, inventory and configuration writes.

## Claude Desktop (macOS / Linux)

```json
{
  "mcpServers": {
    "powercode": {
      "command": "npx",
      "args": ["-y", "powercode-mcp"],
      "env": { "POWERCODE_HOST": "your.server.com", "POWERCODE_API_KEY": "..." }
    }
  }
}
```

## Windows

Same config, but launch through `cmd` so `npx` resolves:

```json
"command": "cmd",
"args": ["/c", "npx", "-y", "powercode-mcp"]
```

Until it is published to npm, build locally (`npm install && npm run build`) and point `command` at `node` with `args` set to the absolute path of `dist/index.js`.
