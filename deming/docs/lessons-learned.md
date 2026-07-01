# Deming — Lessons Learned

Consult this file before starting any task; append after every iteration (contract §5).

## Iteration 0 — Scaffolding (2026-06-26)

- **Kept:** Channel-agnostic `AgentCore` keeps Teams/Web/SMS behavior identical and unit-testable;
  coverage is gated on `src/core/**` where the real logic lives.
- **Kept:** Prioritization math (CD3/WSJF/IINVEST) implemented as pure functions — trivial to test
  to the ≥80% bar and reusable by the other agents.
- **Learned:** Flex Consumption requires a deployment blob container and managed-identity storage
  access (no keys). Encoded in `infra/modules/functionApp.bicep`.
- **Learned:** SMS/non-embedded replies must lead with a Teams deep link and a web fallback (contract §4).
- **Watch:** SMS provider (ACS US number) is regulated — left as opt-in infra pending approval.
