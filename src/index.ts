#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { endpoints, specVersion } from "./endpoints.js";

// Config comes from env vars so nothing secret lives in the client config file's args.
const host = process.env.POWERCODE_HOST;
const port = process.env.POWERCODE_PORT ?? "444";
const apiKey = process.env.POWERCODE_API_KEY; // raw key from the admin portal; base64-encoded below
const username = process.env.POWERCODE_USERNAME;
const password = process.env.POWERCODE_PASSWORD;

if (!host || !(apiKey || (username && password))) {
  console.error(
    "Set POWERCODE_HOST and either POWERCODE_API_KEY or POWERCODE_USERNAME + POWERCODE_PASSWORD."
  );
  process.exit(1);
}

// Powercode servers commonly use self-signed certificates on :444.
if (process.env.POWERCODE_INSECURE_TLS === "1") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

const authHeader =
  "Basic " + Buffer.from(apiKey ?? `${username}:${password}`).toString("base64");
const baseUrl = `https://${host}:${port}/uapi`;

// Access levels. Read is the default. Write (POWERCODE_ENABLE_WRITES=1) registers the write tools.
// YOLO (POWERCODE_YOLO=YOLO) includes Write and also unlocks the restricted catalog endpoints in call_api.
const yolo = process.env.POWERCODE_YOLO === "YOLO";
const writesEnabled = yolo || process.env.POWERCODE_ENABLE_WRITES === "1";
console.error(`powercode-mcp access level: ${yolo ? "YOLO (writes and restricted endpoints)" : writesEnabled ? "write" : "read"}`);

type Param = string | number | boolean | (string | number)[] | undefined;

// The Powercode API takes all parameters in the query string, with arrays as `key[]=a&key[]=b`.
async function pc(path: string, params: Record<string, Param> = {}, method = "GET", post?: (body: any) => unknown) {
  const url = new URL(baseUrl + path);
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === "") continue;
    if (Array.isArray(v)) v.forEach((item) => url.searchParams.append(`${k}[]`, String(item)));
    else url.searchParams.set(k, String(v));
  }
  try {
    const res = await fetch(url, { method, headers: { Authorization: authHeader, Accept: "application/json" } });
    const text = await res.text();
    if (!res.ok) {
      return { isError: true, content: [{ type: "text" as const, text: `HTTP ${res.status} ${res.statusText}: ${text.slice(0, 2000)}` }] };
    }
    let body = text;
    try {
      const json = JSON.parse(text);
      body = JSON.stringify(post ? post(json) : json, null, 2);
    } catch {
      /* not JSON; return as is */
    }
    return { content: [{ type: "text" as const, text: body }] };
  } catch (e) {
    return { isError: true, content: [{ type: "text" as const, text: `Request failed: ${(e as Error).message}` }] };
  }
}

const server = new McpServer({ name: "powercode", version: "0.2.0" });
const readOnly = { readOnlyHint: true, openWorldHint: true };

const customerId = z.number().int().describe("Powercode customer ID");
const optId = (what: string) => z.number().int().optional().describe(`Optional ${what} ID; omit to list all`);
const dateStr = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().describe("YYYY-MM-DD; defaults to today");
const page = z.number().int().min(1).optional().describe("Page number, starting at 1");
const pageSize = z.number().int().min(1).max(200).optional().describe("Rows per page");

// --- Customers ---
server.registerTool("find_customer", {
  description: "Search customers by name or phone number.",
  inputSchema: { query: z.string().describe("Name or phone number, e.g. 111-111-1111") },
  annotations: readOnly,
}, ({ query }) => pc("/customer/Find", { query }));

server.registerTool("get_customer", {
  description: "Get full details for one customer.",
  inputSchema: { customerId },
  annotations: readOnly,
}, ({ customerId }) => pc("/customer/Customer", { customerId }));

server.registerTool("get_customer_tags", {
  description: "List tags on a customer, or all available tags if no customerId is given.",
  inputSchema: { customerId: customerId.optional() },
  annotations: readOnly,
}, ({ customerId }) =>
  customerId ? pc("/customer/tags/customer", { customerID: customerId }) : pc("/customer/tags"));

