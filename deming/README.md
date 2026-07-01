# Deming — Agent of Agents

ASQ Certified Master Black Belt. Coaches `ci-csa-agent` and `ci-csam-agent` on continuous improvement
and quality (contract §2.1). Does not perform Microsoft delivery work itself — it improves the system
that produces it.

## What's here

| Path | Purpose |
| --- | --- |
| [agent/](agent/) | Persona + system prompt (the agent definition) |
| [api/](api/) | Azure Functions (TypeScript) — brain + Teams/Web/SMS webhooks |
| [web/](web/) | Static Web App PWA — web chat / coach dashboard |
| [infra/](infra/) | Bicep — Flex Consumption, SWA, Storage Tables/Queues, App Insights |
| [docs/](docs/) | backlog, roadmap, lessons-learned, audit-proof design docs |

## Run locally

```pwsh
# API
cd api ; npm install ; npm run build ; npm test ; func start

# Web
cd ../web ; npm install ; npm test ; npm run dev
```

## Deploy a ring

```pwsh
az deployment sub create --location eastus2 `
  --template-file infra/main.bicep `
  --parameters infra/main.parameters.json ring=canary
```

## Signature endpoints

| Route | Channel | Auth |
| --- | --- | --- |
| `GET /api/health` | — | anonymous |
| `POST /api/messages` | Web / canonical | anonymous |
| `POST /api/channels/teams` | Teams | function |
| `POST /api/channels/sms` | SMS | function |

See the suite-level [README](../README.md) and [docs/contracts.md](../docs/contracts.md).
