import { readFileSync, writeFileSync } from "node:fs";

const [specPath, outPath] = process.argv.slice(2);
const spec = JSON.parse(readFileSync(specPath, "utf8"));

// GET endpoints that are not plain reads, could expose credentials or whole-customer dumps,
// return files, or are covered by the AI / subscriber-portal families. Never callable through call_api.
const EXCLUDE = [
  /^\/uapi\/ai\//,
  /^\/uapi\/subscriber\//,
  /^\/uapi\/servers\//, // RADIUS / email server definitions can carry shared secrets; sync* are actions
  /^\/uapi\/configure\/validateSaml$/i,
  /^\/uapi\/sp$/i,
  /^\/uapi\/signContract$/i,
  /^\/uapi\/equipment\/trango/i, // trangoAction mutates via GET
  /^\/uapi\/items\/trangoSoftware$/i,
  /^\/uapi\/powercode\/(configValue|license)$/i,
  /^\/uapi\/user\/user$/i, // single-user detail carries Google2faSecret, SquareToken, MapToken, CalendarKey; /user/users is fine
  /^\/uapi\/files\/download$/i,
  /^\/uapi\/items\/tmpKmlFile$/i,
  /^\/uapi\/report\/customerDataDump$/i, // whole-customer dump
  /^\/uapi\/schedule\/completedJobFields$/i, // summary says "Completed a job"
  /^\/uapi\/items\/deviceConfigurationFiles$/i, // device configs often hold credentials
  /^\/uapi\/equipment\/equipmentWithDeviceConfigurationFile$/i,
  /^\/uapi\/items\/checkIfDeviceTypeNameIsUnique$/i,
  /^\/uapi\/configure\/(nextWelcomeWizardStep|welcomeWizardStepCompleted)$/i,
];

const type = (s = {}) => (s.type === "integer" || s.type === "number" ? "number" : s.type === "boolean" ? "boolean" : s.type === "array" ? "array" : "string");
const entries = [];
const excluded = [];
for (const [path, item] of Object.entries(spec.paths)) {
  if (!item.get) continue;
  if (EXCLUDE.some((re) => re.test(path))) { excluded.push(path); continue; }
  const g = item.get;
  entries.push({
    path: path.replace(/^\/uapi/, ""),
    summary: (g.summary || "").replace(/\s+/g, " ").trim(),
    params: (g.parameters || [])
      .filter((p) => p.in === "query")
      .map((p) => ({ name: p.name, type: type(p.schema), required: !!p.required, description: (p.description || "").replace(/\s+/g, " ").trim().slice(0, 160) })),
  });
}
entries.sort((a, b) => a.path.localeCompare(b.path));

const out = `// Generated from the server's /docs/openapi.json (Powercode UAPI ${spec.info?.version ?? "unknown"}). GET endpoints only.
// Excludes credential-bearing, action-via-GET, file and AI endpoints; see the exclusion list in the generator.
export interface EndpointParam { name: string; type: "string" | "number" | "boolean" | "array"; required: boolean; description: string }
export interface Endpoint { path: string; summary: string; params: EndpointParam[] }
export const specVersion = ${JSON.stringify(spec.info?.version ?? "unknown")};
export const endpoints: Endpoint[] = ${JSON.stringify(entries, null, 2)};
`;
writeFileSync(outPath, out);
console.log(`catalog: ${entries.length} endpoints; excluded: ${excluded.length}`);
console.log("excluded:", excluded.join(", "));