server.registerTool("get_call_logs", {
  description: "Get call logs for a customer, or one log entry if logId is given.",
  inputSchema: { customerId, logId: z.number().int().optional() },
  annotations: readOnly,
}, (a) => pc("/customer/callLogs/callLogs", a));

server.registerTool("get_customer_sales_person", {
  description: "Get the salesperson assigned to a customer.",
  inputSchema: { customerId },
  annotations: readOnly,
}, (a) => pc("/customer/salesPerson/salesPerson", a));

server.registerTool("get_customer_groups", {
  description: "List customer groups, or one group by ID.",
  inputSchema: { groupID: optId("group") },
  annotations: readOnly,
}, (a) => pc("/items/customerGroups", a));

// --- Billing ---
server.registerTool("get_credit", {
  description: "Get a specific credit on a customer's account.",
  inputSchema: { customerId, creditId: z.number().int() },
  annotations: readOnly,
}, (a) => pc("/customer/billing/Credit", a));

server.registerTool("get_debit", {
  description: "Get a specific debit on a customer's account.",
  inputSchema: { customerId, debitId: z.number().int() },
  annotations: readOnly,
}, (a) => pc("/customer/billing/Debit", a));

server.registerTool("get_invoice_preference", {
  description: "Get a customer's invoice preferences.",
  inputSchema: { customerId },
  annotations: readOnly,
}, (a) => pc("/customer/billing/InvoicePreference", a));

// --- Services ---
server.registerTool("get_services", {
  description: "List service plans (paginated), or one plan if serviceId is given.",
  inputSchema: { serviceId: optId("service"), page, pageSize },
  annotations: readOnly,
}, ({ serviceId, page, pageSize }) =>
  pc("/services/service", serviceId ? { serviceId } : { _page: page, _pageSize: pageSize }));

// --- Tickets & scheduling ---
type Row = Record<string, unknown>;

const stripHtml = (s: unknown) =>
  typeof s === "string"
    ? s.replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#0?39;/g, "'").replace(/\s+/g, " ").trim()
    : s;

// Whole ticket rows carry HTML bodies and repeat the description in the first log. IdleTime is in seconds.
// ticketsByDate rows carry TicketLogs and IdleTime; tickets rows carry Created, LastActivity and GroupName instead.
function compactTicket(t: Row, descriptionChars = 500): Row {
  const logs = Array.isArray(t.TicketLogs) ? (t.TicketLogs as Row[]) : [];
  const created = (t.Created as string | undefined) ?? (logs[0]?.Created as string | undefined) ?? null;
  const lastActivity = (t.LastActivity as string | undefined) ?? (logs[logs.length - 1]?.Created as string | undefined) ?? null;
  let idleDays: number | null = null;
  if (t.IdleTime !== undefined && t.IdleTime !== null && Number.isFinite(Number(t.IdleTime))) {
    idleDays = Math.round(Number(t.IdleTime) / 8640) / 10;
  } else if (lastActivity) {
    const ms = Date.parse(lastActivity.replace(" ", "T"));
    if (Number.isFinite(ms)) idleDays = Math.round((Date.now() - ms) / 8640000) / 10; // approximate: server time zone unknown
  }
  const description = stripHtml(t.Description);
  return {
    TicketID: t.TicketID,
    Status: t.Status,
    Category: t.Category,
    Priority: t.Priority,
    Summary: t.Summary,
    CustomerID: t.CustomerID ?? null,
    CompanyName: t.CompanyName,
    ResponsibleUser: t.ResponsibleUser,
    Group: t.GroupName ?? t.ResponsibleGroupID ?? null,
    Agent: t.Agent,
    OpenedFrom: t.OpenedFrom,
    FollowUp: t.FollowUp ?? null,
    Created: created,
    LastActivity: lastActivity,
    LogCount: Array.isArray(t.TicketLogs) ? logs.length : null,
    IdleDays: idleDays,
    Description: typeof description === "string" ? description.slice(0, descriptionChars) : description,
  };
}
// Ticket rows arrive either as Response: [...] or as Response: { tickets: [...], totalCount, ... }.
const mapTicketRows = (body: any, fn: (t: Row) => Row) => {
  if (body && Array.isArray(body.Response)) return { ...body, Response: body.Response.map(fn) };
  if (body && body.Response && Array.isArray(body.Response.tickets)) {
    return { ...body, Response: { ...body.Response, tickets: body.Response.tickets.map(fn) } };
  }
  return body;
};
const compactBody = (descriptionChars?: number) => (body: any) => mapTicketRows(body, (t) => compactTicket(t, descriptionChars));
const pickFields = (r: Row, fields?: string[]): Row => (fields ? Object.fromEntries(fields.map((f) => [f, r[f]])) : r);

