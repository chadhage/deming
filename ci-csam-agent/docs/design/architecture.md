# ci-csam-agent — Architecture (audit-proof design doc)

## Context
Fundamentals-breadth + basic-GAAP continuous-improvement advisor. Same app shape as the rest of
the suite (Functions API + SWA PWA + Tables/Queues) so Deming's standards apply.

```mermaid
flowchart LR
  subgraph Channels
    T[MS Teams]:::ch
    W[Web chat PWA]:::ch
    S[SMS / ACS]:::ch
  end
  T -->|Activity| FT[/channels/teams/]
  W -->|POST /messages| FM[/messages/]
  S -->|inbound| FS[/channels/sms/]
  FT & FM & FS --> AC[AgentCore]
  AC --> BC[(Business-case math)]
  AC --> TBL[(Azure Tables)]
  AC --> Q[(Azure Queues)]
  AC --> AI[(App Insights)]
  classDef ch fill:#5b2d0b,color:#fff;
```

## Components
| Component | Tech | Responsibility |
| --- | --- | --- |
| `api` | Azure Functions Flex Consumption, Node 20 TS | Brain + channel webhooks |
| `web` | Vite + React PWA on Static Web Apps | Web chat |
| Storage | Azure Tables + Queues | Conversations, events |
| Monitoring | App Insights + Log Analytics | Telemetry |

## Quality attributes (contract §7)
- Core logic isolated in `src/core`; 80% coverage threshold enforced.
- Build budget <180s; PWA offline mode via NetworkFirst API caching.

## Security
- HTTPS only; managed identity for storage; channel webhooks use `function` auth.

## Ring topology (contract §3)
`canary → private → public → ga`, RG `rg-csam-<ring>`, GA on RA-GRS + geo-redundant pair.
