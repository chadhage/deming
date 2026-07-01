# ci-csam-agent

Lean Six Sigma Black Belt continuous-improvement advisor with **Microsoft Fundamentals** breadth
and **basic GAAP** literacy (contract §2.3). Competency scope:
[../docs/competency-taxonomy.md](../docs/competency-taxonomy.md).

## What's here
| Path | Purpose |
| --- | --- |
| [agent/](agent/) | Persona + system prompt |
| [api/](api/) | Azure Functions (TypeScript) — brain + Teams/Web/SMS webhooks |
| [web/](web/) | Static Web App PWA — web chat |
| [infra/](infra/) | Bicep — Flex Consumption, SWA, Storage Tables/Queues, App Insights |
| [docs/](docs/) | backlog, roadmap, lessons-learned, design docs |

## Run locally
```pwsh
cd api ; npm install ; npm run build ; npm test ; func start
cd ../web ; npm install ; npm test ; npm run dev
```

## Deploy a ring
```pwsh
az deployment sub create --location eastus2 `
  --template-file infra/main.bicep `
  --parameters infra/main.parameters.json ring=canary
```

See the suite-level [README](../README.md) and [contract](../docs/contracts.md).