const compactOpt = z.boolean().optional().describe("Trimmed plain-text rows: no HTML, no log bodies, idle time in days");
const descriptionCharsOpt = z.number().int().min(0).max(5000).optional().describe("With compact: max description characters (default 500)");

// Resolved tickets can still carry Status "Active", so check the summary and logs before treating Status as final.
server.registerTool("get_tickets_by_date", {
  description: "List tickets in a date range with pagination and ordering. The server returns at most 100 rows per page.",
  inputSchema: {
    startDay: dateStr,
    endDay: dateStr,
    orderBy: z.string().optional().describe("COLUMN DIRECTION, e.g. 'Type DESC'"),
    page,
    pageSize,
    compact: compactOpt,
    descriptionChars: descriptionCharsOpt,
  },
  annotations: readOnly,
}, ({ startDay, endDay, orderBy, page, pageSize, compact, descriptionChars }) =>
  pc("/tickets/ticketsByDate", { startDay, endDay, _orderBy: orderBy, _page: page, _pageSize: pageSize }, "GET",
    compact ? compactBody(descriptionChars) : undefined));

// --- Bulk ticket sweep ---
// The API pages tickets 100 rows at a time. These tools page through a whole range or filter
// server-side so an agent can triage thousands of tickets without each page passing through the
// conversation.
const sweepCache = new Map<string, { at: number; rows: Row[]; truncated: boolean }>();
const SWEEP_TTL_MS = 10 * 60 * 1000;

function extractRows(body: unknown): Row[] {
  if (Array.isArray(body)) return body as Row[];
  if (body && typeof body === "object") {
    const arr = Object.values(body).find(Array.isArray);
    if (arr) return arr as Row[];
    // Some endpoints nest the rows one level down, e.g. Response: { tickets: [...], totalCount }.
    for (const v of Object.values(body)) {
      if (v && typeof v === "object") {
        const inner = Object.values(v).find(Array.isArray);
        if (inner) return inner as Row[];
      }
    }
  }
  return [];
}

const sweepTickets = (startDay: string, endDay: string, maxRows: number, refresh: boolean) =>
  fetchAllPages("/tickets/ticketsByDate", { startDay, endDay }, maxRows, refresh);

async function fetchAllPages(path: string, query: Record<string, string>, maxRows: number, refresh: boolean) {
  const key = `${path}|${JSON.stringify(query)}|${maxRows}`;
  const hit = sweepCache.get(key);
  if (!refresh && hit && Date.now() - hit.at < SWEEP_TTL_MS) return hit;

  const pageSize = 200;
  const rows: Row[] = [];
  let truncated = false;
  // The server may return fewer rows per page than requested (it caps at 100), so a short page
  // doesn't mean the last page. Stop on an empty page, or one that repeats the previous page.
  let prevFirst: string | undefined;
  for (let p = 1; ; p++) {
    const url = new URL(baseUrl + path);
    url.search = new URLSearchParams({ ...query, _page: String(p), _pageSize: String(pageSize) }).toString();
    const res = await fetch(url, { headers: { Authorization: authHeader, Accept: "application/json" } });
    if (!res.ok) throw new Error(`HTTP ${res.status} on page ${p}: ${(await res.text()).slice(0, 500)}`);
    const batch = extractRows(await res.json());
    if (batch.length === 0) break;
    const first = JSON.stringify(batch[0]);
    if (first === prevFirst) break;
    prevFirst = first;
    rows.push(...batch);
    if (rows.length >= maxRows) { rows.length = maxRows; truncated = true; break; }
  }
  const entry = { at: Date.now(), rows, truncated };
  sweepCache.set(key, entry);
  return entry;
}

