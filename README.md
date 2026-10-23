# powercode-mcp

[![npm version](https://img.shields.io/npm/v/powercode-mcp)](https://www.npmjs.com/package/powercode-mcp)
[![npm downloads](https://img.shields.io/npm/dm/powercode-mcp)](https://www.npmjs.com/package/powercode-mcp)
[![GitHub release](https://img.shields.io/github/v/release/tomck/powercode-node-mcp)](https://github.com/tomck/powercode-node-mcp/releases)
[![license](https://img.shields.io/npm/l/powercode-mcp)](LICENSE)
[![node](https://img.shields.io/node/v/powercode-mcp)](package.json)

Published on npm as [`powercode-mcp`](https://www.npmjs.com/package/powercode-mcp): run it with `npx -y powercode-mcp`. Unofficial community project, not affiliated with Powercode.

Read-only MCP server for the [Powercode REST API](https://restapi.powercode.com/). 33 tools by default, covering customers, billing lookups, services, tickets, scheduling, equipment, inventory and system health, plus `call_api` for about 70 more read-only endpoints (see below). Write tools are off unless you opt in.

## The rest of the API: `list_api_endpoints` and `call_api`

Your server publishes its API spec at `https://<your-server>:444/docs/openapi.json`. A catalog of its read-only (GET) endpoints, generated from the V26.10.05 spec, is built into the server:

- `list_api_endpoints` searches the catalog (`search`) or shows one endpoint's parameters (`path`).
- `call_api` calls a catalog endpoint with query parameters. It refuses unknown paths, missing required parameters and misspelled ones, and never sends anything but GET.

About 50 endpoints are **restricted**: RADIUS and email server definitions (shared secrets), device configuration files, `configValue` and license, SAML, Trango, single web-user detail (`/user/user` carries 2FA secrets and API tokens), the whole-customer data dump, endpoints that act through GET (sync, sign contract), and the AI and customer-portal (`subscriber`) families. They are listed, marked `[restricted]`, and refused unless you set the YOLO level below. Binary downloads (`files/download`) aren't callable at any level.

## Access levels

| Level | Enable with | What it adds |
|---|---|---|
| **Read** (default) | nothing | The read tools and the safe part of the `call_api` catalog. |
| **Write** | `POWERCODE_ENABLE_WRITES=1` | The write tools (see below). |
| **YOLO** | `POWERCODE_YOLO=YOLO` | Everything in Write, plus the restricted `call_api` endpoints. Secrets can be read into your chat transcript, and some of these endpoints act through GET. |

**Local models.** With a model running on your own machine, secrets in the chat transcript never leave it, so YOLO is an easier call than with a hosted service. The other risks stay the same at any level:

- Endpoints that act through GET (server sync, sign contract) do real things whichever model calls them.
- Smaller local models are more likely to misread a tool or to follow instructions that appear inside ticket text, so keep Write off unless you need it.
- Powercode's own `ai/*` endpoints send ticket content to the AI provider configured in Powercode, which is separate from your local model; YOLO unlocks them.

YOLO only turns on for the exact value `YOLO`; `1`, `true` and `yolo` don't count. At YOLO, `call_api` stops claiming to be read-only in its MCP annotations, so clients that prompt on destructive tools will prompt on it. The server logs its level to stderr at startup.

After a Powercode upgrade, regenerate the catalog from your server's spec and rebuild:

```bash
curl -sk https://<your-server>:444/docs/openapi.json -o openapi.json
node scripts/gen-endpoints.mjs openapi.json src/endpoints.ts && npm run build
```

## Configuration (env vars)

| Variable | Notes |
|---|---|
| `POWERCODE_HOST` | Your Powercode server hostname (required) |
| `POWERCODE_PORT` | Default `444` |
| `POWERCODE_API_KEY` | The API key exactly as shown in the admin portal (the server base64-encodes it), **or** use the two below |
| `POWERCODE_USERNAME` / `POWERCODE_PASSWORD` | Alternative to the API key |
| `POWERCODE_INSECURE_TLS` | Set to `1` to accept a self-signed certificate |
| `POWERCODE_ENABLE_WRITES` | Set to `1` to expose the write tools (off by default) |
| `POWERCODE_YOLO` | Set to `YOLO` to include writes and unlock the restricted `call_api` endpoints. See [Access levels](#access-levels). |

## Triaging large ticket backlogs

The server returns at most 100 tickets per page, whatever page size you ask for. These tools page through everything server-side:

- `get_tickets`: filters by `status` (comma-separated, for example `Active,Waiting`), `responsibleUser`, `updatedSince` and `createdSince`. Set `all: true` to fetch every match.
- `sweep_tickets`: fetches a whole date range, caches it for 10 minutes, and returns a slice (`fields`, `contains`, `offset`, `limit`). Call it first with a small `limit` to see the field names and total count.
- `export_tickets`: saves the full set to a local `.json` or `.csv` file so an agent with shell access can analyze thousands of rows with scripts instead of reading them in the conversation.
- `get_ticket_stats`, `get_ticket_stats_by_group` and `get_tickets_by_user` give counts for sizing a backlog.

Pass `compact: true` (the default for `get_tickets` with `all`) to strip HTML, drop log bodies and show idle time in days. Whole ticket rows are large.

Use an early `startDay` to reach old tickets. `maxRows` (default 5000) caps a sweep as a safety limit; the result says if the cap was hit.

The API has no way to fetch one ticket by ID, or to update or close a ticket. A resolved ticket can still show Status `Active`, so check the summary and logs too.

## Write tools (opt-in)

Registered only at the Write level (`POWERCODE_ENABLE_WRITES=1`) or above (`POWERCODE_YOLO=YOLO`). Each carries MCP annotations so clients can prompt before running them.

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
