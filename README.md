# ci-agents (cicop)

Continuous-Improvement agent suite governed by [docs/contracts.md](docs/contracts.md).

Three Azure-hosted agents, each a self-contained app (Azure Functions Flex Consumption API +
Azure Static Web App PWA + Azure Tables/Queues), coordinated by an "agent of agents".

| Agent | Role | Path |
| --- | --- | --- |
| **Deming** | Agent of agents — ASQ Certified Master Black Belt; coaches the other two on CI & quality | [deming/](deming/) |
| **ci-csa-agent** | Lean Six Sigma Black Belt + Azure/M365/Dynamics **L400** expert | [ci-csa-agent/](ci-csa-agent/) |
| **ci-csam-agent** | LSS BB continuous improvement + basic GAAP + Microsoft **Fundamentals**-level | [ci-csam-agent/](ci-csam-agent/) |

Competency scope is defined in [docs/competency-taxonomy.md](docs/competency-taxonomy.md), extracted
from the certification poster the contract references.

## Hosting

- **Tenant:** `16b3c013-d300-468d-ac64-7eda0820b6d3`
- **Subscription:** `474c40eb-d385-40d8-baa2-06883dbdca2d`

## Architecture conventions (contract §4)

- **Compute:** Azure Functions **Flex Consumption** (Node 20, TypeScript v4 model).
- **Front-end:** Azure **Static Web Apps** — Vite + React + TypeScript, installable **PWA** with offline mode.
- **State/eventing:** Azure **Tables** (store/cache) + **Queues** (events). No always-on databases by default.
- **Channels:** **MS Teams** for embedded interactions; **Web chat + SMS** for non-embedded
  (North-America phone numbers). SMS delivers a deep link to launch the Teams chat, or Web chat as fallback.
  See [docs/channels.md](docs/channels.md).

## Ring-based deployment (contract §3)

Logical segmentation across a geo-redundant footprint. One parameter (`ring`) selects the stage:

| Ring | Audience | Default region pair |
| --- | --- | --- |
| `canary` | Internal smoke / demos | East US 2 → Central US |
| `private` | Invited preview | East US 2 → Central US |
| `public` | Open preview | East US 2 → West US 3 |
| `ga` | General availability | East US 2 → West US 3 (+ Traffic Manager) |

Each agent's `infra/` provisions the same module set parameterized by `ring`.

## Per-agent layout

```
<agent>/
  README.md
  agent/            # persona + system instructions (the "agent" definition)
  api/              # Azure Functions (TypeScript) — the backend brain + channel webhooks
  web/              # Static Web App PWA (Vite + React)
  infra/            # Bicep (Functions Flex, SWA, Storage Tables/Queues, App Insights)
  docs/             # backlog.md, roadmap.md, lessons-learned.md, design/
```

## Engineering standards (contract §7)

- TDD, **≥ 80%** coverage (Vitest, `--coverage`).
- Full build **< 180s**; otherwise refactor stories are prioritized.
- Tech-debt buffer **≤ 10%** per iteration.

## Common commands

```pwsh
# per agent, from the agent folder
npm --prefix api install ; npm --prefix api run build ; npm --prefix api test
npm --prefix web install ; npm --prefix web run build ; npm --prefix web test

# infra what-if (requires az login to the tenant/subscription above)
az deployment sub what-if --location eastus2 `
  --template-file infra/main.bicep --parameters infra/main.parameters.json ring=canary
```

## Iteration workflow (contract §6)

Say **"start iteration"** to begin the cadence: retrospective → backlog harvesting/refinement →
tech-debt mitigation → net-new value. Each iteration ends with **"ready for canary"** → demo.
Prioritization uses **CD3** and **WSJF**; commitment requires an **IINVEST** pass.