const sweepRange = {
  startDay: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).describe("YYYY-MM-DD. Use an early date to reach old tickets."),
  endDay: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).describe("YYYY-MM-DD"),
  maxRows: z.number().int().min(1).max(100000).optional().describe("Safety cap on rows fetched (default 5000)"),
  refresh: z.boolean().optional().describe("Bypass the 10-minute cache"),
};
const textResult = (o: unknown) => ({ content: [{ type: "text" as const, text: JSON.stringify(o, null, 2) }] });
const errResult = (e: unknown) => ({ isError: true, content: [{ type: "text" as const, text: `Sweep failed: ${(e as Error).message}` }] });

function matches(row: Row, contains?: string) {
  return !contains || JSON.stringify(row).toLowerCase().includes(contains.toLowerCase());
}

server.registerTool("sweep_tickets", {
  description:
    "Fetch ALL tickets in a date range by paging server-side, then return a compact slice. " +
    "Returns total count and the field names present, so call it first with a small limit to learn the shape, " +
    "then page through with offset. Use `fields` to cut each row down and `contains` to filter by text. " +
    "For analyzing thousands of tickets, prefer export_tickets and process the file with scripts.",
  inputSchema: {
    ...sweepRange,
    contains: z.string().optional().describe("Case-insensitive text match against the whole row"),
    fields: z.array(z.string()).optional().describe("Only return these fields per row (applied after compact)"),
    compact: compactOpt,
    descriptionChars: descriptionCharsOpt,
    offset: z.number().int().min(0).optional(),
    limit: z.number().int().min(1).max(200).optional().describe("Rows to return (default 50)"),
  },
  annotations: readOnly,
}, async ({ startDay, endDay, maxRows, refresh, contains, fields, compact, descriptionChars, offset = 0, limit = 50 }) => {
  try {
    const { rows, truncated } = await sweepTickets(startDay, endDay, maxRows ?? 5000, refresh ?? false);
    // `contains` searches the full row (including log text) even when the output is compacted.
    const filtered = rows.filter((r) => matches(r, contains));
    const slice = filtered.slice(offset, offset + limit).map((full) => {
      const r = compact ? compactTicket(full, descriptionChars) : full;
      return fields ? Object.fromEntries(fields.map((f) => [f, r[f]])) : r;
    });
    return textResult({
      totalFetched: rows.length,
      hitMaxRowsCap: truncated,
      matching: filtered.length,
      fieldsAvailable: rows[0] ? Object.keys(rows[0]) : [],
      offset,
      returned: slice.length,
      rows: slice,
    });
  } catch (e) {
    return errResult(e);
  }
});

