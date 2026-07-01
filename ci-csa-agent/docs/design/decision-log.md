# ci-csa-agent — Decision Log (ADR-style)

## ADR-0001 — Reuse suite AgentCore + prioritization
- **Status:** Accepted (2026-06-26)
- **Decision:** Inherit the channel-agnostic core and pure CD3/WSJF/IINVEST helpers from the scaffold.
- **Consequences:** Consistency with Deming's quality system; cheap path to ≥80% coverage.

## ADR-0002 — Competency taxonomy as source of truth
- **Status:** Accepted (2026-06-26)
- **Context:** "L400 across the certification poster" must be concrete and testable.
- **Decision:** Use `docs/competency-taxonomy.md` as the canonical scope reference.
- **Consequences:** Recommendations cite specific exam competencies; scope is auditable.

## ADR-0003 — Delegate GAAP/business-case framing to ci-csam-agent
- **Status:** Accepted (2026-06-26)
- **Decision:** Keep this agent focused on technical L400; hand financial framing to csam.
- **Consequences:** Clear separation of concerns; avoids scope creep.

## ADR-0004 — Short agent key in infra
- **Status:** Accepted (2026-06-26)
- **Decision:** Use `csa` (not `ci-csa-agent`) for Azure resource names.
- **Consequences:** Satisfies storage-account naming (≤24 chars, lowercase, no hyphens).
