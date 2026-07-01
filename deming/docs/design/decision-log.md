# Deming — Decision Log (ADR-style)

Audit-proof, defensible record of design decisions (contract §5).

## ADR-0001 — Channel-agnostic AgentCore
- **Status:** Accepted (2026-06-26)
- **Context:** Teams, Web, and SMS must behave consistently and be testable.
- **Decision:** Normalize every channel to `ChannelMessage` → `AgentCore.handle()` → `ChannelReply`.
- **Consequences:** One place to test behavior; channel webhooks stay thin renderers.

## ADR-0002 — Pure-function prioritization
- **Status:** Accepted (2026-06-26)
- **Context:** CD3/WSJF/IINVEST are core to Deming and must hit ≥80% coverage cheaply.
- **Decision:** Implement as side-effect-free functions in `src/core/prioritization.ts`.
- **Consequences:** Reused by ci-csa-agent and ci-csam-agent; easy property/unit tests.

## ADR-0003 — Functions Flex Consumption + managed identity
- **Status:** Accepted (2026-06-26)
- **Context:** Contract §4 mandates Flex Consumption; no secrets in app settings.
- **Decision:** System-assigned identity with Storage Blob/Queue/Table data roles; deployment via blob container.
- **Consequences:** Keyless storage access; RBAC assignments live in `infra/modules/functionApp.bicep`.

## ADR-0004 — Ring as a deployment parameter
- **Status:** Accepted (2026-06-26)
- **Context:** Contract §3 requires canary/private/public/ga via logical segmentation.
- **Decision:** Single `ring` param drives RG name, storage SKU, and app config.
- **Consequences:** Identical templates per ring; GA upgrades to RA-GRS + geo-redundancy.
