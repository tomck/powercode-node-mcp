#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

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

type Param = string | number | boolean | (string | number)[] | undefined;

// The Powercode API takes all parameters in the query string, with arrays as `key[]=a&key[]=b`.
async function pc(path: string, params: Record<string, Param> = {}, method = "GET") {
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
      body = JSON.stringify(JSON.parse(text), null, 2);
    } catch {
      /* not JSON; return as is */
    }
    return { content: [{ type: "text" as const, text: body }] };
  } catch (e) {
    return { isError: true, content: [{ type: "text" as const, text: `Request failed: ${(e as Error).message}` }] };
  }
}

const server = new McpServer({ name: "powercode", version: "0.1.0" });
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
server.registerTool("get_tickets_by_date", {
  description: "List tickets in a date range with pagination and ordering.",
  inputSchema: {
    startDay: dateStr,
    endDay: dateStr,
    orderBy: z.string().optional().describe("COLUMN DIRECTION, e.g. 'Type DESC'"),
    page,
    pageSize,
  },
  annotations: readOnly,
}, ({ startDay, endDay, orderBy, page, pageSize }) =>
  pc("/tickets/ticketsByDate", { startDay, endDay, _orderBy: orderBy, _page: page, _pageSize: pageSize }));

// --- Bulk ticket sweep ---
// The API only exposes tickets by date range, one page at a time. These tools page through the
// whole range server-side so an agent can triage thousands of tickets without each page passing
// through the conversation.
type Row = Record<string, unknown>;
const sweepCache = new Map<string, { at: number; rows: Row[]; truncated: boolean }>();
const SWEEP_TTL_MS = 10 * 60 * 1000;

function extractRows(body: unknown): Row[] {
  if (Array.isArray(body)) return body as Row[];
  if (body && typeof body === "object") {
    const arr = Object.values(body).find(Array.isArray);
    if (arr) return arr as Row[];
  }
  return [];
}

async function sweepTickets(startDay: string, endDay: string, maxRows: number, refresh: boolean) {
  const key = `${startDay}|${endDay}|${maxRows}`;
  const hit = sweepCache.get(key);
  if (!refresh && hit && Date.now() - hit.at < SWEEP_TTL_MS) return hit;

  const pageSize = 200;
  const rows: Row[] = [];
  let truncated = false;
  // The server may return fewer rows per page than requested (it caps at 100), so a short page
  // doesn't mean the last page. Stop on an empty page, or one that repeats the previous page.
  let prevFirst: string | undefined;
  for (let p = 1; ; p++) {
    const url = new URL(baseUrl + "/tickets/ticketsByDate");
    url.search = new URLSearchParams({ startDay, endDay, _page: String(p), _pageSize: String(pageSize) }).toString();
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
    fields: z.array(z.string()).optional().describe("Only return these fields per row"),
    offset: z.number().int().min(0).optional(),
    limit: z.number().int().min(1).max(200).optional().describe("Rows to return (default 50)"),
  },
  annotations: readOnly,
}, async ({ startDay, endDay, maxRows, refresh, contains, fields, offset = 0, limit = 50 }) => {
  try {
    const { rows, truncated } = await sweepTickets(startDay, endDay, maxRows ?? 5000, refresh ?? false);
    const filtered = rows.filter((r) => matches(r, contains));
    const slice = filtered.slice(offset, offset + limit).map((r) =>
      fields ? Object.fromEntries(fields.map((f) => [f, r[f]])) : r);
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
  },
  annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: false },
}, async ({ startDay, endDay, maxRows, refresh, path, overwrite }) => {
  try {
    const fs = await import("node:fs/promises");
    const nodePath = await import("node:path");
    if (!nodePath.isAbsolute(path) || !/\.(json|csv)$/i.test(path)) throw new Error("path must be absolute and end in .json or .csv");
    if (!overwrite && (await fs.stat(path).then(() => true, () => false))) throw new Error(`${path} already exists; pass overwrite: true`);
    const { rows, truncated } = await sweepTickets(startDay, endDay, maxRows ?? 5000, refresh ?? false);
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

// --- Write tools: only registered when POWERCODE_ENABLE_WRITES=1 ---
if (process.env.POWERCODE_ENABLE_WRITES === "1") {
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