server.registerTool("export_tickets", {
  description:
    "Fetch ALL tickets in a date range and save them to a local file (.json or .csv by extension) so they can be " +
    "analyzed with scripts rather than read through the conversation. Refuses to overwrite an existing file unless overwrite is true.",
  inputSchema: {
    ...sweepRange,
    path: z.string().describe("Absolute output path ending in .json or .csv"),
    overwrite: z.boolean().optional(),
    compact: compactOpt,
    descriptionChars: descriptionCharsOpt,
  },
  annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: false },
}, async ({ startDay, endDay, maxRows, refresh, path, overwrite, compact, descriptionChars }) => {
  try {
    const fs = await import("node:fs/promises");
    const nodePath = await import("node:path");
    if (!nodePath.isAbsolute(path) || !/\.(json|csv)$/i.test(path)) throw new Error("path must be absolute and end in .json or .csv");
    if (!overwrite && (await fs.stat(path).then(() => true, () => false))) throw new Error(`${path} already exists; pass overwrite: true`);
    const swept = await sweepTickets(startDay, endDay, maxRows ?? 5000, refresh ?? false);
    const truncated = swept.truncated;
    const rows = compact ? swept.rows.map((r) => compactTicket(r, descriptionChars)) : swept.rows;
    let out: string;
    if (/\.csv$/i.test(path)) {
      const cols = [...new Set(rows.flatMap((r) => Object.keys(r)))];
      const cell = (v: unknown) => {
        const s = v === null || v === undefined ? "" : typeof v === "object" ? JSON.stringify(v) : String(v);
        return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
      };
      out = [cols.join(","), ...rows.map((r) => cols.map((c) => cell(r[c])).join(","))].join("\n");
    } else {
      out = JSON.stringify(rows, null, 2);
    }
    await fs.mkdir(nodePath.dirname(path), { recursive: true });
    await fs.writeFile(path, out, "utf8");
    return textResult({ saved: path, rows: rows.length, hitMaxRowsCap: truncated, fieldsAvailable: rows[0] ? Object.keys(rows[0]) : [] });
  } catch (e) {
    return errResult(e);
  }
});

server.registerTool("get_tickets", {
  description:
    "List tickets with optional filters for status, responsible user and dates. The server returns at most 100 rows per page; " +
    "set all=true to page through every match server-side (compact rows by default). " +
    "Resolved tickets can still show Status 'Active', so check the summary and logs before treating Status as final.",
  inputSchema: {
    status: z.string().optional().describe("Comma-separated status names, e.g. 'Active,Waiting,Resolved'"),
    responsibleUser: z.string().optional().describe("Filter by assigned username"),
    updatedSince: z.string().optional().describe("Only tickets updated since this date (e.g. YYYY-MM-DD)"),
    createdSince: z.string().optional().describe("Only tickets created since this date (e.g. YYYY-MM-DD)"),
    orderBy: z.string().optional().describe("COLUMN DIRECTION, e.g. 'Priority DESC'"),
    page,
    pageSize,
    all: z.boolean().optional().describe("Page through every matching ticket (up to maxRows) instead of returning one page"),
    maxRows: z.number().int().min(1).max(100000).optional().describe("With all: safety cap on rows fetched (default 5000)"),
    compact: compactOpt,
    descriptionChars: descriptionCharsOpt,
    fields: z.array(z.string()).optional().describe("Only return these fields per row (applied after compact)"),
  },
  annotations: readOnly,
}, async ({ status, responsibleUser, updatedSince, createdSince, orderBy, page, pageSize, all, maxRows, compact, descriptionChars, fields }) => {
  const filters = { status, responsibleUser, updatedSince, createdSince };
  if (!all) {
    return pc("/tickets/tickets", { ...filters, _orderBy: orderBy, _page: page, _pageSize: pageSize }, "GET",
      compact || fields
        ? (body) => mapTicketRows(body, (t) => pickFields(compact ? compactTicket(t, descriptionChars) : t, fields))
        : undefined);
  }
  try {
    const query = Object.fromEntries(Object.entries({ ...filters, _orderBy: orderBy }).filter(([, v]) => v !== undefined && v !== "")) as Record<string, string>;
    const { rows, truncated } = await fetchAllPages("/tickets/tickets", query, maxRows ?? 5000, true);
    return textResult({
      count: rows.length,
      hitMaxRowsCap: truncated,
      rows: rows.map((r) => pickFields(compact === false ? r : compactTicket(r, descriptionChars), fields)),
    });
  } catch (e) {
    return { isError: true, content: [{ type: "text" as const, text: `Ticket fetch failed: ${(e as Error).message}` }] };
  }
});

server.registerTool("get_ticket_stats", {
  description: "Aggregate ticket statistics: counts by status and today's activity. Good for sizing a backlog.",
  inputSchema: {},
  annotations: readOnly,
}, () => pc("/tickets/ticketStats"));

server.registerTool("get_ticket_stats_by_group", {
  description: "Ticket statistics broken down by handler group.",
  inputSchema: {},
  annotations: readOnly,
}, () => pc("/tickets/ticketStatsByGroup"));

