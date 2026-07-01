# ci-csam-agent — Decision Log (ADR-style)

## ADR-0001 — Reuse suite AgentCore + prioritization
- **Status:** Accepted (2026-06-26)
- **Decision:** Inherit the channel-agnostic core and pure CD3/WSJF/IINVEST helpers from the scaffold.
- **Consequences:** Consistency with Deming's quality system; cheap path to ≥80% coverage.

## ADR-0002 — Fundamentals depth + GAAP scope guardrail
- **Status:** Accepted (2026-06-26)
- **Context:** Contract §2.3 fixes this agent at Microsoft *Fundamentals* and *basic* GAAP.
- **Decision:** Cap technical depth at Fundamentals; escalate L400 topics to ci-csa-agent.
- **Consequences:** Clear depth split across the suite; predictable, auditable scope.

## ADR-0003 — GAAP disclaimer
- **Status:** Accepted (2026-06-26)
- **Decision:** All GAAP output carries a "basic, not professional accounting advice" disclaimer.
- **Consequences:** Manages liability and sets correct user expectations.

## ADR-0004 — Short agent key in infra
- **Status:** Accepted (2026-06-26)
- **Decision:** Use `csam` for Azure resource names.
- **Consequences:** Satisfies storage-account naming constraints.
