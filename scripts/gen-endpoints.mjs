import { readFileSync, writeFileSync } from "node:fs";

const [specPath, outPath] = process.argv.slice(2);
const spec = JSON.parse(readFileSync(specPath, "utf8"));

// GET endpoints that stay out of call_api at the default Read level. They are kept in the catalog,
// marked `restricted` with the reason, and become callable with POWERCODE_YOLO=YOLO.
const RESTRICTED = [
  [/^\/uapi\/ai\//, "AI endpoint: sends ticket or report content to the configured AI provider"],
  [/^\/uapi\/subscriber\//, "customer-portal endpoint acting as a subscriber; some mutate through GET"],
  [/^\/uapi\/servers\/sync/i, "acts through GET: synchronizes a server"],
  [/^\/uapi\/servers\//, "server definitions can carry shared secrets"],
  [/^\/uapi\/user\/user$/i, "single-user detail carries Google2faSecret, SquareToken, MapToken, CalendarKey"],
  [/^\/uapi\/configure\/validateSaml$/i, "SAML metadata validation"],
  [/^\/uapi\/sp$/i, "SAML service provider endpoint"],
  [/^\/uapi\/signContract$/i, "acts through GET: signs a contract"],
  [/^\/uapi\/equipment\/trango/i, "Trango endpoints; trangoAction mutates through GET"],
  [/^\/uapi\/items\/trangoSoftware$/i, "Trango device software"],
  [/^\/uapi\/powercode\/(configValue|license)$/i, "system configuration values and license"],
  [/^\/uapi\/report\/customerDataDump$/i, "whole-customer data dump"],
  [/^\/uapi\/schedule\/completedJobFields$/i, "summary says it completes a job"],
  [/^\/uapi\/items\/deviceConfigurationFiles$/i, "device configuration files often hold credentials"],
  [/^\/uapi\/equipment\/equipmentWithDeviceConfigurationFile$/i, "device configuration files often hold credentials"],
  [/^\/uapi\/items\/checkIfDeviceTypeNameIsUnique$/i, "validation helper, not data"],
  [/^\/uapi\/configure\/(nextWelcomeWizardStep|welcomeWizardStepCompleted)$/i, "setup wizard state"],
];

// Binary downloads can't be returned as text, so they are not callable at any level.
const UNSUPPORTED = [/^\/uapi\/files\/download$/i, /^\/uapi\/items\/tmpKmlFile$/i];

const type = (s = {}) => (s.type === "integer" || s.type === "number" ? "number" : s.type === "boolean" ? "boolean" : s.type === "array" ? "array" : "string");
const entries = [];
const skipped = [];
for (const [path, item] of Object.entries(spec.paths)) {
  if (!item.get) continue;
  if (UNSUPPORTED.some((re) => re.test(path))) { skipped.push(path); continue; }
  const g = item.get;
  const hit = RESTRICTED.find(([re]) => re.test(path));
  const entry = {
    path: path.replace(/^\/uapi/, ""),
    summary: (g.summary || "").replace(/\s+/g, " ").trim(),
    params: (g.parameters || [])
      .filter((p) => p.in === "query")
      .map((p) => ({ name: p.name, type: type(p.schema), required: !!p.required, description: (p.description || "").replace(/\s+/g, " ").trim().slice(0, 160) })),
  };
  if (hit) entry.restricted = hit[1];
  entries.push(entry);
}
entries.sort((a, b) => a.path.localeCompare(b.path));

const out = `// Generated from the server's /docs/openapi.json (Powercode UAPI ${spec.info?.version ?? "unknown"}). GET endpoints only.
// Entries with \`restricted\` are callable through call_api only with POWERCODE_YOLO=YOLO.
export interface EndpointParam { name: string; type: "string" | "number" | "boolean" | "array"; required: boolean; description: string }
export interface Endpoint { path: string; summary: string; params: EndpointParam[]; restricted?: string }
export const specVersion = ${JSON.stringify(spec.info?.version ?? "unknown")};
export const endpoints: Endpoint[] = ${JSON.stringify(entries, null, 2)};
`;
writeFileSync(outPath, out);
const restricted = entries.filter((e) => e.restricted).length;
console.log(`catalog: ${entries.length} endpoints (${entries.length - restricted} read-level, ${restricted} restricted); unsupported: ${skipped.length}`);