server.registerTool("get_tickets_by_user", {
  description: "Per-user ticket statistics.",
  inputSchema: {},
  annotations: readOnly,
}, () => pc("/tickets/ticketsByUser"));

// --- Generic read access to the rest of the API ---
// The catalog is generated from the server's OpenAPI spec (GET endpoints only). Credential-bearing,
// file, AI and GET-as-action endpoints are left out of it, and call_api refuses anything not in it.
const findEndpoint = (path: string) => endpoints.find((e) => e.path.toLowerCase() === path.toLowerCase());

server.registerTool("list_api_endpoints", {
  description:
    `List the Powercode API endpoints that call_api can reach (generated from the spec, ${specVersion}). ` +
    "Endpoints marked [restricted] need POWERCODE_YOLO=YOLO. " +
    "Pass `search` to filter by path or description, or `path` for one endpoint's full parameter list.",
  inputSchema: {
    search: z.string().optional().describe("Case-insensitive match against path and description"),
    path: z.string().optional().describe("Exact endpoint path for full parameter details, e.g. /customer/contract/contract"),
  },
  annotations: { readOnlyHint: true, openWorldHint: false },
}, ({ search, path }) => {
  if (path) {
    const e = findEndpoint(path);
    return e ? textResult(e) : { isError: true, content: [{ type: "text" as const, text: `${path} is not in the catalog.` }] };
  }
  const q = search?.toLowerCase();
  const matching = endpoints.filter((e) => !q || e.path.toLowerCase().includes(q) || e.summary.toLowerCase().includes(q));
  const list = matching.map((e) =>
    `${e.path}${e.params.some((p) => p.required) ? ` (requires ${e.params.filter((p) => p.required).map((p) => p.name).join(", ")})` : ""} - ${e.summary}` +
    (e.restricted ? ` [restricted: ${e.restricted}${yolo ? "" : "; needs POWERCODE_YOLO=YOLO"}]` : ""));
  return textResult({ specVersion, accessLevel: yolo ? "YOLO" : writesEnabled ? "write" : "read", count: list.length, endpoints: list });
});

server.registerTool("call_api", {
  description:
    "Call an endpoint from list_api_endpoints with query parameters. GET only; paths outside the catalog are refused. " +
    "Endpoints marked [restricted] (secret-bearing, acting through GET, AI) need POWERCODE_YOLO=YOLO. " +
    "Use the dedicated tools where they exist; this covers the rest of the API.",
  inputSchema: {
    path: z.string().describe("Endpoint path from list_api_endpoints, e.g. /customer/contract/contract"),
    params: z.record(z.string(), z.union([z.string(), z.number(), z.boolean(), z.array(z.union([z.string(), z.number()]))])).optional()
      .describe("Query parameters by name, e.g. { customerId: 1 }"),
  },
  // At YOLO some reachable endpoints act through GET, so the read-only hint would be false.
  annotations: yolo ? { readOnlyHint: false, destructiveHint: true, openWorldHint: true } : readOnly,
}, ({ path, params = {} }) => {
  const e = findEndpoint(path);
  if (!e) return { isError: true, content: [{ type: "text" as const, text: `${path} is not in the catalog. Use list_api_endpoints to see what is available.` }] };
  if (e.restricted && !yolo) {
    return { isError: true, content: [{ type: "text" as const, text: `${e.path} is restricted (${e.restricted}). Set POWERCODE_YOLO=YOLO in the server's environment to allow it.` }] };
  }
  const known = new Set(e.params.map((p) => p.name));
  const unknown = Object.keys(params).filter((k) => !known.has(k));
  const missing = e.params.filter((p) => p.required && params[p.name] === undefined).map((p) => p.name);
  if (unknown.length || missing.length) {
    return { isError: true, content: [{ type: "text" as const, text: `${e.path}: ${missing.length ? `missing required ${missing.join(", ")}. ` : ""}${unknown.length ? `unknown parameter ${unknown.join(", ")}. ` : ""}Known parameters: ${[...known].join(", ") || "none"}.` }] };
  }
  return pc(e.path, params);
});

