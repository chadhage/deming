# ci-csa-agent — Lessons Learned

Consult before starting any task; append after every iteration (contract §5).

## Iteration 0 — Scaffolding (2026-06-26)

- **Kept:** Shared `AgentCore` + pure prioritization logic inherited from the suite scaffold keeps
  this agent consistent with Deming's quality system and easy to test to ≥80%.
- **Learned:** L400 scope is large; the competency taxonomy ([../../docs/competency-taxonomy.md])
  is the single source of truth for what "expert across the poster" means.
- **Learned:** Storage account names must be ≤24 chars, lowercase, no hyphens — hence the short
  agent key `csa` (not `ci-csa-agent`) in `infra`.
- **Watch:** Keep financial framing delegated to ci-csam-agent to avoid GAAP scope creep here.
