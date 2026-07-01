# ci-csam-agent — Lessons Learned

Consult before starting any task; append after every iteration (contract §5).

## Iteration 0 — Scaffolding (2026-06-26)

- **Kept:** Inherited the suite `AgentCore` + prioritization helpers — consistent and testable to ≥80%.
- **Learned:** Scope discipline matters: this agent is *Fundamentals + basic GAAP*; expert topics
  must be handed to ci-csa-agent to honor the contract's depth split.
- **Learned:** GAAP guidance must carry a "basic, not professional advice" disclaimer.
- **Watch:** Business-case math (ROI/payback) should reuse the pure-function pattern for coverage.