server.registerTool("get_scheduled_jobs", {
  description: "List scheduled jobs between two days, or one job if jobId is given.",
  inputSchema: { jobId: optId("job"), startDay: dateStr, endDay: dateStr, page, pageSize },
  annotations: readOnly,
}, ({ jobId, startDay, endDay, page, pageSize }) =>
  jobId
    ? pc("/schedule/ScheduledJob", { jobId })
    : pc("/schedule/scheduledJobs", { startDay, endDay, _page: page, _pageSize: pageSize }));

server.registerTool("get_customer_scheduled_jobs", {
  description: "List scheduled jobs for one customer.",
  inputSchema: { customerId },
  annotations: readOnly,
}, (a) => pc("/schedule/scheduledJobsOnCustomer", a));

// --- Equipment & inventory ---
server.registerTool("get_equipment", {
  description: "Get one piece of equipment by ID.",
  inputSchema: { equipmentId: z.number().int() },
  annotations: readOnly,
}, (a) => pc("/equipment/Equipment", a));

server.registerTool("get_dhcp_logs", {
  description: "Get DHCP logs for an IP address on a given RMU.",
  inputSchema: { ipAddress: z.string(), rmuId: z.number().int() },
  annotations: readOnly,
}, (a) => pc("/equipment/DhcpLogs", a));

const inventory: [string, string, string][] = [
  ["get_inventory_items", "Items", "itemID"],
  ["get_inventory_products", "Products", "productID"],
  ["get_inventory_consumables", "Consumables", "consumableID"],
  ["get_inventory_vendors", "Vendors", "ID"],
  ["get_inventory_manufacturers", "Manufacturers", "ID"],
  ["get_inventory_types", "Types", "ID"],
  ["get_inventory_conditions", "Conditions", "ID"],
];
for (const [name, path, idKey] of inventory) {
  server.registerTool(name, {
    description: `List inventory ${path.toLowerCase()}, or one by ID.`,
    inputSchema: { id: optId(path.toLowerCase()) },
    annotations: readOnly,
  }, ({ id }) => pc(`/inventory/${path}`, { [idKey]: id }));
}

// --- System ---
server.registerTool("get_system_health", {
  description: "Get Powercode server health.",
  inputSchema: {},
  annotations: readOnly,
}, () => pc("/system/systemHealth"));

server.registerTool("get_disk_usage", {
  description: "Get Powercode server disk usage.",
  inputSchema: {},
  annotations: readOnly,
}, () => pc("/system/diskUsage"));

server.registerTool("get_dashboard_data", {
  description: "Get install dashboard data.",
  inputSchema: {},
  annotations: readOnly,
}, () => pc("/install/DashboardData"));

