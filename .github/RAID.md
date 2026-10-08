# RAID Register

## Assumptions

| ID | Assumption | Proposed owner | Status | Validation or exit condition | Affected cards |
| --- | --- | --- | --- | --- | --- |
| RAID-A01 | An Example-only compliance boundary is approved; excluded tenant controls are separately governed. | Service owner and security architect | Scope directed by user; external assurance unconfirmed | Publish ownership and externally attested readiness; never label Example exit 0 as tenant security certification. | EXR-001, EXR-006, EXR-018 |

## Risks

| ID | Risk and impact | Proposed owner | Rating / status | Mitigation and closure evidence | Affected cards |
| --- | --- | --- | --- | --- | --- |
| RAID-R01 | 3,072 green offline tests may be mistaken for live Microsoft compatibility; realistic cmdlet output and actual operator workflow can still fail. | Engineering lead and Example service owner | High / open | Test retained raw adapters and documented commands; require authorized independent live Example walkthrough evidence, not only fixtures. | EXR-005, EXR-013, EXR-014, EXR-017 |

## Issues

| ID | Observed issue | Proposed owner | Status | Required resolution and closure evidence | Affected cards |
| --- | --- | --- | --- | --- | --- |
| RAID-I01 | Current product native configuration still enables other workloads and collects tenant-wide governance; board rescoping alone does not fix runtime behavior. | Example engineering lead for isolation; platform owners for excluded services | Open, reproduced by source review | EXR-001 isolates the Example profile; external owners retain responsibility for excluded services. Verify no excluded mutations or mandatory collectors on the Example path. | EXR-001, EXR-005 |

## External Dependencies

These are acceptance handoffs, not authorizations or Product backlog tasks. At implementation start and before live validation, review status with the external owner. Record approved evidence reference, reviewer and date before marking Confirmed; overdue/unavailable items remain visible issues, not silently accepted assumptions.

| ID | External deliverable | Proposed accountable owner | Status | Evidence required / when needed | Example consumer |
| --- | --- | --- | --- | --- | --- |
| RAID-D01 | Disposable isolated Example environment and explicit permission to test; no production identities or live data. | Example environment administrator | Unconfirmed | Environment approval, isolation attestation, authorized test window and ownership of eventual environment teardown; required before EXR-017. No environment creation by the Example harness. | EXR-008, EXR-016, EXR-017 |

## Review And Escalation

### Example escalation

An acceptance check failed during validation. The assigned owner records the observed result, preserves reproducible evidence, identifies the smallest corrective action, and escalates any external dependency to its accountable owner. The item remains open until the correction is independently verified and the closure evidence is linked from the affected card.
