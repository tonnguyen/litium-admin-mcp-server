# Litium Cloud CLI MCP Server Plan

## 1. Goal
Enable developers to converse with an AI (MCP client) to perform Litium Cloud CLI tasks (environment management, deployments, logs, service principals) without manually typing CLI commands.

## 2. Scope (Phase 1 vs Future)
Phase 1 (HTTP-compatible only):
- List environments
- Get environment details
- List apps / services
- Trigger deployment (if exposed via HTTP API) or return instructions if only CLI.
- Fetch recent deployment status/history
- Retrieve logs (bounded slice) if API supports; otherwise defer to streaming phase.

Phase 2 (Requires interactive / streaming / child_process):
- Real-time deployment logs tail
- Long-running operations progress (provisioning)
- Local artifact packaging & upload
- CLI-only commands without public HTTP equivalent

## 3. Architecture Decision: Integrate vs Separate MCP Server
Option A: Integrate into existing Admin MCP Server
- Add `CloudService` under `src/services/cloud/` (mirroring others) and extend `LitiumApiService`.
- Add `cloud-cli-tools.ts` under `app/api/[transport]/tools/` with consolidated operations.
- Reuse logging, error transformation, config, auth shape (extend `LitiumConfig`).
- Only feasible if Cloud operations can be proxied via Litium Cloud HTTP endpoints (no direct binary execution required).

Option B: New dedicated Cloud CLI MCP Server (separate repo or sibling folder `cloud-mcp-server/`)
- Runtime: container/VM (Node) allowing `child_process.spawn` for native CLI, streaming output (WebSocket/SSE).
- Dedicated auth handling (service principal credentials stored as env vars, not per-request headers).
- Clear privilege boundary (infra vs admin data). Less blast radius if compromised.
- Can implement caching & process supervision for long deployments.

Recommendation Path:
1. Inventory Cloud CLI commands & classify: (HTTP-API available?) (Needs streaming?) (Requires local binary?).
2. If >30% commands require binary or streaming → choose Option B initially.
3. Otherwise start with Option A (lower lift) and design for future extraction (keep service + tool isolated namespaced).

## 4. Command Classification Matrix (Example Skeleton)
Columns: command | description | HTTP API? | needs streaming? | needs local FS? | latency risk | integration approach
Populate after discovery; drives decision.

## 5. Auth & Config
Existing Admin: client credentials via headers.
Cloud CLI likely needs: tenant base URL + service principal id/secret OR API token.
Integration (Option A): Extend `LitiumConfig` schema with optional `cloud` section; accept headers: `X-Litium-Cloud-Client-Id`, `X-Litium-Cloud-Client-Secret`.
Separate (Option B): Use environment variables (`LITIUM_CLOUD_CLIENT_ID`, `LITIUM_CLOUD_CLIENT_SECRET`) to avoid exposing high privilege creds on each request; introduce token refresh background logic.

## 6. Services & Tools Design (Option A)
Directory: `src/services/cloud/`
- `cloud-base.ts` (wrap HTTP requests, error mapping)
- `cloud-environments-service.ts`
- `cloud-deployments-service.ts`
- `cloud-logs-service.ts`
Aggregate in `CloudService` then attach to `LitiumApiService`.
Tools file: `cloud-cli-tools.ts`
Operations (single MCP tool with action discriminators): `list_environments`, `get_environment`, `list_deployments`, `trigger_deployment`, `get_deployment`, `fetch_logs_slice`.
Zod schemas: ensure pagination, time range, environment id, deployment id, slice parameters.

## 7. Separate Server Structure (Option B)
Repo layout:
- `src/config.ts` (env + validation)
- `src/cli/runner.ts` (child_process spawn wrapper w/ incremental output buffering)
- `src/tools/cloud-cli-tools.ts`
- `src/stream/websocket-server.ts` (if implementing WS transport for log tail)
- `src/auth/service-principal.ts` (token acquisition, caching)
- `src/logging/logger.ts`
- `src/errors/*`
Add MCP transport similar to existing: HTTP + optional WebSocket.
Security: restrict tool set, sanitize args, whitelisting permissible commands; deny arbitrary flags.

## 8. Streaming Strategy
Need for: log tail, deployment progress.
Approaches:
- WebSocket (preferred) for bi-directional interactive operations.
- Fallback: chunked polling tool returning `cursor` until `done`.
Implementation (Option B): spawn process, stream stdout lines; apply size/time limits; expose tool to request `start_stream` returning WS URL/token.
Option A (serverless) limitation: no durable process; must rely on Cloud-provided HTTP streaming endpoints (if any) or polling.

## 9. Security Considerations
- Least privilege: separate credentials for cloud infra vs admin data.
- Command allowlist to prevent arbitrary execution.
- Rate limiting (missing currently): implement simple in-memory token bucket or integrate external cache (Redis) in Option B.
- Secrets exposure: avoid echoing secrets in error messages or logs.
- Audit logging: record tool name, args (redacting sensitive), duration, status.

## 10. Error & Observability
Reuse patterns (Option A): same transformation + logger.
Enhancements: introduce `operationId` + correlation header for multi-step (polling) flows.
Metrics (future): count per cloud operation, median latency, failures.

## 11. Caching Opportunities
Environments list (rarely changes): TTL cache (60s – 5m).
Deployment status polling: backoff schedule (e.g., 2s, 4s, 8s) until terminal state.
Logs slices: deduplicate identical request within short window.

## 12. Implementation Phases
Phase 0: Discovery & matrix → final architecture decision.
Phase 1A (if integrate): implement HTTP-only services + tools; extend config; docs update.
Phase 1B (if separate): scaffold repo, implement auth + command runner for read-only commands (list env, status).
Phase 2: Add deployment trigger & status polling.
Phase 3: Streaming/log tail (WebSocket or polling cursors).
Phase 4: Hardening: rate limiting, metrics, improved error taxonomy.
Phase 5: Documentation & examples for AI prompts.

## 13. Documentation & Prompt Engineering
Add `docs/cloud/cli.mdx` describing available MCP tools, example user intents → tool calls mapping.
Include negative examples (“deploy with invalid env id”).
Expose tool JSON shape in docs for LLM grounding.

## 14. Extraction Strategy (If start with Option A and later split)
- Namespace code under `cloud/` only.
- No cross-domain imports from admin services.
- Config segregation: cloud keys optional block.
- Provide an interface boundary (`ICloudPlatformAdapter`) to swap HTTP vs CLI execution; future server can reuse.

## 15. Risks & Mitigations
Risk: CLI-only features unavailable in integrated server → user confusion.
Mitigation: return structured message with required manual steps or suggest migrating to advanced server.
Risk: Long deployment > serverless timeout.
Mitigation: asynchronous kickoff + status polling tool.
Risk: Credential leakage via headers.
Mitigation: encourage env-var mode; mark header approach deprecated for cloud.

## 16. Open Questions (Need Answer Before Build)
1. Is there an HTTP management API parallel to the Cloud CLI for core operations?
2. Required maximum deployment duration and log volume expectations?
3. Are service principal credentials different from admin API credentials?
4. Priority commands for initial AI usage (top 5)?
5. Need for real-time vs eventual consistency in deployment feedback?

## 17. Next Immediate Actions
1. Populate command classification matrix.
2. Confirm presence/absence of HTTP endpoints for each target command.
3. Decide Option A vs B.
4. Draft config schema changes.
5. Prototype one read-only tool (list environments) in chosen architecture.

---
End of initial plan. Ready for refinement.