// --- Write tools: only registered at the Write level (POWERCODE_ENABLE_WRITES=1) or above (POWERCODE_YOLO=YOLO) ---
if (writesEnabled) {
  // Creates/updates: not destructive, but they do change records.
  const write = { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: true };
  const update = { ...write, idempotentHint: true };
  // Deletes and anything that issues a customer-facing document: flagged destructive.
  const destructive = { readOnlyHint: false, destructiveHint: true, idempotentHint: true, openWorldHint: true };
  const customerFacing = { readOnlyHint: false, destructiveHint: true, idempotentHint: false, openWorldHint: true };

  const WARN = "WRITES TO PRODUCTION BILLING DATA. Confirm the customer and amounts with the user first. ";
  const day = z.string().regex(/^\d{2}-\d{2}-\d{4}$/).describe("Date as DD-MM-YYYY");
  const amount = z.number().describe("Amount, e.g. 12.00");
  const taxTypes = z.array(z.number().int()).optional().describe("Tax type IDs to apply");
  const lineItem = {
    description: z.string(),
    amount,
    date: day,
    classification: z.number().int().describe("Classification ID"),
    taxOverride: z.number().optional().describe("Tax override percentage"),
    taxTypes,
  };

  for (const kind of ["Credit", "Debit"] as const) {
    const lower = kind.toLowerCase();
    const idKey = `${lower}Id`;
    server.registerTool(`create_${lower}`, {
      description: `${WARN}Add a ${lower} to a customer's account.`,
      inputSchema: { customerId, ...lineItem },
      annotations: write,
    }, (a) => pc(`/customer/billing/${kind}`, a, "POST"));

    server.registerTool(`update_${lower}`, {
      description: `${WARN}Update an existing ${lower}.`,
      inputSchema: { [idKey]: z.number().int(), ...lineItem },
      annotations: update,
    }, (a) => pc(`/customer/billing/${kind}`, a, "PATCH"));

    server.registerTool(`delete_${lower}`, {
      description: `DESTRUCTIVE, cannot be undone. ${WARN}Delete a ${lower} from a customer's account.`,
      inputSchema: { [idKey]: z.number().int() },
      annotations: destructive,
    }, (a) => pc(`/customer/billing/${kind}`, a, "DELETE"));
  }

  server.registerTool("create_one_time_charge", {
    description: `${WARN}Charge a customer a service as a one-time charge.`,
    inputSchema: {
      customerId,
      serviceId: z.number().int(),
      quantity: z.number().int().min(1),
      oneTimeOverride: z.number().optional().describe("Override the service price"),
      overrideReason: z.string().optional(),
    },
    annotations: write,
  }, (a) => pc("/customer/billing/OneTimeCharge", a, "POST"));

  server.registerTool("generate_invoice", {
    description: `${WARN}Generate an invoice from the given credits and debits. This issues a customer-facing invoice and cannot be reversed from this API.`,
    inputSchema: {
      customerId,
      dueDate: day,
      hideDueDate: z.boolean().optional(),
      credits: z.array(z.number().int()).optional().describe("Credit IDs to include"),
      debits: z.array(z.number().int()).optional().describe("Debit IDs to include"),
    },
    annotations: customerFacing,
  }, (a) => pc("/customer/billing/GenerateInvoice", a, "POST"));

  server.registerTool("set_invoice_preference", {
    description: `${WARN}Change how a customer receives invoices.`,
    inputSchema: {
      customerId,
      preference: z.string().describe("e.g. Email"),
      layout: z.string().optional(),
      detailsPage: z.string().optional(),
    },
    annotations: update,
  }, (a) => pc("/customer/billing/InvoicePreference", a, "PUT"));

  server.registerTool("set_service_price_override", {
    description: `${WARN}Override the price of a service on a customer's account.`,
    inputSchema: {
      customerId,
      serviceId: z.number().int(),
      amount,
      reason: z.string().optional(),
      prorateService: z.boolean().optional(),
    },
    annotations: update,
  }, (a) => pc("/customer/service/priceOverride", a, "PUT"));

  // Tags and call logs
  server.registerTool("add_customer_tags", {
    description: "Add existing tags to a customer.",
    inputSchema: { customerID: customerId, tags: z.array(z.number().int()).describe("Tag IDs") },
    annotations: update,
  }, (a) => pc("/customer/tags/customer", a, "POST"));

  server.registerTool("remove_customer_tags", {
    description: "DESTRUCTIVE. Remove tags from a customer.",
    inputSchema: { customerID: customerId, tags: z.array(z.number().int()).describe("Tag IDs") },
    annotations: destructive,
  }, (a) => pc("/customer/tags/customer", a, "DELETE"));

  server.registerTool("create_call_log", {
    description: "Add a call log entry to a customer's account.",
    inputSchema: {
      customerId,
      contactId: z.number().int(),
      webUser: z.string().describe("Powercode username logging the call"),
      subject: z.string(),
      notes: z.string(),
      time: z.string().describe("YYYY-MM-DD HH:MM:SS"),
      created: z.string().describe("YYYY-MM-DD HH:MM:SS"),
    },
    annotations: write,
  }, (a) => pc("/customer/callLogs/callLogs", a, "POST"));
}

await server.connect(new StdioServerTransport());
